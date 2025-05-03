import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import { AuthContext } from '../contexts/AuthContext';

const Register = () => {
  const { register, isAuthenticated, error, clearErrors } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    country: ''
  });
  const [alert, setAlert] = useState(null);

  const { name, email, password, password2, country } = formData;

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
    console.log('Form submitted');
    
    // Check if passwords match
    if (password !== password2) {
      setAlert({ type: 'danger', msg: 'Passwords do not match' });
      setTimeout(() => setAlert(null), 5000);
    } else {
      try {
        // Register the user
        await register({
          name,
          email,
          password,
          country
        });
        
        // Note: Navigation should happen in the useEffect above after isAuthenticated changes
        console.log('Registration request sent');
      } catch (err) {
        console.error('Registration error:', err);
      }
    }
  };

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 
    'France', 'Japan', 'China', 'Brazil', 'India', 'Russia', 'South Africa',
    'Mexico', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Switzerland',
    'Argentina', 'New Zealand', 'Other'
  ];

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>
          <i className="fas fa-user-plus"></i> Register
        </h1>
        <p>Create your TaskTracker account</p>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>{alert.msg}</div>
      )}

      <form className="auth-form" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={onChange}
            required
            placeholder="Enter your full name"
          />
        </div>
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
        <div className="form-group">
          <label htmlFor="password2">Confirm Password</label>
          <input
            type="password"
            name="password2"
            id="password2"
            value={password2}
            onChange={onChange}
            required
            placeholder="Confirm your password"
            minLength="6"
          />
        </div>
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <select 
            name="country" 
            id="country" 
            value={country} 
            onChange={onChange}
            required
          >
            <option value="" disabled>Select your country</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>{country}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>

      <p className="auth-link">
        Already have an account? <Link to="/login">Login</Link>
      </p>

      <div className="auth-social">
        <p>Or register with</p>
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

export default Register;