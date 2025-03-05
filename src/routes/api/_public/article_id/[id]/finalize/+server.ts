import { error, json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { submitArticle } from '$lib/email';

export const POST = async ({ request, locals, params }) => {
    try {
        const session = await locals.auth?.();

        if (!session?.user) {
            throw error(401, 'Non autorisé');
        }

        const articleId = parseInt(params.id);
        if (isNaN(articleId)) {
            throw error(400, 'ID d\'article invalide');
        }

        const { imageUrls } = await request.json();

        if (!Array.isArray(imageUrls)) {
            throw error(400, 'Format des URLs d\'images invalide');
        }

        // Vérifier que l'article existe et appartient à l'utilisateur
        const article = await prisma.articles.findFirst({
            where: {
                id: articleId,
                user_id: session.user.id
            }
        });

        if (!article) {
            throw error(404, 'Article non trouvé ou non autorisé');
        }

        // Mettre à jour l'article avec les URLs des images
        const updatedArticle = await prisma.articles.update({
            where: { id: articleId },
            data: { images: imageUrls }
        });

        // Envoyer l'email de confirmation
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
            imageCount: imageUrls.length
        });
    } catch (err) {
        console.error('Erreur finalisation article:', err);
        if (err && typeof err === 'object' && 'status' in err) {
            throw err;
        } else {
            throw error(500, err instanceof Error ? err.message : 'Erreur lors de la finalisation');
        }
    }
};