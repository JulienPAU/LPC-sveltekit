<!-- src/ routes/dashboard/admin/manage/users/%5Bid%5D/edit/+page.svelte -->

<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import type { UpdateUserData } from '$lib/types/user.js';
	import toast from 'svelte-5-french-toast';
	let isSubmitting = false;

	export let data;

	let { userById } = data;

	let username = userById.username;
	let firstName = userById.first_name || '';
	let lastName = userById.last_name || '';
	let role = userById.User_Role[0].role.toLowerCase() || '';
	let moderatorRequestStatus = userById.moderatorRequestStatus;

	function resetForm() {
		username = userById.username;
		firstName = userById.first_name || '';
		lastName = userById.last_name || '';
		role = userById.User_Role[0].role.toLowerCase() || '';
		moderatorRequestStatus = userById.moderatorRequestStatus;
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		isSubmitting = true;

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		if (role === 'moderator') {
			formData.append('moderatorRequestStatus', 'APPROVED');
		}

		try {
			const response = await fetch(`/api/_private/users/${userById.id}/edit`, {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				toast.error(`Erreur lors de la soumission : ${response.statusText}`, {
					duration: 5000
				});
				throw new Error(`Erreur lors de la soumission : ${response.statusText}`);
			}

			const result: UpdateUserData = await response.json();

			if (result) {
				isSubmitting = false;

				toast.success('Profil mis à jour avec succès', {
					duration: 5000
				});
				invalidate('app:user');
				setTimeout(() => goto('/dashboard/admin/manage/users'), 1000);
			} else {
				toast.error('Erreur lors de la mise à jour du profil', {
					duration: 5000
				});
				throw new Error('Erreur lors de la mise à jour du profil');
			}
		} catch (error) {
			console.error('Erreur:', error);
			isSubmitting = false;
			toast.error('Erreur lors de la soumission', {
				duration: 5000
			});
			throw new Error('Erreur lors de la soumission');
		}
	}
	async function handleRejectModerator() {
		isSubmitting = true;

		const formData = new FormData();
		formData.append('moderatorRequestStatus', 'REJECTED');

		try {
			const response = await fetch(`/api/_private/users/${userById.id}/edit`, {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				toast.error(`Erreur lors du rejet : ${response.statusText}`, {
					duration: 5000
				});
				throw new Error(`Erreur lors du rejet : ${response.statusText}`);
			}

			const result = await response.json();

			if (result) {
				isSubmitting = false;
				toast.error('Demande de modérateur refusée', {
					duration: 5000
				});
				window.location.reload();
			} else {
				toast.error('Erreur lors du rejet de la demande', {
					duration: 5000
				});
				throw new Error('Erreur lors du rejet de la demande');
			}
		} catch (error) {
			console.error('Erreur:', error);
			isSubmitting = false;
			toast.error('Erreur lors de la soumission', {
				duration: 5000
			});
			throw new Error('Erreur lors de la soumission');
		}
	}

	async function handleDelete(event: MouseEvent) {
		event.preventDefault();
		isSubmitting = true;

		try {
			const response = await fetch(`/api/_private/users/${userById.id}/delete`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				toast.error(`Erreur lors de la suppression : ${response.statusText}`, {
					duration: 5000
				});
				throw new Error(`Erreur lors de la suppression : ${response.statusText}`);
			}

			const result: UpdateUserData = await response.json();

			if (result) {
				isSubmitting = false;
				// invalidate('app:user');
				toast.success('User supprimé avec succès', {
					duration: 5000
				});
				setTimeout(() => goto('/dashboard/admin/manage/users'), 1000);
			} else {
				toast.error("Erreur lors de la suppression de l'utilisateur", {
					duration: 5000
				});
				throw new Error("Erreur lors de la suppression de l'utilisateur");
			}
		} catch (error) {
			console.error('Erreur:', error);
			isSubmitting = false;
			toast.error('Erreur lors de la suppression', {
				duration: 5000
			});
			throw new Error('Erreur lors de la supression');
		}
	}

	let confirmDelete = false;

	function askDelete() {
		confirmDelete = true;
	}

	function cancelDelete() {
		confirmDelete = false;
	}

	let isGoogle = false;
	if (userById.authProvider === 'google') {
		isGoogle = true;
	}
</script>

<section class="px-5 lg:px-0">
	<SectionTitle title="Profil de {username}" />

	<form
		on:submit={handleSubmit}
		class="mx-auto w-full max-w-4xl items-center rounded-xl bg-gray-200 p-10"
	>
		<div class="flex flex-col gap-5">
			<div class="flex flex-col gap-5 md:flex-row">
				<div class="w-full">
					<label for="username" class="mb-1 block text-lg font-bold text-gray-700">
						Nom d'utilisateur
					</label>
					<input
						id="username"
						name="username"
						type="text"
						class="input input-bordered input-warning w-full"
						bind:value={username}
					/>
				</div>

				<div class="w-full">
					<label for="role" class="mb-1 block text-lg font-bold text-gray-700"> Role </label>
					<select
						id="role"
						name="role"
						class="input input-bordered input-warning w-full"
						bind:value={role}
					>
						<option value="reader">Lecteur</option>
						<option value="author">Auteur</option>
						<option value="expert">Expert</option>
						<option value="moderator">Modérateur</option>
					</select>
				</div>
			</div>

			<div class="flex flex-col gap-5 md:flex-row">
				<div class="w-full">
					<label for="first_name" class="mb-1 block text-lg font-bold text-gray-700">
						Prénom
					</label>
					<input
						id="first_name"
						name="first_name"
						type="text"
						class="input input-bordered input-warning w-full"
						bind:value={firstName}
						placeholder="Non spécifié"
					/>
				</div>

				<div class="w-full">
					<label for="last_name" class="mb-1 block text-lg font-bold text-gray-700"> Nom </label>
					<input
						id="last_name"
						name="last_name"
						type="text"
						class="input input-bordered input-warning w-full"
						bind:value={lastName}
						placeholder="Non spécifié"
					/>
				</div>
			</div>

			<div>
				<label for="email" class="mb-1 block text-lg font-bold text-gray-700"> Email </label>
				<input
					id="email"
					name="email"
					type="email"
					class="input input-bordered input-warning w-full"
					value={userById.email}
					disabled
				/>
			</div>

			<div>
				<label for="current_password" class="mb-1 block text-lg font-bold text-gray-700">
					Mot de passe actuel
					{#if isGoogle}
						<span class="text-sm text-red-500"> (indisponible pour les comptes Google)</span>
					{/if}
				</label>
				<input
					id="current_password"
					name="current_password"
					type="password"
					class="input input-bordered input-warning w-full"
					placeholder="Enter current password"
					disabled={isGoogle}
				/>
			</div>

			<div>
				<label for="new_password" class="mb-1 block text-lg font-bold text-gray-700">
					Nouveau mot de passe
				</label>
				<input
					id="new_password"
					name="new_password"
					type="password"
					class="input input-bordered input-warning w-full"
					placeholder="Enter new password"
					disabled={isGoogle}
				/>
			</div>

			<div class="flex justify-between">
				<button type="button" class="btn btn-primary text-xl" on:click={resetForm}>
					Annuler
				</button>

				{#if userById.moderatorRequestStatus === 'PENDING'}
					<button
						type="button"
						class="btn bg-[#C41E3A] text-xl text-white hover:bg-[#D22B2B]"
						on:click={handleRejectModerator}
						disabled={isSubmitting}
					>
						Refuser la demande de modérateur
					</button>
				{/if}

				<button type="submit" class="btn btn-warning text-xl"> Enregistrer </button>
			</div>
		</div>
	</form>

	{#if confirmDelete}
		<div class="mt-5 flex flex-col items-center gap-2">
			<p class="mb-2 text-xl font-bold">Etes vous sur de vouloir supprimer?</p>
			<div class="mb-10 flex gap-2 lg:mb-0">
				<button
					type="button"
					class="btn btn-error text-xl"
					disabled={isSubmitting}
					on:click={handleDelete}
				>
					Oui, supprimer
				</button>
				<button type="button" class="btn btn-primary text-xl" on:click={cancelDelete}>
					Annuler
				</button>
			</div>
		</div>
	{:else}
		<div class="mb-10 mt-10 flex w-full justify-center lg:mb-0">
			<button
				type="button"
				class=" btn bg-[#C41E3A] text-xl text-white hover:bg-[#D22B2B]"
				on:click={askDelete}
			>
				Supprimer le compte de : {userById.username}</button
			>
		</div>
	{/if}
</section>
