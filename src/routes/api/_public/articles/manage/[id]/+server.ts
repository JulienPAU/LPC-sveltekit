// src/routes/api/_public/articles/manage/[id]/+server.ts

import prisma from '$lib/prisma';
import { error } from 'console';

export const POST = async ({ params, locals, request }) => {
    const articleId = parseInt(params.id);
    const { status } = await request.json();


    try {
        const session = await locals.auth?.();
        if (!session?.user) {
            throw error(401, 'Non autorisé');
        }

        const existingArticle = await prisma.articles.findUnique({
            where: { id: articleId }
        });

        if (!existingArticle) {
            throw error(404, 'Article non trouvé');
        }

        await prisma.articles.update({
            where: { id: articleId },
            data: { status, publish_date: status === 'PUBLISHED' ? new Date() : null }
        });

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        if (err instanceof Error) {
            throw error(500, err.message);
        } else {
            throw error(500, 'Unknown error');
        }
    }
};
