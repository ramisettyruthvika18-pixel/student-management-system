import { useEffect, useState } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import api, { errorMessage } from "../api.js";

const GRADE_COLORS = {
  "A+": "#0f766e", A: "#2a9d8f", B: "#8ab17d", C: "#e9c46a", D: "#f4a261", F: "#c8553d",
};

function Stat({ label, value, suffix = "", tone }) {
  return (
    <div className={`stat ${tone || ""}`}>
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}<small>{suffix}</small></span>
    </div>
  );
}

function GradeBadge({ grade }) {
  return <span className="badge" style={{ background: GRADE_COLORS[grade] }}>{grade}</span>;
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => setError(errorMessage(err)));
  }, []);

  if (error) return <div className="alert">{error}</div>;
  if (!data) return <p className="muted">Loading dashboard…</p>;

  if (data.totalStudents === 0) {
    return (
      <>
        <header className="page-head"><h1>Performance dashboard</h1></header>
        <div className="empty">No students yet. Add students to see performance charts here.</div>
      </>
    );
  }

  const gradeData = data.grades.filter((g) => g.count > 0);

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Performance dashboard</h1>
          <p className="muted">How students are doing across departments, grades and attendance.</p>
        </div>
      </header>

      <div className="stats">
        <Stat label="Total students" value={data.totalStudents} />
        <Stat label="Average marks" value={data.averageMarks} suffix="%" />
        <Stat label="Average attendance" value={data.averageAttendance} suffix="%" />
        <Stat label="Pass rate" value={data.passRate} suffix="%" tone={data.passRate < 80 ? "warn" : ""} />
      </div>

      <div className="grid-2">
        <section className="panel">
          <h3>Marks and attendance by department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.departments} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e3e7ee" />
              <XAxis dataKey="department" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="averageMarks" name="Avg marks" fill="#14213d" radius={[4, 4, 0, 0]} />
              <Bar dataKey="averageAttendance" name="Avg attendance" fill="#fca311" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="panel">
          <h3>Grade distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={gradeData} dataKey="count" nameKey="grade" innerRadius={62} outerRadius={105} paddingAngle={2}>
                {gradeData.map((g) => <Cell key={g.grade} fill={GRADE_COLORS[g.grade]} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v} students`, `Grade ${n}`]} />
              <Legend formatter={(v) => `Grade ${v}`} />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </div>

      <div className="grid-2">
        <section className="panel">
          <h3>Top performers</h3>
          <table className="table compact">
            <thead>
              <tr><th>Student</th><th>Department</th><th>Marks</th><th>Grade</th></tr>
            </thead>
            <tbody>
              {data.topPerformers.map((s) => (
                <tr key={s.id}>
                  <td><strong>{s.name}</strong><div className="sub">{s.rollNumber}</div></td>
                  <td>{s.department}</td>
                  <td>{s.marks}%</td>
                  <td><GradeBadge grade={s.grade} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="panel">
          <h3>Needs attention</h3>
          <p className="muted small">Attendance below 75% or marks below 50%.</p>
          {data.needsAttention.length === 0 ? (
            <div className="empty small">Everyone is on track.</div>
          ) : (
            <table className="table compact">
              <thead>
                <tr><th>Student</th><th>Attendance</th><th>Marks</th></tr>
              </thead>
              <tbody>
                {data.needsAttention.map((s) => (
                  <tr key={s.id}>
                    <td><strong>{s.name}</strong><div className="sub">{s.rollNumber} · {s.department}</div></td>
                    <td className={s.attendance < 75 ? "bad" : ""}>{s.attendance}%</td>
                    <td className={s.marks < 50 ? "bad" : ""}>{s.marks}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </>
  );
}
