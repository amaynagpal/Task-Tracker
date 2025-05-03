import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './TaskItem.css';
import { TaskContext } from '../../contexts/TaskContext';

const TaskItem = ({ task, projectId }) => {
  const { updateTask, deleteTask } = useContext(TaskContext);

  const onDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task._id);
    }
  };

  const toggleStatus = () => {
    const updatedTask = {
      ...task,
      status: task.status === 'completed' ? 'in-progress' : 'completed',
      completedAt: task.status === 'completed' ? null : new Date()
    };
    updateTask(task._id, updatedTask);
  };

  const getStatusClass = () => {
    switch (task.status) {
      case 'pending':
        return 'status-pending';
      case 'in-progress':
        return 'status-progress';
      case 'completed':
        return 'status-completed';
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={`task-card ${getStatusClass()}`}>
      <div className="task-header">
        <h3>{task.title}</h3>
        <div className="task-actions">
          <Link to={`/tasks/edit/${task._id}`} className="btn-edit">
            <i className="fas fa-edit"></i>
          </Link>
          <button onClick={onDelete} className="btn-delete">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <p className="task-description">{task.description}</p>
      <div className="task-meta">
        <div className="meta-item">
          <i className="fas fa-calendar-alt"></i> Created: {formatDate(task.createdAt)}
        </div>
        {task.status === 'completed' && task.completedAt && (
          <div className="meta-item">
            <i className="fas fa-check-circle"></i> Completed: {formatDate(task.completedAt)}
          </div>
        )}
      </div>
      <div className="task-footer">
        <div className="task-status">
          <span className={`status-indicator ${getStatusClass()}`}></span>
          <span className="status-text">{task.status}</span>
        </div>
        <button
          onClick={toggleStatus}
          className={`btn ${task.status === 'completed' ? 'btn-warning' : 'btn-success'}`}
        >
          {task.status === 'completed' ? (
            <>
              <i className="fas fa-undo"></i> Mark Incomplete
            </>
          ) : (
            <>
              <i className="fas fa-check"></i> Mark Complete
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TaskItem;