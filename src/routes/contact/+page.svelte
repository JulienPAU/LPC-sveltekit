<script lang="ts">
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import DigitalClock from '$lib/components/header/Digitalclock.svelte';
	import digi from '$lib/assets/digi.png';
	import Band from '$lib/components/band/band.svelte';
	import { toast } from 'svelte-5-french-toast';

	let name = '';
	let email = '';
	let message = '';
	let isSubmitting = false;

	async function handleSubmit(event: Event) {
		event.preventDefault();
		isSubmitting = true;

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name, email, message })
			});

			const result = await response.json();

			if (result.success) {
				toast.success('Message envoyé avec succès !', {
					duration: 3000,
					position: 'top-center'
				});
				resetForm();
			} else {
				toast.error(result.error || 'Une erreur est survenue', {
					duration: 5000,
					position: 'top-center'
				});
			}
		} catch (error) {
			toast.error("Une erreur est survenue lors de l'envoi", {
				duration: 5000,
				position: 'top-center'
			});
		} finally {
			isSubmitting = false;
		}
	}

	function resetForm() {
		name = '';
		email = '';
		message = '';
	}
</script>

<section class="mb-10 flex flex-col items-center lg:mb-20 lg:px-0">
	<SectionTitle title="Contactez-nous" />
	<p class="mb-5 text-2xl font-bold italic underline">Il est l'heure</p>
	<p class="mb-10 w-full px-5 text-justify text-xl font-semibold md:w-2/4 lg:w-2/4">
		Vous souhaitez nous contacter pour partager une idée, proposer un sujet, enrichir le lexique ou
		toute autre suggestion ? Nous sommes à l’écoute ! Utilisez le formulaire ci-dessous et faisons
		évoluer Les Petits Cadrans ensemble.
	</p>

	<div class="flex w-full flex-wrap items-center justify-center bg-slate-900 px-5 py-8">
		<div class="flex items-center justify-center md:w-2/6">
			<img src={digi} alt="Casio" class="my-8 h-[250px] w-auto md:h-[290px] lg:h-[450px]" />
			<div class="absolute flex items-center justify-center">
				<DigitalClock />
			</div>
		</div>

		<form
			on:submit={handleSubmit}
			class="mx-auto w-full max-w-4xl items-center rounded-xl border-2 border-gray-300 bg-slate-900 p-10"
		>
			<div class="flex flex-col gap-5">
				<div class="w-full">
					<label for="name" class="mb-1 block text-lg font-bold text-white"> Nom </label>
					<input
						id="name"
						name="name"
						type="text"
						class="input input-bordered input-warning w-full"
						bind:value={name}
						placeholder="Votre nom"
					/>
				</div>

				<div class="w-full">
					<label for="email" class="mb-1 block text-lg font-bold text-white"> Email </label>
					<input
						id="email"
						name="email"
						type="email"
						class="input input-bordered input-warning w-full"
						bind:value={email}
						placeholder="Votre email"
					/>
				</div>

				<div class="w-full">
					<label for="message" class="mb-1 block text-lg font-bold text-white"> Message </label>
					<textarea
						id="message"
						name="message"
						class="textarea textarea-bordered textarea-warning w-full"
						bind:value={message}
						placeholder="Votre message"
					></textarea>
				</div>

				<div class="flex flex-col gap-5">
					<div class="flex justify-end">
						<button type="submit" class="btn btn-warning text-xl" disabled={isSubmitting}>
							{isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
						</button>
					</div>
				</div>
			</div>
		</form>
	</div>
</section>
<Band />
