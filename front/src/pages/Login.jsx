import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../api';

const Login = () => {
  const navigate = useNavigate();
  const { saveAuth } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const data = await apiFetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      const tok = data?.token || data?.plainTextToken || data?.access_token || (typeof data === 'string' ? data : null);
      if (!tok) throw { data, message: 'Token introuvable dans la réponse' };
      saveAuth(tok, null);
      
      try {
        const me = await apiFetch('/api/me', {}, tok);
        saveAuth(tok, me);
      } catch (err) {
        console.warn('fetch /api/me failed after login', err);
      }
      
      navigate('/jobs');
    } catch (e) {
      console.error('login failed', e);
      const msg = e?.data?.message || (e?.data ? JSON.stringify(e.data) : e?.message) || 'Erreur de connexion';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" flex items-center justify-center bg-white px-4 py-8">
      <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8 font-['Poppins']">Connexion</h2>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
            {error}
          </div>
        )}
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-['Inter']">
            Email
          </label>
          <input 
            type="email"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 placeholder-gray-400 font-['Inter']"
            placeholder="votre@email.com"
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-['Inter']">
            Mot de passe
          </label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 placeholder-gray-400 font-['Inter']"
            placeholder="Votre mot de passe"
            required
            disabled={isLoading}
          />
        </div>
        
        <button 
          className={`w-full bg-black text-white py-3.5 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black font-['Inter'] ${
            isLoading 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-gray-800'
          }`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 font-['Inter']">
            Pas de compte ?{' '}
            <Link 
              to="/register" 
              className="text-black font-medium hover:text-gray-700 transition-colors"
            >
              S'inscrire
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;