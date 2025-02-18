// src/routes/api/contact/+server.ts

import { json } from '@sveltejs/kit';
import { sendContactEmail } from '$lib/email';

export async function POST({ request }) {
    try {
        const { name, email, message } = await request.json();

        // Validation basique
        if (!name || !email || !message) {
            return json({
                success: false,
                error: 'Tous les champs sont requis'
            }, { status: 400 });
        }

        const result = await sendContactEmail(name, email, message);

        if (!result.success) {
            return json({
                success: false,
                error: result.error
            }, { status: 500 });
        }

        return json({ success: true });
    } catch (error) {
        console.error('Erreur dans l\'endpoint contact:', error);
        return json({
            success: false,
            error: 'Une erreur est survenue'
        }, { status: 500 });
    }
}