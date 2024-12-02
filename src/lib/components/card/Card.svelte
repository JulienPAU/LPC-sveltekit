<script>
	import { truncateText } from '$lib/utils';

	export let props = {
		title: '',
		content: '',
		imageUrl: 'https://via.placeholder.com/150',
		author: 'Auteur inconnu',
		category: 'Catégorie inconnue'
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
		<p class="mb-5 italic leading-3">
			Par {props.author || 'Auteur inconnu'} dans {props.category || 'Catégorie inconnue'}
		</p>
		<div class="mb-5">{truncateText(props.content, 140) || 'Contenu indisponible'}</div>
		<div class="card-actions justify-end">
			<a href="articles" class="before:content[''] before:absolute before:inset-0">
				<!-- <button
					class="btn bg-yellow-500 text-xl hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
					>+</button
				> -->
			</a>
		</div>
	</div>
</div>
