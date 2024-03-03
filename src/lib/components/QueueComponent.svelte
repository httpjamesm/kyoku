<script lang="ts">
	import { getItemThumbnail } from '$lib/api/image';

	import { queueStore } from '$lib/stores/queue';

	export let albumId: string;
	export let name: string;
	export let artist: string;
	export let duration = 0;
	export let itemId: string;
</script>

<div class="queue-item-container">
	<div class="thumbnail-container">
		<img src={getItemThumbnail(albumId)} alt="thumbnail" />
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

<style lang="scss">
	.queue-item-container {
		display: flex;
		align-items: center;
		gap: 0.5rem;

		height: 3rem;
		width: 100%;

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
</style>
