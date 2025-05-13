// src/routes/api/auth/reset-password/validate/+server.ts
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function isValidResetToken(token: string): Promise<boolean> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const verificationToken = await prisma.verificationToken.findUnique({
        where: { token: hashedToken }
    });

    if (verificationToken && verificationToken.expires > new Date()) {
        return true;
    }

    return false;
}
