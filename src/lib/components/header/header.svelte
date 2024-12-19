<script lang="ts">
	import Navbar from './Navbar.svelte';
	import digit from '$lib/assets/digit.png';
	import DigitalClock from './DigitalClock.svelte';

	export let title: String, content: String;
</script>

<header class=" min-h-fit bg-gray-900 px-4">
	<Navbar />
	<div class=" flex flex-col items-center justify-center md:flex-row">
		<div class="flex items-center justify-center md:order-last md:w-2/5">
			<img src={digit} alt="Casio" class="w-3/5" />
			<div class="absolute">
				<DigitalClock />
			</div>
		</div>

		<div
			class="mx-5 mb-5 flex flex-col items-center justify-center text-lg text-white md:order-first md:w-1/2"
		>
			<h1 class="mb-10 text-yellow-500">{title}</h1>

			<p class=" mb-14 text-justify text-xl font-semibold">
				{content}
			</p>
		</div>
	</div>
</header>
