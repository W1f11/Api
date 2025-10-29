import React, { useEffect, useState, useContext, useCallback } from 'react';
import { apiFetch } from '../api';
import { AuthContext } from '../context/AuthContext';

export default function AdminDashboard() {
  const { token, user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // centralized loader so we can refresh easily
  const loadAll = useCallback(async () => {
    if (!token) return;
    const t = token || localStorage.getItem('token');
    setLoading(true);
    setError(null);
    try {
      const [uRes, jRes, aRes] = await Promise.all([
        apiFetch('/api/users', {}, t).catch(()=>[]),
        apiFetch('/api/jobs', {}, t).catch(()=>[]),
        apiFetch('/api/applications', {}, t).catch(()=>[]),
      ]);
      setUsers(uRes?.data || uRes || []);
      setJobs(jRes?.data || jRes || []);
      setApplications(aRes?.data || aRes || []);
    } catch (err) {
      console.error('admin load failed', err);
      setError('Impossible de charger les données');
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleDelete = async (path, id, onRemove) => {
    if (!confirm('Confirmer la suppression ?')) return;
    try {
      const t = token || localStorage.getItem('token');
      await apiFetch(`${path}/${id}`, { method: 'DELETE' }, t);
      onRemove(id);
    } catch (err) {
      console.error('delete failed', err);
      alert('Impossible de supprimer');
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="p-6">Accès refusé. Espace réservé aux administrateurs.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-red-500 text-2xl mb-4">Espace administrateur</h1>
      {loading && <div>Chargement...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white/5 rounded">
          <div className="text-sm text-gray-300">Utilisateurs</div>
          <div className="text-2xl font-bold">{users.length}</div>
        </div>
        <div className="p-4 bg-white/5 rounded">
          <div className="text-sm text-gray-300">Offres</div>
          <div className="text-2xl font-bold">{jobs.length}</div>
        </div>
        <div className="p-4 bg-white/5 rounded flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-300">Candidatures</div>
            <div className="text-2xl font-bold">{applications.length}</div>
          </div>
          <div>
            <button onClick={loadAll} className="px-3 py-1 bg-cyan-600 rounded text-white">Rafraîchir</button>
          </div>
        </div>
      </div>

      <section className="mb-6">
        <h2 className="text-xl mb-2">Utilisateurs</h2>
        {users.length === 0 ? <div>Aucun utilisateur</div> : (
          <ul className="space-y-2">
            {users.map(u => (
              <li key={u.id} className="flex justify-between items-center p-2 bg-white/5 rounded">
                <div>
                  <div className="font-medium">{u.name || u.username || u.email}</div>
                  <div className="text-sm opacity-70">{u.email} {u.role ? `· ${u.role}` : ''}</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-red-600 rounded text-white" onClick={() => handleDelete('/api/users', u.id, id => setUsers(prev => prev.filter(x => x.id !== id)))}>Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-6">
        <h2 className="text-xl mb-2">Offres</h2>
        {jobs.length === 0 ? <div>Aucune offre</div> : (
          <ul className="space-y-2">
            {jobs.map(j => (
              <li key={j.id} className="flex justify-between items-center p-2 bg-white/5 rounded">
                <div>
                  <div className="font-medium">{j.title}</div>
                  <div className="text-sm opacity-70">{j.company} · {j.location}</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-red-600 rounded text-white" onClick={() => handleDelete('/api/jobs', j.id, id => setJobs(prev => prev.filter(x => x.id !== id)))}>Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl mb-2">Candidatures</h2>
        {applications.length === 0 ? <div>Aucune candidature</div> : (
          <ul className="space-y-2">
            {applications.map(a => (
              <li key={a.id} className="flex justify-between items-center p-2 bg-white/5 rounded">
                <div>
                  <div className="font-medium">{a.candidateName || a.user?.name || a.name}</div>
                  <div className="text-sm opacity-70">Pour : {a.job?.title || a.offerTitle}</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-red-600 rounded text-white" onClick={() => handleDelete('/api/applications', a.id, id => setApplications(prev => prev.filter(x => x.id !== id)))}>Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
