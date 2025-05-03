import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './Project.css';
import TaskItem from '../components/tasks/TaskItem';
import Spinner from '../components/layout/Spinner';
import { AuthContext } from '../contexts/AuthContext';
import { ProjectContext } from '../contexts/ProjectContext';
import { TaskContext } from '../contexts/TaskContext';

const Project = () => {
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const { getProject, currentProject, loading: projectLoading, error: projectError } = useContext(ProjectContext);
  const { tasks, getTasks, loading: taskLoading, error: taskError } = useContext(TaskContext);
  
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated && id) {
      getProject(id);
      getTasks(id);
    }
  }, [isAuthenticated, id, getProject, getTasks]);

  if (authLoading || projectLoading || taskLoading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (projectError || !currentProject) {
    return (
      <div className="project-not-found">
        <h2>Project Not Found</h2>
        <p>{projectError || "The project you are looking for does not exist or you don't have access to it."}</p>
        <Link to="/" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Filter tasks based on status and search term
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = 
      filter === 'all' || 
      task.status === filter ||
      (filter === 'active' && task.status !== 'completed');
    
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Calculate task stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  
  // Calculate completion percentage
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  return (
    <div className="project-container">
      <div className="project-header">
        <div className="project-title">
          <h1>{currentProject.name}</h1>
          <div className="project-actions">
            <Link to={`/projects/edit/${currentProject._id}`} className="btn btn-light">
              <i className="fas fa-edit"></i> Edit Project
            </Link>
            <Link to="/" className="btn btn-dark">
              <i className="fas fa-arrow-left"></i> Back
            </Link>
          </div>
        </div>
        <p className="project-description">{currentProject.description}</p>
      </div>

      <div className="project-stats">
        <div className="stat-card">
          <div className="stat-value">{totalTasks}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-success">{completedTasks}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-primary">{inProgressTasks}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-warning">{pendingTasks}</div>
          <div className="stat-label">Pending</div>
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-info">
          <span>Progress: {completionPercentage}%</span>
          <span>{completedTasks}/{totalTasks} completed</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="tasks-header">
        <h2>Tasks</h2>
        <Link to={`/projects/${id}/tasks/create`} className="btn btn-primary">
          <i className="fas fa-plus"></i> Add Task
        </Link>
      </div>

      <div className="tasks-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="fas fa-search"></i>
        </div>
        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button
            className={filter === 'in-progress' ? 'active' : ''}
            onClick={() => setFilter('in-progress')}
          >
            In Progress
          </button>
          <button
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
        </div>
      </div>

      {taskError && (
        <div className="alert alert-danger">{taskError}</div>
      )}

      {filteredTasks.length === 0 ? (
        <div className="no-tasks">
          <i className="fas fa-tasks fa-3x"></i>
          <h3>No tasks found</h3>
          {searchTerm || filter !== 'all' ? (
            <p>Try changing your filters or search term</p>
          ) : (
            <p>Get started by adding your first task to this project</p>
          )}
          <Link to={`/projects/${id}/tasks/create`} className="btn btn-primary">
            Add Task
          </Link>
        </div>
      ) : (
        <div className="tasks-list">
          {filteredTasks.map(task => (
            <TaskItem key={task._id} task={task} projectId={id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Project;