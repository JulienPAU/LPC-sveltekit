import { createUser } from '$lib/auth/index';
import { json, error } from '@sveltejs/kit';

export async function POST({ request }) {
    try {
        const { email, password, first_name, last_name, username } = await request.json();

        if (!email || !password || !first_name || !last_name || !username) {
            throw error(400, 'Tous les champs sont obligatoires.');
        }

        if (password.length < 8) {
            throw error(400, 'Le mot de passe doit contenir au moins 8 caractères.');
        }

        const newUser = await createUser(email, password, first_name, last_name, username);

        return json({
            user: { id: newUser.id, email: newUser.email, username: newUser.username },
        });
    } catch (err) {
        console.error('Erreur lors de la création du compte:', err);

        if (err instanceof Error) {
            if (err.message.includes('email')) {
                throw error(409, 'Cet email est déjà utilisé.');
            }
            if (err.message.includes('nom d\'utilisateur')) {
                throw error(409, 'Ce nom d\'utilisateur est déjà pris.');
            }
            throw error(500, err.message);
        }

        throw error(500, 'Une erreur inconnue est survenue.');
    }
}