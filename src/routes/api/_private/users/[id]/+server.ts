// src/ routes/ api/ _private/ users/ [id]/ +server.ts

import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export const GET = async ({ params }: { params: { id: string }, request: Request }) => {

    const id = params.id;

    try {

        const userById = await prisma.user.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                username: true,
                profile_picture: true,
                authProvider: true,
                verified: true,
                lastLogin: true,
                User_Role: {
                    select: {
                        role: true
                    }
                }
            }
        });
        return json(userById)

    } catch (error) {
        console.error("Load error:", error);
        throw error;

    }


}