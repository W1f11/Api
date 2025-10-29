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
            <Link to="/jobs" className="text-white">Offres</Link>
            <Link to="/applications" className="text-white">Mes candidatures</Link>
            {/* show employer space only to users with role 'employer' or 'admin' */}
            {user && (user.role === 'employer' || user.role === 'admin') && (
              <Link to="/employer" className="text-white">Espace employeur</Link>
            )}
            {user && user.role === 'admin' && (
              <Link to="/admin" className="text-white">Espace admin</Link>
            )}
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
