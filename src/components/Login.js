import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/login', formData);

      console.log('Response from backend:', response.data);

      // Om svaret är en textsträng, extrahera rollen
      const role = response.data.includes('DOCTOR') ? 'DOCTOR' :
                   response.data.includes('PATIENT') ? 'PATIENT' :
                   response.data.includes('STAFF') ? 'PRACTITIONER' : null;

      if (!role) {
        setMessage('Login successful, but role is undefined!');
        return;
      }

      // Lagra rollen i LocalStorage
      localStorage.setItem('userRole', role);
      localStorage.setItem('username', formData.username);

      setMessage(`Login successful! Role: ${role}`);

      // Navigera till rätt sida baserat på rollen
      if (role === 'PATIENT') navigate('/patient');
      else if (role === 'DOCTOR') navigate('/doctor');
      else if (role === 'PRACTITIONER') navigate('/practitioner');
    } catch (error) {
      setMessage(`Error: ${error.response?.data || 'Login failed'}`);
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        {message && <p className="message">{message}</p>}
        <div className="register-link">
          <p>Don't have an account?</p>
          <Link to="/register">
            <button className="register-button">Register here</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
