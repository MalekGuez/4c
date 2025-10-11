'use client';

import { useEffect } from 'react';
import { tokenManager, apiRequest } from '@/app/services/api';

/**
 * TokenValidator Component
 * 
 * Vérifie automatiquement la validité du token au chargement de l'app.
 * Si le token est expiré, déconnecte automatiquement l'utilisateur.
 */
export default function TokenValidator() {
  useEffect(() => {
    const validateToken = async () => {
      // Si pas de token, rien à faire
      const token = tokenManager.getToken();
      if (!token) {
        return;
      }

      // Vérifier le token avec le backend
      try {
        const response = await apiRequest('/verify');
        
        if (!response.success) {
          console.log('⚠️ Token validation failed - user will be logged out');
          // La déconnexion est déjà gérée par apiRequest si 401
        }
      } catch (error) {
        console.error('Error validating token:', error);
      }
    };

    // Valider au montage du composant
    validateToken();

    // Optionnel : Valider périodiquement toutes les 5 minutes
    const interval = setInterval(validateToken, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null; // Ce composant ne rend rien
}

