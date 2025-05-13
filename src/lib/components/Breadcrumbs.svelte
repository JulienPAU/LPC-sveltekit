<script lang="ts">
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { getTitleFromSlug } from '$lib/utils';

	type Segment = {
		name: string;
		href: string;
	};

	const hiddenPrefixes = ['/auth', '/dashboard'];

	let segments: Segment[] = [];

	const updateBreadcrumbs = () => {
		const path = page.url.pathname;

		const isHidden = hiddenPrefixes.some((prefix) => path.startsWith(prefix));

		if (!isHidden) {
			const pathSegments = path.split('/').filter(Boolean);

			segments = [
				{ name: 'Accueil', href: '/' },
				...pathSegments.map((segment, index) => {
					if (pathSegments[0] === 'articles' && index > 0 && segment.match(/^\d+-/)) {
						return {
							name: getTitleFromSlug(segment),
							href: '/' + pathSegments.slice(0, index + 1).join('/')
						};
					}

					return {
						name: decodeURIComponent(segment.charAt(0).toUpperCase() + segment.slice(1)),
						href: '/' + pathSegments.slice(0, index + 1).join('/')
					};
				})
			];
		} else {
			segments = [];
		}
	};

	updateBreadcrumbs();

	afterNavigate(() => {
		updateBreadcrumbs();
	});
</script>

{#if segments.length > 1}
	<nav aria-label="Fil d'Ariane" class="mt-4 hidden md:flex">
		<ol class="flex overflow-hidden rounded-lg border border-gray-200 text-black">
			{#each segments as segment, index}
				<li class="relative flex items-center">
					{#if index === 0}
						<a
							href={segment.href}
							class="flex h-10 items-center gap-1.5 bg-gray-100 px-4 text-black transition hover:text-slate-700"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="size-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
								/>
							</svg>
							<span class="ms-1.5 text-xs font-medium">{segment.name}</span>
						</a>
					{:else}
						<span
							class="absolute inset-y-0 -start-px h-10 w-4 bg-gray-100 [clip-path:_polygon(0_0,_0%_100%,_100%_50%)]"
						></span>
						<a
							href={segment.href}
							class="flex h-10 items-center bg-white pe-4 ps-8 text-xs font-medium text-black transition hover:text-slate-700"
						>
							{segment.name}
						</a>
					{/if}
				</li>
			{/each}
		</ol>
	</nav>
{/if}
