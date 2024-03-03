<script lang="ts">
	import { getContext } from 'svelte';
	import { playerContextKey } from '$lib/context/player';
	import type { PlayerContextKey } from '$lib/context/player';

	export let progress = 0;

	const { setProgress, pause } = getContext<PlayerContextKey>(playerContextKey);

	let hoveringOverBar = false;
	let clicking = false;
	let lastMovedPositionPercentage = 0;

	$: lastMovedPositionPercentage = progress;

	let progressBarContainer: HTMLDivElement;

	const handleMouseMove = (e: MouseEvent) => {
		if (!clicking) return;
		pause();
		const progressBarWidth = progressBarContainer.clientWidth;
		const cursorX = e.clientX - progressBarContainer.getBoundingClientRect().left;
		const positionPercentage = Math.max(0, Math.min(100, (cursorX / progressBarWidth) * 100));
		lastMovedPositionPercentage = positionPercentage;
		setProgress(positionPercentage / 100);
	};
</script>

<div
	class="progress-bar-container"
	on:mouseenter={() => {
		hoveringOverBar = true;
	}}
	on:mouseleave={() => {
		hoveringOverBar = false;
	}}
	on:mousedown={() => {
		clicking = true;
	}}
	on:mouseup={() => {
		clicking = false;
	}}
	on:mousemove={handleMouseMove}
	role="button"
	tabindex="-1"
	bind:this={progressBarContainer}
>
	<hr class="progress-bar" style="width: {lastMovedPositionPercentage}%" />
	<div class="dot-container">
		<div
			class="dot"
			class:enlarged={hoveringOverBar}
			style="left: {lastMovedPositionPercentage}%;"
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
				background-color: #c957ff;
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
			border: 2px solid #c957ff;
		}
	}
</style>
