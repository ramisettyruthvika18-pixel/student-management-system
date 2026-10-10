package com.sms.repository;

import com.sms.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {

    boolean existsByRollNumber(String rollNumber);
    boolean existsByEmail(String email);
    boolean existsByRollNumberAndIdNot(String rollNumber, Long id);
    boolean existsByEmailAndIdNot(String email, Long id);

    @Query("""
           SELECT s FROM Student s
           WHERE (:search = ''
                  OR LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%'))
                  OR LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :search, '%'))
                  OR LOWER(s.email) LIKE LOWER(CONCAT('%', :search, '%')))
             AND (:department = '' OR s.department = :department)
           ORDER BY s.name
           """)
    List<Student> search(@Param("search") String search, @Param("department") String department);

    @Query("SELECT DISTINCT s.department FROM Student s ORDER BY s.department")
    List<String> findDepartments();
}
