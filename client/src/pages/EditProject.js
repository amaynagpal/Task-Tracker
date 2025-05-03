import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './FormPage.css';
import Spinner from '../components/layout/Spinner';
import { AuthContext } from '../contexts/AuthContext';
import { ProjectContext } from '../contexts/ProjectContext';

const EditProject = () => {
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const { getProject, currentProject, updateProject, loading: projectLoading } = useContext(ProjectContext);
  
  const navigate = useNavigate();
  const { id } = useParams();

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
      return;
    }
    
    if (!currentProject || currentProject._id !== id) {
      getProject(id);
    } else {
      setFormData({
        name: currentProject.name || '',
        description: currentProject.description || '',
        dueDate: currentProject.dueDate ? new Date(currentProject.dueDate).toISOString().substr(0, 10) : '',
        priority: currentProject.priority || 'medium',
        category: currentProject.category || 'work'
      });
    }
  }, [isAuthenticated, authLoading, navigate, getProject, id, currentProject]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    const res = await updateProject(id, formData);
    
    if (res.success) {
      navigate(`/projects/${id}`);
    } else {
      setAlert({
        type: 'danger',
        msg: res.error || 'Failed to update project'
      });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  if (authLoading || projectLoading || !currentProject) {
    return <Spinner />;
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>
          <i className="fas fa-edit"></i> Edit Project
        </h1>
        <p>Update your project details</p>
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
          <Link to={`/projects/${id}`} className="btn btn-light">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Update Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProject;