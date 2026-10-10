package com.sms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Roll number is required")
    @Column(nullable = false, unique = true, length = 30)
    private String rollNumber;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @NotBlank(message = "Department is required")
    @Column(nullable = false, length = 80)
    private String department;

    @NotBlank(message = "Course is required")
    @Column(nullable = false, length = 80)
    private String course;

    @NotNull(message = "Year is required")
    @Min(value = 1, message = "Year must be between 1 and 6")
    @Max(value = 6, message = "Year must be between 1 and 6")
    @Column(name = "study_year", nullable = false)
    private Integer year;

    @Pattern(regexp = "^[0-9+\\- ]{7,15}$", message = "Contact must be 7-15 digits")
    @Column(length = 20)
    private String contact;

    @NotNull(message = "Attendance is required")
    @DecimalMin(value = "0.0", message = "Attendance must be between 0 and 100")
    @DecimalMax(value = "100.0", message = "Attendance must be between 0 and 100")
    @Column(nullable = false)
    private Double attendance;

    @NotNull(message = "Marks are required")
    @DecimalMin(value = "0.0", message = "Marks must be between 0 and 100")
    @DecimalMax(value = "100.0", message = "Marks must be between 0 and 100")
    @Column(nullable = false)
    private Double marks;

    public Student() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }
    public Double getAttendance() { return attendance; }
    public void setAttendance(Double attendance) { this.attendance = attendance; }
    public Double getMarks() { return marks; }
    public void setMarks(Double marks) { this.marks = marks; }
}
