<!-- src/lib/components/ResetPasswordModal.svelte -->

<script lang="ts">
	import { toast } from 'svelte-5-french-toast';

	export let onClose: () => void;

	let email = '';

	async function sendResetRequest() {
		try {
			const res = await fetch('/api/auth/reset-password/request', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			});
			const data = await res.json();
			toast(data.message, {
				duration: 5000
			});
			onClose();
		} catch (error) {
			console.error('Erreur lors de la réinitialisation:', error);
			toast.error('Une erreur est survenue lors de la demande de réinitialisation.', {
				duration: 5000
			});
		}
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
	<div class="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
		<h2 class="mb-4 text-2xl text-gray-700 dark:text-gray-200">Réinitialisation du mot de passe</h2>
		<div class="mb-4">
			<input
				type="email"
				bind:value={email}
				placeholder="Votre email"
				class="w-full rounded-lg border bg-white px-4 py-2 text-gray-700 focus:border-yellow-500 focus:outline-none focus:ring focus:ring-yellow-500 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
			/>
		</div>
		<div class="flex justify-end space-x-2">
			<button
				on:click={onClose}
				class="rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
			>
				Annuler
			</button>
			<button
				on:click={sendResetRequest}
				class="rounded-lg bg-gray-700 px-4 py-2 text-white hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
			>
				Envoyer
			</button>
		</div>
	</div>
</div>
