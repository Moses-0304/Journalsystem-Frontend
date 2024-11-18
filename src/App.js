import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router, Routes, and Route
import Header from './components/Header'; // Importera Header
import Login from './components/Login'; // Importera Login
import Register from './components/Register'; // Importera Register
import PatientPage from './components/PatientPage'; // Importera PatientPage
import DoctorPage from './components/DoctorPage'; // Importera DoctorPage
import PractitionerPage from './components/PractitionerPage'; // Importera PractitionerPage
import CreateCondition from './components/CreateCondition'; // Importera CreateCondition
import CreateObservation from './components/CreateObservation'; // Importera CreateObservation
import MessagePage from './components/MessagePage'; // Importera MessagePage
import PatientMessagePage from './components/PatientMessagePage'; // Importera PatientMessagePage

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Öppna rutter */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Sidor med Header */}
        <Route
          path="/patient"
          element={
            <>
              <Header />
              <PatientPage />
            </>
          }
        />
        <Route
          path="/doctor"
          element={
            <>
              <Header />
              <DoctorPage />
            </>
          }
        />
        <Route
          path="/practitioner"
          element={
            <>
              <Header />
              <PractitionerPage />
            </>
          }
        />
        <Route
          path="/create-condition"
          element={
            <>
              <Header />
              <CreateCondition />
            </>
          }
        />
        <Route
          path="/create-observation"
          element={
            <>
              <Header />
              <CreateObservation />
            </>
          }
        />
        <Route
          path="/messages"
          element={
            <>
              <Header />
              <MessagePage />
            </>
          }
        />
        <Route
          path="/patient/messages"
          element={
            <>
              <Header />
              <PatientMessagePage />
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
