import { useCallback, useEffect, useState } from "react";
import api, { errorMessage } from "../api.js";
import { useAuth } from "../auth.jsx";
import StudentForm from "../components/StudentForm.jsx";

export default function Students() {
  const { isAdmin } = useAuth();
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState(null);   // null | "new" | student object
  const [deleting, setDeleting] = useState(null); // student pending deletion

  const load = useCallback(async () => {
    try {
      const [list, depts] = await Promise.all([
        api.get("/students", { params: { search, department } }),
        api.get("/students/departments"),
      ]);
      setStudents(list.data);
      setDepartments(depts.data);
      setError("");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [search, department]);

  // Re-run the search shortly after the user stops typing
  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const flash = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 3500);
  };

  const handleSaved = (student, wasNew) => {
    setEditing(null);
    flash(wasNew ? `${student.name} was added.` : `${student.name} was updated.`);
    load();
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/students/${deleting.id}`);
      flash(`${deleting.name} was deleted.`);
      setDeleting(null);
      load();
    } catch (err) {
      setError(errorMessage(err));
      setDeleting(null);
    }
  };

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Students</h1>
          <p className="muted">{students.length} {students.length === 1 ? "record" : "records"}</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setEditing("new")}>Add student</button>
        )}
      </header>

      {notice && <div className="toast">{notice}</div>}
      {error && <div className="alert">{error}</div>}

      <div className="filters">
        <input
          type="search"
          placeholder="Search by name, roll number or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option value="">All departments</option>
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Roll no.</th>
              <th>Name</th>
              <th>Department</th>
              <th>Course</th>
              <th>Year</th>
              <th>Attendance</th>
              <th>Marks</th>
              {isAdmin && <th aria-label="Actions"></th>}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={8} className="empty-cell">Loading students…</td></tr>}
            {!loading && students.length === 0 && (
              <tr>
                <td colSpan={8} className="empty-cell">
                  No students match your search.{isAdmin && " Use “Add student” to create the first record."}
                </td>
              </tr>
            )}
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.rollNumber}</td>
                <td>
                  <strong>{s.name}</strong>
                  <div className="sub">{s.email}{s.contact ? ` · ${s.contact}` : ""}</div>
                </td>
                <td>{s.department}</td>
                <td>{s.course}</td>
                <td>{s.year}</td>
                <td>
                  <div className="meter" title={`${s.attendance}%`}>
                    <div className={`meter-fill ${s.attendance < 75 ? "low" : ""}`} style={{ width: `${s.attendance}%` }} />
                  </div>
                  <span className="sub">{s.attendance}%</span>
                </td>
                <td className={s.marks < 50 ? "bad" : ""}><strong>{s.marks}%</strong></td>
                {isAdmin && (
                  <td className="actions">
                    <button className="btn btn-small" onClick={() => setEditing(s)}>Edit</button>
                    <button className="btn btn-small btn-danger" onClick={() => setDeleting(s)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <StudentForm
          student={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}

      {deleting && (
        <div className="overlay" onClick={() => setDeleting(null)}>
          <div className="modal small" onClick={(e) => e.stopPropagation()}>
            <h2>Delete {deleting.name}?</h2>
            <p className="muted">
              This permanently removes the record for roll number {deleting.rollNumber}, including attendance and marks.
              This can’t be undone.
            </p>
            <div className="modal-actions">
              <button className="btn" onClick={() => setDeleting(null)}>Keep student</button>
              <button className="btn btn-danger-solid" onClick={confirmDelete}>Delete student</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
