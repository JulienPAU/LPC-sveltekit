<script lang="ts">
	import { goto } from '$app/navigation';
	import Mouvement from '$lib/assets/watches/Mouvement.png';
	import { signIn } from '@auth/sveltekit/client';

	let errorMessage = '';

	async function handleSignup(event: Event) {
		const formData = new FormData(event.target as HTMLFormElement);
		const response = await fetch('/api/auth/signup', {
			method: 'POST',
			body: JSON.stringify(Object.fromEntries(formData))
		});
		const result = await response.json();

		if (!response.ok) {
			errorMessage = result.message || 'Une erreur est survenue.';
		} else {
			goto('/auth/login');
		}
	}

	async function handleGoogleSignin() {
		try {
			await signIn('google', {
				callbackUrl: '/dashboard',
				redirect: true
			});
		} catch (error) {
			console.error('Erreur lors de la connexion avec Google:', error);
			error = 'Erreur lors de la connexion avec Google.';
		}
	}
</script>

<div
	class="mx-auto my-10 flex w-full max-w-sm justify-center overflow-hidden rounded-lg bg-white shadow-lg sm:my-10 lg:my-0 lg:h-screen lg:max-w-full lg:rounded-none dark:bg-gray-800"
>
	<div class="hidden bg-cover lg:block lg:w-1/2" style="background-image: url({Mouvement});"></div>

	<div class="flex w-full flex-col justify-center px-6 py-8 md:px-36 lg:w-1/2 lg:px-60">
		<a
			href="#"
			class="mt-4 flex transform items-center justify-center rounded-lg border text-gray-600 transition-colors duration-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
		>
			<div class="px-4 py-2">
				<svg class="h-6 w-6" viewBox="0 0 40 40">
					<path
						d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
						fill="#FFC107"
					/>
					<path
						d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
						fill="#FF3D00"
					/>
					<path
						d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
						fill="#4CAF50"
					/>
					<path
						d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
						fill="#1976D2"
					/>
				</svg>
			</div>

			<button on:click={handleGoogleSignin} class="w-5/6 px-4 py-3 text-center font-bold"
				>Se connecter avec Google</button
			>
		</a>

		<div class="mt-4 flex items-center justify-between">
			<span class="w-1/6 border-b lg:w-1/6 dark:border-gray-600"></span>

			<p class="text-center text-xs uppercase text-gray-500 dark:text-gray-400">ou avec un email</p>

			<span class="w-1/6 border-b lg:w-1/6 dark:border-gray-600"></span>
		</div>
		<form method="post" on:submit|preventDefault={handleSignup}>
			<div class="flex w-full gap-5">
				<div class="mt-4 w-full">
					<label
						class="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-200"
						for="last_name">Nom</label
					>
					<input
						id="last_name"
						name="last_name"
						class="block w-full rounded-lg border bg-white px-4 py-2 text-gray-700 focus:border-yellow-500 focus:outline-none focus:ring focus:ring-yellow-500 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-yellow-500"
						type="text"
					/>
				</div>

				<div class="mt-4 w-full">
					<label
						class="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-200"
						for="first_name">Prénom</label
					>
					<input
						id="first_name"
						name="first_name"
						class="block w-full rounded-lg border bg-white px-4 py-2 text-gray-700 focus:border-yellow-500 focus:outline-none focus:ring focus:ring-yellow-500 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-yellow-500"
						type="text"
					/>
				</div>
			</div>

			<div class="mt-4">
				<label
					class="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-200"
					for="username">Nom d'utilisateur</label
				>
				<input
					id="username"
					name="username"
					class="block w-full rounded-lg border bg-white px-4 py-2 text-gray-700 focus:border-yellow-500 focus:outline-none focus:ring focus:ring-yellow-500 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-yellow-500"
					type="text"
				/>
			</div>

			<div class="mt-4">
				<label
					class="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-200"
					for="LoggingEmailAddress">Adresse email</label
				>
				<input
					id="LoggingEmailAddress"
					name="email"
					class="block w-full rounded-lg border bg-white px-4 py-2 text-gray-700 focus:border-yellow-500 focus:outline-none focus:ring focus:ring-yellow-500 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-yellow-500"
					type="email"
				/>
			</div>

			<div class="mt-4">
				<div class="flex justify-between">
					<label
						class="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-200"
						for="loggingPassword">Mot de passe</label
					>
				</div>

				<input
					class="block w-full rounded-lg border bg-white px-4 py-2 text-gray-700 focus:border-yellow-500 focus:outline-none focus:ring focus:ring-yellow-500 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-yellow-500"
					type="password"
					name="password"
				/>
			</div>

			{#if errorMessage}
				<div class="mt-4 text-red-600">{errorMessage}</div>
			{/if}

			<div class="mt-6">
				<button
					class="w-full transform rounded-lg bg-gray-700 px-6 py-3 text-sm font-medium capitalize tracking-wide text-white transition-colors duration-300 hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
				>
					S'inscrire
				</button>
			</div>
		</form>
		<div class="mt-4 flex items-center justify-between">
			<span class="w-1/5 border-b md:w-1/4 dark:border-gray-600"></span>

			<a href="login" class="text-xs uppercase text-gray-500 hover:underline dark:text-gray-400"
				>Se connecter</a
			>

			<span class="w-1/5 border-b md:w-1/4 dark:border-gray-600"></span>
		</div>
	</div>
</div>
