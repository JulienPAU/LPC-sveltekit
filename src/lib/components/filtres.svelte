<!-- src/ lib/ components/ filtres. svelte -->

<script lang="ts">
	import { goto } from '$app/navigation';
	import { getArticleType, getCategory } from '$lib/utils';
	import { onMount } from 'svelte';

	export let articles: any[] = [];
	export let onFilterChange: (filteredArticles: any[]) => void;

	export let initialType = '';
	export let initialCategory = '';
	export let initialBrand = '';
	export let initialSort = '';

	articles = Array.isArray(articles) ? articles : [];

	let articleType = initialType;
	let category = initialCategory;
	let brand = initialBrand;
	let sortBy = initialSort;

	$: if (initialType !== undefined) articleType = initialType;
	$: if (initialCategory !== undefined) category = initialCategory;
	$: if (initialBrand !== undefined) brand = initialBrand;
	$: if (initialSort !== undefined) sortBy = initialSort;

	$: articleTypes = [...new Set(articles.map((article) => article.article_type))].filter(Boolean);

	$: categories = [...new Set(articles.map((article) => article.category?.name))].filter(Boolean);
	$: brands = [
		...new Set(
			articles.flatMap((article) =>
				article.ArticleWatches.map((aw: { watch?: { brand?: string } }) => aw.watch?.brand)
			)
		)
	].filter(Boolean);

	$: updateURL(articleType, category, brand, sortBy);

	function updateURL(type: string, cat: string, br: string, sort: string) {
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href);
			const currentParams = new URLSearchParams(url.search);

			// Conserver le paramètre 'from' s'il existe
			const fromParam = currentParams.get('from');

			// Réinitialiser les paramètres de recherche
			currentParams.delete('type');
			currentParams.delete('category');
			currentParams.delete('brand');
			currentParams.delete('sort');

			// Ajouter les nouveaux paramètres
			if (type) currentParams.set('type', type);
			if (cat) currentParams.set('category', cat);
			if (br) currentParams.set('brand', br);
			if (sort) currentParams.set('sort', sort);

			// Restaurer le paramètre 'from'
			if (fromParam) currentParams.set('from', fromParam);

			// Définir la nouvelle URL
			url.search = currentParams.toString();

			// Utiliser replaceState pour éviter d'ajouter à l'historique
			goto(url.toString(), {
				replaceState: true,
				keepFocus: true,
				noScroll: true
			});

			console.log('URL mise à jour:', url.toString());
		}
	}

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
				return b.id - a.id;
			});

		onFilterChange(filtered);
	}

	onMount(() => {
		// Appliquer le filtrage initial
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
				return b.id - a.id;
			});

		onFilterChange(filtered);
	});

	function clearFilters() {
		articleType = '';
		category = '';
		brand = '';
		sortBy = '';
	}
</script>

<div class=" items-center bg-slate-900 p-4 shadow-sm md:rounded-lg lg:rounded-lg">
	<div class="flex flex-wrap items-center justify-center gap-4 font-semibold lg:justify-between">
		<div class="flex flex-wrap justify-center gap-4">
			<!-- Type d'article -->
			<select bind:value={articleType} class="select select-bordered w-36 lg:w-48">
				<option value="">Type d'article</option>
				{#each articleTypes as type}
					<option value={type}>{getArticleType(type)}</option>
				{/each}
			</select>

			<!-- Catégorie -->
			<select bind:value={category} class="select select-bordered w-36 lg:w-48">
				<option value="">Catégorie</option>
				{#each categories as cat}
					<option value={cat}>{getCategory(cat)}</option>
				{/each}
			</select>

			<!-- Marque -->
			<select bind:value={brand} class="select select-bordered w-36 lg:w-48">
				<option value="">Marque</option>
				{#each brands as b}
					<option value={b}>{b}</option>
				{/each}
			</select>

			<!-- Tri par date -->
			<select bind:value={sortBy} class="select select-bordered w-36 lg:w-48">
				<option value="" disabled selected>Tri par défaut </option>
				<option value="newest">Plus récent</option>
				<option value="oldest">Plus ancien</option>
			</select>
		</div>

		<button
			on:click={clearFilters}
			class="btn border-none bg-yellow-500 text-lg font-bold hover:bg-yellow-400"
		>
			Réinitialiser
		</button>
	</div>
</div>
