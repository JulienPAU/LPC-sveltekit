<!-- src/lib/components/form/ArticleForm.svelte -->

<script lang="ts">
	import { articleTypeOptions } from '$lib/articleTypes';
	import { categoryOptions } from '$lib/categories';
	import QuillEditor from '../QuillEditor.svelte';

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
					case_size: '',
					lug_width: '',
					thickness: '',
					lug_to_lug: '',
					glass: '',
					price: '',
					case_material: null,
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
		case_material: null,
		case_size: '',
		lug_width: '',
		thickness: '',
		lug_to_lug: '',
		glass: '',
		price: '',
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
		if (selectedStraps.has(strap)) {
			selectedStraps.delete(strap);
		} else {
			selectedStraps.add(strap);
		}

		selectedStraps = new Set(selectedStraps);

		let existingStraps = article.ArticleWatches[0].watch.straps || [];

		if (selectedStraps.has(strap)) {
			if (!existingStraps.some((s) => s.strap.material === strap)) {
				existingStraps.push({ strap: { material: strap } });
			}
		} else {
			existingStraps = existingStraps.filter((s) => s.strap.material !== strap);
		}

		article.ArticleWatches[0].watch.straps = existingStraps;

		if (onStrapsChange) {
			onStrapsChange(Array.from(selectedStraps));
		}
	}

	const categoriesWithoutWatchRequirement = ['STRAPS', 'OTHER'];
	const articleTypesWithoutWatchRequirement = [
		'TUTORIAL',
		'GUIDE',
		'LEXIQUE',
		'INTERVIEW',
		'OTHER'
	];

	$: watchFieldsRequired =
		!categoriesWithoutWatchRequirement.includes(selectedCategory) &&
		!articleTypesWithoutWatchRequirement.includes(article.article_type);

	$: {
		if (
			categoriesWithoutWatchRequirement.includes(selectedCategory) ||
			articleTypesWithoutWatchRequirement.includes(article.article_type)
		) {
			watches.brand = watches.brand || 'N/A';
			watches.model = watches.model || 'N/A';
			watches.movement = watches.movement || null;
		}
	}

	export const ssr = false;
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
						Catégorie <span class="text-red-500">*</span>
					</label>

					<select
						id="category"
						name="category"
						class="select select-warning w-full text-lg"
						required={!isEditing}
						bind:value={selectedCategory}
					>
						<option disabled selected>Choisir une catégorie</option>

						{#each categoryOptions as { key, label }}
							<option value={key}>{label}</option>
						{/each}
					</select>
				</div>

				<div class="w-full">
					<label for="type" class="mb-1 block text-lg font-bold text-gray-700"
						>Type <span class="text-red-500">*</span>
					</label>
					<select
						id="type"
						name="type"
						class="select select-warning w-full text-lg"
						required={!isEditing}
						bind:value={article.article_type}
					>
						<option value="" disabled selected class="text-black">Choisir un type</option>

						{#each articleTypeOptions as { key, label }}
							<option value={key}>{label}</option>
						{/each}
					</select>
				</div>
			</div>
			<div class="w-full">
				<label for="titre-article" class="mb-1 block text-lg font-bold text-gray-700">
					Titre de l'article <span class="text-red-500">*</span>
				</label>
				<input
					id="titre-article"
					name="titre-article"
					type="text"
					class="input input-warning mb-5 w-full"
					required={!isEditing}
					bind:value={article.title}
				/>
			</div>

			<div>
				<label for="introduction" class="mb-1 block text-lg font-bold text-gray-700">
					Introduction de l'article <span class="text-red-500">*</span>
				</label>
				<QuillEditor name="introduction" bind:value={article.introduction} maxLength={1000} />
			</div>

			<div>
				<label for="corps-article" class="mb-1 block text-lg font-bold text-gray-700">
					Corps de l'article <span class="text-red-500">*</span>
				</label>
				<QuillEditor name="corps-article" bind:value={article.body} maxLength={10000} />
			</div>

			<div>
				<label for="end" class="mb-1 block text-lg font-bold text-gray-700">
					Le mot de la fin <span class="text-red-500">*</span>
				</label>
				<QuillEditor name="end" bind:value={article.ending} maxLength={1000} />
			</div>

			<div class=" text-sm">
				<span class="text-red-500">*</span> Champs obligatoires
			</div>
		</div>

		<div class="w-full rounded-xl bg-gray-200 p-8">
			<div
				class="mb-5 flex flex-col gap-5 md:flex-row"
				class:opacity-50={categoriesWithoutWatchRequirement.includes(selectedCategory) ||
					articleTypesWithoutWatchRequirement.includes(article.article_type)}
			>
				<div class="w-full">
					<label for="brand" class="mb-1 block text-lg font-bold text-gray-700">
						Marque <span class="text-red-500">{watchFieldsRequired ? '*' : ''}</span>
					</label>
					<input
						id="brand"
						name="brand"
						type="text"
						class="input input-bordered input-warning w-full"
						required={watchFieldsRequired}
						disabled={!watchFieldsRequired}
						bind:value={watches.brand}
					/>
				</div>
				<div class="w-full">
					<label for="model" class="mb-1 block text-lg font-bold text-gray-700">
						Modèle <span class="text-red-500">{watchFieldsRequired ? '*' : ''}</span>
					</label>
					<input
						id="model"
						name="model"
						type="text"
						class="input input-bordered input-warning w-full"
						required={watchFieldsRequired}
						disabled={!watchFieldsRequired}
						bind:value={watches.model}
					/>
				</div>
			</div>

			<div
				class="mb-5 flex flex-col gap-5 md:flex-row"
				class:opacity-50={categoriesWithoutWatchRequirement.includes(selectedCategory) ||
					articleTypesWithoutWatchRequirement.includes(article.article_type)}
			>
				<div class="w-full">
					<label for="movement" class="mb-1 block text-lg font-bold text-gray-700"
						>Mouvement <span class="text-red-500">{watchFieldsRequired ? '*' : ''}</span></label
					>
					<select
						id="movement"
						name="movement"
						class="select select-warning w-full text-lg"
						required={watchFieldsRequired}
						disabled={!watchFieldsRequired}
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
						<option value="OTHER">Autre</option>
					</select>
				</div>
				<div
					class="w-full"
					class:opacity-50={categoriesWithoutWatchRequirement.includes(selectedCategory) ||
						articleTypesWithoutWatchRequirement.includes(article.article_type)}
				>
					<label for="water_resistance" class="mb-1 block text-lg font-bold text-gray-700"
						>Etanchéité</label
					>
					<select
						id="water_resistance"
						name="water_resistance"
						class="select select-warning w-full text-lg"
						disabled={!watchFieldsRequired}
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
						<option value="OTHER">Autre</option>
					</select>
				</div>
			</div>
			<div
				class="mb-5 flex flex-col gap-5 md:flex-row"
				class:opacity-50={categoriesWithoutWatchRequirement.includes(selectedCategory) ||
					articleTypesWithoutWatchRequirement.includes(article.article_type)}
			>
				<div class="w-full">
					<label for="lug_width" class="mb-1 block text-lg font-bold text-gray-700">
						Entrecorne (en mm)
					</label>
					<input
						id="lug_width"
						name="lug_width"
						type="text"
						class="input input-bordered input-warning w-full"
						disabled={!watchFieldsRequired}
						bind:value={watches.lug_width}
					/>
				</div>
				<div class="w-full">
					<label for="lug_to_lug" class="mb-1 block text-lg font-bold text-gray-700">
						Lug to lug (en mm)
					</label>
					<input
						id="lug_to_lug"
						name="lug_to_lug"
						type="text"
						class="input input-bordered input-warning w-full"
						disabled={!watchFieldsRequired}
						bind:value={watches.lug_to_lug}
					/>
				</div>
				<div class="w-full">
					<label for="thickness" class="mb-1 block text-lg font-bold text-gray-700">
						Epaisseur (en mm)
					</label>
					<input
						id="thickness"
						name="thickness"
						type="text"
						class="input input-bordered input-warning w-full"
						disabled={!watchFieldsRequired}
						bind:value={watches.thickness}
					/>
				</div>
			</div>

			<div
				class="mb-5 flex flex-col gap-5 md:flex-row"
				class:opacity-50={categoriesWithoutWatchRequirement.includes(selectedCategory) ||
					articleTypesWithoutWatchRequirement.includes(article.article_type)}
			>
				<div class="w-full">
					<label for="price" class="mb-1 block text-lg font-bold text-gray-700"> Prix </label>
					<input
						id="price"
						name="price"
						type="text"
						class="input input-bordered input-warning w-full"
						disabled={!watchFieldsRequired}
						bind:value={watches.price}
					/>
				</div>
				<div class="w-full">
					<label for="glass" class="mb-1 block text-lg font-bold text-gray-700"> Verre </label>
					<input
						id="glass"
						name="glass"
						type="text"
						class="input input-bordered input-warning w-full"
						disabled={!watchFieldsRequired}
						bind:value={watches.glass}
					/>
				</div>
			</div>

			<div
				class="mb-5 flex flex-col gap-5 md:flex-row"
				class:opacity-50={categoriesWithoutWatchRequirement.includes(selectedCategory) ||
					articleTypesWithoutWatchRequirement.includes(article.article_type)}
			>
				<div class="w-full">
					<label for="case_size" class="mb-1 block text-lg font-bold text-gray-700">
						Taille boitier (en mm)
					</label>
					<input
						id="case_size"
						name="case_size"
						type="text"
						class="input input-bordered input-warning w-full"
						disabled={!watchFieldsRequired}
						bind:value={watches.case_size}
					/>
				</div>
				<div
					class="w-full"
					class:opacity-50={categoriesWithoutWatchRequirement.includes(selectedCategory) ||
						articleTypesWithoutWatchRequirement.includes(article.article_type)}
				>
					<label for="case_material" class="mb-1 block text-lg font-bold text-gray-700"
						>Matériaux du boitier</label
					>
					<select
						id="case_material"
						name="case_material"
						class="select select-warning w-full text-lg"
						disabled={!watchFieldsRequired}
						bind:value={watches.case_material}
					>
						<option value="" disabled selected class="text-black">Choix des matériaux</option>

						<option value="STAINLESS_STEEL_316L">Acier Inoxydable 316L</option>
						<option value="TITANIUM">Titane</option>
						<option value="GOLD">Or</option>
						<option value="GOLD_PLATED">Plaqué Or</option>
						<option value="PLATINUM">Platine</option>
						<option value="CERAMIC">Céramique</option>
						<option value="CARBON">Carbone</option>
						<option value="BRONZE">Bronze</option>
						<option value="PLASTIC">Plastique/Résine</option>
						<option value="ALUMINUM">Aluminium</option>
						<option value="PALLADIUM">Palladium</option>
						<option value="TUNGSTEN">Tungstène</option>
						<option value="SILVER">Argent</option>
						<option value="COPPER">Cuivre</option>
						<option value="MAGNESIUM">Magnésium</option>
						<option value="OTHER">Autre</option>
					</select>
				</div>
			</div>

			<div class="w-full">
				<label for="straps" class="mb-1 block text-lg font-bold text-gray-700">
					Type(s) de bracelet
				</label>

				<div
					id="straps"
					class="mb-5 grid w-full grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4"
				>
					{#each ['Acier', 'Cuir', 'Tissu', 'Nato', 'Métal', 'Nylon', 'Or', 'Titane', 'Céramique', 'Silicone', 'Résine', 'Plastique', 'Caoutchouc', 'Composite', 'Autre'] as strap}
						<label
							class="flex h-full cursor-pointer items-center gap-2 rounded-lg border border-yellow-400 bg-warning px-3 py-2"
						>							<input
								type="checkbox"
								name="straps"
								value={strap}
								checked={selectedStraps.has(strap)}
								on:change={() => toggleStrap(strap)}
								class="form-checkbox h-5 w-5 text-slate-500"
								disabled={!article.ArticleWatches?.[0]?.watch && selectedCategory !== 'STRAPS'}
							/>
							<span class="overflow-hidden truncate text-lg text-gray-900">
								{strap}
							</span>
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
						Télécharger des fichiers <span class="text-red-500">*</span>
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
								{isSubmitting ? 'En cours de suppression...' : 'Oui, supprimer'}
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
						disabled={isSubmitting}
					>
						Supprimer
					</button>
				{/if}
			{/if}
		</div>
	</div>
</form>
