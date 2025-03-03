import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';



export const DELETE: RequestHandler = async ({ params }) => {
    try {
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return new Response(JSON.stringify({ error: 'ID invalide' }), {
                status: 400
            });
        }
        const deletedDefinition = await prisma.lexical.delete({
            where: { id }
        });

        if (!deletedDefinition) {
            return new Response(JSON.stringify({ error: 'Définition non trouvée' }), {
                status: 404
            });
        }

        return json({ success: true, message: 'Définition supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la définition:', error);
        return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
            status: 500
        });
    }
};