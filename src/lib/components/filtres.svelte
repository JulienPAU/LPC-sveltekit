<script lang="ts">
	import { getArticleType, getCategory } from '$lib/utils';

	export let articles: any[];
	export let onFilterChange: (filteredArticles: any[]) => void;

	// État des filtres
	let articleType = '';
	let category = '';
	let brand = '';
	let sortBy = ''; // Pas de tri sélectionné au départ

	// Extraction des valeurs uniques pour les options de filtrage
	$: articleTypes = [...new Set(articles.map((article) => article.article_type))].filter(Boolean);
	$: categories = [...new Set(articles.map((article) => article.category?.name))].filter(Boolean);
	$: brands = [
		...new Set(
			articles.flatMap((article) =>
				article.ArticleWatches.map((aw: { watch?: { brand?: string } }) => aw.watch?.brand)
			)
		)
	].filter(Boolean);

	// Fonction de filtrage et tri réactive
	$: {
		const filtered = [...articles]
			.filter((article) => !articleType || article.article_type === articleType)
			.filter((article) => !category || article.category?.name === category)
			.filter(
				(article) =>
					!brand ||
					article.ArticleWatches.some(
						(aw: { watch?: { brand?: string } }) => aw.watch?.brand === brand
					)
			)
			.sort((a, b) => {
				if (sortBy === 'newest') {
					return b.id - a.id;
				}
				if (sortBy === 'oldest') {
					return a.id - b.id;
				}
				// Tri par ID décroissant par défaut
				return b.id - a.id;
			});

		onFilterChange(filtered);
	}

	// Réinitialiser les filtres
	function clearFilters() {
		articleType = '';
		category = '';
		brand = '';
		sortBy = ''; // Revient au tri par ID décroissant
	}
</script>

<div class="mb-8 w-full items-center rounded-lg bg-slate-900 p-4 shadow-sm">
	<div class="flex flex-wrap items-center justify-center gap-4 font-semibold lg:justify-between">
		<div class="flex flex-wrap gap-4">
			<!-- Type d'article -->
			<select bind:value={articleType} class="select select-bordered w-40">
				<option value="">Type d'article</option>
				{#each articleTypes as type}
					<option value={type}>{getArticleType(type)}</option>
				{/each}
			</select>

			<!-- Catégorie -->
			<select bind:value={category} class="select select-bordered w-40">
				<option value="">Catégorie</option>
				{#each categories as cat}
					<option value={cat}>{getCategory(cat)}</option>
				{/each}
			</select>

			<!-- Marque -->
			<select bind:value={brand} class="select select-bordered w-40">
				<option value="">Marque</option>
				{#each brands as b}
					<option value={b}>{b}</option>
				{/each}
			</select>

			<!-- Tri par date -->
			<select bind:value={sortBy} class="select select-bordered w-40">
				<option value="" disabled selected>Tri par défaut </option>
				<option value="newest">Plus récent</option>
				<option value="oldest">Plus ancien</option>
			</select>
		</div>

		<button
			on:click={clearFilters}
			class="btn bg-yellow-500 text-lg font-bold hover:bg-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
		>
			Réinitialiser
		</button>
	</div>
</div>
