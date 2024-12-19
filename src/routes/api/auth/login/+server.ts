import { json, error } from '@sveltejs/kit';
import { login } from '$lib/auth';

export async function POST({ request }) {
    const { email, password } = await request.json();

    try {
        const { user } = await login(email, password);
        return json({ user });
    } catch (err) {
        if (err instanceof Error) {
            throw error(401, err.message);
        } else {
            throw error(401, 'Unknown error');
        }
    }
}
