/* eslint-disable react-hooks/incompatible-library */
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addTask,
  deleteTask,
  updateTask,
} from "../../features/tasks/taskSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, useEffect } from "react";
import "./tasks.css";

// ✅ validation
const schema = yup.object({
  title: yup.string().required("Task title required"),
  description: yup.string().required("Description required"),
  projectId: yup.string().required("Select project"),
  employeeId: yup.string().required("Assign employee"),
  eta: yup.string().required("ETA required"),
});

export default function Tasks() {
  const dispatch = useDispatch();

  const tasks = useSelector((state) => state.tasks);
  const projects = useSelector((state) => state.projects);
  const employees = useSelector((state) => state.employees);

  const [editId, setEditId] = useState(null);
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState(""); // ✅ NEW

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const selectedProjectId = watch("projectId");

  const selectedProject = projects.find(
    (p) => p.id === selectedProjectId
  );

  const filteredEmployees = selectedProject
    ? employees.filter((emp) =>
        selectedProject.assignedEmployees.includes(emp.id)
      )
    : [];

  // ✅ AUTO CLEAR MESSAGE
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // ✅ IMAGE UPLOAD
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
      setPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // ✅ SUBMIT
  const onSubmit = (data) => {
    const project = projects.find((p) => p.id === data.projectId);

    const isValidEmployee = project?.assignedEmployees.includes(
      data.employeeId
    );

    if (!isValidEmployee) {
      setMessage("❌ Employee not assigned to this project");
      return;
    }

    const taskData = {
      ...data,
      image,
      status: "todo",
    };

    if (editId) {
      dispatch(updateTask({ id: editId, ...taskData }));
      setMessage("✏️ Task updated successfully");
      setEditId(null);
    } else {
      dispatch(addTask(taskData));
      setMessage("✅ Task added successfully");
    }

    reset();
    setImage("");
    setPreview("");
  };

  // ✅ EDIT
  const handleEdit = (task) => {
    setEditId(task.id);

    setValue("title", task.title);
    setValue("description", task.description);
    setValue("projectId", task.projectId);
    setValue("employeeId", task.employeeId);
    setValue("eta", task.eta);

    setImage(task.image);
    setPreview(task.image);

    setMessage("✏️ Editing task");
  };

  // ✅ CANCEL
  const handleCancel = () => {
    setEditId(null);
    reset();
    setImage("");
    setPreview("");
    setMessage("❌ Edit cancelled");
  };

  return (
    <div className="task-container">
      <h2 className="task-title">Tasks</h2>

      {/* ✅ MESSAGE */}
      {message && <p className="task-message">{message}</p>}

      {/* FORM */}
      <form className="task-form" onSubmit={handleSubmit(onSubmit)}>
        <input
          className="task-input"
          placeholder="Task Title"
          {...register("title")}
        />
        <p className="task-error">{errors.title?.message}</p>

        <input
          className="task-input"
          placeholder="Description"
          {...register("description")}
        />
        <p className="task-error">{errors.description?.message}</p>

        <select className="task-select" {...register("projectId")}>
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>

        <select
          className="task-select"
          {...register("employeeId")}
          disabled={!selectedProjectId}
        >
          <option value="">Select Employee</option>
          {filteredEmployees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>

        <input
          className="task-input"
          type="datetime-local"
          {...register("eta")}
        />

        {/* IMAGE */}
        <label className="task-input">
          Reference Images
          <input
            type="file"
            className="task-input"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>

        {preview && (
          <img className="task-preview" src={preview} alt="" />
        )}

        <button className="task-btn" type="submit">
          {editId ? "Update Task" : "Add Task"}
        </button>

        {editId && (
          <button
            className="task-btn-cancel"
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}
      </form>

      {/* TASK LIST */}
      <div className="task-list">
        {tasks.map((task) => {
          const project = projects.find(
            (p) => p.id === task.projectId
          );
          const employee = employees.find(
            (e) => e.id === task.employeeId
          );

          return (
            <div className="task-card" key={task.id}>
              <p><strong>Title:</strong> {task.title}</p>
              <p><strong>Description:</strong> {task.description}</p>
              <p><strong>Project:</strong> {project?.title}</p>
              <p><strong>Employee:</strong> {employee?.name}</p>
              <p><strong>ETA:</strong> {task.eta}</p>

              {task.image && (
                <img className="task-img" src={task.image} alt="" />
              )}

              <div className="task-actions">
                <button
                  className="task-edit"
                  onClick={() => handleEdit(task)}
                >
                  Edit
                </button>

                <button
                  className="task-delete"
                  onClick={() => {
                    dispatch(deleteTask(task.id));
                    setMessage("❌ Task deleted successfully");
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}