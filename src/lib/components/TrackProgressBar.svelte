<script lang="ts">
	import { getContext } from 'svelte';
	import { playerContextKey } from '$lib/context/player';
	import type { PlayerContextKey } from '$lib/context/player';
	import { onMount, onDestroy } from 'svelte';
	import { songColourStore } from '$lib/stores/colours';

	export let progress = 0;

	const { setProgress, pause } = getContext<PlayerContextKey>(playerContextKey);

	let hoveringOverBar = false;
	let clicking = false;
	let lastMovedPositionPercentage = 0;

	$: lastMovedPositionPercentage = progress;

	let progressBarContainer: HTMLDivElement;

	$: trackColour = $songColourStore || '#c957ff';

	const handleMouseMove = (e: MouseEvent) => {
		if (!clicking) return;
		pause();
		const progressBarWidth = progressBarContainer.clientWidth;
		const cursorX = e.clientX - progressBarContainer.getBoundingClientRect().left;
		const positionPercentage = Math.max(0, Math.min(100, (cursorX / progressBarWidth) * 100));
		lastMovedPositionPercentage = positionPercentage;
		setProgress(positionPercentage / 100);
	};

	const handleMouseUp = () => {
		clicking = false;
		window.removeEventListener('mousemove', handleMouseMove);
		window.removeEventListener('mouseup', handleMouseUp);
		document.body.style.userSelect = 'auto';
		document.body.style.webkitUserSelect = 'auto';
	};

	onMount(() => {
		progressBarContainer.addEventListener('mousedown', () => {
			clicking = true;
			window.addEventListener('mousemove', handleMouseMove);
			window.addEventListener('mouseup', handleMouseUp);
			document.body.style.userSelect = 'none';
			document.body.style.webkitUserSelect = 'none';
		});
	});

	onDestroy(() => {
		window.removeEventListener('mousemove', handleMouseMove);
		window.removeEventListener('mouseup', handleMouseUp);
	});
</script>

<div
	class="progress-bar-container"
	on:mouseenter={() => {
		hoveringOverBar = true;
	}}
	on:mouseleave={() => {
		hoveringOverBar = false;
	}}
	role="button"
	tabindex="-1"
	bind:this={progressBarContainer}
>
	<hr
		class="progress-bar"
		style="width: {lastMovedPositionPercentage}%; border-color: {trackColour}"
	/>
	<div class="dot-container">
		<div
			class="dot"
			class:enlarged={hoveringOverBar}
			style="left: {lastMovedPositionPercentage}%; background-color: {trackColour}"
		/>
	</div>
</div>

<style lang="scss">
	.progress-bar-container {
		position: absolute;
		top: -10px;
		width: 100%;
		left: 0;
		height: 1rem;

		.dot-container {
			position: relative;
			height: 100%;
			display: flex;
			align-items: center;
			height: 10px;
			top: 5px;

			.dot {
				height: 10px;
				width: 10px;
				position: absolute;
				border-radius: 100%;

				transition-duration: 100ms;

				&.enlarged {
					transform: scale(2);
				}
			}
		}

		.progress-bar {
			position: absolute;
			left: 0;
			border-style: solid;
			border-width: 2px;
		}
	}
</style>
