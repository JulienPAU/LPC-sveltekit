<script lang="ts">
	import Navbar from './Navbar.svelte';
	import DigitalClock from './Digitalclock.svelte';
	import digi from '$lib/assets/digi.png';

	import { page } from '$app/state';
	import type { SessionUser } from '$lib/types/user';

	export let watches: Array<{ brand: string; model: string }> = [];
	export let ariclesSubmitted: { total: number } = { total: 0 };

	const userSession = page.data.session?.user as SessionUser;
</script>

<Navbar {watches} {ariclesSubmitted} />
<header class="perspective-500 min-h-fit transform bg-slate-900">
	<div class="flex flex-col items-center justify-center md:flex-row">
		<div
			class="mx-5 mt-5 flex flex-col items-center justify-center tracking-widest text-white md:order-first md:w-1/2 lg:w-2/5"
		>
			<p class=" text-justify text-lg font-semibold leading-8 lg:text-2xl lg:leading-10">
				<span
					class="relative bg-gradient-to-r from-white to-yellow-500 bg-clip-text font-orelega text-xl font-extralight text-transparent lg:text-3xl"
				>
					Les Petits Cadrans
				</span>
				vous propose de partager votre passion. Vous avez une montre dont vous avez envie de parler ou
				dont on ne trouve que peu d'informations ?
			</p>
			<a
				href={userSession ? '/dashboard/publish' : '/auth'}
				class="my-8 rounded-md bg-yellow-500 px-2 py-4 text-lg font-bold text-black hover:bg-yellow-400 hover:text-black lg:px-6 lg:text-xl"
			>
				C'est ici qu'il faut en parler !
			</a>
		</div>

		<div class="mb-8 flex items-center justify-center md:order-last md:w-2/6 lg:w-1/3">
			<img src={digi} alt="Casio" class="mb-4 h-[250px] w-auto md:h-[290px] lg:h-[450px]" />
			<div class="absolute flex items-center justify-center">
				<DigitalClock />
			</div>
		</div>
	</div>
</header>
