<script lang="ts">
	import { formatDate, truncateText } from '$lib/utils';

	export let props = {
		title: '',
		introduction: '',
		imageUrl: '/LPC_FAV_BLT.png',
		author: 'Auteur inconnu',
		category: 'Catégorie inconnue',
		publish_date: '',
		submit_date: '',
		id: 0,
		style: '',
		isDashboard: false,
		isModerator: false,
		isAdmin: false,
		status: 'PUBLISHED',
		imgStyle: ''
	};
</script>

<div class={props.style}>
	<figure class="max-h-96 overflow-hidden">
		<img
			src={props.imageUrl || '/LPC_FAV_BLT.png'}
			alt={props.title || 'Image'}
			class="{props.imgStyle} w-full max-w-full object-cover"
		/>
	</figure>

	<div class="card-body">
		<h2 class="card-title font-light">{props.title}</h2>

		{#if props.isDashboard || props.isModerator || props.isAdmin}
			{null}

			{#if props.isModerator}
				<p class="mb-2 text-sm font-bold leading-3">
					Soumis le {formatDate(props.submit_date)}
				</p>
			{/if}

			{#if props.isAdmin}
				<p class="mb-3 text-sm leading-3">
					Par <span class="font-bold"> {props.author || 'Auteur inconnu'}</span>
				</p>

				{#if props.status === 'PUBLISHED'}
					<p class="mb-2 text-sm font-bold leading-3">
						Publié le {formatDate(props.publish_date)}
					</p>
					<p class="mb-2 text-sm font-bold leading-3">
						Soumis le {formatDate(props.submit_date)}
					</p>
				{:else if props.status === 'SUBMITTED'}
					<p class="mb-2 text-sm font-bold leading-3">
						Soumis le {formatDate(props.submit_date)}
					</p>
				{:else}
					<p class="mb-2 text-sm font-bold leading-3">Pas encore publié</p>
				{/if}
			{/if}
		{:else}
			<p class="mb-5 text-sm leading-3">
				Par <span class="font-bold"> {props.author || 'Auteur inconnu'}</span> dans
				<span class="italic"> {props.category || 'Catégorie inconnue'}</span>
			</p>
			<div class="mb-5">{truncateText(props.introduction, 140) || 'Contenu indisponible'}</div>
		{/if}

		{#if props.isDashboard || props.isModerator || props.isAdmin}
			<div
				class="absolute right-2 top-2 rounded px-2 py-1 font-semibold
			{props.status === 'PUBLISHED' ? 'rounded-lg bg-green-500 text-white' : ''}
			{props.status === 'SUBMITTED' ? 'rounded-lg bg-orange-500 text-white' : ''}
			{props.status === 'REFUSED' ? 'rounded-lg bg-red-500 text-white' : ''}"
			>
				{#if props.status === 'PUBLISHED'}
					✔️ Publié
				{:else if props.status === 'SUBMITTED'}
					⏳ En attente
				{:else}
					📝 Refusé
				{/if}
			</div>
		{/if}

		<div class="card-actions justify-end">
			<a
				href={props.isDashboard ? `/dashboard/articles/edit/${props.id}` : `/articles/${props.id}`}
				class="before:content[''] before:absolute before:inset-0"
				aria-label="Lire l'article"
			>
			</a>
		</div>
	</div>
</div>
