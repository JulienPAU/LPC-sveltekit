import { error, json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { DEFAULT_FILE_VALIDATION, type ArticleFormData } from '$lib/types/article';
import type { Article_Type } from '@prisma/client';
import { UTApi, UTFile } from 'uploadthing/server';

export const POST = async ({ request, locals, params }) => {
    const articleId = parseInt(params.id);

    try {
        const session = await locals.auth?.();
        if (!session?.user) {
            throw error(401, 'Non autorisé');
        }

        const formData = await request.formData();

        const files = formData.getAll('files') as File[];
        const hasNewFiles = files.length > 0;

        // Récupérer l'article existant et ses images
        const existingArticle = await prisma.articles.findUnique({
            where: { id: articleId },
            select: { images: true }
        });

        let uploadedImageUrls: string[] = existingArticle?.images || []; // Conserver les images existantes par défaut

        if (hasNewFiles) {
            if (files.length > DEFAULT_FILE_VALIDATION.maxFileCount) {
                throw error(400, `Maximum ${DEFAULT_FILE_VALIDATION.maxFileCount} fichiers autorisés`);
            }

            for (const file of files) {
                if (!DEFAULT_FILE_VALIDATION.acceptedTypes.includes(file.type)) {
                    throw error(400, `Type de fichier non supporté : ${file.name}`);
                }
                if (file.size > DEFAULT_FILE_VALIDATION.maxFileSize) {
                    throw error(400, `${file.name} dépasse la taille maximale de ${DEFAULT_FILE_VALIDATION.maxFileSize / (1024 * 1024)}MB`);
                }
            }

            const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });

            // Supprimer les anciennes images seulement si de nouvelles images sont uploadées
            if (existingArticle?.images && existingArticle.images.length > 0) {
                try {
                    const fileKeys = existingArticle.images.map(url => {
                        const urlParts = typeof url === 'string' ? url.split('/') : [];
                        return urlParts[urlParts.length - 1];
                    });

                    await utapi.deleteFiles(fileKeys);
                } catch (err) {
                    console.error('Erreur lors de la suppression des anciennes images:', err);
                }
            }

            // Upload des nouvelles images
            const uploadResults = await Promise.all(
                files.map(async (file) => {
                    try {
                        const customFileName = `article_${params.id}_${session.user?.id}_${file.name}`;
                        const utFile = new UTFile([file], customFileName);
                        const result = await utapi.uploadFiles(utFile);

                        if (!result || !result.data) {
                            console.error('Échec de l\'upload pour:', file.name);
                            return undefined;
                        }

                        return result.data.url;
                    } catch (err) {
                        console.error(`Erreur lors de l'upload de ${file.name}:`, err);
                        return undefined;
                    }
                })
            );

            uploadedImageUrls = uploadResults.filter((url): url is string => Boolean(url));
        }

        const data: ArticleFormData = {
            'titre-article': formData.get('titre-article')?.toString().trim() || '',
            'introduction': formData.get('introduction')?.toString().trim() || '',
            'corps-article': formData.get('corps-article')?.toString().trim() || '',
            'end': formData.get('end')?.toString().trim() || '',
            'type': formData.get('type')?.toString() as Article_Type || 'ARTICLE',
        };

        const article = await prisma.articles.update({
            where: { id: articleId },
            data: {
                title: data['titre-article'],
                introduction: data.introduction,
                body: data['corps-article'],
                ending: data.end,
                submit_date: new Date(),
                status: 'SUBMITTED',
                article_type: data.type,
                images: uploadedImageUrls, // Conserve les anciennes images si aucune nouvelle n'est ajoutée
            }
        });

        return json({ article });

    } catch (err) {
        console.error('Erreur modification de l\'article :', err);
        throw error(500, 'Erreur modification de l\'article');
    }
};
