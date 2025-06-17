import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './Components/Header/Header';
import Auth from './Components/Auth/Auth';
import HomePage from './Components/LandingPage/LandingPage';
import TestPage from './pages/TestPage/TestPage';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/test-page" element={<TestPage />} />
      </Routes>
    </Router>
  );
}

export default App;