import React, { useState, useEffect } from "react";
import './todo.css';
import axios from "axios";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://https://study-backend-k311.onrender.com/api/tasks");
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  // Add a new task
  const handleAddTask = async () => {
    const newTask = { text: "New Task", isChecked: false }; // Provide a default text
    try {
      const response = await axios.post("http://https://study-backend-k311.onrender.com/api/tasks", newTask);
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
  

  // Update task text or isChecked
  const handleTaskChange = async (id, updates) => {
    try {
      const response = await axios.put(`http://https://study-backend-k311.onrender.com/api/tasks/${id}`, updates);
      setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Mark a task as done
  const handleCheckTask = (id) => {
    const task = tasks.find((t) => t._id === id);
    handleTaskChange(id, { ...task, isChecked: !task.isChecked });
  };

  // Delete selected tasks
  const handleConfirmDelete = async () => {
    try {
      await Promise.all(selectedTasks.map((id) => axios.delete(`http://https://study-backend-k311.onrender.com/api/tasks/${id}`)));
      setTasks(tasks.filter((task) => !selectedTasks.includes(task._id)));
      setSelectedTasks([]);
      setIsDeleteMode(false);
    } catch (error) {
      console.error("Error deleting tasks:", error);
    }
  };

  return (
    <div className="todo-container">
      <h1>TODO LIST</h1>
      <div className="controls">
        <button onClick={handleAddTask}>ADD TASK</button>
        <button onClick={() => setIsDeleteMode(!isDeleteMode)}>
          {isDeleteMode ? "Cancel Delete" : "Delete"}
        </button>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className="task-item" style={{ textDecoration: task.isChecked ? "line-through" : "none" }}>
            <input
              type="text"
              value={task.text}
              placeholder="Enter task"
              onChange={(e) => handleTaskChange(task._id, { ...task, text: e.target.value })}
              disabled={isDeleteMode}
            />
            <input
              type="checkbox"
              checked={task.isChecked}
              onChange={() => handleCheckTask(task._id)}
            />
            {isDeleteMode && (
              <input
                type="checkbox"
                onChange={() =>
                  setSelectedTasks((prev) =>
                    prev.includes(task._id) ? prev.filter((id) => id !== task._id) : [...prev, task._id]
                  )
                }
                checked={selectedTasks.includes(task._id)}
              />
            )}
          </li>
        ))}
      </ul>
      {isDeleteMode && (
        <button onClick={handleConfirmDelete} className="confirm-delete-btn">
          Confirm Delete
        </button>
      )}
    </div>
  );
};

export default Todo;
