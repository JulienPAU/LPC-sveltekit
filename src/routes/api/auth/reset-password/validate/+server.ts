// src/routes/api/auth/reset-password/validate/+server.ts
import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function GET({ url }) {
    const token = url.searchParams.get('token');
    if (!token) {
        return json({ error: 'Token manquant' }, { status: 400 });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const verificationToken = await prisma.verificationToken.findUnique({
        where: { token: hashedToken }
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
        return json({ error: 'Token invalide ou expiré' }, { status: 400 });
    }

    return json({ message: 'Token valide' });
}
