import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchJobs = async (search='') => {
    setLoading(true);
    try {
      const params = search ? `?title=${encodeURIComponent(search)}` : '';
      const data = await apiFetch(`/api/jobs${params}`);
      setJobs(data.data || data);
    } catch (e) {
      console.error('fetch jobs failed', e);
    } finally { setLoading(false); }
  };

  useEffect(()=>{ fetchJobs(); }, []);

  const onSearch = (e) => {
    e.preventDefault();
    fetchJobs(q);
  };

  return (
    <div className="p-4">
      <form onSubmit={onSearch} className="mb-4 flex gap-2">
        <input className="flex-1 p-2" placeholder="Recherche par titre" value={q} onChange={e=>setQ(e.target.value)} />
        <button className="px-4 bg-black/80 rounded text-white">Rechercher</button>
      </form>

      {loading && <div>Chargement...</div>}
      {!loading && jobs.length === 0 && <div>Aucune offre trouvée</div>}
      <ul>
        {jobs.map(j => (
          <li key={j.id} className="mb-3 p-3 bg-white/5 rounded">
            <h3 className="text-lg">{j.title}</h3>
            <p className="text-sm opacity-80">{j.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Jobs;
