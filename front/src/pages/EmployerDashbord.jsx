import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { apiFetch } from "../api";

export default function EmployerDashboard() {
  const { token } = useContext(AuthContext);
  const [offers, setOffers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [editingOffer, setEditingOffer] = useState(null);
  const [form, setForm] = useState({ title: "", company: "", location: "", description: "", salary: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        let offersData;
        try {
          offersData = await apiFetch("/api/employer/offers", {}, token);
        } catch {
          offersData = await apiFetch("/api/jobs", {}, token);
        }
        setOffers(offersData.data || offersData || []);

        const appsData = await apiFetch("/api/applications", {}, token);
        setApplications(appsData.data || appsData || []);
      } catch (err) {
        console.error("EmployerDashboard load failed", err);
        setError("Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const resetForm = () => setForm({ title: "", company: "", location: "", description: "", salary: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return setError("Utilisateur non authentifié");
    setError(null);
    try {
      const payload = { ...form };
      if (payload.salary && !isNaN(payload.salary)) payload.salary = Number(payload.salary);

      if (editingOffer) {
        const res = await apiFetch(`/api/jobs/${editingOffer}`, { method: "PUT", body: JSON.stringify(payload) }, token);
        const updated = res.data || res;
        setOffers((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        setEditingOffer(null);
      } else {
        // create new job
        const res = await apiFetch("/api/jobs", { method: "POST", body: JSON.stringify(payload) }, token);
        const created = res.data || res;
        setOffers((prev) => [...prev, created]);
      }
      resetForm();
    } catch (err) {
      console.error("submit job failed", err);
      setError(err?.data?.message || "Erreur lors de l'enregistrement de l'offre");
    }
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer.id);
    setForm({
      title: offer.title || "",
      company: offer.company || "",
      location: offer.location || "",
      description: offer.description || offer.desription || "",
      salary: offer.salary != null ? String(offer.salary) : "",
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette offre ?")) return;
    try {
      await apiFetch(`/api/jobs/${id}`, { method: "DELETE" }, token);
      setOffers((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error("delete job failed", err);
      setError("Impossible de supprimer l'offre");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Espace employeur</h1>

      <section style={{ marginBottom: "2rem" }}>
        <h2>{editingOffer ? "Modifier l’offre" : "Créer une nouvelle offre"}</h2>
        {error && <div style={{ color: "#ff6b6b" }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input placeholder="Titre de l’offre" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input placeholder="Entreprise" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <input placeholder="Localisation" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <input placeholder="Salaire" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div style={{ marginTop: 8 }}>
            <button type="submit">{editingOffer ? "Mettre à jour" : "Créer"}</button>
            {editingOffer && (
              <button type="button" onClick={() => { setEditingOffer(null); resetForm(); }} style={{ marginLeft: 8 }}>
                Annuler
              </button>
            )}
          </div>
        </form>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2>Mes offres</h2>
        {loading ? (
          <div>Chargement...</div>
        ) : offers.length === 0 ? (
          <div>Aucune offre</div>
        ) : (
          <ul>
            {offers.map((o) => (
              <li key={o.id} style={{ borderBottom: "1px solid #ccc", padding: "0.5rem 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong>{o.title}</strong>
                    <div style={{ fontSize: 12, opacity: 0.8 }}>{o.company}</div>
                    <div style={{ fontSize: 13 }}>{o.location}</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{o.salary ? `Salaire: ${o.salary}` : ''}</div>
                    <p>{o.description}</p>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => handleEdit(o)}>Éditer</button>
                    <button onClick={() => handleDelete(o.id)}>Supprimer</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Candidatures reçues</h2>
        {applications.length === 0 ? (
          <p>Aucune candidature reçue.</p>
        ) : (
          <ul>
            {applications.map((a) => (
              <li key={a.id} style={{ borderBottom: "1px solid #ccc", padding: "0.5rem 0" }}>
                <strong>{a.candidateName || a.user?.name || a.name}</strong> a postulé pour <em>{a.job?.title || a.offerTitle}</em>
                <p>Email : {a.candidateEmail || a.user?.email || a.email}</p>
                <div style={{ fontSize: 12, opacity: 0.8 }}>{a.cover_letter}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}