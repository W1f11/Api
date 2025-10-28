import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../api';

const Login = () => {
  const navigate = useNavigate();
  const { saveAuth } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={submit} className="bg-white/10 p-6 rounded-lg text-white w-full max-w-md">
        <h2 className="text-2xl mb-4">Connexion</h2>
        {error && <div className="mb-2 text-red-200">{error}</div>}
        <label className="block mb-2">
          Email
          <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full mt-1 p-2 rounded text-black" />
        </label>
        <label className="block mb-4">
          Mot de passe
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full mt-1 p-2 rounded text-black" />
        </label>
        <button className="bg-black/80 px-6 py-3 rounded-lg" type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
