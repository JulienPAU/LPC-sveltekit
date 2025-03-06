<script lang="ts">
	import { page } from '$app/state';
	import type { SessionUser } from '$lib/types/user';
	const userSession = page.data.session?.user as SessionUser;
</script>

<section class=" relative mb-20 bg-gray-200">
	<div class="relative z-10 px-2 py-24 text-center lg:px-8">
		<h1>Partagez votre passion en proposant vos propres articles sur vos tocantes favorites!</h1>

		<h2 class="py-4">Créez votre compte dès maintenant pour :</h2>

		<div class="mt-8 flex justify-center space-x-4">
			<a
				href={userSession ? '/dashboard/publish' : '/auth'}
				class="f rounded-md bg-yellow-500 px-6 py-4 font-orelega text-2xl text-black hover:bg-yellow-400 hover:text-black"
			>
				Proposer un article
			</a>
		</div>
	</div>
</section>
