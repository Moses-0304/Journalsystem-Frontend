import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // För navigering
import api from '../services/api';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'PATIENT',
    patientName: '', // Uppdaterat för att matcha backend
    patientBirthDate: '', // Uppdaterat för att matcha backend
    patientContactInfo: '', // Uppdaterat för att matcha backend
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Navigeringsfunktion

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enkel validering innan skick
    if (
      !formData.username ||
      !formData.password ||
      (formData.role === 'PATIENT' &&
        (!formData.patientName || !formData.patientBirthDate || !formData.patientContactInfo))
    ) {
      setMessage('All fields are required.');
      return;
    }

    console.log('Data being sent to backend:', formData); // Debug-logg

    try {
      await api.post('/users/register', formData);
      setMessage('Registration successful!');
      setTimeout(() => navigate('/'), 2000); // Navigera tillbaka till login efter registrering
    } catch (error) {
      console.error('Error registering user:', error.response?.data || error.message); // Debug-logg
      setMessage(`Error: ${error.response?.data || 'Registration failed'}`);
    }
  };

  const handleBack = () => {
    navigate('/'); // Navigera tillbaka till login-sidan
  };

  return (
    <div className="container">
      <div className="form-box">
        <h1>Register</h1>
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
          <div>
            <label>Role:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
              <option value="STAFF">Staff</option>
            </select>
          </div>
          {/* Visa extra fält endast för patienter */}
          {formData.role === 'PATIENT' && (
            <>
              <div>
                <label>Patient Name:</label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  placeholder="Enter patient name"
                  required
                />
              </div>
              <div>
                <label>Birth Date:</label>
                <input
                  type="date"
                  name="patientBirthDate"
                  value={formData.patientBirthDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Contact Info:</label>
                <input
                  type="text"
                  name="patientContactInfo"
                  value={formData.patientContactInfo}
                  onChange={handleChange}
                  placeholder="Enter contact info"
                  required
                />
              </div>
            </>
          )}
          <button type="submit">Register</button>
        </form>
        {message && <p className="message">{message}</p>}
        <button className="back-button" onClick={handleBack}>
          Tillbaka
        </button>
      </div>
    </div>
  );
};

export default Register;
