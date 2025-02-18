




import type { User } from '$lib/types/user';
import { error, json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export const GET = async (event: RequestEvent) => {
    try {
        // Vérification de la session
        const session = await event.locals.auth();

        if (!session) {
            throw error(401, {
                message: 'Non authentifié - Veuillez vous connecter'
            });
        }

        if (!session.user) {
            throw error(403, {
                message: 'Session utilisateur invalide'
            });
        }

        const user = session.user as User;

        // Vérification que User_Role existe
        if (!user.User_Role) {
            throw error(403, {
                message: 'Rôle utilisateur non défini'
            });
        }

        // Vérification du rôle admin
        const isAdmin = Array.isArray(user.User_Role)
            ? user.User_Role.some(role => role.role === 'ADMIN')
            : user.User_Role === 'ADMIN';

        if (!isAdmin) {
            throw error(403, {
                message: 'Accès refusé - Permissions administrateur requises'
            });
        }

        // Filtrer les données sensibles avant de les renvoyer
        const sanitizedUser = {
            id: user.id,
            email: user.email,
            User_Role: user.User_Role
        };

        return json({
            success: true,
            message: 'Bienvenue dans la route privée !',
            user: sanitizedUser
        }, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate'
            }
        });

    } catch (err) {
        // Log de l'erreur pour le débogage
        console.error('Erreur dans la route privée:', err);

        // Si c'est une erreur SvelteKit, la propager
        if (err instanceof Error && 'status' in err) {
            throw err;
        }

        // Pour toute autre erreur inattendue
        throw error(500, {
            message: "Une erreur inattendue s'est produite"
        });
    }
};

