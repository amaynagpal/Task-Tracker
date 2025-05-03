import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './FormPage.css';
import { AuthContext } from '../contexts/AuthContext';
import { ProjectContext } from '../contexts/ProjectContext';

const CreateProject = () => {
  const { isAuthenticated, loading: authLoading, user } = useContext(AuthContext);
  const { createProject, projects } = useContext(ProjectContext);
  
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: 'work'
  });

  const [alert, setAlert] = useState(null);

  const { name, description, dueDate, priority, category } = formData;

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigate('/login');
    }
    
    // Check if user already has 4 projects
    if (projects.length >= 4) {
      setAlert({
        type: 'danger',
        msg: 'You have reached the maximum limit of 4 projects. Delete an existing project to create a new one.'
      });
    }
  }, [isAuthenticated, authLoading, navigate, projects.length]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (projects.length >= 4) {
      setAlert({
        type: 'danger',
        msg: 'You have reached the maximum limit of 4 projects. Delete an existing project to create a new one.'
      });
      return;
    }

    const res = await createProject(formData);
    
    if (res.success) {
      navigate('/');
    } else {
      setAlert({
        type: 'danger',
        msg: res.error || 'Failed to create project'
      });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>
          <i className="fas fa-folder-plus"></i> Create Project
        </h1>
        <p>Add a new project to your account</p>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>{alert.msg}</div>
      )}

      <form className="form-content" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Project Name*</label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={onChange}
            required
            placeholder="Enter a descriptive name for your project"
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
            placeholder="Provide details about your project"
          ></textarea>
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
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            name="category"
            id="category"
            value={category}
            onChange={onChange}
          >
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="education">Education</option>
            <option value="health">Health</option>
            <option value="finance">Finance</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-footer">
          <Link to="/" className="btn btn-light">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary" disabled={projects.length >= 4}>
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;