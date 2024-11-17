import React, { useState } from 'react';
import api from '../services/api'; // Din API-instans för backend-anrop
import './CreateObservation.css';

const CreateObservation = ({ patientId }) => {
  const [formData, setFormData] = useState({
    description: '',
    patientId: patientId, // Koppla direkt till patienten
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/observations', formData);
      setMessage('Observation created successfully!');
      console.log('Observation:', response.data);
    } catch (error) {
      setMessage(`Error: ${error.response?.data || 'Failed to create observation'}`);
    }
  };

  return (
    <div className="create-observation">
      <h2>Create Observation</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter observation details"
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default CreateObservation;
