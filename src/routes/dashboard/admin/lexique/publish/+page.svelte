<!-- src/ routes/dashboard/admin/lexique/%2Bpage.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import { onMount } from 'svelte';
	import toast from 'svelte-5-french-toast';

	let formData = {
		title: '',
		content: ''
	};

	let isEditing = false;
	let definitionId: string | null = null;
	let showDeleteConfirm = false;

	onMount(async () => {
		const id = $page.url.searchParams.get('id');
		if (id) {
			isEditing = true;
			definitionId = id;
			try {
				const response = await fetch(`/api/_public/lexical/${id}`);
				if (response.ok) {
					const definition = await response.json();
					formData = {
						title: definition.title,
						content: definition.content
					};
				}
			} catch (error) {
				console.error('Erreur lors du chargement:', error);
				toast.error('Erreur lors du chargement de la définition');
			}
		}
	});

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		let formDataForSubmit = new FormData(form);

		if (isEditing && definitionId) {
			formDataForSubmit.append('id', definitionId);
		}
		try {
			const response = await fetch('/api/_public/lexical/publish', {
				method: isEditing ? 'PUT' : 'POST',
				body: formDataForSubmit
			});

			if (!response.ok) {
				throw new Error(`Erreur lors de la soumission : ${response.statusText}`);
			}

			const result = await response.json();

			if (!result) {
				toast.error('Erreur lors de la soumission');
				throw new Error('Erreur lors de la soumission');
			} else {
				toast.success(
					isEditing ? 'Définition mise à jour avec succès.' : 'Définition créée avec succès.'
				);
				window.location.href = '/dashboard/admin/lexique';
			}
		} catch (error) {
			console.error('Erreur:', error);
			toast.error('Erreur lors de la soumission');
		}
	}

	async function handleDelete() {
		if (!definitionId) return;

		try {
			const response = await fetch(`/api/_public/lexical/${definitionId}/delete`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				throw new Error(`Erreur lors de la suppression : ${response.statusText}`);
			}

			toast.success('Définition supprimée avec succès');
			window.location.href = '/dashboard/admin/lexique';
		} catch (error) {
			console.error('Erreur:', error);
			toast.error('Erreur lors de la suppression');
		}
	}

	function toggleDeleteConfirm() {
		showDeleteConfirm = !showDeleteConfirm;
	}
</script>

<div class="flex flex-col items-center p-4">
	<div class="flex justify-center gap-2">
		<a href="/dashboard/admin/lexique" class="btn btn-neutral"> Retour au lexique</a>
	</div>
	<SectionTitle title="Publier une définition" />

	<form
		on:submit={handleSubmit}
		class="mx-auto mb-5 flex w-full flex-col items-center justify-center gap-5 rounded-lg bg-gray-300 p-4 lg:w-2/5"
	>
		<div class="w-full">
			<label for="titre-def" class="mb-1 block text-lg font-bold text-gray-700">
				Titre définition
			</label>
			<input
				id="titre-def"
				name="title-def"
				bind:value={formData.title}
				type="text"
				class="input input-warning mb-5 w-full"
			/>
		</div>

		<div class="w-full">
			<label for="content-def" class="mb-1 block text-lg font-bold text-gray-700">
				Contenu définition
			</label>
			<textarea
				id="content-def"
				name="content-def"
				bind:value={formData.content}
				class="textarea textarea-warning mb-5 w-full"
				rows="8"
				cols="50"
			>
			</textarea>
		</div>

		<div class=" flex w-full items-center justify-between gap-2">
			<button type="submit" class="btn btn-warning text-xl">Enregistrer</button>

			{#if isEditing}
				{#if !showDeleteConfirm}
					<button type="button" class="btn btn-error text-lg" on:click={toggleDeleteConfirm}>
						Supprimer
					</button>
				{:else}
					<div class="flex flex-col items-center justify-center gap-2 lg:flex-row">
						<span class="font-bold text-red-500">Confirmer la suppression ?</span>
						<div>
							<button type="button" class="btn btn-error" on:click={handleDelete}> Oui </button>
							<button type="button" class="btn btn-neutral" on:click={toggleDeleteConfirm}>
								Non
							</button>
						</div>
					</div>
				{/if}
			{/if}
		</div>
	</form>
</div>
