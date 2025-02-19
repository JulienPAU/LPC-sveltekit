// src/routes/api/_public/dashboard/moderator-request/+server.ts

import { json } from '@sveltejs/kit';
import { moderatorRequestEmail } from '$lib/email';
import prisma from '$lib/prisma';

export async function POST({ request }) {
    try {
        const { name, email, id } = await request.json();
        if (!name || !email) {
            return json({ success: false, error: 'Données manquantes' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: { moderatorRequestStatus: true }
        });

        if (!user) {
            return json({ success: false, error: 'Utilisateur introuvable' }, { status: 404 });
        }

        if (user.moderatorRequestStatus === 'PENDING') {
            return json({ success: false, error: 'Une demande est déjà en attente' }, { status: 400 });
        }

        await prisma.user.update({
            where: { id },
            data: { moderatorRequestStatus: 'PENDING' }
        });

        const result = await moderatorRequestEmail(name, email, id);
        return json(result);
    } catch (error) {
        console.error('Erreur dans la route API:', error);
        return json({ success: false, error: 'Erreur interne' }, { status: 500 });
    }
}
