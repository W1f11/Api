import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const NavBar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  return (
    // keep navbar in normal document flow so page content is pushed below it
    <nav className="w-full px-4 py-3 flex items-center justify-between bg-transparent z-20">
      <Link to="/" className="font-bold text-lg text-white">JobConnect</Link>
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link to="/jobs" className="text-blue">Offres</Link>
            <Link to="/applications" className="text-blue">Mes candidatures</Link>
            {/* show employer space only to users with role 'employer' or 'admin' */}
            {user && (user.role === 'employer' || user.role === 'admin') && (
              <Link to="/employer" className="text-blue">Espace employeur</Link>
            )}
            {user && user.role === 'admin' && (
              <Link to="/admin" className="text-blue">Espace admin</Link>
            )}
            <button onClick={logout} className="text-blue">Se déconnecter</button>
          </>
        ) : (
          <div className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-sm z-50">
  <div className="container mx-auto px-4 py-3">
    <div className="flex justify-end space-x-4">
      <Link 
        to="/login" 
        className="bg-transparent text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 font-medium font-['Roboto']"
      >
        Connexion
      </Link>
      <Link 
        to="/register" 
        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium font-['Roboto']"
      >
        Inscription
      </Link>
    </div>
  </div>
</div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
