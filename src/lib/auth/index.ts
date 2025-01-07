import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '$lib/prisma';
import { JWT_SECRET_Key } from '$env/static/private';


export async function login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Email ou mot de passe incorrect.');
    }

    // Générer un token JWT
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET_Key, { expiresIn: '1h' });
    return { token, user: { id: user.id, first_name: user.first_name, last_name: user.last_name } };
}

export async function signup(email: string, password: string, first_name: string, last_name: string, username: string) {
    if (!email || !username) {
        throw new Error("L'email et le nom d'utilisateur sont requis.");
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
            first_name: first_name,
            last_name: last_name,
            username,
        },
    });
}


// Vérifier le token JWT
export function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET_Key);
    } catch {
        return null;
    }
}
