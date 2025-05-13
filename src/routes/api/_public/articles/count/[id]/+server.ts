

import { error, json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

interface StatusCount {
    [key: string]: number;
}

export async function GET(event: RequestEvent) {
    const userId = event.params.id;

    if (!userId || userId.trim() === '') {
        throw error(400, {
            message: "ID utilisateur invalide"
        });
    }

    try {
        const userExists = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!userExists) {
            throw error(404, {
                message: "Utilisateur non trouvé"
            });
        }

        const counts = await prisma.articles.groupBy({
            by: ['status'],
            where: {
                user_id: userId
            },
            _count: {
                status: true,
            },
        });

        const countByStatus: StatusCount = counts.reduce((acc: StatusCount, item) => {
            acc[item.status] = item._count.status;
            return acc;
        }, {});

        const total = Object.values(countByStatus).reduce((sum, count) => sum + count, 0);

        if (total === 0) {
            return json({
                message: "Aucun article trouvé pour cet utilisateur",
                countByStatus: {},
                total: 0
            });
        }

        return json({ countByStatus, total });

    } catch (err) {
        console.error('Erreur lors du comptage des articles:', err);

        if (err instanceof PrismaClientKnownRequestError) {
            switch (err.code) {
                case 'P2025':
                    throw error(404, {
                        message: "Données non trouvées"
                    });
                default:
                    throw error(500, {
                        message: "Erreur lors de l'accès à la base de données"
                    });
            }
        }

        if (err instanceof Error && 'status' in err) {
            throw err;
        }

        throw error(500, {
            message: "Erreur lors du comptage des articles"
        });
    }
}