// src/routes/api/_private/+server.ts

import { error, json } from '@sveltejs/kit';

export const GET = async (event) => {
    // Récupération de la session utilisateur
    const session = await event.locals.auth();
    // console.log("Session:", session);

    // Vérification de l'authentification
    if (!session || !session.user) {
        throw error(401, 'Unauthorized');
    }

    // Optionnel : Vérification du rôle utilisateur
    if (session.user.role !== 'ADMIN') {
        throw error(403, 'Forbidden: You do not have access to this resource.');
    }

    // Si tout est OK, retourne les données protégées
    return json({
        message: 'Bienvenue dans la route privée !',
        user: session.user,
    });
};
