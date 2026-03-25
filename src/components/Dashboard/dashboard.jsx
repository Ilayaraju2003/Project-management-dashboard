import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { updateTaskStatus } from "../../features/tasks/taskSlice";
import { useState } from "react";
import "./dashboard.css";

export default function Dashboard() {
  const dispatch = useDispatch();

  const tasks = useSelector((state) => state.tasks);
  const projects = useSelector((state) => state.projects);
  const employees = useSelector((state) => state.employees);

  const [selectedProject, setSelectedProject] = useState("");

  // ✅ Column setup (IMPORTANT: ids must match task.status)
  const columns = [
    { id: "todo", title: "Need to Do" },
    { id: "inprogress", title: "In Progress" },
    { id: "testing", title: "Need for Test" },
    { id: "completed", title: "Completed" },
    { id: "reopen", title: "Re-open" },
  ];

  // ✅ Drag handler
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;

    dispatch(
      updateTaskStatus({
        id: draggableId,
        status: destination.droppableId,
      })
    );
  };

  // ✅ Filter by project
  const filteredTasks = selectedProject
    ? tasks.filter((t) => t.projectId === selectedProject)
    : tasks;

  return (
    <div className="dash-container">
      <h2 className="dash-title">Dashboard</h2>

      {/* ✅ Project Filter */}
      <select
        className="dash-filter"
        value={selectedProject}
        onChange={(e) => setSelectedProject(e.target.value)}
      >
        <option value="">All Projects</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.title}
          </option>
        ))}
      </select>

      {/* ✅ Drag & Drop Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="dash-board">
          {columns.map((col) => (
            <Droppable droppableId={col.id} key={col.id}>
              {(provided) => (
                <div
                  className="dash-column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h4 className="dash-column-title">{col.title}</h4>

                  {filteredTasks
                    .filter((task) => task.status === col.id)
                    .map((task, index) => {
                      const emp = employees.find(
                        (e) => e.id === task.employeeId
                      );

                      return (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              className="dash-card"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <h5 className="dash-card-title">
                                {task.title}
                              </h5>

                              <p className="dash-emp">
                                👤 {emp ? emp.name : "No Employee"}
                              </p>

                              <p className="dash-eta">
                                ⏰  {task.eta}
                              </p>

                              {task.image && (
                                <img
                                  className="dash-img"
                                  src={task.image}
                                  alt={task.title}
                                />
                              )}
                            </div>
                          )}
                        </Draggable>
                      );
                    })}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}