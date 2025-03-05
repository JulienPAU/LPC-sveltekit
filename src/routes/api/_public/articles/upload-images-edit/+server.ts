// src / routes / api / _public / articles / upload - images - edit / %2Bserver.ts

import { DEFAULT_FILE_VALIDATION } from '$lib/types/article';
import { error, json } from '@sveltejs/kit';
import { UTApi, UTFile } from 'uploadthing/server';

export const POST = async ({ request, locals }) => {
    try {
        const session = await locals.auth?.();
        if (!session?.user) {
            throw error(401, 'Non autorisé');
        }

        const formData = await request.formData();
        const files = formData.getAll('files') as File[];
        const articleId = formData.get('articleId')?.toString();

        if (!articleId) {
            throw error(400, 'ID de l\'article manquant');
        }

        if (files.length === 0) {
            return json({ success: true, images: [] });
        }

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

        // Upload des fichiers
        const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });

        const uploadResults = await Promise.all(
            files.map(async (file) => {
                try {
                    const customFileName = `article_${articleId}_${session.user?.id}_${file.name}`;
                    const utFile = new UTFile([file], customFileName);
                    const result = await utapi.uploadFiles(utFile);

                    return result?.data?.ufsUrl || undefined;
                } catch (err) {
                    console.error(`Erreur lors de l'upload de ${file.name}:`, err);
                    return undefined;
                }
            })
        );

        const uploadedImageUrls = uploadResults.filter((url): url is string => Boolean(url));

        return json({
            success: true,
            images: uploadedImageUrls
        });

    } catch (err) {
        console.error('Erreur upload images:', err);

        if (err && typeof err === 'object' && 'status' in err) {
            throw err;
        } else if (err instanceof Error) {
            throw error(500, err.message || 'Erreur interne du serveur');
        } else {
            throw error(500, 'Erreur lors de l\'upload des images');
        }
    }
};