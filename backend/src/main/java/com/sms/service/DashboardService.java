package com.sms.service;

import com.sms.entity.Student;
import com.sms.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private static final double LOW_ATTENDANCE = 75.0;
    private static final double LOW_MARKS = 50.0;
    private static final List<String> GRADES = List.of("A+", "A", "B", "C", "D", "F");

    private final StudentRepository repo;

    public DashboardService(StudentRepository repo) {
        this.repo = repo;
    }

    static String grade(double marks) {
        if (marks >= 90) return "A+";
        if (marks >= 80) return "A";
        if (marks >= 70) return "B";
        if (marks >= 60) return "C";
        if (marks >= 50) return "D";
        return "F";
    }

    private static double round(double v) {
        return Math.round(v * 10.0) / 10.0;
    }

    public Map<String, Object> build() {
        List<Student> all = repo.findAll();
        Map<String, Object> out = new LinkedHashMap<>();

        out.put("totalStudents", all.size());
        out.put("averageMarks", round(all.stream().mapToDouble(Student::getMarks).average().orElse(0)));
        out.put("averageAttendance", round(all.stream().mapToDouble(Student::getAttendance).average().orElse(0)));
        out.put("passRate", all.isEmpty() ? 0.0 :
                round(100.0 * all.stream().filter(s -> s.getMarks() >= LOW_MARKS).count() / all.size()));

        // Department-wise performance
        Map<String, List<Student>> byDept = all.stream()
                .collect(Collectors.groupingBy(Student::getDepartment, TreeMap::new, Collectors.toList()));
        List<Map<String, Object>> departments = new ArrayList<>();
        byDept.forEach((dept, list) -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("department", dept);
            row.put("students", list.size());
            row.put("averageMarks", round(list.stream().mapToDouble(Student::getMarks).average().orElse(0)));
            row.put("averageAttendance", round(list.stream().mapToDouble(Student::getAttendance).average().orElse(0)));
            departments.add(row);
        });
        out.put("departments", departments);

        // Grade distribution
        Map<String, Long> counts = all.stream()
                .collect(Collectors.groupingBy(s -> grade(s.getMarks()), Collectors.counting()));
        List<Map<String, Object>> grades = new ArrayList<>();
        for (String g : GRADES) {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("grade", g);
            row.put("count", counts.getOrDefault(g, 0L));
            grades.add(row);
        }
        out.put("grades", grades);

        // Top performers
        out.put("topPerformers", all.stream()
                .sorted(Comparator.comparingDouble(Student::getMarks).reversed())
                .limit(5)
                .map(this::summary)
                .collect(Collectors.toList()));

        // Students who need attention
        out.put("needsAttention", all.stream()
                .filter(s -> s.getAttendance() < LOW_ATTENDANCE || s.getMarks() < LOW_MARKS)
                .sorted(Comparator.comparingDouble(Student::getMarks))
                .map(this::summary)
                .collect(Collectors.toList()));

        return out;
    }

    private Map<String, Object> summary(Student s) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", s.getId());
        m.put("name", s.getName());
        m.put("rollNumber", s.getRollNumber());
        m.put("department", s.getDepartment());
        m.put("marks", s.getMarks());
        m.put("attendance", s.getAttendance());
        m.put("grade", grade(s.getMarks()));
        return m;
    }
}
