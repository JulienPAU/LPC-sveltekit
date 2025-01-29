<script>
	export let data;
	const session = data?.session;
</script>

<section class="p-8">
	<h2 class="text-center">
		Bonjour <span class="border-b-4 border-b-yellow-500 text-3xl"> {session?.user?.username}</span>
	</h2>
</section>
