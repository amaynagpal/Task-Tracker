import React, { createContext, useReducer } from 'react';
import api from '../services/api';

const ProjectContext = createContext();

const initialState = {
  projects: [],
  currentProject: null,
  loading: true,
  error: null
};

const projectReducer = (state, action) => {
  switch (action.type) {
    case 'GET_PROJECTS':
      return {
        ...state,
        projects: action.payload,
        loading: false,
        error: null
      };
    case 'GET_PROJECT':
      return {
        ...state,
        currentProject: action.payload,
        loading: false,
        error: null
      };
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [action.payload, ...state.projects],
        loading: false,
        error: null
      };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project._id === action.payload._id ? action.payload : project
        ),
        currentProject: action.payload,
        loading: false,
        error: null
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project._id !== action.payload),
        loading: false,
        error: null
      };
    case 'PROJECT_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_PROJECT':
      return {
        ...state,
        currentProject: null,
        loading: false,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
};

const ProjectProvider = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  // Get all projects
  const getProjects = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await api.get('/api/projects');
      
      // Make sure res exists and has data property
      if (res && res.data) {
        dispatch({
          type: 'GET_PROJECTS',
          payload: res.data
        });
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      dispatch({
        type: 'PROJECT_ERROR',
        payload: err.response?.data?.msg || 'Failed to fetch projects'
      });
    }
  };

  // Get a single project by ID
  const getProject = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await api.get(`/api/projects/${id}`);
      
      if (res && res.data) {
        dispatch({
          type: 'GET_PROJECT',
          payload: res.data
        });
      }
    } catch (err) {
      console.error('Error fetching project:', err);
      dispatch({
        type: 'PROJECT_ERROR',
        payload: err.response?.data?.msg || 'Failed to fetch project'
      });
    }
  };

  // Create a new project
  const createProject = async (project) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await api.post('/api/projects', project);
      
      if (res && res.data) {
        dispatch({
          type: 'ADD_PROJECT',
          payload: res.data
        });
        return { success: true, project: res.data };
      }
    } catch (err) {
      console.error('Error creating project:', err);
      dispatch({
        type: 'PROJECT_ERROR',
        payload: err.response?.data?.msg || 'Failed to create project'
      });
      return { success: false, error: err.response?.data?.msg || 'Failed to create project' };
    }
  };

  // Update an existing project
  const updateProject = async (id, project) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await api.put(`/api/projects/${id}`, project);
      
      if (res && res.data) {
        dispatch({
          type: 'UPDATE_PROJECT',
          payload: res.data
        });
        return { success: true, project: res.data };
      }
    } catch (err) {
      console.error('Error updating project:', err);
      dispatch({
        type: 'PROJECT_ERROR',
        payload: err.response?.data?.msg || 'Failed to update project'
      });
      return { success: false, error: err.response?.data?.msg || 'Failed to update project' };
    }
  };

  // Delete a project
  const deleteProject = async (id) => {
    try {
      await api.delete(`/api/projects/${id}`);
      dispatch({
        type: 'DELETE_PROJECT',
        payload: id
      });
    } catch (err) {
      console.error('Error deleting project:', err);
      dispatch({
        type: 'PROJECT_ERROR',
        payload: err.response?.data?.msg || 'Failed to delete project'
      });
    }
  };

  // Clear current project
  const clearProject = () => {
    dispatch({ type: 'CLEAR_PROJECT' });
  };

  return (
    <ProjectContext.Provider
      value={{
        projects: state.projects,
        currentProject: state.currentProject,
        loading: state.loading,
        error: state.error,
        getProjects,
        getProject,
        createProject,
        updateProject,
        deleteProject,
        clearProject
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export { ProjectContext, ProjectProvider };