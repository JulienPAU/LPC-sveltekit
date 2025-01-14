// src/routes/auth/signout/+page.server.ts
import { signOut } from "../../../auth";  // Assure-toi que ce chemin est correct

import type { Actions } from "./$types";  // Type pour les actions dans cette page

export const actions: Actions = {
    default: async (event) => {
        // Appelle signOut ici
        await signOut(event); // Cela va supprimer la session et rediriger l'utilisateur vers la page de connexion
    }
};
