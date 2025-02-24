<!-- src/lib/components/WatchDetails.svelte -->
<script lang="ts">
	import { getWatchCaseMaterial } from '$lib/utils';
	import { onMount } from 'svelte';

	export let article: any;

	let mounted = false;
	let hoveredSpec: string | null = null;

	// Vérification plus sécurisée des données
	let watchData = article?.ArticleWatches?.[0]?.watch || null;

	// Formatter pour le type de mouvement (enlever les underscores et mettre en minuscule)
	const formatMovement = (movement: string) => {
		if (!movement) return null;
		return movement
			.toLowerCase()
			.replace(/_/g, ' ')
			.replace(/\b\w/g, (char) => char.toUpperCase());
	};

	// Préparer les bracelets en une seule chaîne avec vérification de nullité
	const formatStraps = (straps: any[] | null | undefined) => {
		if (!straps || !Array.isArray(straps) || straps.length === 0) return null;
		return straps
			.filter((s) => s?.strap?.material) // Filtrer les entrées nulles ou invalides
			.map((s) => s.strap.material)
			.join(', ');
	};

	// Vérifier si on a des données à afficher
	$: hasAnyData =
		watchData &&
		(watchData.brand ||
			watchData.model ||
			watchData.movement ||
			watchData.water_resistance ||
			watchData.case_material ||
			(watchData.straps && watchData.straps.length > 0));

	onMount(() => {
		mounted = true;
	});
</script>

{#if hasAnyData}
	<div class="specs-container mb-10 px-0 md:px-4 lg:px-8">
		<div
			class="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-8"
		>
			<div class="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl"></div>
			<div
				class="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl"
			></div>

			<h3 class="relative mb-8 text-2xl text-white">Caractéristiques Techniques</h3>

			<div class="relative grid grid-cols-1 gap-6 md:grid-cols-2">
				{#if watchData?.brand}
					<div
						class="transform-gpu transition-all duration-300"
						role="presentation"
						class:translate-y-[-5px]={hoveredSpec === 'brand'}
						on:mouseenter={() => (hoveredSpec = 'brand')}
						on:mouseleave={() => (hoveredSpec = null)}
						style="opacity: {mounted ? 1 : 0}; transform: translateY({mounted ? 0 : '20px'});"
					>
						<div class="group relative overflow-hidden rounded-lg bg-white/10 p-6 backdrop-blur-lg">
							<div
								class="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 transition-opacity group-hover:opacity-100"
							></div>
							<div class="relative">
								<h4 class="text-md font-medium text-white">Marque</h4>
								<p class="mt-2 pl-4 text-xl font-bold text-white">{watchData.brand}</p>
							</div>
						</div>
					</div>
				{/if}

				{#if watchData?.model}
					<div
						class="transform-gpu transition-all duration-300"
						role="presentation"
						class:translate-y-[-5px]={hoveredSpec === 'model'}
						on:mouseenter={() => (hoveredSpec = 'model')}
						on:mouseleave={() => (hoveredSpec = null)}
						style="opacity: {mounted ? 1 : 0}; transform: translateY({mounted ? 0 : '20px'});"
					>
						<div class="group relative overflow-hidden rounded-lg bg-white/10 p-6 backdrop-blur-lg">
							<div
								class="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 transition-opacity group-hover:opacity-100"
							></div>
							<div class="relative">
								<h4 class="text-md font-medium text-white">Modèle</h4>
								<p class="mt-2 pl-4 text-xl font-bold text-white">{watchData.model}</p>
							</div>
						</div>
					</div>
				{/if}

				{#if watchData?.movement}
					<div
						class="transform-gpu transition-all duration-300"
						role="presentation"
						class:translate-y-[-5px]={hoveredSpec === 'movement'}
						on:mouseenter={() => (hoveredSpec = 'movement')}
						on:mouseleave={() => (hoveredSpec = null)}
						style="opacity: {mounted ? 1 : 0}; transform: translateY({mounted ? 0 : '20px'});"
					>
						<div class="group relative overflow-hidden rounded-lg bg-white/10 p-6 backdrop-blur-lg">
							<div
								class="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 transition-opacity group-hover:opacity-100"
							></div>
							<div class="relative">
								<h4 class="text-md font-medium text-white">Mouvement</h4>
								<p class="mt-2 pl-4 text-xl font-bold text-white">
									{formatMovement(watchData.movement)}
								</p>
							</div>
						</div>
					</div>
				{/if}

				{#if watchData?.water_resistance}
					<div
						class="transform-gpu transition-all duration-300"
						role="presentation"
						class:translate-y-[-5px]={hoveredSpec === 'water_resistance'}
						on:mouseenter={() => (hoveredSpec = 'water_resistance')}
						on:mouseleave={() => (hoveredSpec = null)}
						style="opacity: {mounted ? 1 : 0}; transform: translateY({mounted ? 0 : '20px'});"
					>
						<div class="group relative overflow-hidden rounded-lg bg-white/10 p-6 backdrop-blur-lg">
							<div
								class="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 transition-opacity group-hover:opacity-100"
							></div>
							<div class="relative">
								<h4 class="text-md font-medium text-white">Étanchéité</h4>
								<p class="mt-2 pl-4 text-xl font-bold text-white">{watchData.water_resistance}</p>
							</div>
						</div>
					</div>
				{/if}

				{#if watchData?.case_material}
					<div
						class="transform-gpu transition-all duration-300"
						role="presentation"
						class:translate-y-[-5px]={hoveredSpec === 'case_material'}
						on:mouseenter={() => (hoveredSpec = 'case_material')}
						on:mouseleave={() => (hoveredSpec = null)}
						style="opacity: {mounted ? 1 : 0}; transform: translateY({mounted ? 0 : '20px'});"
					>
						<div class="group relative overflow-hidden rounded-lg bg-white/10 p-6 backdrop-blur-lg">
							<div
								class="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 transition-opacity group-hover:opacity-100"
							></div>
							<div class="relative">
								<h4 class="text-md font-medium text-white">Matériaux du boitier</h4>
								<p class="mt-2 pl-4 text-xl font-bold text-white">
									{getWatchCaseMaterial(watchData.case_material)}
								</p>
							</div>
						</div>
					</div>
				{/if}

				{#if watchData?.straps && watchData.straps.length > 0}
					{#if formatStraps(watchData.straps)}
						<div
							class="transform-gpu transition-all duration-300"
							role="presentation"
							class:translate-y-[-5px]={hoveredSpec === 'straps'}
							on:mouseenter={() => (hoveredSpec = 'straps')}
							on:mouseleave={() => (hoveredSpec = null)}
							style="opacity: {mounted ? 1 : 0}; transform: translateY({mounted ? 0 : '20px'});"
						>
							<div
								class="group relative overflow-hidden rounded-lg bg-white/10 p-6 backdrop-blur-lg"
							>
								<div
									class="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 transition-opacity group-hover:opacity-100"
								></div>
								<div class="relative">
									<h4 class="text-md font-medium text-white">Types de bracelet</h4>
									<p class="mt-2 pl-4 text-xl font-bold text-white">
										{formatStraps(watchData.straps)}
									</p>
								</div>
							</div>
						</div>
					{/if}
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.specs-container {
		perspective: 1000px;
	}
</style>
