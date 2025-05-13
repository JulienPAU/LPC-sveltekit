

import { error, json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit';
import type { SessionUser } from '$lib/types/user';

export async function GET(event: RequestEvent) {
    try {
        const session = await event.locals.auth();
        if (!session) {
            throw error(401, {
                message: "Authentification requise"
            });
        }

        const user = session.user as SessionUser;

        const userRole = user.User_Role;
        const hasAccess = Array.isArray(userRole)
            ? userRole.some(role => ['ADMIN', 'MODERATOR'].includes(role.role))
            : ['ADMIN', 'MODERATOR'].includes(userRole);

        if (!hasAccess) {
            throw error(403, {
                message: "Accès non autorisé"
            });
        }

        const articles = await prisma.articles.findMany({
            where: {
                status: 'SUBMITTED',
            },
            orderBy: {
                id: 'desc',
            },
            include: {
                user: {
                    select: {
                        username: true
                    }
                }
            }
        });

        if (!articles || articles.length === 0) {
            return json({
                message: "Aucun article en attente de modération",
                articles: []
            });
        }

        return json(articles);

    } catch (err) {
        console.error('Erreur lors de la récupération des articles soumis:', err);

        if (err instanceof Error && 'status' in err) {
            throw err;
        }

        throw error(500, {
            message: "Erreur lors de la récupération des articles"
        });
    }
}