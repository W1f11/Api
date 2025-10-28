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
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={submit} className="bg-white/10 p-6 rounded-lg text-white w-full max-w-md">
        <h2 className="text-2xl mb-4">Inscription</h2>
        {error && <div className="mb-2 text-red-200">{error}</div>}
        <label className="block mb-2">
          Nom
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full mt-1 p-2 rounded text-black" />
        </label>
        <label className="block mb-2">
          Email
          <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full mt-1 p-2 rounded text-black" />
        </label>
        <label className="block mb-2">
          Mot de passe
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full mt-1 p-2 rounded text-black" />
        </label>
        <label className="block mb-4">
          Confirmer le mot de passe
          <input type="password" value={passwordConfirm} onChange={e=>setPasswordConfirm(e.target.value)} className="w-full mt-1 p-2 rounded text-black" />
        </label>
        <button className="bg-black/80 px-6 py-3 rounded-lg" type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;
