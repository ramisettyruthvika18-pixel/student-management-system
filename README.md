# Student Management System

Full-stack app: **React (Vite)** frontend, **Spring Boot 3** REST backend, **MySQL** database, JWT authentication.

```
student-management-system/
├── backend/    Spring Boot (Java 17, Maven)
├── frontend/   React + Vite
└── database/   schema.sql (optional, tables are auto-created)
```

## Features
- Login and registration (JWT, BCrypt-hashed passwords)
- Roles: **ADMIN** can add / edit / delete students; **STUDENT** accounts are view-only
- Student records: name, roll number, email, department, course, year, contact, attendance, marks
- Search (name / roll number / email) and filter by department
- Performance dashboard: totals, average marks and attendance, pass rate, marks by department,
  grade distribution, top performers, and students needing attention

## Prerequisites
- Java 17+
- Maven 3.8+ (or use your IDE's Maven support)
- Node.js 18+
- MySQL 8+ running on `localhost:3306`

## 1. Database
Nothing to create by hand: the backend creates the `student_management` database and tables on first start.
Set your MySQL credentials in `backend/src/main/resources/application.properties`
(defaults: user `root`, password `root`) or via environment variables:

```bash
export DB_USERNAME=root
export DB_PASSWORD=your_mysql_password
```

## 2. Backend
```bash
cd backend
mvn spring-boot:run
```
Runs on http://localhost:8080. On first start it seeds:
- Admin account: **admin / admin123**
- 10 sample students (so the dashboard has data)

## 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173 and sign in with `admin` / `admin123`.

If the backend runs elsewhere, change `VITE_API_URL` in `frontend/.env`
(and `app.cors.allowed-origin` in the backend if the frontend origin changes).

## REST API
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | public | Create a STUDENT (view-only) account |
| POST | `/api/auth/login` | public | Returns a JWT |
| GET | `/api/students?search=&department=` | logged in | List / search / filter |
| GET | `/api/students/departments` | logged in | Distinct departments |
| GET | `/api/students/{id}` | logged in | One student |
| POST | `/api/students` | ADMIN | Add student |
| PUT | `/api/students/{id}` | ADMIN | Update student |
| DELETE | `/api/students/{id}` | ADMIN | Delete student |
| GET | `/api/dashboard` | logged in | Performance statistics |

Send the token as `Authorization: Bearer <token>`.

## Making another admin
Registration only creates view-only accounts. To promote a user:
```sql
UPDATE student_management.users SET role = 'ADMIN' WHERE username = 'someone';
```

## Before deploying
Change the admin password, set a long random `JWT_SECRET`, and set `CORS_ORIGIN` to your real frontend URL.
