import React from 'react';
import CreateObservation from './CreateObservation';
import CreateCondition from './CreateCondition';

const PatientDetails = ({ patient }) => {
  return (
    <div className="patient-details">
      <h1>Patient Details</h1>
      <p><strong>Name:</strong> {patient.name}</p>
      <p><strong>Birth Date:</strong> {patient.birthDate}</p>
      <p><strong>Contact Info:</strong> {patient.contactInfo}</p>

      <hr />

      {/* Skapa en ny observation */}
      <CreateObservation patientId={patient.id} />

      <hr />

      {/* Skapa en ny diagnos */}
      <CreateCondition patientId={patient.id} createdBy="Dr. John Doe" />
    </div>
  );
};

export default PatientDetails;
