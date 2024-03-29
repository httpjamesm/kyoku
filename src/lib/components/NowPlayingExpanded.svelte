<script lang="ts">
	import { slide } from 'svelte/transition';
	import { getItemThumbnail } from '$lib/api/image';
	import { queueStore } from '$lib/stores/queue';
	import Divider from './Divider.svelte';
	import QueueComponentButton from './QueueComponentButton.svelte';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import type { QueueItem } from '$lib/stores/queue';

	export let currentQueueItem: QueueItem | null = null;

	let thumbnail = '';

	$: if (currentQueueItem) {
		thumbnail = getItemThumbnail(currentQueueItem.albumId, 1024, 1024);
	}
</script>

<div class="now-playing-expanded-container" transition:slide={{ duration: 250 }}>
	{#if currentQueueItem}
		<div class="thumbnail-container">
			<img
				src={thumbnail}
				on:error={() => {
					thumbnail = '/icons/unknown-track.webp';
				}}
				alt="current playing album art"
			/>
		</div>
		<div class="track-menu-container">
			<h3>Queue</h3>
			<div
				class="queue-container"
				use:dndzone={{ items: $queueStore.items, flipDurationMs: 300 }}
				on:finalize={(e) => {
					queueStore.update((store) => ({ ...store, items: e.detail.items }));
				}}
				on:consider={(e) => {
					queueStore.update((store) => ({ ...store, items: e.detail.items }));
				}}
			>
				{#each $queueStore.items as item, index (item.id)}
					<div animate:flip={{ duration: 300 }}>
						<QueueComponentButton
							on:click={() => {
								queueStore.update((store) => ({
									...store,
									currentIndex: index
								}));
							}}
							albumId={item.albumId}
							name={item.name}
							artists={item.artists}
							itemId={item.id}
							ticks={item.ticks}
							isInQueue
						/>

						{#if index !== $queueStore?.items.length}
							<Divider />
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.now-playing-expanded-container {
		position: absolute;
		z-index: 4;
		bottom: 0;
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
			padding-left: 3rem;

			.queue-container {
				overflow-y: auto;
				height: 100%;
			}
		}
	}
</style>
