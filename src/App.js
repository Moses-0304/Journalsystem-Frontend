import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router, Routes, and Route
import Login from './components/Login'; // Import Login component
import Register from './components/Register'; // Import Register component
import PatientPage from './components/PatientPage'; // Import PatientPage component
import DoctorPage from './components/DoctorPage'; // Import DoctorPage component
import PractitionerPage from './components/PractitionerPage'; // Import PractitionerPage component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/patient" element={<PatientPage />} />
        <Route path="/doctor" element={<DoctorPage />} />
        <Route path="/practitioner" element={<PractitionerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
