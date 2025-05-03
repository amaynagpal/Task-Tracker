import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import ProjectItem from '../components/projects/ProjectItem';
import Spinner from '../components/layout/Spinner';
import { AuthContext } from '../contexts/AuthContext';
import { ProjectContext } from '../contexts/ProjectContext';

const Dashboard = () => {
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const { projects, loading: projectLoading, error, getProjects } = useContext(ProjectContext);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      getProjects();
    }
  }, [isAuthenticated, authLoading]); // Remove getProjects from dependencies to avoid infinite loop

  if (authLoading || projectLoading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return null; // Return null while redirecting
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>
          <i className="fas fa-tachometer-alt"></i> Dashboard
        </h1>
        <Link to="/projects/create" className="btn btn-primary">
          <i className="fas fa-plus"></i> New Project
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {projects.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-folder-open fa-4x"></i>
          <h2>No Projects Found</h2>
          <p>You haven't created any projects yet. Get started by creating a new project.</p>
          <Link to="/projects/create" className="btn btn-primary">
            Create Your First Project
          </Link>
        </div>
      ) : (
        <>
          <p className="projects-count">
            You have <span className="text-primary">{projects.length}</span> active{' '}
            {projects.length === 1 ? 'project' : 'projects'}{' '}
            {projects.length >= 4 && '(maximum limit reached)'}
          </p>
          <div className="grid">
            {projects.map(project => (
              <ProjectItem key={project._id} project={project} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;