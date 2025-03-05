import { error, json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { articlePublishSchema } from '$lib/schemas/articles';
import { Article_Type, Category, WatchCaseMaterial } from '@prisma/client';

export const POST = async ({ request, locals }) => {
    try {
        const session = await locals.auth?.();
        if (!session?.user) {
            throw error(401, 'Non autorisé');
        }

        const formData = await request.formData();

        // Validation des données (comme dans votre route publish)
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
            throw error(400, `Données invalides : ${parsedData.error.errors.map(e => e.message).join(', ')}`);
        }

        const data = parsedData.data;

        // Création de l'article
        const result = await prisma.$transaction(async (tx) => {
            const category = await tx.categories.findFirst({
                where: { type: data.category as Category },
            });

            if (!category) {
                throw new Error(`La catégorie ${data.category} n'existe pas.`);
            }

            const article = await tx.articles.create({
                data: {
                    user: { connect: { id: session?.user?.id } },
                    title: data['titre-article'],
                    introduction: data.introduction,
                    body: data['corps-article'],
                    ending: data.end,
                    submit_date: new Date(),
                    status: 'DRAFT',
                    article_type: data.type,
                    category: { connect: { id: category.id } },
                    images: [],
                }
            });

            return article;
        });

        // Gérer les montres et bracelets
        if (data.brand && data.model && result) {
            // Utilisez votre fonction existante
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

        return json({
            success: true,
            articleId: result.id
        });
    } catch (err) {
        console.error('Erreur création article:', err);
        // Gestion d'erreurs
        if (err && typeof err === 'object' && 'status' in err) {
            throw err;
        } else if (err instanceof Error) {
            throw error(500, err.message || 'Erreur interne du serveur');
        } else {
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