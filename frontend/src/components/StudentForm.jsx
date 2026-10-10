import { useState } from "react";
import api, { errorMessage } from "../api.js";

const EMPTY = {
  name: "", rollNumber: "", email: "", department: "", course: "",
  year: 1, contact: "", attendance: "", marks: "",
};

export default function StudentForm({ student, onClose, onSaved }) {
  const isNew = !student;
  const [form, setForm] = useState(student ? { ...EMPTY, ...student, contact: student.contact || "" } : EMPTY);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const payload = {
      ...form,
      year: Number(form.year),
      attendance: Number(form.attendance),
      marks: Number(form.marks),
      contact: form.contact || null,
    };
    try {
      const res = isNew
        ? await api.post("/students", payload)
        : await api.put(`/students/${student.id}`, payload);
      onSaved(res.data, isNew);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>{isNew ? "Add student" : `Edit ${student.name}`}</h2>

        {error && <div className="alert">{error}</div>}

        <div className="form-grid">
          <label className="span-2">Full name
            <input value={form.name} onChange={set("name")} required autoFocus />
          </label>
          <label>Roll number
            <input value={form.rollNumber} onChange={set("rollNumber")} required />
          </label>
          <label>Email
            <input type="email" value={form.email} onChange={set("email")} required />
          </label>
          <label>Department
            <input value={form.department} onChange={set("department")} placeholder="e.g. Computer Science" required />
          </label>
          <label>Course
            <input value={form.course} onChange={set("course")} placeholder="e.g. B.Tech CSE" required />
          </label>
          <label>Year
            <select value={form.year} onChange={set("year")}>
              {[1, 2, 3, 4, 5, 6].map((y) => <option key={y} value={y}>Year {y}</option>)}
            </select>
          </label>
          <label>Contact number
            <input value={form.contact} onChange={set("contact")} placeholder="Optional" />
          </label>
          <label>Attendance (%)
            <input type="number" min="0" max="100" step="0.1" value={form.attendance} onChange={set("attendance")} required />
          </label>
          <label>Marks (%)
            <input type="number" min="0" max="100" step="0.1" value={form.marks} onChange={set("marks")} required />
          </label>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={busy}>
            {busy ? "Saving…" : isNew ? "Add student" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
