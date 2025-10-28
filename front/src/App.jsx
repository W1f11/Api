import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import EmployerDashboard from './pages/EmployerDashbord.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Jobs from './pages/Jobs.jsx';
import Applications from './pages/Applications.jsx';
import { AuthProvider } from './context/AuthContext';
import NavBar from './components/NavBar';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-[url('/src/assets/bg.jpg')] bg-cover bg-center">
          <NavBar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/employer" element={<EmployerDashboard />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
