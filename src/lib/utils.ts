import { error } from "@sveltejs/kit";

export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength) + '...';
}

// onScroll.js
interface ObserverOptions {
	root: null | HTMLElement;
	threshold: number;
	rootMargin: string;
}

interface OnScrollReturn {
	destroy: () => void;
}

export function onScroll(node: HTMLElement): OnScrollReturn {
	const observerOptions: ObserverOptions = {
		root: null, // Utilise la fenêtre comme root
		rootMargin: '0px 0px 90% 0px', // Le bas du viewport est réduit de 50%
		threshold: 0, // L'animation se déclenche dès que l'élément commence à être visible
	};

	const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
		entries.forEach((entry: IntersectionObserverEntry) => {
			if (entry.isIntersecting) {
				node.classList.add('animate'); // Ajoute la classe quand visible
				observer.unobserve(node); // Arrête d'observer l'élément
			}
		});
	}, observerOptions);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect(); // Nettoyage si le composant est démonté
		}
	};
}


export function formatDate(date: string): string {
	const options = { year: 'numeric' as const, month: 'long' as const, day: 'numeric' as const };
	return new Date(date).toLocaleDateString('fr-FR', options);
}



export function togglePasswordVisibility(passwordInputId: string, togglePasswordId: string) {
	const passwordInput = document.getElementById(passwordInputId);
	const togglePassword = document.getElementById(togglePasswordId);

	if (passwordInput) {
		const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
		passwordInput.setAttribute('type', type);

		if (togglePassword) {
			togglePassword.innerHTML =
				type === 'password'
					? '<i class="fa-regular fa-eye" style="color: #ffffff;"></i>'
					: '<i class="fa-regular fa-eye-slash" style="color: #ffffff;"></i>';
		}
	}
}


export function handleResponse(successMessage: object) {
	return new Response(JSON.stringify(successMessage), { status: 200 });
}

export function handleError(err: unknown) {
	if (err instanceof Error) {
		throw error(500, err.message);
	} else {
		throw error(500, 'Unknown error');
	}
}



import { updateUserSchema } from '$lib/schemas/user';
import { z } from 'zod';

export async function extractAndValidateFormData(request: Request) {
	const formData = await request.formData();
	const updateData = {
		username: formData.get('username')?.toString().trim(),
		first_name: formData.get('first_name')?.toString().trim(),
		last_name: formData.get('last_name')?.toString().trim(),
		current_password: formData.get('current_password')?.toString(),
		new_password: formData.get('new_password')?.toString(),
		role: formData.get('role')?.toString().trim(),
		moderatorRequestStatus: formData.get('moderatorRequestStatus')?.toString().trim(),
	};

	const filteredUpdateData = Object.fromEntries(
		Object.entries(updateData).filter(([, value]) => value !== "" && value !== undefined)
	);

	try {
		return updateUserSchema.parse(filteredUpdateData); // Validation Zod
	} catch (err) {
		if (err instanceof z.ZodError) {
			throw new Error('Données invalides');
		}
		throw err; // Rethrow any other error
	}
}


import { json } from '@sveltejs/kit';

export function handleErrorForm(error: Error) {
	if (error.message === 'Données invalides') {
		return json({ error: 'Données invalides' }, { status: 400 });
	}

	console.error('Erreur serveur:', error);
	return json({ error: 'Erreur serveur' }, { status: 500 });
}