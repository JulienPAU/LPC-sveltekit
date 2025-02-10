// lib/user.ts
import bcrypt from 'bcrypt';
import prisma from '$lib/prisma';

function validatePassword(password: string): boolean {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);

    return password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar;
}

export async function createUser(email: string, password: string, first_name: string, last_name: string, username: string) {
    if (!email || !username) {
        throw new Error("L'email et le nom d'utilisateur sont requis.");
    }

    if (!validatePassword(password)) {
        throw new Error("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");
    }

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{ email }, { username }],
        },
    });

    if (existingUser) {
        if (existingUser.email === email) {
            throw new Error('Un utilisateur avec cet email existe déjà.');
        }
        if (existingUser.username === username) {
            throw new Error('Ce nom d\'utilisateur est déjà pris.');
        }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    return prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            first_name,
            last_name,
            username,
            User_Role: {
                create: {
                    role: "READER"
                }
            }
        },
    });
}


