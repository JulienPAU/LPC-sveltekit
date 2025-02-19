// src/ routes/ api/ _private/ users/ [id]/ edit/ +server.ts

import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { updateUserSchema } from '$lib/schemas/user';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import type { UpdateUserData } from '$lib/types/user';
import { RoleType } from '@prisma/client';


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
            role: formData.get('role')?.toString().trim(),
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
                authProvider: true,
                moderatorRequestStatus: true,

            }
        });

        if (!existingUser) {
            return json({ error: 'Utilisateur non trouvé' }, { status: 404 });
        }

        // Créer un objet ne contenant que les champs du modèle Prisma
        const dataToUpdate: UpdateUserData = {
            ...(validatedData.username && { username: validatedData.username }),
            ...(validatedData.first_name && { first_name: validatedData.first_name }),
            ...(validatedData.last_name && { last_name: validatedData.last_name })
        };


        if (validatedData.current_password && validatedData.new_password) {
            if (existingUser.authProvider === 'google') {
                return json({
                    error: 'La modification du mot de passe n\'est pas disponible pour les comptes Google'
                }, { status: 400 });
            }

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

            const hashedPassword = await bcrypt.hash(validatedData.new_password, 10);
            dataToUpdate.password = hashedPassword;
        }

        if (validatedData.role) {
            const upperRole = validatedData.role.toUpperCase() as RoleType;

            // Récupérer d'abord l'enregistrement User_Role existant
            const userRole = await prisma.user_Role.findFirst({
                where: {
                    user_id: id
                }
            });

            if (userRole) {

                if (upperRole === 'MODERATOR' && existingUser.moderatorRequestStatus !== 'APPROVED') {
                    await prisma.user.update({
                        where: { id },
                        data: {
                            moderatorRequestStatus: 'APPROVED',
                            moderatorRequestAt: new Date()
                        }
                    });
                } else if (upperRole !== 'MODERATOR') {
                    // Réinitialisation des champs si le rôle n'est pas MODERATOR
                    await prisma.user.update({
                        where: { id },
                        data: {
                            moderatorRequestStatus: 'NOT_REQUESTED',
                            moderatorRequestAt: null
                        }
                    });
                }
                // Mise à jour du rôle avec l'ID correct
                await prisma.user_Role.update({
                    where: {
                        id: userRole.id  // Utiliser l'ID numérique comme clé unique
                    },
                    data: {
                        role: upperRole
                    }
                });
            }
        }

        if (Object.keys(dataToUpdate).length === 0) {
            return json({ error: 'Aucune donnée à mettre à jour' }, { status: 400 });
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
                moderatorRequestStatus: true,
                moderatorRequestAt: true,
                User_Role: {
                    select: {
                        role: true
                    }
                }
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
        return json({ error: 'Erreur serveur' }, { status: 500 });
    }
}