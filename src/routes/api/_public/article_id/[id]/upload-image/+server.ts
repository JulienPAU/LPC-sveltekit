// src / routes / api / _public / article_id / %5Bid%5D / upload - image / %2Bserver.ts

import { error, json } from '@sveltejs/kit';
import { UTApi, UTFile } from 'uploadthing/server';
import { DEFAULT_FILE_VALIDATION } from '$lib/types/article';

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

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            throw error(400, 'Fichier manquant');
        }

        if (!DEFAULT_FILE_VALIDATION.acceptedTypes.includes(file.type)) {
            throw error(400, `Type de fichier non supporté : ${file.name}`);
        }

        if (file.size > DEFAULT_FILE_VALIDATION.maxFileSize) {
            throw error(400, `${file.name} dépasse la taille maximale de ${DEFAULT_FILE_VALIDATION.maxFileSize / (1024 * 1024)}MB`);
        }

        try {
            const utFile = new UTFile([file], `article_${articleId}_${session.user?.id}_${file.name}`);
            const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });
            const fileResult = await utapi.uploadFiles(utFile);

            if (!fileResult.data) {
                throw error(500, `Échec de l'upload pour: ${file.name}`);
            }

            return json({
                success: true,
                imageUrl: fileResult.data.ufsUrl
            });
        } catch (uploadError) {
            console.error('Erreur durant l\'upload:', uploadError);
            throw error(500, 'Échec du téléchargement de l\'image');
        }
    } catch (err) {
        console.error('Erreur upload image:', err);
        if (err && typeof err === 'object' && 'status' in err) {
            throw err;
        } else {
            throw error(500, err instanceof Error ? err.message : 'Erreur lors de l\'upload');
        }
    }
};