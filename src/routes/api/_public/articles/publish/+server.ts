// src/ api/ articles/ publish/ +server.ts

import { error, json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { DEFAULT_FILE_VALIDATION, type ArticleUploadResponse } from '$lib/types/article';
import { articlePublishSchema } from '$lib/schemas/articles';

import type { Article_Type, Category } from '@prisma/client';
import { UTApi, UTFile } from 'uploadthing/server';
import { submitArticle } from '$lib/email';

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

        const parsedData = articlePublishSchema.safeParse({
            'titre-article': formData.get('titre-article')?.toString().trim() || '',
            'introduction': formData.get('introduction')?.toString().trim() || '',
            'corps-article': formData.get('corps-article')?.toString().trim() || '',
            'end': formData.get('end')?.toString().trim() || '',
            'type': formData.get('type')?.toString() as Article_Type || 'ARTICLE',
            'category': formData.get('category')?.toString() as Category,

            'brand': formData.get('brand')?.toString().trim() || '',
            'model': formData.get('model')?.toString().trim() || '',
            'movement': formData.get('movement')?.toString() || null,
            'water_resistance': formData.get('water_resistance')?.toString() || null,
            'straps': formData.getAll('straps').map(s => s.toString())
        });

        if (!parsedData.success) {
            // Si la validation échoue, renvoie une erreur avec les messages d'erreur
            throw error(400, `Données invalides : ${parsedData.error.errors.map(e => e.message).join(', ')}`);
        }

        const data = parsedData.data;


        const result = await prisma.$transaction(async (tx) => {
            // 1. Trouver la catégorie
            const category = await tx.categories.findFirst({
                where: { type: data.category as Category },
            });

            if (!category) {
                throw new Error(`La catégorie ${data.category} n'existe pas.`);
            }

            // 2. Créer l'article
            const article = await tx.articles.create({
                data: {
                    user: { connect: { id: session?.user?.id } },
                    title: data['titre-article'],
                    introduction: data.introduction,
                    body: data['corps-article'],
                    ending: data.end,
                    submit_date: new Date(),
                    status: 'SUBMITTED',
                    article_type: data.type,
                    category: { connect: { id: category.id } },

                }
            });



            const userRole = await tx.user_Role.findFirst({
                where: {
                    user_id: session?.user?.id
                }
            });


            if (userRole?.role === 'READER') {
                await tx.user_Role.update({
                    where: { id: userRole.id },
                    data: { role: 'AUTHOR' }
                });
            }


            return article;
        });

        if (data.brand && data.model && result) {
            await handleWatchAndStraps(result.id, {
                brand: data.brand,
                model: data.model,
                movement: data.movement,
                water_resistance: data.water_resistance,
                straps: data.straps ?? []
            });
        }



        // Upload des fichiers sur Uploadthing
        const uploadResults = await Promise.all(
            files.map(async (file) => {
                try {
                    // Créer un UTFile avec le nom du fichier et le customId
                    const utFile = new UTFile([file], `article_${result.id}_${session.user?.id}_${file.name}`);


                    const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN, });
                    const fileResult = await utapi.uploadFiles(utFile);

                    if (!result || !fileResult.data) {
                        console.error('Échec de l upload pour:', file.name);
                        return undefined;
                    }

                    return fileResult.data.url;
                } catch (err) {
                    console.error(`Erreur lors de l'upload de ${file.name}:`, err);
                    return undefined;
                }
            })
        );

        const uploadedImageUrls = uploadResults.filter((url): url is string => Boolean(url));

        if (uploadedImageUrls.length > 0) {
            const updatedArticle = await prisma.articles.update({
                where: { id: result.id },
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

        try {
            if (session.user.email) {
                await submitArticle(session.user.email);
            }
        } catch (emailError) {
            // On log l'erreur mais on ne la propage pas pour ne pas bloquer la réponse
            console.error('Erreur lors de l\'envoi du mail de confirmation:', emailError);
        }

        const response: ArticleUploadResponse = {
            success: true,
            articleId: result.id,
            imageUrls: uploadedImageUrls
        };

        return json(response);

    } catch (err) {
        console.error('Erreur création article:', err);
        throw error(500, 'Erreur lors de la création article');
    }
};



async function handleWatchAndStraps(articleId: number, watchData: {
    brand: string;
    model: string;
    movement?: string | null;
    water_resistance?: string | null;
    straps: string[];
}) {
    const article = await prisma.articles.findUnique({
        where: { id: articleId }
    });

    if (!article) {
        throw new Error(`Article ${articleId} non trouvé`);
    }

    // Utiliser upsert pour créer ou récupérer la montre
    const watch = await prisma.watches.upsert({
        where: {
            brand_model: {
                brand: watchData.brand,
                model: watchData.model
            }
        },
        update: {
            // Mettre à jour seulement si les champs sont fournis
            ...(watchData.movement && { movement: watchData.movement }),
            ...(watchData.water_resistance && { water_resistance: watchData.water_resistance })
        },
        create: {
            brand: watchData.brand,
            model: watchData.model,
            movement: watchData.movement,
            water_resistance: watchData.water_resistance
        }
    });

    // Gérer les bracelets
    if (watchData.straps && watchData.straps.length > 0) {
        // Récupérer tous les bracelets déjà en BDD
        const existingStraps = await prisma.straps.findMany({
            where: { material: { in: watchData.straps } },
            select: { id: true, material: true }
        });

        const existingMaterials = new Set(existingStraps.map(s => s.material));

        // Trouver les bracelets qui ne sont pas encore en BDD
        const newStraps = watchData.straps.filter(material => !existingMaterials.has(material));

        // Insérer uniquement les nouveaux bracelets
        if (newStraps.length > 0) {
            await prisma.straps.createMany({
                data: newStraps.map(material => ({ material })),
                skipDuplicates: true // Ignore les doublons
            });
        }

        // Récupérer tous les bracelets maintenant existants pour les lier à la montre
        const strapRecords = await prisma.straps.findMany({
            where: { material: { in: watchData.straps } },
            select: { id: true }
        });

        // Créer les associations watch-strap
        await prisma.watchStraps.createMany({
            data: strapRecords.map(strap => ({
                watch_id: watch.id,
                strap_id: strap.id
            })),
            skipDuplicates: true
        });
    }

    // Lier la montre à l'article
    await prisma.articleWatches.create({
        data: {
            article_id: articleId,
            watch_id: watch.id
        }
    });

    return watch;
}