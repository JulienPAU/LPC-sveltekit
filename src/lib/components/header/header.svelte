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

			<div class="relative my-8">
				<div
					class="absolute left-1/2 top-1/2 h-16 w-[35%] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-slate-200/40 blur-lg"
				></div>

				<a
					href={userSession ? '/dashboard/publish' : '/auth'}
					class="group relative z-10 block cursor-pointer rounded-md border-yellow-600 bg-gradient-to-b from-yellow-400 to-yellow-500 px-2 py-4 text-lg font-bold text-black shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2),0_2px_4px_rgba(255,255,255,0.1)] hover:shadow-[inset_0_-1px_2px_rgba(0,0,0,0.1),0_3px_5px_rgba(255,255,255,0.2)] lg:px-6 lg:text-xl"
				>
					<div class="relative overflow-hidden text-center">
						<p
							class="text-lg duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-7 lg:text-xl"
						>
							C'est ici qu'il faut en parler !
						</p>
						<div
							class="absolute left-0 top-7 flex w-full items-center justify-center space-x-2 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:top-0"
						>
							<span class="text-lg text-black lg:text-xl"
								>{userSession ? 'Publier' : 'Se connecter'}</span
							>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 text-black lg:text-xl"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					</div>
				</a>
			</div>
		</div>

		<div class="mb-8 flex items-center justify-center md:order-last md:w-2/6 lg:w-1/3">
			<img src={digi} alt="Casio" class="mb-4 h-[250px] w-auto md:h-[290px] lg:h-[450px]" />
			<div class="absolute flex items-center justify-center">
				<DigitalClock />
			</div>
		</div>
	</div>
</header>
