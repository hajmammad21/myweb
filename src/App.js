import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './Components/Header/Header';
import Auth from './Components/Auth/Auth';
import HomePage from './Components/LandingPage/LandingPage';
import PastExams from './pages/PastExams/PastExams';
import TestPage from './pages/TestPage/TestPage';
import ContactUs from './pages/ContactUs/ContactUs';
import MockExams from './pages/MockExams/MockExams';


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/test-page" element={<TestPage />} />
        <Route path="/past-exams" element={<PastExams />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/mock-exams" element={<MockExams />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;