import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DoctorPage = () => {
  const [selectedPatientId, setSelectedPatientId] = useState('');

  const handlePatientChange = (e) => {
    setSelectedPatientId(e.target.value);
  };

  return (
    <div>
      <h1>Välkommen, Läkare</h1>
      <p>Här kan du se och hantera patientjournaler samt svara på meddelanden.</p>

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

export default DoctorPage;
