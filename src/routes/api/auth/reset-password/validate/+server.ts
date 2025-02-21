

import { error, json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import type { RequestEvent } from '@sveltejs/kit';

const prisma = new PrismaClient();

export async function GET(event: RequestEvent) {
    try {
        const token = event.url.searchParams.get('token');

        if (!token) {
            throw error(400, {
                message: 'Token manquant'
            });
        }

        try {
            const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
            const verificationToken = await prisma.verificationToken.findUnique({
                where: { token: hashedToken }
            });

            if (!verificationToken || verificationToken.expires < new Date()) {
                throw error(400, {
                    message: 'Token invalide ou expiré'
                });
            }

            return json({
                message: 'Token valide'
            });

        } catch (dbError) {
            console.error('Erreur base de données:', dbError);
            throw error(500, {
                message: "Erreur lors de la vérification du token"
            });
        }

    } catch (err) {
        console.error('Erreur:', err);

        if (err instanceof Error && 'status' in err) {
            throw err;
        }

        throw error(500, {
            message: "Une erreur inattendue s'est produite"
        });
    }
}
