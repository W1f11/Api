import React, { useEffect, useState, useContext } from 'react';
import { apiFetch } from '../api';
import { AuthContext } from '../context/AuthContext';

const Applications = () => {
  const { token } = useContext(AuthContext);
  const [apps, setApps] = useState([]);

  useEffect(()=>{
    const load = async () => {
      try {
        const data = await apiFetch('/api/applications', {}, token);
        setApps(data.data || data);
      } catch (e) {
        console.error('fetch applications failed', e);
      }
    };
    load();
  }, [token]);

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Mes candidatures</h2>
      {!apps.length && <div>Aucune candidature</div>}
      <ul>
        {apps.map(a => (
          <li key={a.id} className="mb-3 p-3 bg-white/5 rounded">
            <div className="font-semibold">{a.job?.title || 'Offre supprimée'}</div>
            <div className="text-sm opacity-80">{a.cover_letter}</div>
            <div className="text-xs mt-1 opacity-70">{a.status}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Applications;
