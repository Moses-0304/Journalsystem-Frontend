import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PractitionerPage = () => {
  const [selectedPatientId, setSelectedPatientId] = useState('');

  const handlePatientChange = (e) => {
    setSelectedPatientId(e.target.value);
  };

  return (
    <div>
      <h1>Välkommen, Personal</h1>
      <p>Här kan du hantera patienter och skapa noteringar eller diagnoser.</p>

      {/* Formulär för att välja patient */}
      <div>
        <label htmlFor="patientId">Välj Patient ID:</label>
        <input
          type="text"
          id="patientId"
          value={selectedPatientId}
          onChange={handlePatientChange}
          placeholder="Ange patient-ID"
        />
      </div>

      {/* Länkar till att skapa ny condition eller observation */}
      <div>
        <h2>Hantera Patient</h2>
        <Link to={`/create-condition?patientId=${selectedPatientId}`}>
          <button disabled={!selectedPatientId}>Skapa ny diagnos</button>
        </Link>
        <Link to={`/create-observation?patientId=${selectedPatientId}`}>
          <button disabled={!selectedPatientId}>Skapa ny notering</button>
        </Link>
      </div>
    </div>
  );
};

export default PractitionerPage;
