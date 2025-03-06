<!-- src/lib/components/WatchDetails.svelte -->
<script lang="ts">
	import { getWatchCaseMaterial } from '$lib/utils';

	export let article: any;

	// Vérification plus sécurisée des données
	let watchData = article?.ArticleWatches?.[0]?.watch || null;
	let isOpen = false; // État pour gérer l'ouverture/fermeture manuelle

	// Formatter pour le type de mouvement
	const formatMovement = (movement: string) => {
		if (!movement) return null;
		return movement
			.toLowerCase()
			.replace(/_/g, ' ')
			.replace(/\b\w/g, (char) => char.toUpperCase());
	};

	// Préparer les bracelets en une seule chaîne
	const formatStraps = (straps: any[] | null | undefined) => {
		if (!straps || !Array.isArray(straps) || straps.length === 0) return null;
		return straps
			.filter((s) => s?.strap?.material)
			.map((s) => s.strap.material)
			.join(', ');
	};

	// Fonction pour formater les valeurs ou afficher N/A
	const formatValue = (value: any) => {
		if (value === null || value === undefined || value === '') {
			return 'N/A';
		}
		return value;
	};

	// Gérer le clic sur le titre pour ouvrir/fermer
	const toggleDropdown = () => {
		isOpen = !isOpen;
	};

	// Vérifier si on a des données à afficher
	$: hasAnyData =
		watchData &&
		(watchData.brand ||
			watchData.model ||
			watchData.movement ||
			watchData.water_resistance ||
			watchData.case_material ||
			watchData.case_size ||
			watchData.thickness ||
			watchData.glass ||
			watchData.lug_width ||
			watchData.lug_to_lug ||
			watchData.price ||
			(watchData.straps && watchData.straps.length > 0));
</script>

{#if hasAnyData}
	<div class="mb-10 px-0 md:px-4 lg:px-8">
		<div class="overflow-hidden rounded-xl bg-slate-900">
			<button
				on:click={toggleDropdown}
				class="flex w-full items-center justify-between p-4 text-xl font-medium text-white focus:outline-none"
			>
				<h3>Caractéristiques Techniques</h3>
				<svg
					class="h-6 w-6 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			<!-- Contenu du dropdown -->
			{#if isOpen}
				<div class="bg-slate-900 p-4 text-white transition-all duration-300">
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						{#if watchData?.brand}
							<div class="flex flex-col rounded-lg bg-white/10 p-3">
								<span class="text-sm font-semibold">Marque</span>
								<span class="pl-2 text-lg font-bold">{watchData.brand}</span>
							</div>
						{/if}

						{#if watchData?.model}
							<div class="flex flex-col rounded-lg bg-white/10 p-3">
								<span class="text-sm font-semibold">Modèle</span>
								<span class="pl-2 text-lg font-bold">{watchData.model}</span>
							</div>
						{/if}

						{#if watchData?.movement}
							<div class="flex flex-col rounded-lg bg-white/10 p-3">
								<span class="text-sm font-semibold">Mouvement</span>
								<span class="pl-2 text-lg font-bold">{formatMovement(watchData.movement)}</span>
							</div>
						{/if}

						{#if watchData?.water_resistance !== undefined}
							<div class="flex flex-col rounded-lg bg-white/10 p-3">
								<span class="text-sm font-semibold">Étanchéité</span>
								<span class="pl-2 text-lg font-bold">{formatValue(watchData.water_resistance)}</span
								>
							</div>
						{/if}

						{#if watchData?.case_material !== undefined}
							<div class="flex flex-col rounded-lg bg-white/10 p-3">
								<span class="text-sm font-semibold">Matériaux du boitier</span>
								<span class="pl-2 text-lg font-bold">
									{watchData.case_material ? getWatchCaseMaterial(watchData.case_material) : 'N/A'}
								</span>
							</div>
						{/if}

						{#if watchData?.case_size !== undefined}
							<div class="flex flex-col rounded-lg bg-white/10 p-3">
								<span class="text-sm font-semibold">Diamètre du boitier (en mm)</span>
								<span class="pl-2 text-lg font-bold">{formatValue(watchData.case_size)} </span>
							</div>
						{/if}

						{#if watchData?.thickness !== undefined}
							<div class="flex flex-col rounded-lg bg-white/10 p-3">
								<span class="text-sm font-semibold">Épaisseur (en mm)</span>
								<span class="pl-2 text-lg font-bold">{formatValue(watchData.thickness)} </span>
							</div>
						{/if}

						{#if watchData?.glass !== undefined}
							<div class="flex flex-col rounded-lg bg-white/10 p-3">
								<span class="text-sm font-semibold">Verre</span>
								<span class="pl-2 text-lg font-bold">{formatValue(watchData.glass)}</span>
							</div>
						{/if}

						{#if watchData?.lug_width !== undefined}
							<div class="flex flex-col rounded-lg bg-white/10 p-3">
								<span class="text-sm font-semibold">Largeur d'entrecorne (en mm)</span>
								<span class="pl-2 text-lg font-bold">{formatValue(watchData.lug_width)} </span>
							</div>
						{/if}

						{#if watchData?.lug_to_lug !== undefined}
							<div class="flex flex-col rounded-lg bg-white/10 p-3">
								<span class="text-sm font-semibold">Lug to lug (en mm)</span>
								<span class="pl-2 text-lg font-bold">{formatValue(watchData.lug_to_lug)} </span>
							</div>
						{/if}

						{#if watchData?.straps && watchData.straps.length > 0 && formatStraps(watchData.straps)}
							<div class="flex flex-col rounded-lg bg-white/10 p-3">
								<span class="text-sm font-semibold">Types de bracelet</span>
								<span class="pl-2 text-lg font-bold">{formatStraps(watchData.straps)}</span>
							</div>
						{/if}
						{#if watchData?.price !== undefined}
							<div class="flex flex-col rounded-lg bg-white/10 p-3">
								<span class="text-sm font-semibold">Prix en €</span>
								<span class="pl-2 text-lg font-bold"
									>{watchData.price ? watchData.price : 'N/A'}</span
								>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
