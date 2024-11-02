import React, { useState } from "react";
import moment from "moment";
import axiosInstance from "../utils/axiosInstance";
import "../styles/TaskCard.css";

const TaskCard = ({ task, onStatusChange, onEdit, onShare, onDelete }) => {
  const [isChecklistCollapsed, setIsChecklistCollapsed] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleChecklistToggle = async (itemId) => {
    try {
      await axiosInstance.patch(`/tasks/${task._id}/checklist/${itemId}`);
      const response = await axiosInstance.get(`/tasks/${task._id}`);
     await onStatusChange(task._id, response.data.status);
    } catch (error) {
      console.error("Error toggling checklist item:", error);
    }
  };



  const getCompletedTasks = () =>
    task.checklist.filter((item) => item.isCompleted).length;
  const isOverdue = () =>
    task.dueDate && moment(task.dueDate).isBefore(moment(), "day");
  const getPriorityClass = () => {
    switch (task.priority) {
      case "HIGH":
        return "priority-high";
      case "LOW":
        return "priority-low";
      default:
        return "";
    }
  };


  const getInitials = (name) =>
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();


  const toggleMenu = () => setMenuVisible(!menuVisible);

  return (
    <div className="task-card">
      <div className="task-header">
        <div className="task-info">
          <div className={`priority-badge ${getPriorityClass()}`}>
            {task.priority.toLowerCase()} priority
          </div>
          {task.assignees?.length > 0 && (
            <div className="assignees">
              {task.assignees.map((assignee) => (
                <div
                  key={assignee._id}
                  className="assignee-avatar"
                  title={assignee.name}
                >
                  {getInitials(assignee.name)}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="task-menu">
          <img
            src="/images/three-dots.svg"
            alt="Menu"
            className="three-dots"
            onClick={toggleMenu}
          />
          {menuVisible && (
            <div className="menu-dropdown">
              <div className="menu-item" onClick={() => onEdit(task)}>
                Edit
              </div>
              <div className="menu-item" onClick={() => onShare(task)}>
                Share
              </div>
              <div className="menu-item delete" onClick={() => onDelete(task)}>
                Delete
              </div>
            </div>
          )}
        </div>
      </div>

      <h3 className="task-title">{task.title}</h3>

      {/* Checklist Section */}
      <div className="checklist-container">
        <div
          className="checklist-header"
          onClick={() => setIsChecklistCollapsed(!isChecklistCollapsed)}
        >
          <span className="checklist-progress">
            Checklist ({getCompletedTasks()}/{task.checklist.length})
          </span>
          <span>{isChecklistCollapsed ? "▼" : "▲"}</span>
        </div>

        {!isChecklistCollapsed && (
  <div className="checklist-items">
    {task.checklist.map((item) => (
      <div
        key={item._id}
        className={`checklist-item ${item.isCompleted ? 'true' : ''}`}
        onClick={() => handleChecklistToggle(item._id)}
      >
        <div
          className={`checklist-checkbox ${item.isCompleted ? 'checked' : ''}`}
        />
        <span>{item.text}</span>
      </div>
    ))}
  </div>
)}

      </div>

      {/* Footer Section with Due Date and Assignees */}
      <div className="task-footer">
  {task.dueDate && (
    <div className={`due-date ${isOverdue() ? "overdue" : ""}`}>
      <span>{moment(task.dueDate).format("MMM D")}</span>
    </div>
  )}

  <div className="status-buttons">
    <button
      className={`status-button ${task.status === "BACKLOG" ? "active" : ""}`}
      onClick={() => onStatusChange(task._id, "BACKLOG")}
    >
      BACKLOG
    </button>
    <button
      className={`status-button ${task.status === "PROGRESS" ? "active" : ""}`}
      onClick={() => onStatusChange(task._id, "PROGRESS")}
    >
      PROGRESS
    </button>
    <button
      className={`status-button ${task.status === "DONE" ? "active" : ""}`}
      onClick={() => onStatusChange(task._id, "DONE")}
    >
      DONE
    </button>
  </div>
</div>

    </div>
  );
};

export default TaskCard;
