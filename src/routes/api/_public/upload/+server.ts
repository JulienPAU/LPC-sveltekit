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
        const MAX_FILE_SIZE = 4 * 1024 * 1024; // 5 Mo
        const MAX_FILE_COUNT = 6; // Limite à 10 fichiers


        if (files.length > MAX_FILE_COUNT) {
            throw error(400, `Too many files. Maximum ${MAX_FILE_COUNT} photos sont autorisés`);
        }

        files.forEach(file => {
            if (file.size > MAX_FILE_SIZE) {
                throw error(400, `${file.name} doit être inférieur a 4MO`);
            }
        });


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
