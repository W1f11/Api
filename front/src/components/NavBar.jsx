import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const NavBar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  return (
    <nav className="w-full px-4 py-3 flex items-center justify-between bg-transparent absolute top-0 left-0 z-20">
      <Link to="/" className="font-bold text-lg text-white">JobConnect</Link>
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link to="/jobs" className="text-white">Offres</Link>
            <Link to="/applications" className="text-white">Mes candidatures</Link>
            <Link to="/employer" className="text-white">Espace employeur</Link>
            <button onClick={logout} className="text-white">Se déconnecter</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-white">Connexion</Link>
            <Link to="/register" className="text-white">Inscription</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
