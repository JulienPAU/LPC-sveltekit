<!-- src/ routes/dashboard/admin/lexique/%2Bpage.svelte -->

<script lang="ts">
	import SectionTitle from '$lib/components/SectionTitle.svelte';

	let formData = {
		title: '',
		content: ''
	};

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		let formDataForSubmit = new FormData(form);
		console.log('formData:', formData);

		try {
			const response = await fetch('/api/_public/lexical/publish', {
				method: 'POST',
				body: formDataForSubmit
			});

			if (!response.ok) {
				throw new Error(`Erreur lors de la soumission : ${response.statusText}`);
			}

			const result = await response.json();

			if (!result) {
				throw new Error('Erreur lors de la soumission');
			} else {
				alert('Définition créée avec succès.');
				form.reset();
			}
		} catch (error) {
			console.error('Erreur:', error);
			throw new Error('Erreur lors de la soumission');
		}
	}
</script>

<div class="flex flex-col items-center">
	<SectionTitle title="Lexique" />

	<form
		on:submit={handleSubmit}
		class="mx-auto mb-5 flex w-2/4 flex-col items-center justify-center gap-5 rounded-lg bg-gray-300 p-4"
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
			>
			</textarea>
		</div>

		<button type="submit" class="btn btn-warning text-xl">Enregistrer</button>
	</form>
</div>
