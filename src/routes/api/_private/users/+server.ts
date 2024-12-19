// src/routes/api/articles/+server.ts
import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export async function GET() {
    const users = await prisma.user.findMany();

    return json(users);
}
