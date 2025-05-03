import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Project from './pages/Project';
import CreateProject from './pages/CreateProject';
import EditProject from './pages/EditProject';
import CreateTask from './pages/CreateTask';
import EditTask from './pages/EditTask';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { TaskProvider } from './contexts/TaskContext';
import setAuthToken from './utils/setAuthToken';

// Check if token is in localStorage and set it to header
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

// Private Route component to protect routes that require authentication
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  // Log session information for debugging
  useEffect(() => {
    console.log('App initialized');
    console.log('Token in localStorage:', localStorage.getItem('token') ? 'Yes' : 'No');
  }, []);

  return (
    <AuthProvider>
      <ProjectProvider>
        <TaskProvider>
          <Router>
            <Navbar />
            <div className="container">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route path="/" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />
                <Route path="/projects/:id" element={
                  <PrivateRoute>
                    <Project />
                  </PrivateRoute>
                } />
                <Route path="/projects/create" element={
                  <PrivateRoute>
                    <CreateProject />
                  </PrivateRoute>
                } />
                <Route path="/projects/edit/:id" element={
                  <PrivateRoute>
                    <EditProject />
                  </PrivateRoute>
                } />
                <Route path="/projects/:projectId/tasks/create" element={
                  <PrivateRoute>
                    <CreateTask />
                  </PrivateRoute>
                } />
                <Route path="/tasks/edit/:id" element={
                  <PrivateRoute>
                    <EditTask />
                  </PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
        </TaskProvider>
      </ProjectProvider>
    </AuthProvider>
  );
};

export default App;