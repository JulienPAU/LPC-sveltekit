import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
    // Récupère les données globales du hook parent (par exemple : session)
    const { session } = await parent();

    // console.log("Session page publish:", session);

    // Vérifie si l'utilisateur est connecté
    if (!session?.user) {
        throw redirect(302, '/auth/login');
    }

    // Si l'utilisateur est connecté, continue de charger la page
    return {};
};
