import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './DoctorPage.css'; // Importera CSS

const DoctorPage = () => {
  const [patients, setPatients] = useState([]); // Lista över patienter
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [error, setError] = useState(null); // Hantera fel

  // Hämta alla patienter från backend vid inläsning
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get('/patients');
        setPatients(response.data);
      } catch (error) {
        console.error('Failed to fetch patients:', error);
        setError('Kunde inte hämta patienter. Försök igen senare.');
      }
    };
    fetchPatients();
  }, []);

  const handlePatientSelect = (patientId) => {
    const patient = patients.find((p) => p.id === Number(patientId));
    setSelectedPatient(patient);
  };

  return (
    <div className="doctor-page">
      <h1>Välkommen, Läkare</h1>
      <p>Här kan du se och hantera patientjournaler samt skapa diagnoser och noteringar.</p>

      {/* Felmeddelande */}
      {error && <p className="error-message">{error}</p>}

      {/* Patientlista */}
      <div className="patient-list">
        <h2>Lista över patienter</h2>
        {patients.length === 0 && !error ? (
          <p>Inga patienter hittades.</p>
        ) : (
          <ul>
            {patients.map((patient) => (
              <li key={patient.id}>
                <button onClick={() => handlePatientSelect(patient.id)}>
                  {patient.name} (ID: {patient.id})
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Vald patient */}
      {selectedPatient && (
        <div className="patient-details">
          <h3>Information om vald patient:</h3>
          <p><strong>Namn:</strong> {selectedPatient.name}</p>
          <p><strong>Födelsedatum:</strong> {selectedPatient.birthDate}</p>
          <p><strong>Kontaktinfo:</strong> {selectedPatient.contactInfo}</p>

          {/* Länkar för att skapa diagnos och notering */}
          <div className="actions">
            <Link to={`/create-condition?patientId=${selectedPatient.id}`}>
              <button>Skapa ny diagnos</button>
            </Link>
            <Link to={`/create-observation?patientId=${selectedPatient.id}`}>
              <button>Skapa ny notering</button>
            </Link>
            <Link to={`/messages?patientId=${selectedPatient.id}`}>
              <button className="messages-button">Meddelanden</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPage;
