<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	// Props avec valeurs par défaut
	export let use24Hour = true;
	export let showDate = true;

	let time = '';
	let date = '';
	let period = ''; // AM/PM
	let timer: NodeJS.Timeout;

	function formatTime(hours: number, minutes: number, seconds: number) {
		if (!use24Hour) {
			period = hours >= 12 ? 'PM' : 'AM';
			hours = hours % 12 || 12; // Convertit 0 en 12
		}
		return {
			hours: String(hours).padStart(2, '0'),
			minutes: String(minutes).padStart(2, '0'),
			seconds: String(seconds).padStart(2, '0')
		};
	}

	function formatDate(date: any) {
		const options = {
			weekday: 'short',
			year: '2-digit',
			month: 'short',
			day: 'numeric'
		};
		return date.toLocaleDateString(undefined, options);
	}

	function updateTime() {
		const now = new Date();
		const formattedTime = formatTime(now.getHours(), now.getMinutes(), now.getSeconds());

		time = `${formattedTime.hours}:${formattedTime.minutes}:${formattedTime.seconds}`;
		if (showDate) {
			date = formatDate(now);
		}
	}

	onMount(() => {
		updateTime();
		timer = setInterval(updateTime, 1000);
	});

	onDestroy(() => {
		if (timer) clearInterval(timer);
	});

	$: timeDisplay = use24Hour ? time : `${time} ${period}`;
</script>

<div class="flex items-center justify-center font-['digital']">
	<div class="flex w-full max-w-[300px] flex-col items-center justify-between space-y-4 rounded-md">
		<div class="xl:text-custom text-3xl font-bold sm:text-3xl md:text-xs lg:text-3xl">
			{timeDisplay}
		</div>

		{#if showDate}
			<div class="mb-5 text-sm font-bold sm:text-base md:text-sm xl:text-xl">{date}</div>
		{/if}
	</div>
</div>
