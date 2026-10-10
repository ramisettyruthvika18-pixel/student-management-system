-- Optional: the backend creates these tables automatically (spring.jpa.hibernate.ddl-auto=update).
-- Use this file only if you prefer to create the schema by hand.

CREATE DATABASE IF NOT EXISTS student_management;
USE student_management;

CREATE TABLE IF NOT EXISTS users (
    id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    username  VARCHAR(50)  NOT NULL UNIQUE,
    email     VARCHAR(120) NOT NULL UNIQUE,
    password  VARCHAR(255) NOT NULL,           -- BCrypt hash
    role      VARCHAR(20)  NOT NULL            -- ADMIN or STUDENT
);

CREATE TABLE IF NOT EXISTS students (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    roll_number  VARCHAR(30)  NOT NULL UNIQUE,
    email        VARCHAR(120) NOT NULL UNIQUE,
    department   VARCHAR(80)  NOT NULL,
    course       VARCHAR(80)  NOT NULL,
    study_year   INT          NOT NULL,
    contact      VARCHAR(20),
    attendance   DOUBLE       NOT NULL,        -- percentage 0-100
    marks        DOUBLE       NOT NULL         -- percentage 0-100
);
-- The default admin (admin / admin123) and sample students are inserted on first start by DataSeeder.java
