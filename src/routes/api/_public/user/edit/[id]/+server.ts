// src\routes\api\_public\article_id\+server.ts
import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { updateUserSchema } from '$lib/schemas/user';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import type { UpdateUserData } from '$lib/types/user';

export const POST = async ({ params, request }: { params: { id: string }, request: Request }) => {

    try {
        const id = params.id;

        if (!id) {
            return json({ error: 'Invalid ID format' }, { status: 400 });
        }

        const formData = await request.formData();


        const updateData = {
            username: formData.get('username')?.toString().trim(),
            first_name: formData.get('first_name')?.toString().trim(),
            last_name: formData.get('last_name')?.toString().trim(),
            current_password: formData.get('current_password')?.toString(),
            new_password: formData.get('new_password')?.toString(),
        };


        const filteredUpdateData = Object.fromEntries(
            Object.entries(updateData).filter(([, value]) => value !== "" && value !== undefined)
        );


        const validatedData = updateUserSchema.parse(filteredUpdateData);


        const existingUser = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                password: true,
                authProvider: true
            }
        });

        if (!existingUser) {
            return json({ error: 'Utilisateur non trouvé' }, { status: 404 });
        }

        const dataToUpdate: UpdateUserData = Object.fromEntries(
            Object.entries(validatedData).filter(([, value]) => value !== "")
        );

        if (Object.keys(dataToUpdate).length === 0) {
            return json({ error: 'Aucune donnée à mettre à jour' }, { status: 400 });
        }

        if (validatedData.current_password && validatedData.new_password) {
            // Vérifier si l'utilisateur utilise l'authentification Google
            if (existingUser.authProvider === 'google') {
                return json({
                    error: 'La modification du mot de passe n\'est pas disponible pour les comptes Google'
                }, { status: 400 });
            }

            // Vérifier le mot de passe actuel
            const isPasswordValid = await bcrypt.compare(
                validatedData.current_password,
                existingUser.password
            );


            if (!isPasswordValid) {
                return json({ error: 'Mot de passe actuel incorrect' }, { status: 400 });
            }


            if (validatedData.current_password === validatedData.new_password) {
                return json({
                    error: 'Le nouveau mot de passe doit être différent de l\'ancien'
                }, { status: 400 });
            }

            // Hasher le nouveau mot de passe
            if (validatedData.new_password) {
                const hashedPassword = await bcrypt.hash(validatedData.new_password, 10);
                dataToUpdate.password = hashedPassword;
            }


        }
        const updatedUser = await prisma.user.update({
            where: { id },
            data: dataToUpdate,
            select: {
                id: true,
                username: true,
                first_name: true,
                last_name: true,
                email: true,
                role: true,
            }
        });


        return json({
            message: 'Profil mis à jour avec succès',
            user: updatedUser
        }, { status: 200 });


    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        if (error instanceof z.ZodError) {
            return json({ error: 'Données invalides', details: error.errors }, { status: 400 });
        }
        console.error('Erreur lors de la mise à jour:', error);
        return json({ error: 'Erreur serveur' }, { status: 500 });
    }




}