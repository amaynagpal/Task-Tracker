import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './FormPage.css';
import Spinner from '../components/layout/Spinner';
import { AuthContext } from '../contexts/AuthContext';
import { TaskContext } from '../contexts/TaskContext';

const EditTask = () => {
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const { getTask, currentTask, updateTask, loading: taskLoading } = useContext(TaskContext);
  
  const navigate = useNavigate();
  const { id } = useParams();

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
    
    if (!currentTask || currentTask._id !== id) {
      getTask(id);
    } else {
      setFormData({
        title: currentTask.title || '',
        description: currentTask.description || '',
        status: currentTask.status || 'pending',
        dueDate: currentTask.dueDate ? new Date(currentTask.dueDate).toISOString().substr(0, 10) : '',
        priority: currentTask.priority || 'medium'
      });
    }
  }, [isAuthenticated, authLoading, navigate, getTask, id, currentTask]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    const res = await updateTask(id, formData);
    
    if (res.success) {
      navigate(`/projects/${currentTask.project}`);
    } else {
      setAlert({
        type: 'danger',
        msg: res.error || 'Failed to update task'
      });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  if (authLoading || taskLoading || !currentTask) {
    return <Spinner />;
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>
          <i className="fas fa-edit"></i> Edit Task
        </h1>
        <p>Update task details</p>
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
          <Link to={`/projects/${currentTask.project}`} className="btn btn-light">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Update Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTask;