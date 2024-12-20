import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: '', // Can be username or email
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Frontend validation
    if (!formData.identifier || !formData.password) {
      setError('Please fill in both fields.');
      return;
    }

    const { identifier, password } = formData;

    try {
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setError(''); // Clear any previous errors
        // store token to localStorage
        localStorage.setItem('token', data.token);
        // Redirect to the landing page
        navigate('/landing');
      } else {
        const errorData = await response.json();
        // Handle specific errors from backend
        if (errorData.error === 'User not found') {
          setError('Username or email does not exist.');
        } else if (errorData.error === 'Incorrect password') {
          setError('Incorrect password. Please try again.');
        } else {
          setError('Login failed. Please try again later.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Login failed. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <img
        src="/images/bionicRobot.png"
        alt="robot"
        className="background-image"
      ></img>
      <img
        src="/images/backgroundSignup.jpg"
        alt="background"
        className="background-cover"
      ></img>
      <img
        src="/images/friendlyRobot.png"
        alt="robot"
        className="robot-image"
      ></img>
      <div className="login-box">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Log into your account</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="identifier"
            placeholder="Username or email"
            value={formData.identifier}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error && <p className="error-message">{error}</p>}
          <div className="remember-forgot">
            <div style={{ whiteSpace: 'nowrap' }}>
              <label className="checkboxes">
                <input type="checkbox" />
                Remember me
              </label>
            </div>
            <a href="/forgotPassword">Forgot password?</a>
          </div>
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
        <div className="login-link">
          <p>
            Don’t have an account?<a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
