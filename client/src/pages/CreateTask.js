import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './FormPage.css';
import { AuthContext } from '../contexts/AuthContext';
import { ProjectContext } from '../contexts/ProjectContext';
import { TaskContext } from '../contexts/TaskContext';

const CreateTask = () => {
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const { getProject, currentProject } = useContext(ProjectContext);
  const { createTask } = useContext(TaskContext);
  
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    dueDate: '',
    priority: 'medium'
  });

  const [alert, setAlert] = useState(null);

  const { title, description, status, dueDate, priority } = formData;

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigate('/login');
      return;
    }
    
    if (!currentProject || currentProject._id !== projectId) {
      getProject(projectId);
    }
  }, [isAuthenticated, authLoading, navigate, getProject, projectId, currentProject]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    const res = await createTask(projectId, formData);
    
    if (res.success) {
      navigate(`/projects/${projectId}`);
    } else {
      setAlert({
        type: 'danger',
        msg: res.error || 'Failed to create task'
      });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>
          <i className="fas fa-tasks"></i> Create Task
        </h1>
        <p>Add a new task to {currentProject?.name || 'your project'}</p>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>{alert.msg}</div>
      )}

      <form className="form-content" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title">Task Title*</label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={onChange}
            required
            placeholder="Enter a clear title for your task"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description*</label>
          <textarea
            name="description"
            id="description"
            value={description}
            onChange={onChange}
            required
            placeholder="Provide details about what needs to be done"
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            name="status"
            id="status"
            value={status}
            onChange={onChange}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dueDate">Due Date (Optional)</label>
          <div className="date-picker">
            <input
              type="date"
              name="dueDate"
              id="dueDate"
              value={dueDate}
              onChange={onChange}
            />
            <i className="fas fa-calendar-alt"></i>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            name="priority"
            id="priority"
            value={priority}
            onChange={onChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="form-footer">
          <Link to={`/projects/${projectId}`} className="btn btn-light">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;