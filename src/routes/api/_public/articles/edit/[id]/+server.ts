import { error, json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { DEFAULT_FILE_VALIDATION } from '$lib/types/article';
import { articleUpdateSchema } from '$lib/schemas/articles';

import type { Article_Type, Category } from '@prisma/client';
import { UTApi, UTFile } from 'uploadthing/server';
import { submitUpdatedArticle } from '$lib/email.js';

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

        let uploadedImageUrls: string[] = existingArticle?.images || [];

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

            if (existingArticle?.images && existingArticle.images.length > 0) {
                try {
                    const fileKeys = existingArticle.images.map(url => url.split('/').pop()!);
                    await utapi.deleteFiles(fileKeys);
                } catch (err) {
                    console.error('Erreur lors de la suppression des anciennes images:', err);
                }
            }

            const uploadResults = await Promise.all(
                files.map(async (file) => {
                    try {
                        const customFileName = `article_${params.id}_${session.user?.id}_${file.name}`;
                        const utFile = new UTFile([file], customFileName);
                        const result = await utapi.uploadFiles(utFile);

                        return result?.data?.url || undefined;
                    } catch (err) {
                        console.error(`Erreur lors de l'upload de ${file.name}:`, err);
                        return undefined;
                    }
                })
            );

            uploadedImageUrls = uploadResults.filter((url): url is string => Boolean(url));
        }

        const formDataObject = {
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
        };

        const parsedData = articleUpdateSchema.safeParse(formDataObject);

        if (!parsedData.success) {
            throw error(400, new Error(`Validation échouée: ${JSON.stringify(parsedData.error.format())}`));
        }

        const data = parsedData.data;

        const updatedArticle = await prisma.$transaction(async (tx) => {
            const category = await tx.categories.findFirst({
                where: { type: data.category as Category }
            });

            if (!category) {
                throw new Error(`La catégorie ${data.category} n'existe pas.`);
            }

            const article = await tx.articles.update({
                where: { id: articleId },
                data: {
                    title: data['titre-article'],
                    introduction: data.introduction,
                    body: data['corps-article'],
                    ending: data.end,
                    submit_date: new Date(),
                    status: 'SUBMITTED',
                    article_type: data.type,
                    images: uploadedImageUrls,
                    category: { connect: { id: category.id } }
                }
            });

            return article;
        });

        if (data.brand && data.model) {
            await handleWatchAndStraps(articleId, {
                brand: data.brand,
                model: data.model,
                movement: data.movement,
                water_resistance: data.water_resistance,
                straps: data.straps || []
            });
        }

        try {
            if (session.user.email) {
                await submitUpdatedArticle(session.user.email);
            }
        } catch (emailError) {
            // On log l'erreur mais on ne la propage pas
            console.error('Erreur lors de l\'envoi du mail de mise à jour:', emailError);
        }

        return json({ success: true, article: updatedArticle });

    } catch (err) {
        console.error('Erreur modification de l\'article :', err);
        throw error(500, 'Erreur modification de l\'article');
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

    const watch = await prisma.watches.upsert({
        where: {
            brand_model: {
                brand: watchData.brand,
                model: watchData.model
            }
        },
        update: {
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

    // Récupérer tous les bracelets déjà en BDD
    const existingStraps = await prisma.straps.findMany({
        where: { material: { in: watchData.straps } },
        select: { material: true }
    });

    const existingMaterials = new Set(existingStraps.map(s => s.material));

    // Trouver les bracelets qui ne sont pas encore en BDD
    const newStraps = watchData.straps.filter(material => !existingMaterials.has(material));

    // Insérer uniquement les nouveaux bracelets
    if (newStraps.length > 0) {
        await prisma.straps.createMany({
            data: newStraps.map(material => ({ material }))
        });
    }

    // Récupérer tous les bracelets maintenant existants pour les lier à la montre
    const strapRecords = await prisma.straps.findMany({
        where: { material: { in: watchData.straps } },
        select: { id: true, material: true }
    });

    // Supprimer les liaisons existantes qui ne sont plus présentes
    const existingWatchStraps = await prisma.watchStraps.findMany({
        where: { watch_id: watch.id },
        select: { strap_id: true, strap: { select: { material: true } } }
    });

    const strapsToRemove = existingWatchStraps.filter(ws => !watchData.straps.includes(ws.strap.material));

    if (strapsToRemove.length > 0) {
        await prisma.watchStraps.deleteMany({
            where: {
                watch_id: watch.id,
                strap_id: { in: strapsToRemove.map(ws => ws.strap_id) }
            }
        });
    }

    // Ajouter les nouvelles liaisons
    await prisma.watchStraps.createMany({
        data: strapRecords.map(strap => ({
            watch_id: watch.id,
            strap_id: strap.id
        })),
        skipDuplicates: true
    });

    // Vérifier si l'association existe déjà
    await prisma.articleWatches.upsert({
        where: {
            article_id_watch_id: {
                article_id: articleId,
                watch_id: watch.id
            }
        },
        update: {}, // Ne rien mettre à jour si ça existe déjà
        create: {
            article_id: articleId,
            watch_id: watch.id
        }
    });

    return watch;
}