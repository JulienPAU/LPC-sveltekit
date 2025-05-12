<script>
	export let title = '';
	export let level = 1;
</script>

{#if level === 1}
	<h1 class="m-5 overflow-hidden hyphens-auto break-words text-center lg:m-10" lang="fr">
		{title}
	</h1>
{:else if level === 2}
	<h2 class="m-5 overflow-hidden hyphens-auto break-words text-center lg:m-10" lang="fr">
		{title}
	</h2>
{:else if level === 3}
	<h3 class="m-5 overflow-hidden hyphens-auto break-words text-center lg:m-10" lang="fr">
		{title}
	</h3>
{/if}
