import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import './MessagePage.css'; // CSS för MessagePage

const MessagePage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const patientId = searchParams.get('patientId'); // Hämta patientens ID från URL
  const username = localStorage.getItem('username'); // Hämta inloggad användares användarnamn
  const [userId, setUserId] = useState(null); // Lagrar den inloggade användarens ID
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null); // Felmeddelande för hela komponenten
  const [isLoading, setIsLoading] = useState(true); // För att hantera laddningsstatus

  // Hämta ID för inloggad användare baserat på username
  useEffect(() => {
    const fetchUserId = async () => {
      if (!username) {
        setError('Ingen användare är inloggad.');
        setIsLoading(false); // Stoppa laddning
        return;
      }

      try {
        const response = await api.get(`/practitioners/name/${username}`);
        if (response.data && response.data.id) {
          setUserId(response.data.id); // Sätt användarens ID
          setError(null); // Återställ fel om det lyckas
        } else {
          setError('Kunde inte hämta användarens ID.');
        }
      } catch (error) {
        console.error('Failed to fetch user ID:', error);
        setError('Kunde inte hämta användarens ID.');
      } finally {
        setIsLoading(false); // Stoppa laddning oavsett resultat
      }
    };

    fetchUserId();
  }, [username]);

  // Hämta alla meddelanden mellan inloggad användare och vald patient
  useEffect(() => {
    if (!patientId || !userId) return;

    const fetchMessages = async () => {
      try {
        const response = await api.get(`/messages/conversation?user1=${userId}&user2=${patientId}`);
        setMessages(response.data);
        setError(null); // Återställ fel om det lyckas
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        setError('Kunde inte hämta meddelanden.');
      }
    };

    fetchMessages();
  }, [patientId, userId]);

  const handleSendMessage = async () => {
    if (!userId) {
      setError('Du är inte inloggad.');
      return;
    }

    try {
      const response = await api.post('/messages', {
        content: newMessage,
        senderId: userId, // Använd ID från backend
        receiverId: patientId,
      });
      setMessages([...messages, response.data]);
      setNewMessage('');
      setError(null); // Återställ fel om det lyckas
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Kunde inte skicka meddelande.');
    }
  };

  if (isLoading) {
    return <div className="message-page"><p>Laddar...</p></div>; // Visa laddningsindikator
  }

  return (
    <div className="message-page">
      <h1>Meddelanden med patient (ID: {patientId})</h1>

      {/* Felmeddelanden */}
      {error && <p className="error-message">{error}</p>}

      {/* Lista över meddelanden */}
      <div className="message-list">
        {messages.length === 0 ? (
          <p>Inga meddelanden hittades.</p>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="message">
              <p>
                <strong>{message.senderId === userId ? 'Du' : 'Patienten'}:</strong>{' '}
                {message.content}
              </p>
              <small>{new Date(message.sentDate).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>

      {/* Formulär för att skicka nytt meddelande */}
      <div className="message-form">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Skriv ditt meddelande här..."
        ></textarea>
        <button onClick={handleSendMessage}>Skicka</button>
      </div>
    </div>
  );
};

export default MessagePage;
