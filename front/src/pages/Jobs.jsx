
import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api';

// Simple Jobs component: fetch on mount and on search button click
export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchJobs(filters = {}) {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.title) params.append('title', filters.title);
      if (filters.company) params.append('company', filters.company);
      if (filters.location) params.append('location', filters.location);
      const qs = params.toString() ? `?${params.toString()}` : '';
      const token = localStorage.getItem('token');
      const data = await apiFetch(`/api/jobs${qs}`, {}, token);
      setJobs(data?.data || data || []);
    } catch (err) {
      console.error('fetch jobs failed', err);
      setError(err?.message || JSON.stringify(err));
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchJobs(); }, []);

  const onSearch = (e) => {
    e.preventDefault();
    fetchJobs({ title: title.trim(), company: company.trim(), location: location.trim() });
  };

  return (
    <div className="p-4 pt-24">
      <form onSubmit={onSearch} className="mb-4 mt-6 flex gap-2">
        <input className="p-2" placeholder="Titre" value={title} onChange={e => setTitle(e.target.value)} />
        <input className="p-2" placeholder="Entreprise" value={company} onChange={e => setCompany(e.target.value)} />
        <input className="p-2" placeholder="Localisation" value={location} onChange={e => setLocation(e.target.value)} />
        <button className="px-4 bg-black/80 rounded text-white" type="submit">Rechercher</button>
      </form>

  {loading && <div>Chargement...</div>}
  {error && <div className="text-red-400">Erreur : {String(error)}</div>}
  {!loading && !error && jobs.length === 0 && <div>Aucune offre trouvée</div>}

      <ul>
        {jobs.map(j => (
          <li key={j.id} className="mb-3 p-3 bg-white/5 rounded">
            <h3 className="text-lg">{j.title}</h3>
            <p className="text-sm opacity-80">{j.description}</p>
            {j.location && <p className="text-sm mt-1">📍 {j.location}</p>}
            {j.salary !== undefined && j.salary !== null && j.salary !== '' && (
              <p className="text-sm font-semibold mt-1">Salaire: {j.salary}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
