<script lang="ts">
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	export let data;
	const { articles } = data;

	let activeLetter: string | null = null;
	let activeBrandIndex: number | null = null;

	// Fonction pour normaliser les caractères (enlever les accents)
	const normalizeChar = (char: string) => {
		return char.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	};

	// Créer un objet groupé par première lettre à partir des marques
	const groupedBrands = articles.reduce((acc: Record<string, any[]>, article: any) => {
		article.ArticleWatches.forEach((watch: any) => {
			const brand = watch.watch.brand.trim();
			const firstLetter = brand.charAt(0).toUpperCase();
			if (!acc[firstLetter]) {
				acc[firstLetter] = [];
			}
			if (!acc[firstLetter].some((entry: any) => entry.brand === brand)) {
				acc[firstLetter].push({
					brand,
					articles: []
				});
			}
		});
		return acc;
	}, {});

	// Ajouter les articles à chaque marque
	articles.forEach((article: any) => {
		article.ArticleWatches.forEach((watch: any) => {
			const brand = watch.watch.brand.trim();
			const firstLetter = brand.charAt(0).toUpperCase();
			const brandEntry = groupedBrands[firstLetter].find((entry: any) => entry.brand === brand);
			if (brandEntry) {
				brandEntry.articles.push(article);
			}
		});
	});

	// Tri personnalisé pour les lettres avec accents
	const sortedLetters = Object.keys(groupedBrands).sort((a, b) => {
		return normalizeChar(a).localeCompare(normalizeChar(b), 'fr');
	});

	const selectLetter = (letter: string) => {
		activeLetter = activeLetter === letter ? null : letter;
		activeBrandIndex = null;
	};

	const toggleBrandPanel = (index: number) => {
		activeBrandIndex = activeBrandIndex === index ? null : index;
	};
</script>

<!-- Affichage des lettres -->
<div class="flex flex-col items-center">
	<SectionTitle title="Toutes les Marques" />

	<div
		class="mb-10 flex w-full flex-row flex-wrap justify-center gap-2 border-y bg-slate-900 p-4 text-white lg:w-1/2 lg:rounded-lg"
	>
		{#each sortedLetters as letter}
			<button
				class="rounded-lg p-2 text-xl font-bold hover:bg-slate-700 hover:text-yellow-500 lg:p-4 {activeLetter ===
				letter
					? ' bg-slate-700 '
					: ''}"
				on:click={() => selectLetter(letter)}
			>
				{letter}
			</button>
		{/each}
	</div>
	<p class=" mb-5 w-full p-4 text-center font-semibold lg:mb-10 lg:w-4/5 lg:text-2xl">
		Retrouvez toutes les marques de montres présentes dans les articles du site.
	</p>
</div>

<!-- Affichage des marques et articles -->
<div class="w-full p-4">
	<div class="p-5 lg:p-10">
		{#if activeLetter}
			<h2 class="text-3xl font-bold">{activeLetter}</h2>
			<div class="">
				{#each groupedBrands[activeLetter] as { brand, articles }, index}
					<div class="mb-4 rounded-lg bg-slate-800 p-4 text-white">
						<a
							href={`/articles/brand/${brand.toLowerCase()}`}
							class="flex w-full items-center justify-between text-left text-2xl font-medium"
						>
							<span>{brand}</span>
						</a>
						{#if activeBrandIndex === index}
							<div class="mt-2 break-words p-4 text-lg font-semibold text-white">
								{#each articles as article}
									<div>
										<strong>{article.title}</strong>
										<p>{article.introduction}</p>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
