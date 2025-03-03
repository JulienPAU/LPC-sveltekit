<!-- src/routes/dashboard/%2Bpage.svelte -->

<script lang="ts">
	import { toast } from 'svelte-5-french-toast';

	export let data;
	const user = data?.user;
	const { articlesByUserId } = data;

	const sendModeratorRequest = async () => {
		if (!user) return;
		try {
			const response = await fetch('/api/_public/dashboard/moderator-request', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: user.username,
					email: user.email,
					id: user.id
				})
			});

			const result = await response.json();
			if (result.success) {
				toast.success('Votre demande a été envoyée avec succès ! ', {
					duration: 5000
				});
			} else {
				toast.error('Une erreur est survenue. Veuillez réessayer plus tard.', {
					duration: 5000
				});
			}
		} catch (error) {
			console.error('Erreur lors de la demande de modérateur:', error);
			toast.error('Une erreur est survenue. Veuillez réessayer plus tard.', {
				duration: 5000
			});
		}
	};

	const declineModeratorRequest = async () => {
		if (!user) return;
		try {
			const response = await fetch('/api/_public/dashboard/moderator-decline', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id: user.id
				})
			});

			const result = await response.json();
			if (result.success) {
				toast.success('Votre refus a été enregistré.', {
					duration: 5000
				});
				location.reload();
			} else {
				toast.error('Une erreur est survenue. Veuillez réessayer plus tard.', {
					duration: 5000
				});
			}
		} catch (error) {
			console.error('Erreur lors du refus:', error);
			toast.error('Une erreur est survenue. Veuillez réessayer plus tard.', {
				duration: 5000
			});
		}
	};

	const acknowledgedRejection = async () => {
		if (!user) return;
		try {
			const response = await fetch('/api/_public/dashboard/moderator-ack', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id: user.id
				})
			});

			const result = await response.json();
			if (result.success) {
				toast('Merci pour votre compréhension.', {
					duration: 5000
				});
				location.reload();
			} else {
				toast.error('Une erreur est survenue. Veuillez réessayer plus tard.', {
					duration: 5000
				});
			}
		} catch (error) {
			console.error('Erreur lors du refus:', error);
			toast.error('Une erreur est survenue. Veuillez réessayer plus tard.', {
				duration: 5000
			});
		}
	};
</script>

