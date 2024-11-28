<script>
	import Navbar from './Navbar.svelte';
	import digit from '$lib/assets/digit.png';
	import background from '$lib/assets/background.png';
</script>

<header class="min-h-fit bg-gray-400" style="background-image: url('{background}');">
	<Navbar />
	<div class="flex flex-col items-center justify-center md:flex-row">
		<div class="flex items-center justify-center md:order-last md:w-2/5">
			<img src={digit} alt="Casio" class="w-3/5" />
		</div>
		<div class="mx-5 mb-5 flex items-center justify-center leading-loose md:order-first md:w-1/2">
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, veniam natus voluptatem quos
			recusandae placeat porro impedit, vel maiores omnis laboriosam voluptates culpa. Eligendi,
			ipsam blanditiis. Alias labore aut autem eum quos commodi nemo reprehenderit officiis nostrum
			aliquid. Adipisci quaerat repudiandae nobis officia ullam numquam repellendus voluptate
			dolorum similique eveniet?
		</div>
	</div>
</header>
