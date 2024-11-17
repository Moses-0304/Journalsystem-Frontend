import React, { useState } from 'react';
import api from '../services/api'; // Din API-instans för backend-anrop
import './CreateCondition.css';

const CreateCondition = ({ patientId, createdBy }) => {
  const [formData, setFormData] = useState({
    diagnosis: '',
    severity: '',
    patientId: patientId, // Koppla direkt till patienten
    createdBy: createdBy, // Läkaren eller personalens namn
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/conditions', formData);
      setMessage('Condition created successfully!');
      console.log('Condition:', response.data);
    } catch (error) {
      setMessage(`Error: ${error.response?.data || 'Failed to create condition'}`);
    }
  };

  return (
    <div className="create-condition">
      <h2>Create Condition</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Diagnosis:</label>
          <input
            type="text"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            placeholder="Enter diagnosis"
            required
          />
        </div>
        <div>
          <label>Severity:</label>
          <select
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            required
          >
            <option value="">Select severity</option>
            <option value="MILD">Mild</option>
            <option value="MODERATE">Moderate</option>
            <option value="SEVERE">Severe</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default CreateCondition;
