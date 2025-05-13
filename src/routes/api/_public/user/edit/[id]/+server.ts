import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import bcrypt from 'bcrypt';
import type { UpdateUserData } from '$lib/types/user';
import { extractAndValidateFormData } from '$lib/utils';
import { handleErrorForm } from '$lib/utils';

export const POST = async ({ params, request }: { params: { id: string }, request: Request }) => {
    try {
        const id = params.id;
        if (!id) {
            return json({ error: 'Invalid ID format' }, { status: 400 });
        }

        const validatedData = await extractAndValidateFormData(request);


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
                User_Role: true,
            }
        });

        return json({
            message: 'Profil mis à jour avec succès',
            user: updatedUser
        }, { status: 200 });

    } catch (error) {
        return handleErrorForm(error as Error);

    }
}