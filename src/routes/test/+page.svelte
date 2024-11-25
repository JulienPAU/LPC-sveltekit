<script lang="ts">
	export let data;
	const { articles } = data;
</script>

<h1>test</h1>
{#each articles as article}
	<article>
		<h2>{article.title}</h2>
		<p>Par {article.user.last_name} dans {article.category.name}</p>
		<div>{article.content}</div>
	</article>
{/each}
