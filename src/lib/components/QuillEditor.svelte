<script lang="ts">
	import { onMount } from 'svelte';
	import 'quill/dist/quill.snow.css';

	export let value: string = '';
	export let placeholder: string = 'Écrivez ici...';
	export let name: string = '';
	export let maxLength: number = 500;

	let editorContainer: HTMLDivElement;
	let quill: any;
	let remainingCharacters: number = maxLength;

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
			remainingCharacters = maxLength - quill.root.innerHTML.length;
		});
	});

	$: {
		if (quill && quill.root.innerHTML !== value) {
			quill.root.innerHTML = value;
			remainingCharacters = maxLength - quill.root.innerHTML.length;
		}
	}
</script>

<div
	class={`relative mb-5 flex w-full flex-col border border-warning ${name === 'corps-article' ? 'h-72' : 'h-32'}`}
>
	<div bind:this={editorContainer} class={`textarea mb-5 w-full rounded-none bg-white`}></div>
	<input type="hidden" {name} bind:value />
	<div class="absolute bottom-2 right-2 text-xs italic text-gray-500">
		{remainingCharacters} caractères restants
	</div>
</div>
