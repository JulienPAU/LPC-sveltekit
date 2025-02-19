// src/routes/api/_public/dashboard/moderator-decline/+server.ts

import prisma from '$lib/prisma';

export async function POST({ request }) {
    try {
        const { id } = await request.json();

        await prisma.user.update({
            where: { id },
            data: {
                moderatorRequestStatus: "DECLINED",
                moderatorRequestAt: null
            }
        });

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error('Erreur lors du refus de modération:', error);
        return new Response(JSON.stringify({ success: false }), { status: 500 });
    }
}
