import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './PatientMessagePage.css'; // CSS för styling

const PatientMessagePage = () => {
  const [practitioners, setPractitioners] = useState([]); // Lista över vårdpersonal
  const [selectedPractitioner, setSelectedPractitioner] = useState(null); // Vald vårdpersonal
  const [messages, setMessages] = useState([]); // Meddelanden mellan patient och vårdpersonal
  const [newMessage, setNewMessage] = useState(''); // Nytt meddelande
  const [patientId, setPatientId] = useState(null); // Patientens ID
  const [error, setError] = useState(null); // Felmeddelanden

  const username = localStorage.getItem('username'); // Hämta användarnamnet från localStorage

  // Steg 1: Hämta patientens ID baserat på användarnamnet
  useEffect(() => {
    const fetchPatientId = async () => {
      try {
        const response = await api.get(`/users/username/${username}`);
        const userData = response.data;

        if (userData.role !== 'PATIENT' || !userData.patientId) {
          setError('Endast patienter kan visa denna sida.');
          return;
        }

        setPatientId(userData.patientId);
        setError(null); // Rensa tidigare fel
      } catch (error) {
        console.error('Kunde inte hämta patientens ID:', error);
        setError('Kunde inte hämta patientinformation.');
      }
    };

    if (username) {
      fetchPatientId();
    } else {
      setError('Inloggat användarnamn saknas. Logga in igen.');
    }
  }, [username]);

  // Steg 2: Hämta lista över vårdpersonal
  useEffect(() => {
    const fetchPractitioners = async () => {
      try {
        const response = await api.get('/practitioners');
        setPractitioners(response.data);
      } catch (error) {
        console.error('Kunde inte hämta vårdpersonal:', error);
        setError('Kunde inte hämta tillgängliga vårdpersonal.');
      }
    };

    fetchPractitioners();
  }, []);

  // Hämta meddelanden mellan patienten och vald vårdpersonal
  const fetchMessages = async (practitionerId) => {
    try {
      const response = await api.get(`/messages/conversation?user1=${patientId}&user2=${practitionerId}`);
      setMessages(response.data);
      setError(null); // Rensa tidigare fel
    } catch (error) {
      console.error('Kunde inte hämta meddelanden:', error);
      setError('Kunde inte hämta meddelanden.');
    }
  };

  const handlePractitionerSelect = (practitioner) => {
    setSelectedPractitioner(practitioner);
    fetchMessages(practitioner.id);
  };

  const handleSendMessage = async () => {
    try {
      const response = await api.post('/messages', {
        content: newMessage,
        senderId: patientId,
        receiverId: selectedPractitioner.id,
      });
      setMessages([...messages, response.data]);
      setNewMessage('');
      setError(null); // Rensa tidigare fel
    } catch (error) {
      console.error('Kunde inte skicka meddelandet:', error);
      setError('Kunde inte skicka meddelandet.');
    }
  };

  if (!patientId) {
    return <p>Laddar patientinformation...</p>;
  }

  return (
    <div className="patient-message-page">
      <h1>Patientens Meddelanden</h1>

      {/* Välj vårdpersonal */}
      <div className="practitioner-list">
        <h2>Välj en vårdpersonal:</h2>
        {practitioners.map((practitioner) => (
          <button
            key={practitioner.id}
            onClick={() => handlePractitionerSelect(practitioner)}
            className={selectedPractitioner?.id === practitioner.id ? 'selected' : ''}
          >
            {practitioner.name} ({practitioner.role})
          </button>
        ))}
      </div>

      {/* Meddelanden */}
      {selectedPractitioner && (
        <div className="message-section">
          <h2>Meddelanden med {selectedPractitioner.name} ({selectedPractitioner.role})</h2>
          <div className="message-list">
            {messages.length === 0 ? (
              <p>Inga meddelanden hittades.</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="message">
                  <strong>{msg.senderId === patientId ? 'Du' : selectedPractitioner.name}:</strong>
                  <p>{msg.content}</p>
                  <small>{new Date(msg.sentDate).toLocaleString()}</small>
                </div>
              ))
            )}
          </div>

          {/* Skicka nytt meddelande */}
          <div className="send-message">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Skriv ditt meddelande..."
            />
            <button onClick={handleSendMessage}>Skicka</button>
          </div>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default PatientMessagePage;
