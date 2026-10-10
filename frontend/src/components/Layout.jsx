import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">S</span>
          <span>Student<br />Management</span>
        </div>

        <nav className="nav">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/students">Students</NavLink>
        </nav>

        <div className="sidebar-foot">
          <div className="who">
            <strong>{user.username}</strong>
            <span>{user.role === "ADMIN" ? "Administrator" : "Student account (view only)"}</span>
          </div>
          <button className="btn btn-ghost-light" onClick={handleLogout}>Sign out</button>
        </div>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}
