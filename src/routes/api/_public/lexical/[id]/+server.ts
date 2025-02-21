// src/routes/api/_public/lexical/[id]/+server.ts
import prisma from '$lib/prisma';
import { error, json } from '@sveltejs/kit';

export const GET = async ({ params }) => {
    try {
        const definition = await prisma.lexical.findUnique({
            where: {
                id: parseInt(params.id)
            }
        });

        if (!definition) {
            throw error(404, 'Définition non trouvée');
        }

        return json(definition);
    } catch (err) {
        console.error(err);
        throw error(500, 'Erreur serveur');
    }
};