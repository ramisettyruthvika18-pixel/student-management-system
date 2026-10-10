import { useState } from "react";
import { useAuth } from "../auth.jsx";
import { errorMessage } from "../api.js";

export default function Login() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") await login(form.username, form.password);
      else await register(form.username, form.email, form.password);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
  };

  return (
    <div className="auth">
      <section className="auth-side">
        <h1>Every student record, in one place.</h1>
        <p>
          Track enrolment, attendance and marks without spreadsheets or paper registers.
          Spot who is thriving and who needs help early.
        </p>
        <ul>
          <li>Add, edit and remove student records</li>
          <li>Search by name, roll number or department</li>
          <li>See performance by department and grade</li>
        </ul>
      </section>

      <section className="auth-form-wrap">
        <form className="auth-form" onSubmit={submit}>
          <h2>{mode === "login" ? "Sign in" : "Create an account"}</h2>
          <p className="muted">
            {mode === "login"
              ? "Use your username and password to continue."
              : "New accounts can view students and the dashboard."}
          </p>

          {error && <div className="alert">{error}</div>}

          <label>
            Username
            <input value={form.username} onChange={set("username")} autoFocus required />
          </label>

          {mode === "register" && (
            <label>
              Email
              <input type="email" value={form.email} onChange={set("email")} required />
            </label>
          )}

          <label>
            Password
            <input type="password" value={form.password} onChange={set("password")} required minLength={mode === "register" ? 6 : undefined} />
          </label>

          <button className="btn btn-primary btn-block" disabled={busy}>
            {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>

          <p className="switch">
            {mode === "login" ? "No account yet?" : "Already registered?"}{" "}
            <button type="button" className="link" onClick={switchMode}>
              {mode === "login" ? "Create one" : "Sign in"}
            </button>
          </p>

          {mode === "login" && (
            <p className="hint">Demo admin: <code>admin</code> / <code>admin321</code></p>
          )}
        </form>
      </section>
    </div>
  );
}
