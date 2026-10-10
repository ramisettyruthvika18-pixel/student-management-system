package com.sms.service;

import com.sms.entity.Student;
import com.sms.repository.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository repo;

    public StudentService(StudentRepository repo) {
        this.repo = repo;
    }

    public List<Student> search(String search, String department) {
        return repo.search(search, department);
    }

    public List<String> departments() {
        return repo.findDepartments();
    }

    public Student get(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
    }

    public Student create(Student s) {
        if (repo.existsByRollNumber(s.getRollNumber())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A student with that roll number already exists");
        }
        if (repo.existsByEmail(s.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A student with that email already exists");
        }
        s.setId(null);
        return repo.save(s);
    }

    public Student update(Long id, Student incoming) {
        Student existing = get(id);
        if (repo.existsByRollNumberAndIdNot(incoming.getRollNumber(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A student with that roll number already exists");
        }
        if (repo.existsByEmailAndIdNot(incoming.getEmail(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A student with that email already exists");
        }
        existing.setName(incoming.getName());
        existing.setRollNumber(incoming.getRollNumber());
        existing.setEmail(incoming.getEmail());
        existing.setDepartment(incoming.getDepartment());
        existing.setCourse(incoming.getCourse());
        existing.setYear(incoming.getYear());
        existing.setContact(incoming.getContact());
        existing.setAttendance(incoming.getAttendance());
        existing.setMarks(incoming.getMarks());
        return repo.save(existing);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found");
        }
        repo.deleteById(id);
    }
}
