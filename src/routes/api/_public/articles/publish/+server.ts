import { error, json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { DEFAULT_FILE_VALIDATION, type ArticleFormData, type ArticleUploadResponse } from '$lib/types/article';
import type { Article_Type } from '@prisma/client';
import { UTApi, UTFile } from 'uploadthing/server';

export const POST = async ({ request, locals }) => {
    try {
        const session = await locals.auth?.();
        if (!session?.user) {
            throw error(401, 'Non autorisé');
        }

        const formData = await request.formData();


        const files = formData.getAll('files') as File[];


        if (files.length > DEFAULT_FILE_VALIDATION.maxFileCount) {
            throw error(400, `Maximum ${DEFAULT_FILE_VALIDATION.maxFileCount} fichiers autorisés`);
        }

        if (files.length < DEFAULT_FILE_VALIDATION.minFileCount) {
            throw error(400, `Minimum ${DEFAULT_FILE_VALIDATION.minFileCount} fichiers requis`);
        }

        // Validation de chaque fichier
        for (const file of files) {
            if (!DEFAULT_FILE_VALIDATION.acceptedTypes.includes(file.type)) {
                throw error(400, `Type de fichier non supporté : ${file.name}`);
            }

            if (file.size > DEFAULT_FILE_VALIDATION.maxFileSize) {
                throw error(400, `${file.name} dépasse la taille maximale de ${DEFAULT_FILE_VALIDATION.maxFileSize / (1024 * 1024)}MB`);
            }
        }




        const data: ArticleFormData = {
            'titre-article': formData.get('titre-article')?.toString().trim() || '',
            'introduction': formData.get('introduction')?.toString().trim() || '',
            'corps-article': formData.get('corps-article')?.toString().trim() || '',
            'end': formData.get('end')?.toString().trim() || '',
            'type': formData.get('type')?.toString() as Article_Type || 'ARTICLE',
        };


        // const existingArticle = await prisma.articles.findFirst({
        //     where: {
        //         title: data['titre-article'],
        //     },
        // });

        // if (existingArticle) {
        //     throw error(400, `Un article avec ce titre existe déjà.`);
        // }



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

        // if (article.id) {
        //     throw error(400, `Article déjà créé`);
        // }


        // Upload des fichiers sur Uploadthing
        const uploadResults = await Promise.all(
            files.map(async (file) => {
                try {
                    // Créer un UTFile avec le nom du fichier et le customId
                    const utFile = new UTFile([file], `article_${article.id}_${session.user?.id}_${file.name}`);


                    const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN, });
                    const result = await utapi.uploadFiles(utFile);

                    if (!result || !result.data) {
                        console.error('Échec de l upload pour:', file.name);
                        return undefined;
                    }

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
            return json({
                success: true,
                articleId: updatedArticle.id,
                imageUrls: uploadedImageUrls
            });
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