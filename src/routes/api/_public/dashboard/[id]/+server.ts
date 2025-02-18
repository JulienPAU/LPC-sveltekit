

import { error, json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent) {
    const userId = event.params.id;

    if (!userId) {
        throw error(400, {
            message: "ID utilisateur invalide"
        });
    }

    try {
        const userArticle = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                articles: {
                    orderBy: {
                        id: 'desc',
                    },
                },
                User_Role: true,
            },
        });

        if (!userArticle) {
            throw error(404, {
                message: "Utilisateur non trouvé"
            });
        }

        return json(userArticle);

    } catch (err) {
        console.error('Erreur lors de la récupération des articles:', err);

        throw error(500, {
            message: "Erreur lors de la récupération des articles"
        });
    }
}