import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import MainPage from './pages/MainPage';
import MealPlanner from './pages/MealPlanner'

function App() {
  const clientId = import.meta.env.VITE_REACT_APP_CLIENT_ID;
  return (
    <GoogleOAuthProvider clientId={clientId}>
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/mealplanner" element={<MealPlanner />} />
        </Routes>
      </div>
    </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
