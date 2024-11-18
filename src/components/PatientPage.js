import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // För navigering
import api from '../services/api';
import './PatientPage.css'; // CSS för PatientPage

const PatientPage = () => {
  const [patientInfo, setPatientInfo] = useState(null); // Patientens grundinformation
  const [observations, setObservations] = useState([]); // Patientens observationer
  const [conditions, setConditions] = useState([]); // Patientens diagnoser
  const [error, setError] = useState(null); // Felmeddelande

  const username = localStorage.getItem('username'); // Hämta användarnamn från localStorage
  const navigate = useNavigate(); // Använd för navigering

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        if (!username) {
          setError('Inloggat användarnamn saknas. Logga in igen.');
          return;
        }

        const userResponse = await api.get(`/users/username/${username}`);
        const userData = userResponse.data;

        if (userData.role !== 'PATIENT' || !userData.patientId) {
          setError('Endast patienter kan visa denna sida.');
          return;
        }

        const patientId = userData.patientId;

        const patientResponse = await api.get(`/patients/${patientId}`);
        const patientData = patientResponse.data;

        setPatientInfo({
          name: patientData.name,
          id: patientData.id,
          contactInfo: patientData.contactInfo,
          birthDate: patientData.birthDate,
        });

        const observationsResponse = await api.get(`/observations/patient/${patientId}`);
        setObservations(observationsResponse.data);

        const conditionsResponse = await api.get(`/conditions/patient/${patientId}`);
        setConditions(conditionsResponse.data);

        setError(null);
      } catch (error) {
        console.error('Failed to fetch patient data:', error);
        setError('Kunde inte hämta patientinformation. Kontrollera din anslutning.');
      }
    };

    fetchPatientData();
  }, [username]);

  const goToMessages = () => {
    navigate('/patient/messages');
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!patientInfo) {
    return <p>Laddar patientinformation...</p>;
  }

  return (
    <div className="patient-page">
      <h1>Välkommen, {patientInfo.name}</h1>
      <p>Här kan du se din journal och information kopplad till din vård.</p>

      <div className="patient-info">
        <h2>Din Information</h2>
        <p><strong>Namn:</strong> {patientInfo.name}</p>
        <p><strong>Kontaktinfo:</strong> {patientInfo.contactInfo}</p>
        <p><strong>Födelsedatum:</strong> {new Date(patientInfo.birthDate).toLocaleDateString()}</p>
        <p><strong>ID:</strong> {patientInfo.id}</p>
      </div>

      <div className="patient-observations">
        <h2>Dina Observationer</h2>
        {observations.length === 0 ? (
          <p>Inga observationer hittades.</p>
        ) : (
          <ul>
            {observations.map((obs) => (
              <li key={obs.id}>
                <p><strong>Beskrivning:</strong> {obs.description}</p>
                <p><strong>Datum:</strong> {new Date(obs.observationDate).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="patient-conditions">
        <h2>Dina Diagnoser</h2>
        {conditions.length === 0 ? (
          <p>Inga diagnoser hittades.</p>
        ) : (
          <ul>
            {conditions.map((cond) => (
              <li key={cond.id}>
                <p><strong>Diagnos:</strong> {cond.diagnosis}</p>
                <p><strong>Datum:</strong> {new Date(cond.diagnosisDate).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button className="message-button" onClick={goToMessages}>
        Gå till Meddelanden
      </button>
    </div>
  );
};

export default PatientPage;
