


import { error, json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { SessionUser } from '$lib/types/user';

export const POST = async (event: RequestEvent) => {
    const articleId = parseInt(event.params.id ?? '');

    try {
        // Validation de l'ID
        if (isNaN(articleId) || articleId <= 0) {
            throw error(400, {
                message: "ID d'article invalide"
            });
        }

        // Récupération et validation du status
        const requestData = await event.request.json();
        const { status } = requestData;

        if (!status || !['SUBMITTED', 'PUBLISHED', 'REFUSED'].includes(status)) {
            throw error(400, {
                message: "Statut invalide"
            });
        }

        // Vérification de l'authentification
        const session = await event.locals.auth?.();
        if (!session?.user) {
            throw error(401, {
                message: "Non authentifié"
            });
        }

        // Vérification de l'existence de l'article
        const existingArticle = await prisma.articles.findUnique({
            where: { id: articleId },
            include: {
                user: true
            }
        });

        if (!existingArticle) {
            throw error(404, {
                message: "Article non trouvé"
            });
        }

        const user = session.user as SessionUser;

        // Vérification des permissions
        const userRole = user.User_Role;
        const isAdmin = Array.isArray(userRole)
            ? userRole.some(role => role.role === 'ADMIN')
            : userRole === 'ADMIN';
        const isAuthor = existingArticle.user_id === session.user.id;

        if (!isAdmin && !isAuthor) {
            throw error(403, {
                message: "Permission insuffisante pour modifier cet article"
            });
        }

        // Mise à jour de l'article
        try {
            const isPublishing = status === 'PUBLISHED';
            const updatedArticle = await prisma.articles.update({
                where: { id: articleId },
                data: {
                    status,
                    publish_date: isPublishing ? new Date() : null,
                }
            });

            return json({
                message: `Article ${isPublishing ? 'publié' : 'mis à jour'} avec succès`,
                article: updatedArticle
            });

        } catch (dbError) {
            if (dbError instanceof PrismaClientKnownRequestError) {
                throw error(500, {
                    message: "Erreur lors de la mise à jour en base de données"
                });
            }
            throw dbError;
        }

    } catch (err) {
        console.error('Erreur lors de la gestion du statut:', err);

        if (err instanceof Error && 'status' in err) {
            throw err;
        }

        throw error(500, {
            message: "Une erreur inattendue s'est produite"
        });
    }
};