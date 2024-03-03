<script lang="ts">
	import { fade } from 'svelte/transition';
	import { getItemThumbnail } from '$lib/api/image';
	import { playingStore } from '$lib/stores/playing';
	import { queueStore } from '$lib/stores/queue';
	import QueueComponent from './QueueComponent.svelte';
</script>

<div class="now-playing-expanded-container" transition:fade={{ duration: 250 }}>
	{#if $playingStore && $playingStore.track}
		<div class="thumbnail-container">
			<img
				src={getItemThumbnail($playingStore.track.albumId, 1024, 1024)}
				alt="current playing album art"
			/>
		</div>
		<div class="track-menu-container">
			<h3>Queue</h3>
			<div class="queue-container">
				{#each $queueStore?.items as item, index}
					<QueueComponent
						albumId={item.albumId}
						name={item.name}
						artist={item.artist}
						itemId={item.id}
					/>
					{#if index !== $queueStore?.items.length}
						<hr class="divider" />
					{/if}
				{/each}
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.now-playing-expanded-container {
		position: absolute;
		z-index: 4;
		top: 0;
		left: 0;
		height: 100vh;
		width: 100%;
		background-color: black;

		position: fixed;

		display: flex;
		padding: 2rem;
		box-sizing: border-box;
		justify-content: space-between;
		gap: 1rem;

		.thumbnail-container {
			height: 100%;
			width: 50%;
			display: flex;
			align-items: center;
			justify-content: center;

			position: relative;

			img {
				width: 100%;
				object-fit: contain;
				border-radius: 10px;
			}
		}

		.track-menu-container {
			height: 100%;
			width: 50%;
			padding: 0 3rem;

			.queue-container {
				overflow-y: auto;
				height: 100%;

				.divider {
					border: 1px solid #1d1d1d;
				}
			}
		}
	}
</style>