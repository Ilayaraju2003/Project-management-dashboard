import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard/dashboard";
import Employees from "./components/Employees/employees";
import Projects from "./components/Projects/projects";
import Tasks from "./components/Tasks/tasks";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <nav className="nav-container">
        <Link className="nav-link" to="/"></Link>
        <Link className="nav-link" to="/employees">Employees</Link>
        <Link className="nav-link" to="/projects">Projects</Link>
        <Link className="nav-link" to="/tasks">Tasks</Link>
        <Link className="nav-link" to="/dashboard">Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Employees />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;