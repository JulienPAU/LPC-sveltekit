<script lang="ts">
	export let containerClass = ''; // style par défaut si rien n'est passé
	export let imageClass = ''; // style par défaut si rien n'est passé
	export let type: 'images' | 'articles' = 'articles';
</script>

<div
	class={type === 'images'
		? 'carousel-item mx-auto w-[253px] flex-shrink-0 snap-center'
		: `${containerClass} flex w-full gap-4`}
>
	<div
		class={type === 'images' ? 'skeleton h-[250px] w-full' : `skeleton w-full ${imageClass}`}
	></div>

	{#if type === 'articles'}
		<div class="skeleton h-4 w-28"></div>
		<div class="skeleton h-4 w-full"></div>
		<div class="skeleton h-4 w-full"></div>
	{/if}
</div>
