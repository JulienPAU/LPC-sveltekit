<script lang="ts">
	export let data;

	export let { user } = data;
</script>

<section class="p-8">
	<p>Nom d'utilisateur : {user.username}</p>
	<p>
		Nom : {user.last_name ? user.last_name : 'Non renseigné'}
	</p>

	<p>
		Prénom : {user.first_name ? user.first_name : 'Non renseigné'}
	</p>

	<p>
		Rôle : {user.role.toLowerCase()}
	</p>
</section>
