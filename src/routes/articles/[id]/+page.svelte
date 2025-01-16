<!-- src/routes/articles/[id]/+page.svelte -->
<script lang="ts">
	import Glycine from '$lib/assets/watches/Glycine.png';

	export let data;
	export let { article } = data;
	console.log('data reçue:', article); // Pour debug
</script>

{#if article}
	<h1>{article.title}</h1>
	<p>{article.content}</p>
	<img src={Glycine} alt="" />
	<p>{article.publish_date}</p>
{:else}
	<p>L'article est introuvable ou une erreur s'est produite.</p>
{/if}
