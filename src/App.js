import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router, Routes, and Route
import Login from './components/Login'; // Import Login component
import Register from './components/Register'; // Import Register component
import PatientPage from './components/PatientPage'; // Import PatientPage component
import DoctorPage from './components/DoctorPage'; // Import DoctorPage component
import PractitionerPage from './components/PractitionerPage'; // Import PractitionerPage component
import CreateCondition from './components/CreateCondition'; // Import CreateCondition component
import CreateObservation from './components/CreateObservation'; // Import CreateObservation component
import MessagePage from './components/MessagePage'; // Import MessagePage component
import PatientMessagePage from './components/PatientMessagePage'; // Import PatientMessagePage component

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Patient Routes */}
        <Route path="/patient" element={<PatientPage />} />
        <Route path="/patient/messages" element={<PatientMessagePage />} />

        {/* Doctor Routes */}
        <Route path="/doctor" element={<DoctorPage />} />

        {/* Practitioner Routes */}
        <Route path="/practitioner" element={<PractitionerPage />} />

        {/* Shared Functionalities */}
        <Route path="/create-condition" element={<CreateCondition />} />
        <Route path="/create-observation" element={<CreateObservation />} />

        {/* Generic Message Page */}
        <Route path="/messages" element={<MessagePage />} />
      </Routes>
    </Router>
  );
}

export default App;
