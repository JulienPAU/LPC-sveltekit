<!-- src/ routes/mentions-legales/ +page.svelte -->

<div class="flex items-center justify-center text-center">
	<h1 class="py-10">Mentions Légales</h1>
</div>

<div
	class="mx-auto mb-10 max-w-[100%] rounded-lg bg-white px-6 sm:max-w-[90%] md:px-10 lg:max-w-5xl lg:px-12"
	lang="fr"
>
	<section class="mb-6 sm:mb-8">
		<h2>1. Éditeur du site</h2>
		<p class="overflow-wrap-anywhere hyphens-auto break-words text-justify">
			Le site "Les Petits Cadrans" (ci-après "le Site") est édité par :
		</p>
		<ul class="list-inside list-disc pl-4 sm:pl-6">
			<li>Les Petits Cadrans</li>
			<li>Email de contact : lespetitscadrans.lpc@gmail.com</li>
		</ul>
	</section>

	<section class="mb-6 sm:mb-8">
		<h2>2. Hébergement</h2>
		<p class="overflow-wrap-anywhere hyphens-auto break-words text-justify">
			Le Site est hébergé par :
		</p>
		<ul class="list-inside list-disc pl-4 sm:pl-6">
			<li>Vercel</li>
		</ul>
	</section>

	<section class="mb-6 sm:mb-8">
		<h2>3. Propriété intellectuelle</h2>
		<p class="overflow-wrap-anywhere hyphens-auto break-words text-justify">
			L'ensemble des éléments constituant le Site (textes, graphismes, logiciels, photographies,
			images, vidéos, sons, logos, marques, etc.) ainsi que le Site lui-même, sont la propriété
			exclusive de l'éditeur ou de ses partenaires. Ces éléments sont protégés par les lois
			relatives à la propriété intellectuelle.
		</p>
		<p class="overflow-wrap-anywhere hyphens-auto break-words text-justify">
			Toute reproduction, représentation, modification, publication, adaptation ou exploitation de
			tout ou partie des éléments du Site, quel que soit le moyen ou le procédé utilisé, est
			interdite sans autorisation préalable écrite de l'éditeur.
		</p>
	</section>

	<section class="mb-6 sm:mb-8">
		<h2>4. Limitation de responsabilité</h2>
		<p class="overflow-wrap-anywhere hyphens-auto break-words text-justify">
			L'éditeur du Site ne pourra être tenu responsable des dommages directs et indirects causés au
			matériel de l'utilisateur lors de l'accès au Site, et résultant soit de l'utilisation d'un
			matériel ne répondant pas aux spécifications techniques requises, soit de l'apparition d'un
			bug ou d'une incompatibilité.
		</p>
		<p class="overflow-wrap-anywhere hyphens-auto break-words text-justify">
			L'éditeur ne peut également être tenu responsable des dommages indirects consécutifs à
			l'utilisation du Site.
		</p>
		<p class="overflow-wrap-anywhere hyphens-auto break-words text-justify">
			L'éditeur du Site ne garantit pas l'exactitude et l'exhaustivité des informations diffusées
			sur son Site. Ces informations ne sauraient en aucun cas être considérées comme contractuelles
			ou se substituer à une consultation de professionnels.
		</p>
	</section>

	<section class="mb-6 sm:mb-8">
		<h2>5. Liens hypertextes</h2>
		<p class="overflow-wrap-anywhere hyphens-auto break-words text-justify">
			Le Site peut contenir des liens hypertextes vers d'autres sites internet. L'éditeur n'a pas la
			possibilité de vérifier le contenu des sites ainsi visités, et n'assumera en conséquence
			aucune responsabilité de ce fait.
		</p>
	</section>

	<section class="mb-6 sm:mb-8">
		<h2>6. Droit applicable et juridiction compétente</h2>
		<p class="overflow-wrap-anywhere hyphens-auto break-words text-justify">
			Les présentes mentions légales sont soumises au droit français. En cas de litige, les
			tribunaux français seront seuls compétents.
		</p>
	</section>

	<footer class="mt-4 text-center text-sm text-gray-600">
		<p>Date de dernière mise à jour : 1 mars 2025</p>
	</footer>
</div>

<style>
	h2 {
		font-size: 1.4rem;
		overflow-wrap: anywhere;
		hyphens: auto;
		word-break: break-word;
	}

	@media (min-width: 640px) {
		h2 {
			font-size: 2rem;
		}
	}
</style>
