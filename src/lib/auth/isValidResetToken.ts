// src/routes/api/auth/reset-password/validate/+server.ts
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function isValidResetToken(token: string): Promise<boolean> {
    // Hacher le token reçu (comme lors de sa création)
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Chercher le token dans la base de données
    const verificationToken = await prisma.verificationToken.findUnique({
        where: { token: hashedToken }
    });

    // Vérifier que le token existe et qu'il n'est pas expiré
    if (verificationToken && verificationToken.expires > new Date()) {
        return true;
    }

    return false; // Token invalide ou expiré
}
