import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from "../utils/axiosInstance";
import "../styles/AddTaskModal.css";

const AddTaskModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: "",
    priority: "HIGH",
    checklist: [{ text: "", isCompleted: false }],
    dueDate: "",
    assignees: [],
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/users");
      setUsers(response.data);
    } catch (error) {
      toast.error("Error fetching users");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChecklistChange = (index, value) => {
    const newChecklist = [...formData.checklist];
    newChecklist[index].text = value;
    setFormData({
      ...formData,
      checklist: newChecklist,
    });
  };

  const addChecklistItem = () => {
    setFormData({
      ...formData,
      checklist: [...formData.checklist, { text: "", isCompleted: false }],
    });
  };

  const removeChecklistItem = (index) => {
    const newChecklist = formData.checklist.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      checklist: newChecklist,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      dueDate: date ? date.toISOString().split("T")[0] : "",
    });
    setShowDatePicker(false);
  };

  const clearDate = (e) => {
    e.stopPropagation();
    setFormData({
      ...formData,
      dueDate: "",
    });
  };

  // Add this function inside the AddTaskModal component, before the return statement:

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (!formData.title.trim()) {
      toast.error("Title is required");
      setLoading(false);
      return;
    }

    if (formData.checklist.some((item) => !item.text.trim())) {
      toast.error("All checklist items must have text");
      setLoading(false);
      return;
    }

    try {
      await onAdd(formData);
      toast.success("Task created successfully");
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target.className === "modal-overlay" && onClose()}
    >
      <div className="modal-container">
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <label className="form-label">
              Title <span className="required">*</span>
            </label>
            <div className="form-input-container">
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="Enter Task Title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">
              Select Priority <span className="required">*</span>
            </label>
            <div className="priority-options">
              {[
                { label: "HIGH PRIORITY", value: "HIGH" },
                { label: "MODERATE PRIORITY", value: "MODERATE" },
                { label: "LOW PRIORITY", value: "LOW" },
              ].map((priority) => (
                <button
                  key={priority.value}
                  type="button"
                  className={`priority-option ${priority.value.toLowerCase()} ${
                    formData.priority === priority.value ? "selected" : ""
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, priority: priority.value })
                  }
                >
                  <span className="priority-dot"></span>
                  {priority.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Assign to</label>
            <div className="form-input-container">
              <select
                name="assignees"
                className="form-select"
                value={formData.assignees}
                onChange={(e) => {
                  const values = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  setFormData({ ...formData, assignees: values });
                }}
              >
                <option value="">Add a assignee</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Checklist (
              {formData.checklist.filter((item) => item.isCompleted).length}/
              {formData.checklist.length}) <span className="required">*</span>
            </label>
            {formData.checklist.length > 0 ? (
              <div className="checklist-container">
                {formData.checklist.map((item, index) => (
                  <div key={index} className="checklist-item">
                    <input
                      type="checkbox"
                      checked={item.isCompleted}
                      onChange={(e) => {
                        const newChecklist = [...formData.checklist];
                        newChecklist[index].isCompleted = e.target.checked;
                        setFormData({ ...formData, checklist: newChecklist });
                      }}
                      className="checklist-checkbox"
                    />
                    <input
                      type="text"
                      className="checklist-input"
                      placeholder="Add a task"
                      value={item.text}
                      onChange={(e) =>
                        handleChecklistChange(index, e.target.value)
                      }
                    />
                    {/* Add assignee badges here if needed */}
                    <button
                      type="button"
                      className="checklist-delete"
                      onClick={() => removeChecklistItem(index)}
                    >
                      <span className="delete-icon">🗑️</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
            <button
              type="button"
              className="add-checklist-button"
              onClick={addChecklistItem}
            >
              + Add New
            </button>
          </div>

          {/* Checklist section remains the same */}

          <div className="modal-footer">
            <button
              type="button"
              className="date-picker-button"
              onClick={() => setShowDatePicker(true)}
            >
              {formData.dueDate ? (
                <>
                  {formData.dueDate}
                  <span className="clear-date" onClick={clearDate}>
                    ×
                  </span>
                </>
              ) : (
                "Select Due Date"
              )}
            </button>
            {showDatePicker && (
              <DatePicker
                selected={formData.dueDate ? new Date(formData.dueDate) : null}
                onChange={handleDateChange}
                dateFormat="MM/dd/yyyy"
                minDate={new Date()}
                inline
              />
            )}

            <div className="button-group">
              <button type="button" onClick={onClose} className="cancel-button">
                Cancel
              </button>
              <button type="submit" className="save-button" disabled={loading}>
                {loading ? "Creating..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
