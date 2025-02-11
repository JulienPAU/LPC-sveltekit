<!-- src/lib/components/form/ArticleForm.svelte -->

<script lang="ts">
	export let isEditing = false;
	export let article = {
		title: '',
		article_type: '',
		introduction: '',
		body: '',
		ending: '',
		images: [],
		category: { type: '' },
		ArticleWatches: [
			{
				article_id: 0,
				watch_id: 0,
				watch: {
					id: 0,
					brand: '',
					model: '',
					movement: null,
					water_resistance: null,
					straps: [{ strap: { material: '' } }]
				}
			}
		]
	};

	const watches = article.ArticleWatches?.[0]?.watch || {
		id: 0,
		brand: '',
		model: '',
		movement: null,
		water_resistance: null,
		straps: [{ strap: { material: '' } }]
	};
	const straps = watches?.straps?.map((s) => s.strap.material) || [];

	export let onSubmit: (event: SubmitEvent) => void;
	export let onDelete: ((event: MouseEvent) => void) | null = null;

	export let isSubmitting = false;

	export let selectedStraps = new Set<string>();

	interface $$Events {
		strapsChange: string[];
	}

	export let onFilesSelected: ((files: File[]) => void) | null = null;

	let confirmDelete = false;

	function askDelete() {
		confirmDelete = true;
	}

	function cancelDelete() {
		confirmDelete = false;
	}

	let selectedCategory = article.category?.type || 'Choisir une catégorie';

	$: if (selectedCategory) {
		if (!article.category) {
			article.category = { type: selectedCategory };
		} else {
			article.category.type = selectedCategory;
		}
	}

	selectedStraps = new Set(straps);

	export let onStrapsChange: ((straps: string[]) => void) | null = null;

	$: {
		if (onStrapsChange) {
			onStrapsChange(Array.from(selectedStraps));
		}
	}

	function toggleStrap(strap: string) {
		// Met à jour le Set local
		if (selectedStraps.has(strap)) {
			selectedStraps.delete(strap);
		} else {
			selectedStraps.add(strap);
		}

		// Force la réactivité du Set
		selectedStraps = new Set(selectedStraps);

		// Récupère les bracelets existants
		let existingStraps = article.ArticleWatches[0].watch.straps || [];

		if (selectedStraps.has(strap)) {
			// Ajoute le nouveau bracelet s'il n'existe pas déjà
			if (!existingStraps.some((s) => s.strap.material === strap)) {
				existingStraps.push({ strap: { material: strap } });
			}
		} else {
			// Retire le bracelet décoché
			existingStraps = existingStraps.filter((s) => s.strap.material !== strap);
		}

		// Met à jour l'article
		article.ArticleWatches[0].watch.straps = existingStraps;

		if (onStrapsChange) {
			onStrapsChange(Array.from(selectedStraps));
		}
	}
</script>

<form
	on:submit={onSubmit}
	class="mx-auto mb-10 flex w-full flex-col justify-between gap-10 rounded-xl"
