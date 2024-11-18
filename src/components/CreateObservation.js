import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api'; // API-instans
import './CreateObservation.css';

const CreateObservation = () => {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId'); // Hämta patientId från URL
  const [formData, setFormData] = useState({
    description: '',
    patientId: patientId,
  });
  const [observations, setObservations] = useState([]); // Lista för patientens observationer
  const [message, setMessage] = useState('');
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole')); // Hämta användarroll
  const [error, setError] = useState(null); // Hantera fel

  // Hämta alla observationer om användaren är läkare
  const fetchObservations = async () => {
    try {
      if (userRole === 'DOCTOR') {
        const response = await api.get(`/observations/patient/${patientId}`);
        // Sortera observationer efter datum
        const sortedObservations = response.data.sort(
          (a, b) => new Date(a.observationDate) - new Date(b.observationDate)
        );
        setObservations(sortedObservations);
      }
    } catch (error) {
      console.error('Failed to fetch observations:', error);
      setError('Kunde inte hämta observationer.');
    }
  };

  useEffect(() => {
    fetchObservations();
  }, [patientId, userRole]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/observations', formData);
      setMessage('Notering skapad!');
      setFormData({ ...formData, description: '' });

      // Uppdatera lista endast om användaren är läkare
      if (userRole === 'DOCTOR') {
        setObservations((prevObservations) => [
          ...prevObservations,
          response.data,
        ].sort((a, b) => new Date(a.observationDate) - new Date(b.observationDate)));
      }
    } catch (error) {
      console.error('Failed to create observation:', error);
      setMessage(`Fel: ${error.response?.data || 'Misslyckades med att skapa notering'}`);
    }
  };

  return (
    <div className="create-observation">
      <h2>Skapa Notering</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Beskrivning:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Ange noteringsdetaljer"
            required
          />
        </div>
        <button type="submit">Skapa</button>
      </form>
      {message && <p className="message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Visa observationer endast om användaren är läkare */}
      {userRole === 'DOCTOR' && (
        <>
          <h2>Patientens Observationer</h2>
          {observations.length === 0 ? (
            <p>Inga observationer hittades.</p>
          ) : (
            <ul className="observation-list">
              {observations.map((observation) => (
                <li key={observation.id} className="observation-item">
                  <p><strong>Beskrivning:</strong> {observation.description}</p>
                  <p><strong>Datum:</strong> {new Date(observation.observationDate).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default CreateObservation;
