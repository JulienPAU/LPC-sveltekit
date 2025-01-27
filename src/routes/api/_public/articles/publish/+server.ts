import { error, json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import type { ArticleFormData, ArticleUploadResponse } from '$lib/types/article';
import type { Article_Type } from '@prisma/client';
import { UTApi, UTFile } from 'uploadthing/server';

export const POST = async ({ request, locals }) => {
    try {
        const session = await locals.auth?.();
        if (!session?.user) {
            throw error(401, 'Non autorisé');
        }

        const formData = await request.formData();
        const data: ArticleFormData = {
            'titre-article': formData.get('titre-article')?.toString().trim() || '',
            'introduction': formData.get('introduction')?.toString().trim() || '',
            'corps-article': formData.get('corps-article')?.toString().trim() || '',
            'end': formData.get('end')?.toString().trim() || '',
            'type': formData.get('type')?.toString() as Article_Type || 'ARTICLE',
        };

        // Validation et création de l'article
        const article = await prisma.articles.create({
            data: {
                user: { connect: { id: session.user.id } },
                title: data['titre-article'],
                introduction: data.introduction,
                body: data['corps-article'],
                ending: data.end,
                submit_date: new Date(),
                status: 'SUBMITTED',
                article_type: data.type
            }
        });

        const files = formData.getAll('files') as File[];
        console.log('Fichiers reçus sur le serveur:', files); // Debug

        // Upload des fichiers sur Uploadthing
        const uploadResults = await Promise.all(
            files.map(async (file) => {
                try {
                    // Créer un UTFile avec le nom du fichier et le customId
                    const utFile = new UTFile([file], `article_${article.id}_${session.user?.id}_${file.name}`);

                    console.log("utFile:", utFile, "utfFile name:", utFile.name); // Debug

                    const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN, });
                    const result = await utapi.uploadFiles(utFile);

                    if (!result || !result.data) {
                        console.error('Échec de l upload pour:', file.name);
                        return undefined;
                    }

                    console.log(`Upload réussi pour ${file.name}:`, result.data.url);
                    return result.data.url;
                } catch (err) {
                    console.error(`Erreur lors de l'upload de ${file.name}:`, err);
                    return undefined;
                }
            })
        );

        const uploadedImageUrls = uploadResults.filter((url): url is string => Boolean(url));

        if (uploadedImageUrls.length > 0) {
            const updatedArticle = await prisma.articles.update({
                where: { id: article.id },
                data: { images: uploadedImageUrls }
            });
            console.log('Article mis à jour avec les images:', updatedArticle);
        } else {
            console.warn('Aucune image valide uploadée. article pas  mis à jour.');
        }

        const response: ArticleUploadResponse = {
            success: true,
            articleId: article.id,
            imageUrls: uploadedImageUrls
        };

        return json(response);

    } catch (err) {
        console.error('Erreur création article:', err);
        throw error(500, 'Erreur lors de la création article');
    }
};