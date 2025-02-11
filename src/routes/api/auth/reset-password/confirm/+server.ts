// src / routes / api / auth / reset - password / confirm / +server.ts

import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const resetSchema = z.object({
    token: z.string(),
    password: z.string().min(8) // Exige au moins 8 caractères
});

export async function POST({ request }) {
    const body = await request.json();
    const parse = resetSchema.safeParse(body);

    if (!parse.success) {
        return json({ error: 'Données invalides' }, { status: 400 });
    }

    const { token, password } = parse.data;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Vérifier le token
    const verificationToken = await prisma.verificationToken.findUnique({
        where: { token: hashedToken }
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
        return json({ error: 'Token invalide ou expiré' }, { status: 400 });
    }

    // Mettre à jour le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
        where: { email: verificationToken.identifier },
        data: { password: hashedPassword }
    });

    // Supprimer le token après utilisation
    await prisma.verificationToken.delete({
        where: { token: hashedToken }
    });

    return json({ message: 'Mot de passe mis à jour avec succès' });
}
