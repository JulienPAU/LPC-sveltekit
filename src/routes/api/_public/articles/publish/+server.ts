// src/ api/ articles/ publish/ +server.ts

import { error, json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { DEFAULT_FILE_VALIDATION, type ArticleUploadResponse } from '$lib/types/article';
import { articlePublishSchema } from '$lib/schemas/articles';

import { Article_Type, Category, WatchCaseMaterial } from '@prisma/client';
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

        const categoryValue = formData.get('category')?.toString();

        if (categoryValue && !Object.values(Category).includes(categoryValue as Category)) {
            throw error(400, `Catégorie invalide: ${categoryValue}`);
        }

        const typeValue = formData.get('type')?.toString();
        if (typeValue && !Object.values(Article_Type).includes(typeValue as Article_Type)) {
            throw error(400, `Type d'article invalide: ${typeValue}`);
        }

        const caseMaterialValue = formData.get('case_material')?.toString();
        if (caseMaterialValue && !Object.values(WatchCaseMaterial).includes(caseMaterialValue as WatchCaseMaterial)) {
            throw error(400, `Matériau de boîtier invalide: ${caseMaterialValue}`);
        }

        const parsedData = articlePublishSchema.safeParse({
            'titre-article': formData.get('titre-article')?.toString().trim() || '',
            'introduction': formData.get('introduction')?.toString().trim() || '',
            'corps-article': formData.get('corps-article')?.toString().trim() || '',
            'end': formData.get('end')?.toString().trim() || '',
            'type': formData.get('type')?.toString() as Article_Type || 'ARTICLE',
            'category': formData.get('category')?.toString() as Category,


            'case_material': formData.get('case_material')?.toString() as WatchCaseMaterial || "",
            'brand': formData.get('brand')?.toString().trim() || '',
            'model': formData.get('model')?.toString().trim() || '',
            'movement': formData.get('movement')?.toString() || null,
            'water_resistance': formData.get('water_resistance')?.toString() || null,
            'case_size': formData.get('case_size')?.toString().trim() || null,
            'lug_width': formData.get('lug_width')?.toString().trim() || null,
            'thickness': formData.get('thickness')?.toString().trim() || null,
            'lug_to_lug': formData.get('lug_to_lug')?.toString().trim() || null,
            'price': formData.get('price')?.toString().trim() || null,

            'glass': formData.get('glass')?.toString().trim() || null,
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
                water_resistance: data.water_resistance || null,
                case_material: data.case_material || null,
                case_size: data.case_size || null,
                lug_width: data.lug_width || null,
                thickness: data.thickness || null,
                lug_to_lug: data.lug_to_lug || null,
                price: data.price || null,
                glass: data.glass || null,
                straps: data.straps || []
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

                    return fileResult.data.ufsUrl;
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

        // Vérifier plus explicitement si c'est une erreur de validation
        if (err && typeof err === 'object' && 'status' in err && err.status === 400) {
            throw err; // Propager l'erreur de validation telle quelle
        } else if (err instanceof Error) {
            // Pour les autres erreurs, conserver au moins le message
            throw error(500, err.message || 'Erreur interne du serveur');
        } else {
            // Fallback pour tout autre type d'erreur
            throw error(500, 'Erreur lors de la création article');
        }
    }
};



async function handleWatchAndStraps(articleId: number, watchData: {
    brand: string;
    model: string;
    movement?: string | null;
    water_resistance?: string | null;
    case_material?: string | null;
    case_size?: string | null;
    lug_width?: string | null;
    thickness?: string | null;
    lug_to_lug?: string | null;
    price?: string | null;
    glass?: string | null;
    straps: string[];
}) {
    const article = await prisma.articles.findUnique({
        where: { id: articleId }
    });

    if (!article) {
        throw new Error(`Article ${articleId} non trouvé`);
    }

    const normalizedBrand = watchData.brand.charAt(0).toUpperCase() + watchData.brand.slice(1).toLowerCase();


    // Utiliser upsert pour créer ou récupérer la montre
    const watch = await prisma.watches.upsert({
        where: {
            brand_model: {
                brand: normalizedBrand,
                model: watchData.model
            }
        },
        update: {
            // Mettre à jour seulement si les champs sont fournis
            ...(watchData.movement && { movement: watchData.movement }),
            ...(watchData.water_resistance && { water_resistance: watchData.water_resistance }),
            ...(watchData.case_material && { case_material: { set: watchData.case_material as WatchCaseMaterial } }),
            ...(watchData.case_size && { case_size: watchData.case_size }),
            ...(watchData.lug_width && { lug_width: watchData.lug_width }),
            ...(watchData.thickness && { thickness: watchData.thickness }),
            ...(watchData.lug_to_lug && { lug_to_lug: watchData.lug_to_lug }),
            ...(watchData.price && { price: watchData.price }),

            ...(watchData.glass && { glass: watchData.glass })


        },
        create: {
            brand: normalizedBrand,
            model: watchData.model,
            movement: watchData.movement,
            water_resistance: watchData.water_resistance || null,
            case_material: watchData.case_material as WatchCaseMaterial || null,
            case_size: watchData.case_size || null,
            lug_width: watchData.lug_width || null,
            thickness: watchData.thickness || null,
            lug_to_lug: watchData.lug_to_lug || null,
            price: watchData.price || null,
            glass: watchData.glass || null


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