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





export const getRole = (role: string) => {
	switch (role) {
		case "EDITOR":
			return "Éditeur";
		case "ADMIN":
			return "Admin";
		case "MODERATOR":
			return "Modérateur";
		case "AUTHOR":
			return "Auteur";
		case "READER":
			return "Lecteur";
		case "EXPERT":
			return "Expert";
		default:
			return role;
	}
};

export const getPublicationStatus = (status: string) => {
	switch (status) {
		case "PUBLISHED":
			return "Publié";
		case "SUBMITTED":
			return "Soumis";
		case "REFUSED":
			return "Refusé";
		default:
			return status;
	}
};

// Conversion des types d'articles
export const getArticleType = (type: string) => {
	switch (type) {
		case "GUIDE":
			return "Guide";
		case "ARTICLE":
			return "Article";
		case "REVIEW":
			return "Revue";
		case "TECHNICAL":
			return "Technique";
		case "LEXIQUE":
			return "Lexique";
		case "NEWS":
			return "Actualités";
		case "VINTAGE":
			return "Vintage";
		case "SPONSORED":
			return "Sponsorisé";
		case "INTERVIEW":
			return "Interview";
		case "COMPARISON":
			return "Comparatif";
		case "TUTORIAL":
			return "Tutoriel";
		case "MODDING":
			return "Modding";
		case "OTHER":
			return "Autre";
		default:
			return type;
	}
};


// Conversion des catégories
export const getCategory = (category: string) => {
	switch (category) {
		case "ANALOG":
			return "Analogique";
		case "ANALOG_DIGITAL":
			return "Ana-Digitale";
		case "QUARTZ":
			return "Quartz";
		case "AUTOMATIC":
			return "Automatique";
		case "DIGITAL":
			return "Digitale";
		case "CHRONOGRAPH":
			return "Chronographe";
		case "SMARTWATCH":
			return "Montre Connectée";
		case "HYBRID":
			return "Hybride";
		case "LUXURY":
			return "Luxe";
		case "DIVER":
			return "Plongée";
		case "PILOT":
			return "Aviation";
		case "POCKET":
			return "Gousset";
		case 'STRAPS':
			return "Bracelets";
		case "DRESS":
			return "Habillée";
		case "FIELD":
			return "Militaire / Tout-terrain";
		case "TOURBILLON":
			return "Tourbillon";
		case "MECHANICAL":
			return "Mécanique";
		case "SOLAR":
			return "Solaire";
		case "SKELETON":
			return "Squelette";
		case "OTHER":
			return "Autre";
		default:
			return category;
	}
};



export const getWatchCaseMaterial = (material: string) => {
	switch (material) {
		case "STAINLESS_STEEL_316L":
			return "Acier Inoxydable 316L";
		case "TITANIUM":
			return "Titane";
		case "GOLD":
			return "Or";
		case "PLATINUM":
			return "Platine";
		case "CERAMIC":
			return "Céramique";
		case "CARBON":
			return "Carbone";
		case "BRONZE":
			return "Bronze";
		case "PLASTIC":
			return "Plastique/Résine";
		case "ALUMINUM":
			return "Aluminium";
		case "PALLADIUM":
			return "Palladium";
		case "TUNGSTEN":
			return "Tungstène";
		case "SILVER":
			return "Argent";
		case "COPPER":
			return "Cuivre";
		case "MAGNESIUM":
			return "Magnésium";
		case "OTHER":
			return "Autre";
		default:
			return material;
	}
};


export function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^\w\s-]/g, '') // Supprimer les caractères spéciaux
		.replace(/\s+/g, '-')     // Remplacer les espaces par des tirets
		.replace(/--+/g, '-')     // Éviter les tirets multiples
		.trim();                  // Supprimer les espaces au début et à la fin
}

export function generateArticleUrl(id: number, title: string): string {
	return `/articles/${id}-${generateSlug(title)}`;
}