>
	<div class="flex w-full flex-wrap gap-10 md:flex-nowrap">
		<div class="w-full rounded-xl bg-gray-200 p-8">
			<div class="mb-5 flex flex-col gap-5 md:flex-row">
				<div class="w-full">
					<label for="category" class="mb-1 block text-lg font-bold text-gray-700">
						Catégorie de l'article</label
					>

					<select
						id="category"
						name="category"
						class="select select-warning w-full text-lg"
						bind:value={selectedCategory}
					>
						<option disabled selected>Choisir une catégorie</option>

						<option value="LUXURY">Montres de luxe</option>
						<option value="SMARTWATCH">Montres connectées</option>
						<option value="DIGITAL">Montres digitales</option>
						<option value="ANALOG">Montres analogiques</option>
						<option value="HYBRID">Montres hybrides</option>
						<option value="CHRONOGRAPH">Montres chronographe</option>
						<option value="OTHER">Autre catégorie</option>
					</select>
				</div>

				<div class="w-full">
					<label for="type" class="mb-1 block text-lg font-bold text-gray-700"
						>Type de l'article</label
					>
					<select
						id="type"
						name="type"
						class="select select-warning w-full text-lg"
						bind:value={article.article_type}
					>
						<option value="" disabled selected class="text-black">Choisir un type</option>

						<option value="ARTICLE">Article</option>
						<option value="REVIEW">Review</option>
						<option value="TECHNICAL">Technique</option>
						<option value="LEXIQUE">Lexique</option>
						<option value="GUIDE">Guide</option>
					</select>
				</div>
			</div>

			<div class="w-full">
				<label for="titre-article" class="mb-1 block text-lg font-bold text-gray-700">
					Titre de l'article
				</label>
				<input
					id="titre-article"
					name="titre-article"
					type="text"
					class="input input-bordered input-warning mb-5 w-full"
					bind:value={article.title}
				/>
			</div>

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
		</div>

		<div class=" w-full rounded-xl bg-gray-200 p-8">
			<div class="mb-5 flex flex-col gap-5 md:flex-row">
				<div class="w-full">
					<label for="brand" class="mb-1 block text-lg font-bold text-gray-700">
						Marque de la montre
					</label>
					<input
						id="brand"
						name="brand"
						type="text"
						class="input input-bordered input-warning mb-5 w-full"
						bind:value={watches.brand}
					/>
				</div>
				<div class="w-full">
					<label for="model" class="mb-1 block text-lg font-bold text-gray-700">
						Modèle de la montre
					</label>
					<input
						id="model"
						name="model"
						type="text"
						class="input input-bordered input-warning mb-5 w-full"
						bind:value={watches.model}
					/>
				</div>
			</div>

			<div class="mb-5 flex flex-col gap-5 md:flex-row">
				<div class="w-full">
					<label for="movement" class="mb-1 block text-lg font-bold text-gray-700">Mouvement</label>
					<select
						id="movement"
						name="movement"
						class="select select-warning w-full text-lg"
						bind:value={watches.movement}
					>
						<option value="" disabled selected class="text-black">Choix du mouvement</option>

						<option value="QUARTZ">Quartz</option>
						<option value="MECHANICAL">Mécanique</option>
						<option value="AUTOMATIC">Automatique</option>
						<option value="DIGITAL">Digitale</option>
						<option value="ANADIGIT">Analogue-Digital</option>
						<option value="KINETIC">Kinetic</option>
						<option value="Solar">Solaire</option>
						<option value="Other">Autre</option>
					</select>
				</div>
				<div class="w-full">
					<label for="water_resistance" class="mb-1 block text-lg font-bold text-gray-700"
						>Etanchéité</label
					>
					<select
						id="water_resistance"
						name="water_resistance"
						class="select select-warning w-full text-lg"
						bind:value={watches.water_resistance}
					>
						<option value="" disabled selected class="text-black">Choix de l'étanchéité</option>

						<option value="3 Bar">3 Bar</option>
						<option value="5 Bar">5 Bar</option>
						<option value="10 Bar">10 Bar</option>
						<option value="15 Bar">15 Bar</option>
						<option value="20 Bar">20 Bar</option>
						<option value="30 Bar">30 Bar</option>
						<option value="100 Bar">100 Bar</option>
						<option value="Other">Autre</option>
					</select>
				</div>
			</div>

			<div class="w-full">
				<label for="straps" class="mb-1 block text-lg font-bold text-gray-700">
					Type de bracelet
				</label>

				<div
					id="straps"
					class="mb-5 flex w-full flex-wrap justify-normal gap-2 lg:justify-between lg:gap-4"
				>
					{#each ['Acier', 'Cuir', 'Tissu', 'Nato', 'Métal', 'Nylon', 'Or', 'Titane', 'Céramique', 'Silicone', 'Résine', 'Plastique', 'Caoutchouc', 'Composite', 'Autre'] as strap}
						<label
							class="flex cursor-pointer items-center gap-2 rounded-lg border border-yellow-400 bg-warning px-3 py-1"
						>
							<input
								type="checkbox"
								name="straps"
								value={strap}
								checked={selectedStraps.has(strap)}
								on:change={() => toggleStrap(strap)}
								class="form-checkbox h-5 w-5 text-slate-500"
								disabled={!article.ArticleWatches?.[0]?.watch}
							/>
							<span class="text-lg text-gray-900">{strap}</span>
						</label>
					{/each}
				</div>
			</div>

			{#if isEditing}
				<div class="mb-5 w-full">
					<label for="upload-files" class="mb-1 block text-lg font-bold text-gray-700">
						Modifier les photos de l'article
					</label>
					<slot name="imageUploader" />
				</div>
				<div class="mb-20">
					<label for="img" class="mb-1 block text-lg font-bold text-gray-700">Photos</label>
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
		</div>
	</div>

	<div class="flex-col">
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
								class="btn bg-[#C41E3A] text-xl text-white hover:bg-[#D22B2B]"
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
					<button
						type="button"
						class=" btn bg-[#C41E3A] text-xl text-white hover:bg-[#D22B2B]"
						on:click={askDelete}
					>
						Supprimer
					</button>
				{/if}
			{/if}
		</div>
	</div>
</form>
