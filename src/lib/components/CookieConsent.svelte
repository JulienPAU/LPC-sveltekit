<script lang="ts">
	import { onMount } from 'svelte';
	import { cookieConsent } from '$lib/stores/cookieConsent';

	let showBanner = false;

	onMount(() => {
		const saved = localStorage.getItem('cookieConsent');
		showBanner = !saved;
		cookieConsent.init();
	});

	function acceptAll() {
		cookieConsent.setConsent({
			necessary: true,
			analytics: true,
			preferences: true
		});
		localStorage.setItem('cookieConsent', 'true');
		showBanner = false;
	}

	function acceptNecessary() {
		cookieConsent.setConsent({
			necessary: true,
			analytics: false,
			preferences: false
		});
		localStorage.setItem('cookieConsent', 'true');
		showBanner = false;
	}
</script>

<!-- // src/lib/components/CookieConsent.svelte -->
{#if showBanner}
	<div class="left-50 fixed bottom-0 right-0 z-50 shadow-lg">
		<div class="mx-auto max-w-2xl rounded-lg bg-slate-300 p-4">
			<h3 class="text-center">🍪 Nous utilisons des cookies</h3>
			<p class="mx-auto mb-4 w-full text-justify">
				Nous utilisons des cookies pour améliorer votre expérience sur notre site. Les cookies
				nécessaires sont indispensables au bon fonctionnement du site. Les cookies d'analyse nous
				aident à comprendre comment vous utilisez notre site.
			</p>
			<div class="flex justify-center gap-4">
				<button
					class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
					on:click={acceptAll}
				>
					Accepter tout
				</button>
				<button
					class="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-400"
					on:click={acceptNecessary}
				>
					Cookies nécessaires uniquement
				</button>
			</div>
		</div>
	</div>
{/if}
