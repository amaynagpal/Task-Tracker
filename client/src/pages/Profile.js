import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FormPage.css';
import Spinner from '../components/layout/Spinner';
import { AuthContext } from '../contexts/AuthContext';

const Profile = () => {
  const { isAuthenticated, loading, user, updateProfile, loadUser } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log('Profile component - User:', user);
  console.log('Profile component - Loading:', loading);
  console.log('Profile component - isAuthenticated:', isAuthenticated);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [alert, setAlert] = useState(null);

  const { name, email, country, currentPassword, newPassword, confirmPassword } = formData;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    // If user data is not loaded yet, try to load it
    if (isAuthenticated && !user && !loading) {
      console.log('User data missing, attempting to load');
      loadUser();
    }
  }, [isAuthenticated, user, loading, loadUser]);

  useEffect(() => {
    if (user) {
      console.log('Setting form data with user:', user);
      setFormData(prevData => ({
        ...prevData,
        name: user.name || '',
        email: user.email || '',
        country: user.country || ''
      }));
    }
  }, [user]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();

    if (newPassword !== '' && newPassword !== confirmPassword) {
      setAlert({
        type: 'danger',
        msg: 'New passwords do not match'
      });
      setTimeout(() => setAlert(null), 5000);
      return;
    }

    const updateData = {
      name,
      country
    };

    if (newPassword !== '') {
      updateData.currentPassword = currentPassword;
      updateData.newPassword = newPassword;
    }

    console.log('Updating profile with data:', updateData);
    const res = await updateProfile(updateData);

    if (res.success) {
      setAlert({
        type: 'success',
        msg: 'Profile updated successfully'
      });
      setTimeout(() => setAlert(null), 5000);
      
      // Clear password fields after successful update
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      setAlert({
        type: 'danger',
        msg: res.error || 'Failed to update profile'
      });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 
    'France', 'Japan', 'China', 'Brazil', 'India', 'Russia', 'South Africa',
    'Mexico', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Switzerland',
    'Argentina', 'New Zealand', 'Other'
  ];

  if (loading) {
    console.log('Profile loading...');
    return <Spinner />;
  }

  if (!user) {
    console.log('No user data available');
    return (
      <div className="form-container">
        <div className="form-header">
          <h1>Error Loading Profile</h1>
          <p>Unable to load user data. Please try refreshing the page.</p>
          <button onClick={() => loadUser()} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>
          <i className="fas fa-user-circle"></i> Profile
        </h1>
        <p>Manage your account information</p>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>{alert.msg}</div>
      )}

      <form className="form-content" onSubmit={onSubmit}>
        <div className="form-section">
          <h3 className="form-section-title">Account Information</h3>
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
              disabled
              className="disabled-input"
            />
            <small className="form-text">Email address cannot be changed</small>
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
              <option value="">Select your country</option>
              {countries.map((countryOption, index) => (
                <option key={index} value={countryOption}>{countryOption}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Change Password</h3>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              id="currentPassword"
              value={currentPassword}
              onChange={onChange}
              placeholder="Enter your current password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              value={newPassword}
              onChange={onChange}
              placeholder="Enter your new password"
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              placeholder="Confirm your new password"
              minLength="6"
            />
          </div>
        </div>

        <div className="form-footer">
          <button type="button" className="btn btn-light" onClick={() => navigate('/')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;