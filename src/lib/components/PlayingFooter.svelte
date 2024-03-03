<script lang="ts">
	import MdSkipPrevious from 'svelte-icons/md/MdSkipPrevious.svelte';
	import MdSkipNext from 'svelte-icons/md/MdSkipNext.svelte';
	import MdPause from 'svelte-icons/md/MdPause.svelte';
	import MdPlayArrow from 'svelte-icons/md/MdPlayArrow.svelte';
	import { playerContextKey } from '$lib/context/player';
	import type { PlayerContextKey } from '$lib/context/player';
	import { getContext } from 'svelte';
	import { onMount, onDestroy } from 'svelte';
	import { playingStore } from '$lib/stores/playing';
	import { getUrl } from '$lib/api/url';

	const { play, pause, isPlaying, setSrc } = getContext<PlayerContextKey>(playerContextKey);

	let playing = false;

	let intervalId: number;

	onMount(() => {
		intervalId = setInterval(() => {
			playing = isPlaying();
		}, 500);
	});

	onDestroy(() => {
		clearInterval(intervalId);
		intervalId = 0;
	});
</script>

<footer class="footer">
	<div class="buttons">
		<button>
			<MdSkipPrevious />
		</button>
		<button
			on:click={() => {
				if (playing) {
					pause();
					return;
				}

				play();
			}}
		>
			{#if playing}
				<MdPause />
			{:else}
				<MdPlayArrow />
			{/if}
		</button>
		<button>
			<MdSkipNext />
		</button>
	</div>
	<div class="current-track-container">
		<img
			src="{getUrl()}/Items/{$playingStore?.track
				.albumId}/Images/Primary?fillHeight=334&fillWidth=334&quality=96"
			alt="{$playingStore?.track.name} album art"
		/>
		<div class="details">
			<p class="name">{$playingStore?.track.name}</p>
			<p class="metadata">
				{$playingStore?.track.artist} • {$playingStore?.track.album} • {$playingStore?.track.year}
			</p>
		</div>
	</div>
</footer>

<style lang="scss">
	.footer {
		width: 100%;
		background-color: #202020;
		height: 4rem;
		position: absolute;
		bottom: 0;
		left: 0;
		padding: 0.5rem 2rem;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;

		.buttons {
			display: flex;
			gap: 0.5rem;

			button {
				display: flex;
				align-items: center;
				justify-content: center;

				cursor: pointer;

				border-radius: 100%;

				&:hover {
					background-color: rgb(255, 255, 255, 0.3);
				}

				border: none;
				background: none;
				color: white;
				width: 54px;
				height: 54px;
			}
		}

		.current-track-container {
			display: flex;
			align-items: center;
			gap: 1rem;

			img {
				width: 3rem;
				height: 3rem;
				border-radius: 5px;
			}

			.details {
				p {
					margin: 0;
				}

				.name {
					font-weight: bold;
				}

				.metadata {
					color: #7c7c7c;
				}
			}
		}
	}
</style>
