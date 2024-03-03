<script lang="ts">
	import { getUrl } from '$lib/api/url';
	import { playerContextKey } from '$lib/context/player';
	import type { PlayerContextKey } from '$lib/context/player';
	import { getContext } from 'svelte';
	import { playingStore } from '$lib/stores/playing';
	import { queueStore } from '$lib/stores/queue';
	import { getInstantMixFromSong } from '$lib/api/getMusic';

	const { play, pause, setSrc } = getContext<PlayerContextKey>(playerContextKey);

	export let itemId: string;
	export let albumId: string;
	export let album: string;
	export let name: string;
	export let artist: string;
	export let year: number;

	const startTrack = async () => {
		const mix = await getInstantMixFromSong(itemId);

		const newQueue = mix.map((item: any) => ({
			albumId: item.AlbumId,
			name: item.Name,
			artist: item.AlbumArtist,
			album: item.Album,
			year: item.ProductionYear,
			id: item.Id
		}));

		console.log('instant mix queue', newQueue);

		queueStore.set({
			currentIndex: 0,
			items: newQueue
		});
	};
</script>

<button class="item-container" on:click={startTrack}>
	<img
		src="{getUrl()}/Items/{albumId}/Images/Primary?fillHeight=334&fillWidth=334&quality=96"
		alt="{name} album art"
	/>
	<p class="name">{name}</p>
	<p class="artist">{artist}</p>
</button>

<style lang="scss">
	.item-container {
		all: unset;
		cursor: pointer;

		text-align: center;
		width: 10rem;

		img {
			height: 10rem;
			object-fit: contain;
			border-radius: 10px;
		}

		p {
			margin: 0;
			text-overflow: ellipsis;
			overflow: hidden;
			text-wrap: nowrap;
			white-space: nowrap;
		}

		.artist {
			color: #7c7c7c;
			/* font-size: 0.8rem; */
		}
	}
</style>
