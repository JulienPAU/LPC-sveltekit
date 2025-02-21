<!-- src/ routes/auth/reset-password/+page.svelte -->

<script lang="ts">
	import { onMount } from 'svelte';
	import Mouvement from '$lib/assets/watches/Mouvement.png';
	import { goto } from '$app/navigation';
	import toast from 'svelte-5-french-toast';

	let token = '';
	let password = '';
	let tokenValid = true;

	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);
		token = urlParams.get('token') || '';

		// Vérification du token côté client
		const res = await fetch(`/api/auth/reset-password/validate?token=${token}`);
		const data = await res.json();
		if (data.error) {
			tokenValid = false; // Si le token est invalide
		}
	});

	async function resetPassword() {
		if (!tokenValid) return;

		const res = await fetch('/api/auth/reset-password/confirm', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token, password })
		});
		const data = await res.json();
		toast(data.message, {
			duration: 5000
		});

		if (data.message === 'Mot de passe mis à jour avec succès') {
			// Redirection vers la page de connexion après la mise à jour réussie
			setTimeout(() => goto('/auth/login'), 1000);
		}
	}
</script>

<div
	class="mx-auto my-10 flex w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg sm:my-10 lg:my-0 lg:h-screen lg:max-w-full lg:rounded-none dark:bg-gray-800"
>
	<div class="hidden bg-cover lg:block lg:w-1/2" style="background-image: url({Mouvement});"></div>

	<div class="flex w-full flex-col justify-center px-6 py-8 md:px-36 lg:w-1/2 lg:px-60">
		<h2 class="mb-6 text-center text-2xl text-gray-700 dark:text-gray-200">
			Réinitialiser votre mot de passe
		</h2>
		<input
			type="password"
			bind:value={password}
			placeholder="Nouveau mot de passe"
			class="mb-4 block w-full rounded-lg border bg-white px-4 py-2 text-gray-700 focus:border-yellow-500 focus:outline-none focus:ring focus:ring-yellow-500 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-yellow-500"
		/>
		<button
			on:click={resetPassword}
			class="w-full transform rounded-lg bg-gray-700 px-6 py-3 text-sm font-medium capitalize tracking-wide text-white transition-colors duration-300 hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
		>
			Mettre à jour
		</button>
	</div>
</div>
