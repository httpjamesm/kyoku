<script lang="ts">
	import { getItemThumbnail } from '$lib/api/image';
	import MdRemove from 'svelte-icons/md/MdRemove.svelte';
	import { queueStore } from '$lib/stores/queue';
	import { formatMinutesShort, ticksToMinutes } from '$lib/utils/ticks';
	import MdAllInclusive from 'svelte-icons/md/MdAllInclusive.svelte';
	import { playNow } from '$lib/utils/queue';
	import { Item } from '$lib/enums/item';
	import IconButton from './buttons/IconButton.svelte';

	let playNowLoading = false;

	export let albumId: string;
	export let name: string;
	export let artist: string;
	export let ticks = 0;
	export let itemId: string;
	export let isInQueue = true;
</script>

<div class="queue-item-container">
	<div class="item-data">
		<div class="thumbnail-container">
			<img src={getItemThumbnail(albumId, 128, 128)} alt="thumbnail" />
			{#if $queueStore}
				{#if $queueStore.items.length > $queueStore.currentIndex}
					{#if $queueStore.items[$queueStore.currentIndex].id === itemId}
						<div class="thumbnail-overlay">
							<img
								style="height: 100%; width: 100%;"
								src="/icons/now-playing.svg"
								alt="now playing"
							/>
						</div>
					{/if}
				{/if}
			{/if}
		</div>
		<div class="metadata">
			<p class="name">
				{name}
			</p>
			<p class="artist">
				{artist}
			</p>
		</div>
	</div>
	<div class="buttons">
		<p class="runtime">
			{formatMinutesShort(ticksToMinutes(ticks))}
		</p>
		<IconButton
			loading={playNowLoading}
			on:click={(e) => {
				e.stopPropagation();
				playNowLoading = true;
				playNow(Item.SONG, itemId).finally(() => {
					playNowLoading = false;
				});
			}}
		>
			<MdAllInclusive />
		</IconButton>

		{#if isInQueue}
			<IconButton
				on:click={(e) => {
					e.stopPropagation();

					queueStore.update((store) => ({
						...store,
						items: store.items.filter((item) => item.id !== itemId)
					}));
				}}
			>
				<MdRemove />
			</IconButton>
		{/if}
	</div>
</div>

<style lang="scss">
	.queue-item-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;

		.item-data {
			display: flex;
			align-items: center;
			gap: 0.5rem;

			cursor: pointer;
			width: 100%;

			transition-duration: 100ms;

			&:hover {
				opacity: 0.5;
			}

			.thumbnail-container {
				position: relative;

				img {
					height: 3rem;
					width: 3rem;
					border-radius: 5px;
					object-fit: contain;
				}

				.thumbnail-overlay {
					position: absolute;
					top: 0;
					left: 0;
					background-color: rgb(0, 0, 0, 0.7);
					width: 100%;
					height: 100%;
					padding: 0.75rem;
					display: flex;
					align-items: center;
					justify-content: center;
					box-sizing: border-box;
				}
			}
			.metadata {
				height: 100%;

				p {
					margin: 0;
				}

				.name {
					font-weight: bold;
				}

				.artist {
					color: #7c7c7c;
				}
			}
		}

		.buttons {
			display: flex;
			gap: 1rem;
			align-items: center;

			.runtime {
				color: #7c7c7c;
			}

			button {
				height: 3rem;
				width: 3rem;
				padding: 0.75rem;
				box-sizing: border-box;
				background: transparent;
				border: none;
				border-radius: 100%;
				color: white;

				&:hover {
					background-color: rgb(255, 255, 255, 0.3);
				}
			}
		}

		height: 3rem;
		width: 100%;
	}
</style>
