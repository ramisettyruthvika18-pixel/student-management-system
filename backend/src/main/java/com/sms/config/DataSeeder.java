package com.sms.config;

import com.sms.entity.Student;
import com.sms.entity.User;
import com.sms.repository.StudentRepository;
import com.sms.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/** Creates a default admin account and some sample students on first run. */
@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seed(UserRepository users, StudentRepository students, PasswordEncoder encoder) {
        return args -> {
            if (!users.existsByUsername("admin")) {
                users.save(new User("admin", "admin@school.edu", encoder.encode("admin321"), "ADMIN"));
            }
            if (students.count() == 0) {
                add(students, "Aarav Sharma", "CS2101", "aarav@school.edu", "Computer Science", "B.Tech CSE", 3, "9876500001", 92.5, 88.0);
                add(students, "Diya Reddy", "CS2102", "diya@school.edu", "Computer Science", "B.Tech CSE", 3, "9876500002", 96.0, 94.5);
                add(students, "Rohan Mehta", "EC2103", "rohan@school.edu", "Electronics", "B.Tech ECE", 2, "9876500003", 71.0, 63.0);
                add(students, "Sneha Iyer", "EC2104", "sneha@school.edu", "Electronics", "B.Tech ECE", 2, "9876500004", 84.0, 79.5);
                add(students, "Karthik Rao", "ME2105", "karthik@school.edu", "Mechanical", "B.Tech ME", 4, "9876500005", 68.0, 55.0);
                add(students, "Ananya Das", "ME2106", "ananya@school.edu", "Mechanical", "B.Tech ME", 4, "9876500006", 90.0, 82.0);
                add(students, "Vikram Singh", "BA2107", "vikram@school.edu", "Business", "BBA", 1, "9876500007", 78.0, 72.0);
                add(students, "Meera Nair", "BA2108", "meera@school.edu", "Business", "BBA", 1, "9876500008", 97.0, 91.0);
                add(students, "Imran Khan", "CS2109", "imran@school.edu", "Computer Science", "B.Tech CSE", 2, "9876500009", 62.0, 47.0);
                add(students, "Pooja Verma", "BA2110", "pooja@school.edu", "Business", "BBA", 2, "9876500010", 88.0, 69.0);
            }
        };
    }

    private void add(StudentRepository repo, String name, String roll, String email, String dept,
                     String course, int year, String contact, double attendance, double marks) {
        Student s = new Student();
        s.setName(name);
        s.setRollNumber(roll);
        s.setEmail(email);
        s.setDepartment(dept);
        s.setCourse(course);
        s.setYear(year);
        s.setContact(contact);
        s.setAttendance(attendance);
        s.setMarks(marks);
        repo.save(s);
    }
}
