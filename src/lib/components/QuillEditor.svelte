<script lang="ts">
	import { onMount } from 'svelte';
	import 'quill/dist/quill.snow.css';

	export let value: string = '';
	export let placeholder: string = 'Écrivez ici...';
	export let name: string = ''; // Ajout d'une prop name pour l'input

	let editorContainer: HTMLDivElement;
	let quill: any;

	onMount(async () => {
		const Quill = (await import('quill')).default;

		quill = new Quill(editorContainer, {
			theme: 'snow',
			placeholder,
			modules: {
				toolbar: [['bold', 'italic', 'underline'], ['link']]
			}
		});

		quill.root.innerHTML = value;

		quill.on('text-change', () => {
			value = quill.root.innerHTML;
		});
	});

	$: {
		if (quill && quill.root.innerHTML !== value) {
			quill.root.innerHTML = value;
		}
	}
</script>

<div
	class={`mb-5 flex w-full flex-col border border-warning  ${name === 'corps-article' ? 'h-72' : 'h-32'}`}
>
	<div bind:this={editorContainer} class={`textarea mb-5 w-full  rounded-none bg-white`}></div>
	<input type="hidden" {name} bind:value />
</div>
