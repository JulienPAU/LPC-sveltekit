import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import { UploadService } from '$lib/services/uploadService';
import type { Article_Type } from '@prisma/client';

export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        const session = await locals.auth?.();

        // console.log('Session server article:', session);


        if (!session?.user) {
            throw error(401, 'Non autorisé');
        }

        const formData = await request.formData();
        const title = formData.get('titre-article') as string;
        // const category = formData.get('categorie') as string;
        const introduction = formData.get('introduction') as string;
        const body = formData.get('corps-article') as string;
        const ending = formData.get('end') as string;
        const article_type = formData.get('type') as string;

        const files = formData.getAll('images') as File[];

        // Validation
        if (!title || !introduction || !body || !ending) {
            throw error(400, 'Titre , introduction, corps et mot de la fin requis');
        }

        // Conversion de la catégorie en Article_Type
        // const articleType = category.toUpperCase() as Article_Type;


        // const categoryData = await prisma.categories.findFirstOrThrow({
        //     where: {
        //         type: category.toUpperCase() as Category
        //     }
        // });

        // Créer l'article
        const article = await prisma.articles.create({
            data: {
                user: {
                    connect: { id: session.user.id }
                },
                // category_id: categoryData.id, /

                title,
                introduction,
                body,
                ending,
                submit_date: new Date(),
                status: 'SUBMITTED',
                article_type: article_type as Article_Type
            }
        });

        // Traiter les images si présentes
        if (files.length > 0) {
            const userId = session?.user?.id;
            if (!userId) {
                throw error(400, 'User ID is required');
            }
            const uploadPromises = files.map(file =>
                UploadService.uploadImage(file, userId)
            );
            const uploadResults = await Promise.all(uploadPromises);

            // Enregistrer les images en base de données
            await prisma.articleImage.createMany({
                data: uploadResults.map(result => ({
                    article_id: article.id,
                    url: result.secure_url,
                    public_id: result.public_id
                }))
            });
        }

        return json({
            success: true,
            articleId: article.id
        });
    } catch (err) {
        console.error('Erreur création article:', err);
        throw error(500, 'Erreur lors de la création de l\'article');
    }
};

export const PUT: RequestHandler = async ({ request, locals }) => {
    try {
        const session = await locals.auth?.();
        if (!session?.user) {
            throw error(401, 'Non autorisé');
        }

        const formData = await request.formData();
        const articleId = formData.get('articleId') as string;
        const title = formData.get('titre-article') as string;
        // const category = formData.get('categorie') as string;
        const article_type = formData.get('type') as string;
        const introduction = formData.get('introduction') as string;
        const body = formData.get('corps-article') as string;
        const ending = formData.get('end') as string;


        // const categoryData = await prisma.categories.findFirstOrThrow({
        //     where: {
        //         type: category.toUpperCase() as Category
        //     }
        // });


        const article = await prisma.articles.update({
            where: {
                id: parseInt(articleId),
                user_id: session.user.id
            },
            data: {
                title,
                introduction,
                body,
                ending,
                article_type: article_type as Article_Type,
                update_date: new Date(),
                // category_id: categoryData.id

            }
        });

        return json({
            success: true,
            article
        });
    } catch (err) {
        console.error('Erreur mise à jour article:', err);
        throw error(500, 'Erreur lors de la mise à jour de l\'article');
    }
};