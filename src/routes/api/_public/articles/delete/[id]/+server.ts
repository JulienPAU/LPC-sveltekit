import { deletedArticle } from '$lib/email';
import prisma from '$lib/prisma';
import { handleError, handleResponse } from '$lib/utils';
import { error } from 'console';
import { UTApi } from 'uploadthing/server';



export const DELETE = async ({ params, locals }) => {
    const articleId = parseInt(params.id);

    try {
        const session = await locals.auth?.();
        if (!session?.user) {
            throw error(401, 'Non autorisé');
        }

        const existingArticle = await prisma.articles.findUnique({
            where: { id: articleId },
            select: { images: true, user: { select: { email: true } } }
        });


        if (!existingArticle) {
            throw error(404, 'Article non trouvé');
        }

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

        await prisma.articles.delete({
            where: { id: articleId }
        });

        try {
            if (existingArticle?.user?.email) {
                await deletedArticle(existingArticle.user.email);
            }
        } catch (emailError) {
            console.error('Erreur lors de l\'envoi du mail de mise à jour:', emailError);
        }

        return handleResponse({ success: true });
    } catch (err) {
        handleError(err);

    }
}