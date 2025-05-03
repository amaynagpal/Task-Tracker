import React, { createContext, useReducer } from 'react';
import api from '../services/api';

const TaskContext = createContext();

const initialState = {
  tasks: [],
  currentTask: null,
  loading: true,
  error: null
};

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'GET_TASKS':
      return {
        ...state,
        tasks: action.payload,
        loading: false
      };
    case 'GET_TASK':
      return {
        ...state,
        currentTask: action.payload,
        loading: false
      };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        loading: false
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task._id === action.payload._id ? action.payload : task
        ),
        currentTask: action.payload,
        loading: false
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task._id !== action.payload),
        loading: false
      };
    case 'TASK_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_TASK':
      return {
        ...state,
        currentTask: null,
        loading: false
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

const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Get all tasks for a project
  const getTasks = async (projectId) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await api.get(`/api/projects/${projectId}/tasks`);
      dispatch({
        type: 'GET_TASKS',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response.data.msg
      });
    }
  };

  // Get a single task by ID
  const getTask = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await api.get(`/api/tasks/${id}`);
      dispatch({
        type: 'GET_TASK',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response.data.msg
      });
    }
  };

  // Create a new task
  const createTask = async (projectId, task) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await api.post(`/api/projects/${projectId}/tasks`, task);
      dispatch({
        type: 'ADD_TASK',
        payload: res.data
      });
      return { success: true, task: res.data };
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response.data.msg
      });
      return { success: false, error: err.response.data.msg };
    }
  };

  // Update an existing task
  const updateTask = async (id, task) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await api.put(`/api/tasks/${id}`, task);
      dispatch({
        type: 'UPDATE_TASK',
        payload: res.data
      });
      return { success: true, task: res.data };
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response.data.msg
      });
      return { success: false, error: err.response.data.msg };
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      dispatch({
        type: 'DELETE_TASK',
        payload: id
      });
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response.data.msg
      });
    }
  };

  // Clear current task
  const clearTask = () => {
    dispatch({ type: 'CLEAR_TASK' });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        currentTask: state.currentTask,
        loading: state.loading,
        error: state.error,
        getTasks,
        getTask,
        createTask,
        updateTask,
        deleteTask,
        clearTask
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export { TaskContext, TaskProvider };