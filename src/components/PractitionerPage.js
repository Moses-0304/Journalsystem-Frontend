import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './PractitionerPage.css'; // CSS för PractitionerPage

const PractitionerPage = () => {
  const [patients, setPatients] = useState([]); // Lista över patienter
  const [error, setError] = useState(null); // Hantera fel

  // Hämta alla patienter från backend
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get('/patients'); // Anta att "/patients" returnerar alla patienter
        setPatients(response.data);
      } catch (error) {
        console.error('Failed to fetch patients:', error);
        setError('Kunde inte hämta patienter. Försök igen senare.');
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="practitioner-page">
      <h1>Välkommen, Personal</h1>
      <p>Här kan du hantera patienter och skapa noteringar eller diagnoser.</p>

      {/* Felmeddelande */}
      {error && <p className="error-message">{error}</p>}

      {/* Lista över patienter */}
      <div className="patient-list">
        <h2>Lista över patienter</h2>
        {patients.length === 0 ? (
          <p>Inga patienter hittades.</p>
        ) : (
          <ul>
            {patients.map((patient) => (
              <li key={patient.id}>
                <p>
                  <strong>Namn:</strong> {patient.name}
                  <br />
                  <strong>ID:</strong> {patient.id}
                </p>
                <div className="actions">
                  {/* Länkar till att skapa diagnos och notering */}
                  <Link to={`/create-condition?patientId=${patient.id}`}>
                    <button>Skapa ny diagnos</button>
                  </Link>
                  <Link to={`/create-observation?patientId=${patient.id}`}>
                    <button>Skapa ny notering</button>
                  </Link>
                  {/* Länk till MessagePage */}
                  <Link to={`/messages?patientId=${patient.id}`}>
                    <button>Meddelanden</button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PractitionerPage;
