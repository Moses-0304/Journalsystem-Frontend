import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api'; // API-instans
import './CreateCondition.css';

const CreateCondition = () => {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId'); // Hämta patientId från URL
  const [formData, setFormData] = useState({
    diagnosis: '',
    patientId: patientId,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [conditions, setConditions] = useState([]); // Patientens diagnoser
  const userRole = localStorage.getItem('userRole'); // Hämta användarroll från localStorage

  // Hämta diagnoser om användaren är läkare
  useEffect(() => {
    const fetchConditions = async () => {
      try {
        if (userRole === 'DOCTOR') {
          const response = await api.get(`/conditions/patient/${patientId}`);
          const sortedConditions = response.data.sort(
            (a, b) => new Date(a.diagnosisDate) - new Date(b.diagnosisDate)
          );
          setConditions(sortedConditions);
        }
      } catch (error) {
        console.error('Failed to fetch conditions:', error);
        setError('Kunde inte hämta diagnoser.');
      }
    };

    fetchConditions();
  }, [patientId, userRole]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/conditions', formData);
      setMessage('Diagnos skapad!');
      setFormData({ ...formData, diagnosis: '' });

      // Om användaren är läkare, uppdatera listan
      if (userRole === 'DOCTOR') {
        setConditions((prevConditions) => [
          ...prevConditions,
          response.data,
        ].sort((a, b) => new Date(a.diagnosisDate) - new Date(b.diagnosisDate)));
      }
    } catch (error) {
      setMessage(`Fel: ${error.response?.data || 'Misslyckades med att skapa diagnos'}`);
    }
  };

  return (
    <div className="create-condition">
      <h2>Skapa Diagnos</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Diagnos:</label>
          <input
            type="text"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            placeholder="Skriv diagnos"
            required
          />
        </div>
        <button type="submit">Skapa</button>
      </form>
      {message && <p className="message">{message}</p>}

      {/* Visa diagnoser endast om användaren är läkare */}
      {userRole === 'DOCTOR' && (
        <>
          <h2>Patientens Diagnoser</h2>
          {error && <p className="error-message">{error}</p>}
          {conditions.length === 0 ? (
            <p>Inga diagnoser hittades.</p>
          ) : (
            <ul>
              {conditions.map((condition) => (
                <li key={condition.id}>
                  <p><strong>Diagnos:</strong> {condition.diagnosis}</p>
                  <p><strong>Datum:</strong> {new Date(condition.diagnosisDate).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default CreateCondition;
