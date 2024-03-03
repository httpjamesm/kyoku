<script lang="ts">
	import { getUrl } from '$lib/api/url';
	import { getStream } from '$lib/api/getMusic';
	import { playerContextKey } from '$lib/context/player';
	import type { PlayerContextKey } from '$lib/context/player';
	import { getContext } from 'svelte';

	const { play, pause, setSrc } = getContext<PlayerContextKey>(playerContextKey);

	export let itemId: string;
	export let albumId: string;
	export let name: string;
	export let artist: string;

	const startTrack = async () => {
		const audioUrl = `${getUrl(false)}/Audio/${itemId}/stream?audioCodec=mp3`;

		setSrc(audioUrl);
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
