import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import { AuthContext } from '../contexts/AuthContext';

const Login = () => {
  const { login, isAuthenticated, error, clearErrors } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [alert, setAlert] = useState(null);

  const { email, password } = formData;

  // This useEffect will run when isAuthenticated or error changes
  useEffect(() => {
    // Clear any previous errors
    clearErrors();
    
    // If user is authenticated, redirect to dashboard
    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to dashboard');
      navigate('/');
    }

    // Display error if there is one
    if (error) {
      setAlert({ type: 'danger', msg: error });
      setTimeout(() => setAlert(null), 5000);
    }
  }, [isAuthenticated, error, clearErrors, navigate]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    console.log('Login form submitted');
    
    try {
      // Login the user
      await login({ email, password });
      
      // Note: Navigation should happen in the useEffect above after isAuthenticated changes
      console.log('Login request sent');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>
          <i className="fas fa-sign-in-alt"></i> Login
        </h1>
        <p>Sign in to your TaskTracker account</p>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>{alert.msg}</div>
      )}

      <form className="auth-form" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={onChange}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={onChange}
            required
            placeholder="Enter your password"
            minLength="6"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>

      <p className="auth-link">
        Don't have an account? <Link to="/register">Register</Link>
      </p>

      <div className="auth-social">
        <p>Or login with</p>
        <div className="social-buttons">
          <button type="button" className="social-button google">
            <i className="fab fa-google"></i>
          </button>
          <button type="button" className="social-button facebook">
            <i className="fab fa-facebook-f"></i>
          </button>
          <button type="button" className="social-button github">
            <i className="fab fa-github"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;