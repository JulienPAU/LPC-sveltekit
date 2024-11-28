<script lang="ts">
	export let title: string;
	export let content: string;
	export let imageUrl: string;
	export let author: string;
	export let category: string;
</script>

<div class="card w-96 bg-base-100 shadow-xl sm:w-4/5 xl:w-96">
	<figure>
		<img src={imageUrl} alt={title} />
	</figure>
	<div class="card-body">
		<h3 class="card-title">{title}</h3>
		<p>Par {author} dans {category}</p>
		<div>{content}</div>
		<div class="card-actions justify-end">
			<button class="btn btn-primary">Lire plus</button>
		</div>
	</div>
</div>