<section class="flex flex-col items-center p-4">
	<h2 class="mb-10">
		Bienvenue <span class="border-b-4 border-b-yellow-500">{user?.username}</span>
	</h2>

	<p class="mb-6 text-base font-semibold text-gray-900 md:text-lg lg:text-xl">
		Prêt à partager ta passion horlogère ?
	</p>

	{#if articlesByUserId.total >= 10 && user.User_Role[0].role !== 'MODERATOR' && user.User_Role[0].role !== 'ADMIN'}
		{#if user.moderatorRequestStatus === 'NOT_REQUESTED'}
			<div class="mb-10 flex flex-col items-center gap-4 rounded-lg bg-slate-900 p-8 text-white">
				<p class="text-2xl font-bold">Félicitations, vous avez publié plus de 10 articles !</p>
				<p>Vous pouvez faire une demande pour être modérateur.</p>
				<button class="btn btn-warning text-lg font-bold" on:click={sendModeratorRequest}>
					Cliquez ici pour faire la demande
				</button>

				<button class="btn-gray-600 btn text-lg font-bold" on:click={declineModeratorRequest}>
					Je ne veux pas être modérateur
				</button>
			</div>
		{:else if user.moderatorRequestStatus === 'PENDING'}
			<div class="mb-10 flex flex-col items-center gap-4 rounded-lg bg-blue-900 p-4 text-white">
				<p class="text-2xl font-bold">Votre demande est en attente</p>
				<p class="font-semibold">
					L’équipe des Petits Cadrans examinera votre demande et vous recevrez une réponse
					prochainement. Surveillez vos mails !
				</p>
			</div>
		{:else if user.moderatorRequestStatus === 'REJECTED'}
			<div class="mb-10 flex flex-col items-center gap-4 rounded-lg bg-red-900 p-4 text-white">
				<p class="text-2xl font-bold">Votre demande a été refusée</p>
				<p>Vous ne remplissez pas encore les critères pour devenir modérateur.</p>
				<p>Continuez à contribuer, et vous pourrez refaire une demande plus tard.</p>

				<button class="btn-gray-600 btn text-lg font-bold" on:click={acknowledgedRejection}>
					J'ai compris
				</button>
			</div>
		{/if}
	{/if}

	<div class="w-full max-w-5xl rounded-xl bg-gray-200 p-6 shadow-lg">
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="rounded-xl bg-white p-6 shadow-md">
				<h3 class="mb-4 text-center">Statistiques Articles</h3>
				<div class="space-y-2">
					<div class="flex justify-between border-b pb-2">
						<span>Total Articles</span>
						<span class="font-bold text-black"
							>{articlesByUserId.total < 0 || !articlesByUserId.total
								? '0'
								: articlesByUserId.total}</span
						>
					</div>
					<div class="flex justify-between border-b pb-2">
						<span>Articles Publiés</span>
						<span class="font-bold text-green-500"
							>{articlesByUserId.countByStatus.PUBLISHED < 0 ||
							!articlesByUserId.countByStatus.PUBLISHED
								? '0'
								: articlesByUserId.countByStatus.PUBLISHED}</span
						>
					</div>
					<div class="flex justify-between border-b pb-2">
						<span>Articles en Attente</span>
						<span class="font-bold text-yellow-500"
							>{articlesByUserId.countByStatus.SUBMITTED < 0 ||
							!articlesByUserId.countByStatus.SUBMITTED
								? '0'
								: articlesByUserId.countByStatus.SUBMITTED}</span
						>
					</div>
					<div class="flex justify-between border-b pb-2">
						<span>Articles Refusés</span>
						<span class="font-bold text-red-500"
							>{articlesByUserId.countByStatus.REFUSED < 0 ||
							!articlesByUserId.countByStatus.REFUSED
								? '0'
								: articlesByUserId.countByStatus.REFUSED}</span
						>
					</div>
				</div>
			</div>

			<div class="rounded-xl bg-white p-6 shadow-md">
				<h3 class="mb-4 text-center">Actions Rapides</h3>
				<div class="space-y-3">
					<a
						href="/dashboard/publish"
						class=" btn flex w-full flex-nowrap items-center justify-center gap-2 bg-warning text-lg text-black hover:bg-yellow-400 hover:text-black"
					>
						<i class="fa-solid fa-pen-clip text-base text-slate-800"></i>
						<span class="text-base font-bold lg:text-xl">Proposer un Article</span>
					</a>
					<a
						href="/dashboard/articles"
						class="btn flex w-full flex-nowrap items-center justify-center gap-2 bg-warning text-lg text-black hover:bg-yellow-400 hover:text-black"
					>
						<i class="fa-solid fa-newspaper text-base text-slate-800"></i>
						<span class="text-base font-bold lg:text-xl">Gérer mes Articles</span>
					</a>
					<a
						href="/dashboard/profil"
						class="btn flex w-full flex-nowrap items-center justify-center gap-2 bg-warning text-lg text-black hover:bg-yellow-400 hover:text-black"
					>
						<i class="fa-solid fa-user text-base text-slate-800"></i>
						<span class="text-base font-bold lg:text-xl">Mon Profil</span>
					</a>
				</div>
			</div>
		</div>
	</div>

	{#if articlesByUserId.total >= 10 && user.User_Role[0].role !== 'MODERATOR' && user.User_Role[0].role !== 'ADMIN'}
		{#if user.moderatorRequestStatus === 'DECLINED' || user.moderatorRequestStatus === 'ACK_REJECT'}
			<p class="mt-10 rounded-lg bg-slate-900 p-4 text-center text-lg font-semibold text-white">
				Si vous changez d'avis pour être modérateur ou si vous voulez faire une nouvelle demande,
				contactez-nous :
				<a href="/contact" class="btn btn-warning hover:text-black">Contact</a>
			</p>
		{/if}
	{/if}

	<div class="mt-10 w-full max-w-5xl rounded-xl bg-white p-6 shadow-lg">
		<h3 class="mb-4">📌 Comment fonctionne Les Petits Cadrans ?</h3>
		<p class="text-gray-600">
			Les Petits Cadrans est une plateforme dédiée aux passionnés d'horlogerie. Vous pouvez proposer
			vos articles et explorer ceux des autres contributeurs.
		</p>
		<p class="mt-4 text-gray-600">
			🔹 Commencez par rédiger et partager un article sur votre passion.
			<br />
			🔹 Consultez les articles populaires et découvrez de nouvelles perspectives horlogères.
		</p>
	</div>
</section>
