import { error, json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { articleUpdateSchema } from '$lib/schemas/articles';
import { generateSlug } from '$lib/utils/slug';

import { Article_Type, Category, WatchCaseMaterial } from '@prisma/client';


export const POST = async ({ request, locals, params }) => {
    const articleId = parseInt(params.id);

    try {
        const session = await locals.auth?.();
        if (!session?.user) {
            throw error(401, 'Non autorisé');
        }

        const formData = await request.formData();

        const existingArticle = await prisma.articles.findUnique({
            where: { id: articleId },
            select: { images: true, user_id: true }
        });

        if (!existingArticle) {
            throw error(404, 'Article non trouvé');
        }

        const userRoles = await prisma.user_Role.findMany({
            where: { user_id: session.user.id },
            select: { role: true }
        });

        const isAdmin = userRoles.some(userRole => userRole.role === 'ADMIN');

        if (existingArticle.user_id !== session.user.id && !isAdmin) {
            throw error(403, 'Vous n\'êtes pas autorisé à modifier cet article');
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
            'case_material': formData.get('case_material')?.toString() as WatchCaseMaterial || '',
            'case_size': formData.get('case_size')?.toString().trim() || null,
            'lug_width': formData.get('lug_width')?.toString().trim() || null,
            'thickness': formData.get('thickness')?.toString().trim() || null,
            'lug_to_lug': formData.get('lug_to_lug')?.toString().trim() || null,
            'price': formData.get('price')?.toString().trim() || null,
            'glass': formData.get('glass')?.toString().trim() || null,
            'straps': formData.getAll('straps').map(s => s.toString())
        };

        const parsedData = articleUpdateSchema.safeParse(formDataObject);

        if (!parsedData.success) {
            return json({
                success: false,
                errors: parsedData.error.format()
            }, { status: 400 });
        } const data = parsedData.data;

        const recentModifications = await prisma.articles.findMany({
            where: {
                id: {
                    not: articleId
                },
                user_id: session.user.id,
                title: data['titre-article'],
                submit_date: {
                    gte: new Date(Date.now() - 30000)
                }
            }
        });

        if (recentModifications.length > 0) {
            throw error(409, "Une modification similaire a été soumise récemment. Veuillez patienter avant de soumettre à nouveau.");
        }

        const updatedArticle = await prisma.$transaction(async (tx) => {
            const category = await tx.categories.findFirst({
                where: { type: data.category as Category }
            });

            if (!category) {
                throw new Error(`La catégorie ${data.category} n'existe pas.`);
            }
            const baseSlug = generateSlug(data['titre-article']);

            const existingArticlesWithSimilarSlug = await tx.articles.findMany({
                where: {
                    slug: {
                        startsWith: baseSlug
                    },
                    id: {
                        not: articleId
                    }
                },
                select: { slug: true }
            });

            let slug = baseSlug;
            let counter = 1;

            while (existingArticlesWithSimilarSlug.some(a => a.slug === slug)) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }

            const article = await tx.articles.update({
                where: { id: articleId },
                data: {
                    title: data['titre-article'],
                    slug: slug,
                    introduction: data.introduction,
                    body: data['corps-article'],
                    ending: data.end,
                    submit_date: new Date(),
                    status: 'SUBMITTED',
                    article_type: data.type,
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

        return json({ success: true, article: updatedArticle });

    } catch (err) {
        console.error('Erreur modification article:', err);

        if (err && typeof err === 'object' && 'status' in err && err.status === 400) {
            throw err;
        } else if (err instanceof Error) {
            throw error(500, err.message || 'Erreur interne du serveur');
        } else {
            throw error(500, 'Erreur lors de la modification de l\'article');
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
    const normalizeChar = (str: string) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const existingWatches = await prisma.watches.findMany({
        where: {},
        select: { brand: true }
    });

    let brandToUse = watchData.brand.charAt(0).toUpperCase() + watchData.brand.slice(1).toLowerCase();

    for (const existingWatch of existingWatches) {
        if (normalizeChar(existingWatch.brand.toLowerCase()) === normalizeChar(brandToUse.toLowerCase())) {
            brandToUse = existingWatch.brand;
            break;
        }
    }

    const watch = await prisma.watches.upsert({
        where: {
            brand_model: {
                brand: brandToUse,
                model: watchData.model
            }
        },
        update: {
            ...(watchData.movement && { movement: watchData.movement }),
            ...(watchData.water_resistance && { water_resistance: watchData.water_resistance }),
            ...(watchData.case_material && { case_material: { set: watchData.case_material as WatchCaseMaterial } }),
            ...(watchData.case_size && { case_size: watchData.case_size }),
            ...(watchData.lug_width && { lug_width: watchData.lug_width }),
            ...(watchData.thickness && { thickness: watchData.thickness }),
            ...(watchData.lug_to_lug && { lug_to_lug: watchData.lug_to_lug }),
            ...(watchData.price && { price: watchData.price }),
            ...(watchData.glass && { glass: watchData.glass })

        }, create: {
            brand: brandToUse,
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

    const existingStraps = await prisma.straps.findMany({
        where: { material: { in: watchData.straps } },
        select: { material: true }
    });

    const existingMaterials = new Set(existingStraps.map(s => s.material));

    const newStraps = watchData.straps.filter(material => !existingMaterials.has(material));

    if (newStraps.length > 0) {
        await prisma.straps.createMany({
            data: newStraps.map(material => ({ material }))
        });
    }

    const strapRecords = await prisma.straps.findMany({
        where: { material: { in: watchData.straps } },
        select: { id: true, material: true }
    });

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

    await prisma.watchStraps.createMany({
        data: strapRecords.map(strap => ({
            watch_id: watch.id,
            strap_id: strap.id
        })),
        skipDuplicates: true
    });

    await prisma.articleWatches.upsert({
        where: {
            article_id_watch_id: {
                article_id: articleId,
                watch_id: watch.id
            }
        },
        update: {},
        create: {
            article_id: articleId,
            watch_id: watch.id
        }
    });

    return watch;
}