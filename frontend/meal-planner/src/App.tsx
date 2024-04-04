import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import MainPage from './pages/MainPage';
import MealPlanner from './pages/MealPlanner';
import WeeklyMeals from './pages/MyMeals';
import Navbar from './components/Navbar';
import logo from './assets/logo.png';

function App() {
  const clientId = import.meta.env.VITE_REACT_APP_CLIENT_ID;

  return (
    <div className="app-container">
      <img src={logo} alt="Logo" className="logo" />
      <Navbar />
      <div className="content-container">
        <GoogleOAuthProvider clientId={clientId}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/mealplanner" element={<MealPlanner />} />
            <Route path="/currentmeals" element={<WeeklyMeals />} />
          </Routes>
        </GoogleOAuthProvider>
      </div>
    </div>
  );
}

export default App;