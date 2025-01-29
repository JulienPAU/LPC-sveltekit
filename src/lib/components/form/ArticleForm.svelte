<!-- src/lib/components/form/ArticleForm.svelte -->

<script lang="ts">
	export let isEditing = false; // Pour différencier mode édition vs création
	export let article = {
		title: '',
		article_type: '',
		introduction: '',
		body: '',
		ending: '',
		images: []
	};
	export let onSubmit: (event: SubmitEvent) => void;
	export let isSubmitting = false;

	// Prop optionnelle pour la fonction de gestion des fichiers
	export let onFilesSelected: ((files: File[]) => void) | null = null;
</script>

src/

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
					<option disabled selected>Choisir un type</option>
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
			<div class="w-full">
				<label for="upload-files" class="mb-1 block text-lg font-bold text-gray-700">
					Télécharger des fichiers
				</label>
				<slot name="imageUploader" />
			</div>
			<div>
				<label for="img" class="mb-1 block text-lg font-bold text-gray-700">Images</label>
				<div class="l flex flex-wrap gap-5">
					{#each article.images as image}
						<img src={image} alt="l'article" class="image-item h-48 w-auto" />
					{/each}
				</div>
			</div>
		{:else if onFilesSelected}
			<div class="w-full">
				<label for="upload-files" class="mb-1 block text-lg font-bold text-gray-700">
					Télécharger des fichiers
				</label>
				<slot name="imageUploader" />
			</div>
		{/if}

		<button type="submit" class="btn btn-warning mt-20 text-xl" disabled={isSubmitting}>
			{isSubmitting ? 'En cours...' : 'Valider'}
		</button>
	</div>
</form>
