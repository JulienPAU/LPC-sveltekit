<script lang="ts">
	import Navbar from './Navbar.svelte';
	import digit from '$lib/assets/digit.png';
	import DigitalClock from './DigitalClock.svelte';
	import digi from '$lib/assets/digi.png';

	export let title: String, content: String;
	export let watches: Array<{ brand: string; model: string }> = [];
</script>

<header class="perspective-500 min-h-fit transform bg-slate-900">
	<Navbar {watches} />
	<div class=" flex flex-col items-center justify-center md:flex-row">
		<div
			class="mx-5 mt-5 flex flex-col items-center justify-center text-lg text-white md:order-first md:w-1/2"
		>
			<h1
				class="relative mb-10 bg-gradient-to-r from-white to-yellow-500 bg-clip-text text-transparent lg:mb-14"
			>
				{title}
			</h1>

			<p class=" mb-8 text-justify text-xl font-semibold">
				{content}
			</p>
		</div>

		<div class="flex items-center justify-center md:order-last md:w-2/6">
			<img src={digi} alt="Casio" class="mb-8 h-[250px] w-auto md:h-[290px] lg:h-[450px]" />
			<div class="absolute flex items-center justify-center">
				<DigitalClock />
			</div>
		</div>
	</div>
</header>
