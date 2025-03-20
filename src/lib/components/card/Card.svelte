<script lang="ts">
	import type { CardProps } from '$lib/types/card';

	import {
		formatDate,
		generateArticleUrl,
		getArticleType,
		getCategory,
		truncateText
	} from '$lib/utils';

	import DOMPurify from 'dompurify';
	import { onMount } from 'svelte';

	let sanitize = (input: string) => input;

	onMount(() => {
		sanitize = DOMPurify.sanitize;
	});

	export let props: CardProps = {
		title: '',
		introduction: '',
		imageUrl: '/LPC_FAV_BLT.png',
		author: 'Auteur inconnu',
		article_type: 'Type inconnue',
		category: 'Catégorie inconnue',
		publish_date: '',
		submit_date: '',
		id: 0,
		style: '',
		isDashboard: false,
		isModerator: false,
		isAdmin: false,
		status: 'PUBLISHED',
		imgStyle: '',
		carouselClasses: false
	};
</script>

<div class={`group relative overflow-hidden ${props.style}`}>
	<figure class="group relative max-h-96 overflow-hidden">
		<img
			src={props.imageUrl || '/LPC_FAV_BLT.png'}
			alt={props.title || 'Image'}
			class={`${props.imgStyle} w-full max-w-full ${!props.imageUrl ? 'object-contain' : 'object-cover'}`}
		/>
		<div
			class="absolute inset-0 bg-black bg-opacity-20 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
		></div>

		{#if props.isDashboard || props.isModerator || props.isAdmin}
			<div
				class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg bg-warning p-2 font-bold opacity-0 transition-opacity duration-500 group-hover:opacity-100"
			>
				Modifier
			</div>
		{:else}
			<div
				class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg bg-warning p-2 font-bold opacity-0 transition-opacity duration-500 group-hover:opacity-100"
			>
				Lire l'article
			</div>
		{/if}
	</figure>

	<div class="{props.carouselClasses ? 'card-body px-4  py-5 lg:px-5' : 'card-body p-5'}   ">
		<h2
			class="card-title overflow-hidden hyphens-auto font-light"
			lang="fr"
			style="hyphens: auto; word-break: break-word;"
		>
			{props.title}
		</h2>
		{#if props.isDashboard || props.isModerator || props.isAdmin}
			{null}

			{#if props.isModerator}
				<p class=" text-sm font-bold leading-3">
					Soumis le {formatDate(props.submit_date)}
				</p>
			{/if}

			{#if props.isAdmin}
				<p class=" text-sm leading-3">
					Par <span class="font-bold"> {props.author || 'Auteur inconnu'}</span>
				</p>

				{#if props.status === 'PUBLISHED'}
					<p class=" text-sm font-bold leading-3">
						Publié le {formatDate(props.publish_date)}
					</p>
					<p class=" text-sm font-bold leading-3">
						Soumis le {formatDate(props.submit_date)}
					</p>
				{:else if props.status === 'SUBMITTED'}
					<p class=" text-sm font-bold leading-3">
						Soumis le {formatDate(props.submit_date)}
					</p>
				{:else}
					<p class="mb-2 text-sm font-bold leading-3">Pas encore publié</p>
				{/if}
			{/if}
		{:else}
			<p class="mb-3 text-sm leading-3">
				<span class="italic"> {getArticleType(props.article_type) || 'Type inconnu'}</span>
				Par <span class="font-bold"> {props.author || 'Auteur inconnu'}</span> dans

				<span class="italic">
					{props.category && typeof props.category === 'object'
						? getCategory(props.category.name) || 'Catégorie inconnue'
						: 'Catégorie inconnue'}
				</span>
			</p>
			{#if props.introduction}
				<div class="">
					{@html truncateText(sanitize(props.introduction), 140) || 'Contenu indisponible'}
				</div>
			{/if}
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
				href={props.isDashboard
					? `/dashboard/articles/edit/${props.id}`
					: generateArticleUrl(props.id, props.title)}
				class="before:content[''] before:absolute before:inset-0"
				aria-label="Lire l'article"
			>
			</a>
		</div>
	</div>
</div>
