<script lang="ts">
	import { truncateText } from '$lib/utils';

	export let props = {
		title: '',
		introduction: '',
		imageUrl: 'https://via.placeholder.com/150',
		author: 'Auteur inconnu',
		category: 'Catégorie inconnue',
		id: 0
	};
</script>

<div
	class="xl:w3/5 tranform card w-96 bg-base-100 shadow-xl transition duration-500 hover:scale-105 sm:w-4/5 md:w-96 lg:w-2/6"
>
	<figure>
		<img src={props.imageUrl || 'https://via.placeholder.com/150'} alt={props.title || 'Image'} />
	</figure>
	<div class="card-body">
		<h2 class="card-title font-light">{props.title}</h2>
		<p class="mb-5 text-sm leading-3">
			Par <span class="font-bold"> {props.author || 'Auteur inconnu'}</span> dans
			<span class="italic"> {props.category || 'Catégorie inconnue'}</span>
		</p>
		<div class="mb-5">{truncateText(props.introduction, 140) || 'Contenu indisponible'}</div>
		<div class="card-actions justify-end">
			<a href="/articles/{props.id}" class="before:content[''] before:absolute before:inset-0">
				<!-- <button
					class="btn bg-yellow-500 text-xl hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
					>+</button
				> -->
			</a>
		</div>
	</div>
</div>
