<script>
	import { page } from '$app/state';
	import Error403 from '$lib/components/error403.svelte';
	import Error404 from '$lib/components/error404.svelte';
	import Error500 from '$lib/components/error500.svelte';
</script>

{#if page.status === 404}
	<Error404 />
{:else if page.status === 403}
	<Error403 />
{:else if page.status === 500}
	<Error500 />
{/if}
