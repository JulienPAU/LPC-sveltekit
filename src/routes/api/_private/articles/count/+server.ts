import { json, error } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { RequestEvent } from '@sveltejs/kit';

interface StatusCount {
    [key: string]: number;
}

export async function GET({ locals }: RequestEvent) {
    try {
        const session = await locals.auth();

        // Vérification de l'authentification
        if (!session) {
            throw error(401, {
                message: "Non authentifié"
            });
        }

        const user = session.user;
        if (!user) {
            throw error(403, {
                message: "Session utilisateur invalide"
            });
        }

        // Récupération des comptages
        try {
            const counts = await prisma.articles.groupBy({
                by: ['status'],
                _count: {
                    status: true,
                },
            });

            // Vérification des résultats
            if (!counts || !Array.isArray(counts)) {
                throw error(500, {
                    message: "Format de données invalide"
                });
            }

            // Transformation des données
            const countByStatus: StatusCount = counts.reduce((acc: StatusCount, item) => {
                if (item.status && typeof item._count.status === 'number') {
                    acc[item.status] = item._count.status;
                }
                return acc;
            }, {});

            const total = Object.values(countByStatus).reduce((sum, count) => sum + count, 0);

            // Si aucun article n'est trouvé
            if (total === 0) {
                return json({
                    countByStatus: {},
                    total: 0,
                    message: "Aucun article trouvé"
                });
            }

            return json({
                countByStatus,
                total,
                success: true
            });

        } catch (dbError) {
            if (dbError instanceof PrismaClientKnownRequestError) {
                switch (dbError.code) {
                    case 'P2002':
                        throw error(409, {
                            message: "Conflit de données"
                        });
                    case 'P2025':
                        throw error(404, {
                            message: "Ressource non trouvée"
                        });
                    default:
                        throw error(500, {
                            message: "Erreur lors de l'accès à la base de données"
                        });
                }
            }
            throw error(500, {
                message: "Erreur lors de la récupération des statistiques"
            });
        }

    } catch (e: unknown) {
        // Log de l'erreur pour le débogage
        console.error('Erreur lors du comptage des articles:', e);

        // Si c'est déjà une erreur SvelteKit, la propager
        if (e instanceof Error && 'status' in e) throw e;

        // Pour toute autre erreur inattendue
        throw error(500, {
            message: "Une erreur inattendue s'est produite"
        });
    }
}