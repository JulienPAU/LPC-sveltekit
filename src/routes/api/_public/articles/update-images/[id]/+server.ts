import { error, json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { submitArticle } from '$lib/email';

export const POST = async ({ request, locals, params }) => {
    try {
        const articleId = parseInt(params.id);

        if (isNaN(articleId)) {
            throw error(400, 'ID d\'article invalide');
        }

        const session = await locals.auth?.();

        if (!session?.user) {
            throw error(401, 'Non autorisé');
        }

        // Vérifier que l'article appartient à l'utilisateur
        const article = await prisma.articles.findUnique({
            where: {
                id: articleId,
                user_id: session.user.id
            }
        });

        if (!article) {
            throw error(404, 'Article non trouvé ou accès refusé');
        }

        const { images } = await request.json();

        if (!Array.isArray(images)) {
            throw error(400, 'Format des images invalide');
        }

        // Mettre à jour l'article avec les images
        const updatedArticle = await prisma.articles.update({
            where: { id: articleId },
            data: {
                images: images,
                status: 'SUBMITTED' // Changer le statut de brouillon à soumis
            }
        });

        // Envoyer un email de confirmation
        try {
            if (session.user.email) {
                await submitArticle(session.user.email);
            }
        } catch (emailError) {
            console.error('Erreur lors de l\'envoi du mail de confirmation:', emailError);
        }

        return json({
            success: true,
            articleId: updatedArticle.id,
            imageUrls: updatedArticle.images
        });

    } catch (err) {
        console.error('Erreur mise à jour images:', err);

        if (err && typeof err === 'object' && 'status' in err) {
            throw err;
        } else if (err instanceof Error) {
            throw error(500, err.message || 'Erreur interne du serveur');
        } else {
            throw error(500, 'Erreur lors de la mise à jour des images');
        }
    }
};