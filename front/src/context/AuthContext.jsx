import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Création du contexte d'authentification
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Récupération initiale du token et de l'utilisateur depuis localStorage
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null; // évite les erreurs si les données JSON sont corrompues
    }
  });

  // Synchronisation du token avec localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Synchronisation de l'utilisateur avec localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Fonction pour sauvegarder le token + les infos utilisateur
  const saveAuth = (tok, userObj = null) => {
    setToken(tok);
    setUser(userObj);
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      if (token) {
        await fetch("/api/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.warn("Erreur lors de la déconnexion :", err);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  // Objet contenant les données et fonctions partagées
  const value = {
    token,
    user,
    isAuthenticated: !!token,
    saveAuth,
    setUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Default export the provider for convenience (named export AuthContext remains available)
export default AuthProvider;
