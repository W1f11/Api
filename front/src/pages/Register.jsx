import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../api';

const Register = () => {
  const navigate = useNavigate();
  const { saveAuth } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await apiFetch('/api/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirm }),
      });

      
      const tok = data?.token || data?.plainTextToken || data?.access_token || (typeof data === 'string' ? data : null);
      if (!tok) throw { data, message: 'Token introuvable dans la réponse d\'inscription' };
      saveAuth(tok, null);


      try {
        const me = await apiFetch('/api/me', {}, tok);
        saveAuth(tok, me);
      } catch (err) {
        // ignore failing /api/me fetch; user still registered
        console.warn('fetch /api/me failed after register', err);
      }
      navigate('/jobs');
    } catch (e) {
      console.error('register failed', e);

      const msg = e?.data?.message || (e?.data ? JSON.stringify(e.data) : e?.message) || "Erreur d'inscription";
      setError(msg);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 bg-white">
      <form onSubmit={submit} className="bg-white p-8 rounded-lg w-full max-w-md shadow-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 font-['Poppins']">Inscription</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-['Roboto']">
            Nom
          </label>
          <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-colors" 
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-['Roboto']">
            Email
          </label>
          <input 
            type="email"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-colors" 
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-['Roboto']">
            Mot de passe
          </label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-colors" 
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-['Roboto']">
            Confirmer le mot de passe
          </label>
          <input 
            type="password" 
            value={passwordConfirm} 
            onChange={e => setPasswordConfirm(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-colors" 
            required
          />
        </div>
        
        <button 
          className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 font-['Poppins']" 
          type="submit"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
};

export default Register;