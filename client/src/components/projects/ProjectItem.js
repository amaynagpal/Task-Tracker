import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './ProjectItem.css';
import { ProjectContext } from '../../contexts/ProjectContext';

const ProjectItem = ({ project }) => {
  const { deleteProject } = useContext(ProjectContext);

  const onDelete = () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(project._id);
    }
  };

  return (
    <div className="project-card">
      <div className="project-header">
        <h3>{project.name}</h3>
        <div className="project-actions">
          <Link to={`/projects/edit/${project._id}`} className="btn-edit">
            <i className="fas fa-edit"></i>
          </Link>
          <button onClick={onDelete} className="btn-delete">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <p className="project-description">{project.description}</p>
      <div className="project-stats">
        <div className="stats-item">
          <i className="fas fa-tasks"></i> {project.taskCount || 0} Tasks
        </div>
        <div className="stats-item">
          <i className="fas fa-check-circle"></i> {project.completedTaskCount || 0} Completed
        </div>
      </div>
      <Link to={`/projects/${project._id}`} className="btn btn-primary btn-block">
        View Details
      </Link>
    </div>
  );
};

export default ProjectItem;