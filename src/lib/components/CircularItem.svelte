<script lang="ts">
	import { getItemThumbnail } from '$lib/api/image';
	import { goto } from '$app/navigation';

	export let artistId: string;
	export let artist: string;

	let thumbnail = getItemThumbnail(artistId);
</script>

<button
	class="item-container"
	on:click={() => {
		goto(`/app/artist?id=${artistId}`);
	}}
>
	<div class="image-container">
		<img
			src={thumbnail}
			alt={artist}
			on:error={() => {
				thumbnail = '/icons/unknown-artist.webp';
			}}
		/>
	</div>
	<div class="metadata">
		<p class="name">{artist}</p>
	</div>
</button>

<style lang="scss">
	.item-container {
		all: unset;
		cursor: pointer;

		width: 10rem;
		transition-duration: 250ms;

		&:hover {
			opacity: 0.7;
		}

		.image-container {
			img {
				height: 10rem;
				object-fit: contain;
				border-radius: 100%;
			}

			position: relative;
		}

		text-align: center;

		.metadata {
			margin-top: 0.25rem;

			p {
				margin: 0;
				text-overflow: ellipsis;
				overflow: hidden;
				text-wrap: nowrap;
				white-space: nowrap;
			}
		}
	}
</style>
