<script lang="ts">
	import SectionTitle from '$lib/components/SectionTitle.svelte';

	let files: File[] = [];

	// Fonction pour gérer la sélection des fichiers
	function handleFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files) {
			files = Array.from(target.files); // Met à jour la liste des fichiers
		}
	}

	function formatFileSize(size: number): string {
		return (size / 1024).toFixed(2) + ' Ko'; // Convertit en kilooctets avec 2 décimales
	}
</script>

<!-- \src\routes\articles\publish\+page.svelte -->

<section class="flex flex-col items-center justify-evenly px-5 pb-5">
	<SectionTitle title="Proposer un article" />

	<form action="" class="mx-auto mb-10 w-full max-w-4xl rounded-xl bg-gray-200 p-10">
		<div class="mb-5 flex flex-col gap-5 md:flex-row">
			<div class="w-full">
				<label for="titre-article" class="mb-1 block text-lg font-bold text-gray-700">
					Titre de l'article
				</label>
				<input id="titre-article" type="text" class="input input-bordered input-warning w-full" />
			</div>

			<div class="w-full">
				<label for="categorie" class="mb-1 block text-lg font-bold text-gray-700">
					Catégorie
				</label>
				<select id="categorie" class="select select-warning w-full text-lg">
					<option disabled selected>Choisir une catégorie</option>
					<option>Article</option>
					<option>Review</option>
					<option>Technique</option>
					<option>Lexique</option>
					<option>Guide</option>
				</select>
			</div>
		</div>

		<div>
			<label for="introduction" class="mb-1 block text-lg font-bold text-gray-700">
				Introduction de l'article
			</label>
			<textarea id="introduction" class="textarea textarea-warning mb-5 h-32 w-full"></textarea>
		</div>

		<div>
			<label for="corps-article" class="mb-1 block text-lg font-bold text-gray-700">
				Corps de l'article
			</label>
			<textarea id="corps-article" class="textarea textarea-warning mb-5 h-72 w-full"></textarea>
		</div>

		<div>
			<label for="end" class="mb-1 block text-lg font-bold text-gray-700"> Le mot de la fin </label>
			<textarea id="end" class="textarea textarea-warning mb-5 h-32 w-full"></textarea>
		</div>

		<div class="flex-col">
			<div class="w-full">
				<label for="upload-files" class="mb-1 block text-lg font-bold text-gray-700">
					Télécharger des fichiers
				</label>
				<input
					id="upload-files"
					type="file"
					multiple
					class="file-input file-input-bordered file-input-warning w-full md:w-1/2 lg:w-1/2"
					on:change={handleFileUpload}
				/>
			</div>

			{#if files.length > 0}
				<ul class="mt-3 text-sm text-gray-700">
					{#each files as file}
						<li>
							{file.name} - {formatFileSize(file.size)}
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</form>

	<button class="btn btn-warning text-xl">Valider</button>
</section>
