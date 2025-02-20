import { deletedArticle } from '$lib/email';
import prisma from '$lib/prisma';
import { error } from 'console';
import { UTApi } from 'uploadthing/server';



export const DELETE = async ({ params, locals }) => {
    const articleId = parseInt(params.id);

    try {
        const session = await locals.auth?.();
        if (!session?.user) {
            throw error(401, 'Non autorisé');
        }

        // Récupérer l'article existant et ses images
        const existingArticle = await prisma.articles.findUnique({
            where: { id: articleId },
            select: { images: true }
        });

        if (!existingArticle) {
            throw error(404, 'Article non trouvé');
        }

        // Supprimer les images de l'article
        if (existingArticle?.images && existingArticle.images.length > 0) {
            try {
                const fileKeys = existingArticle.images.map(url => {
                    const urlParts = typeof url === 'string' ? url.split('/') : [];
                    return urlParts[urlParts.length - 1];
                });

                const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });
                await utapi.deleteFiles(fileKeys);
            } catch (err) {
                console.error('Erreur lors de la suppression des images:', err);
            }
        }

        // Supprimer l'article
        await prisma.articles.delete({
            where: { id: articleId }
        });

        try {
            if (session.user.email) {
                await deletedArticle(session.user.email);
            }
        } catch (emailError) {
            // On log l'erreur mais on ne la propage pas
            console.error('Erreur lors de l\'envoi du mail de mise à jour:', emailError);
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        if (err instanceof Error) {
            throw error(500, err.message);
        } else {
            throw error(500, 'Unknown error');
        }
    }
}