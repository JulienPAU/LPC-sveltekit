// src / routes / api / auth / reset - password / request / +server.ts

// import { json } from '@sveltejs/kit';
// import { PrismaClient } from '@prisma/client';
// import { z } from 'zod';
// import crypto from 'crypto';
// import { sendResetEmail } from '$lib/email'; // Fonction à implémenter

// const prisma = new PrismaClient();

// const requestSchema = z.object({
//     email: z.string().email()
// });

// export async function POST({ request }) {
//     const body = await request.json();
//     const parse = requestSchema.safeParse(body);

//     if (!parse.success) {
//         return json({ error: 'Email invalide' }, { status: 400 });
//     }

//     const { email } = parse.data;
//     const user = await prisma.user.findUnique({ where: { email } });

//     if (!user) {
//         // Par sécurité, on ne révèle pas que l'email n'existe pas
//         return json({ message: 'Si cet email existe, un lien a été envoyé' });
//     }

//     // Génération du token sécurisé
//     const rawToken = crypto.randomBytes(32).toString('hex');
//     const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

//     // Stocker le token
//     await prisma.verificationToken.create({
//         data: {
//             identifier: email,
//             token: hashedToken,
//             expires: new Date(Date.now() + 3600000) // Expiration dans 1h
//         }
//     });

//     // Envoyer l'email
//     await sendResetEmail(email, rawToken);

//     return json({ message: 'Si cet email existe, un lien a été envoyé' });
// }


import { error, json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import crypto from 'crypto';
import { sendResetEmail } from '$lib/email';

const prisma = new PrismaClient();

const requestSchema = z.object({
    email: z.string().email()
});

export async function POST({ request }) {
    try {
        const body = await request.json();
        const parse = requestSchema.safeParse(body);

        if (!parse.success) {
            throw error(400, {
                message: 'Email invalide'
            });
        }

        const { email } = parse.data;

        try {
            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                return json({
                    message: 'Si cet email existe, un lien a été envoyé'
                });
            }

            const rawToken = crypto.randomBytes(32).toString('hex');
            const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

            await prisma.verificationToken.create({
                data: {
                    identifier: email,
                    token: hashedToken,
                    expires: new Date(Date.now() + 3600000)
                }
            });

            await sendResetEmail(email, rawToken);

            return json({
                message: 'Si cet email existe, un lien a été envoyé'
            });

        } catch (dbError) {
            console.error('Erreur base de données:', dbError);
            throw error(500, {
                message: "Erreur lors de la réinitialisation du mot de passe"
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