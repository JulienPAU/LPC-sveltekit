<!-- src/lib/components/form/ArticleForm.svelte -->

<script lang="ts">
	export let isEditing = false;
	export let article = {
		title: '',
		article_type: '',
		introduction: '',
		body: '',
		ending: '',
		images: []
	};
	export let onSubmit: (event: SubmitEvent) => void;
	export let onDelete: ((event: MouseEvent) => void) | null = null;

	export let isSubmitting = false;

	export let onFilesSelected: ((files: File[]) => void) | null = null;

	let confirmDelete = false;

	function askDelete() {
		confirmDelete = true;
	}

	function cancelDelete() {
		confirmDelete = false;
	}
</script>

<form on:submit={onSubmit} class="mx-auto mb-10 w-full max-w-4xl rounded-xl bg-gray-200 p-10">
	<div class="mb-5 flex flex-col gap-5 md:flex-row">
		<div class="w-full">
			<label for="titre-article" class="mb-1 block text-lg font-bold text-gray-700">
				Titre de l'article
			</label>
			<input
				id="titre-article"
				name="titre-article"
				type="text"
				class="input input-bordered input-warning w-full"
				bind:value={article.title}
			/>
		</div>

		<div class="w-full">
			<label for="type" class="mb-1 block text-lg font-bold text-gray-700">Type</label>
			<select
				id="type"
				name="type"
				class="select select-warning w-full text-lg"
				bind:value={article.article_type}
			>
				{#if !isEditing}
					<option value="" disabled selected class="text-black">Choisir un type</option>
				{/if}
				<option value="ARTICLE">Article</option>
				<option value="REVIEW">Review</option>
				<option value="TECHNICAL">Technique</option>
				<option value="LEXIQUE">Lexique</option>
				<option value="GUIDE">Guide</option>
			</select>
		</div>
	</div>
	<!-- <div class="w-full">
				<label for="categorie" class="mb-1 block text-lg font-bold text-gray-700">
					Catégorie
				</label>

				<select id="categorie" name="categorie" class="select select-warning w-full text-lg">
					<option disabled selected>Choisir une catégorie</option>
					<option value="LUXURY">Montres de luxe</option>
					<option value="SMARTWATCH">Montres connectées</option>
					<option value="DIGITAL">Montres digitales</option>
					<option value="ANALOG">Montres analogiques</option>
					<option value="HYBRID">Montres hybrides</option>
				</select>
			</div> -->

	<div>
		<label for="introduction" class="mb-1 block text-lg font-bold text-gray-700">
			Introduction de l'article
		</label>
		<textarea
			id="introduction"
			name="introduction"
			class="textarea textarea-warning mb-5 h-32 w-full"
			bind:value={article.introduction}
		></textarea>
	</div>

	<div>
		<label for="corps-article" class="mb-1 block text-lg font-bold text-gray-700">
			Corps de l'article
		</label>
		<textarea
			id="corps-article"
			name="corps-article"
			class="textarea textarea-warning mb-5 h-72 w-full"
			bind:value={article.body}
		></textarea>
	</div>

	<div>
		<label for="end" class="mb-1 block text-lg font-bold text-gray-700">Le mot de la fin</label>
		<textarea
			id="end"
			name="end"
			class="textarea textarea-warning mb-5 h-32 w-full"
			bind:value={article.ending}
		></textarea>
	</div>

	<div class="flex-col">
		{#if isEditing}
			<div class="mb-5 w-full">
				<label for="upload-files" class="mb-1 block text-lg font-bold text-gray-700">
					Modifier les photos de l'article
				</label>
				<slot name="imageUploader" />
			</div>
			<div class="mb-20">
				<label for="img" class="mb-1 block text-lg font-bold text-gray-700">Images</label>
				<div class=" flex flex-wrap gap-1">
					{#each article.images as image}
						<img
							src={image}
							alt="l'article"
							class="image-item w-1/5 rounded-xl sm:w-1/5 lg:w-1/5"
						/>
					{/each}
				</div>
			</div>
		{:else if onFilesSelected}
			<div class="mb-20 w-full">
				<label for="upload-files" class="mb-1 block text-lg font-bold text-gray-700">
					Télécharger des fichiers
				</label>
				<slot name="imageUploader" />
			</div>
		{/if}

		<div class="flex justify-between">
			<button type="submit" class="btn btn-warning text-xl" disabled={isSubmitting}>
				{isSubmitting ? 'En cours...' : 'Valider'}
			</button>

			{#if isEditing}
				{#if confirmDelete}
					<div class="flex flex-col items-center gap-2">
						<p class="mb-2 text-xl font-bold">Etes vous sur de vouloir supprimer?</p>
						<div class="flex gap-2">
							<button
								type="button"
								class="btn btn-error text-xl"
								disabled={isSubmitting}
								on:click={onDelete}
							>
								Oui, supprimer
							</button>
							<button type="button" class="btn btn-primary text-xl" on:click={cancelDelete}>
								Annuler
							</button>
						</div>
					</div>
				{:else}
					<button type="button" class=" btn bg-red-500 text-xl" on:click={askDelete}>
						Supprimer
					</button>
				{/if}
			{/if}
		</div>
	</div>
</form>
