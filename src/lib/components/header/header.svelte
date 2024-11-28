<script>
	import Navbar from './Navbar.svelte';
	import digit from '$lib/assets/digit.png';
	import DigitalClock from './DigitalClock.svelte';
</script>

<header class="mb-20 min-h-fit bg-gray-400 px-4">
	<Navbar />
	<div class="mb-10 flex flex-col items-center justify-center md:flex-row">
		<div class="flex items-center justify-center md:order-last md:w-2/5">
			<img src={digit} alt="Casio" class="w-3/5" />
			<div class="absolute">
				<DigitalClock />
			</div>
		</div>

		<div
			class="mx-5 mb-5 flex flex-col items-center justify-center text-lg text-white md:order-first md:w-1/2"
		>
			<h1 class="mb-10">Bienvenue sur Les Petits Cadrans !</h1>

			<p class=" mb-14 text-justify text-lg leading-loose">
				Passionné(e) par l'univers des montres, qu'elles soient classiques, modernes ou uniques ? Ce
				site est fait pour vous ! Découvrez des articles dédiés aux garde-temps qui marquent les
				heures et les esprits, et partagez votre passion en proposant vos propres articles. Ici,
				chaque cadran raconte une histoire, et la vôtre mérite d'être entendue.
			</p>
		</div>
	</div>
</header>
