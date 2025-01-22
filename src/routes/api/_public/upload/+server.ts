// src/routes/api/_public/upload/+server.ts

import { UploadService } from '$lib/services/uploadService';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';




export const GET = async (event) => {
    // Récupération de la session utilisateur
    const session = await event.locals.auth();
    // console.log("Session:", session);

    // Vérification de l'authentification
    if (!session || !session.user) {
        throw error(401, 'Unauthorized');
    }



    // Si tout est OK, retourne les données protégées
    return json({
        message: 'Bienvenue dans la route privée !',
        user: session.user,
    });
};


export const POST: RequestHandler = async ({ request, locals }) => {
    try {

        const session = await locals.auth?.();
        const userId = session?.user?.id as string;


        const formData = await request.formData();

        const files = formData.getAll('images') as File[];
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo
        // const articleId = Number(formData.get('articleId'));


        files.forEach(file => {
            if (file.size > MAX_FILE_SIZE) {
                throw error(400, `${file.name} exceeds maximum file size`);
            }
        });

        // if (!articleId || isNaN(articleId)) {
        //     throw error(400, 'Invalid or missing articleId');
        // }

        if (!files || files.length === 0) {
            throw error(400, 'No files provided');
        }


        const uploadPromises = files.map(file => UploadService.uploadImage(file, userId)
        );
        const results = await Promise.all(uploadPromises);



        return json({
            success: true,
            data: results
        });
    } catch (err) {
        console.error('Upload handler error:', err);
        throw error(500, 'Failed to process upload');
    }
};
