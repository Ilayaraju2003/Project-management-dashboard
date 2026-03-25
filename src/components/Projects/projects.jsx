/* eslint-disable react-hooks/incompatible-library */
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addProject,
  deleteProject,
  updateProject,
} from "../../features/projects/projectSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, useEffect } from "react";
import "./projects.css";

// validation schema
const schema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  logo: yup.string().required("Logo is required"),
  startDate: yup.string().required("Start date required"),
  endDate: yup.string().required("End date required"),
  assignedEmployees: yup.array().min(1, "Select at least one employee"),
});

export default function Projects() {
  const dispatch = useDispatch();

  const projects = useSelector(state => state.projects);
  const employees = useSelector(state => state.employees);

  const [editId, setEditId] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      assignedEmployees: [],
    },
  });

  const selectedEmployees = watch("assignedEmployees");

  // ✅ AUTO CLEAR MESSAGE
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // ✅ IMAGE UPLOAD
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setLogoPreview(reader.result);
      setValue("logo", reader.result);
    };

    reader.readAsDataURL(file);
  };

  // checkbox handler
  const handleEmployeeSelect = (id) => {
    let updated = selectedEmployees.includes(id)
      ? selectedEmployees.filter(e => e !== id)
      : [...selectedEmployees, id];

    setValue("assignedEmployees", updated);
  };

  // ✅ SUBMIT
  const onSubmit = (data) => {
    if (new Date(data.startDate) >= new Date(data.endDate)) {
      setMessage("❌ Start date must be before End date");
      return;
    }

    if (editId) {
      dispatch(updateProject({ id: editId, ...data }));
      setMessage("✏️ Project updated successfully");
      setEditId(null);
    } else {
      dispatch(addProject(data));
      setMessage("✅ Project created successfully");
    }

    reset({ assignedEmployees: [] });
    setLogoPreview("");
  };

  // ✅ EDIT
  const handleEdit = (project) => {
    setEditId(project.id);

    setValue("title", project.title);
    setValue("description", project.description);
    setValue("logo", project.logo);
    setValue("startDate", project.startDate);
    setValue("endDate", project.endDate);
    setValue("assignedEmployees", project.assignedEmployees);

    setLogoPreview(project.logo);
    setMessage("✏️ Editing project");
  };

  // ✅ CANCEL
  const handleCancel = () => {
    setEditId(null);
    reset({ assignedEmployees: [] });
    setLogoPreview("");
    setMessage("❌ Edit cancelled");
  };

  return (
    <div className="proj-container">
      <h2 className="proj-title">Projects</h2>

      {/* ✅ MESSAGE */}
      {message && <p className="proj-message">{message}</p>}

      <form className="proj-form" onSubmit={handleSubmit(onSubmit)}>
        <input
          className="proj-input"
          placeholder="Title"
          {...register("title")}
        />
        <p className="proj-error">{errors.title?.message}</p>

        <input
          className="proj-input"
          placeholder="Description"
          {...register("description")}
        />
        <p className="proj-error">{errors.description?.message}</p>

        {/* LOGO */}
        <label className="proj-file-label">
          Upload Logo
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            hidden
          />
        </label>

        {logoPreview && (
          <img src={logoPreview} className="proj-preview-img" alt="logo" />
        )}
        <p className="proj-error">{errors.logo?.message}</p>

        <label className="proj-label">Start Date:</label>
        <input
          className="proj-input"
          type="datetime-local"
          {...register("startDate")}
        />

        <label className="proj-label">End Date:</label>
        <input
          className="proj-input"
          type="datetime-local"
          {...register("endDate")}
        />

        <h4>Assign Employees</h4>

        <div className="proj-checkbox-group">
          {employees.map(emp => (
            <div className="proj-checkbox-item" key={emp.id}>
              <input
                type="checkbox"
                checked={selectedEmployees.includes(emp.id)}
                onChange={() => handleEmployeeSelect(emp.id)}
              />
              {emp.name}
            </div>
          ))}
        </div>

        <p className="proj-error">{errors.assignedEmployees?.message}</p>

        <button className="proj-btn" type="submit">
          {editId ? "Update Project" : "Create Project"}
        </button>

        {editId && (
          <button
            className="proj-btn-cancel"
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="proj-list">
        {projects.map(project => (
          <div className="proj-card" key={project.id}>
            <p><strong>Title:</strong> {project.title}</p>
            <p><strong>Description:</strong> {project.description}</p>

            <img className="proj-img" src={project.logo} alt="logo" />

            <p>
              <strong>ETM:</strong> {project.startDate} → {project.endDate}
            </p>

            <p>
              <strong>Employees:</strong>
              {project.assignedEmployees.map(id => {
                const emp = employees.find(e => e.id === id);
                return emp ? ` ${emp.name}, ` : "";
              })}
            </p>

            <div className="proj-actions">
              <button
                className="proj-edit"
                onClick={() => handleEdit(project)}
              >
                Edit
              </button>

              <button
                className="proj-delete"
                onClick={() => {
                  dispatch(deleteProject(project.id));
                  setMessage("❌ Project deleted successfully");
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}