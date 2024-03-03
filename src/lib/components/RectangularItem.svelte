<script lang="ts">
	import { getUrl } from '$lib/api/url';
	import { playerContextKey } from '$lib/context/player';
	import type { PlayerContextKey } from '$lib/context/player';
	import { getContext } from 'svelte';
	import { playingStore } from '$lib/stores/playing';
	import { queueStore } from '$lib/stores/queue';
	import { getInstantMixFromSong } from '$lib/api/getMusic';
	import MdPlayArrow from 'svelte-icons/md/MdPlayArrow.svelte';
	import { fade } from 'svelte/transition';

	const { play, pause, setSrc } = getContext<PlayerContextKey>(playerContextKey);

	export let itemId: string;
	export let albumId: string;
	export let album: string;
	export let name: string;
	export let artist: string;
	export let year: number;
	export let type: 'song' | 'album' = 'song';

	let hovering = false;

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

		queueStore.set({
			currentIndex: 0,
			items: newQueue
		});
	};

	$: isCurrentlyPlaying = $queueStore.items[$queueStore.currentIndex].id === itemId;
</script>

<button
	class="item-container"
	on:click={() => {
		if (type === 'song') {
			startTrack();
		}
	}}
	on:mouseenter={() => {
		hovering = true;
	}}
	on:mouseleave={() => {
		hovering = false;
	}}
>
	<div class="image-container">
		<img
			src="{getUrl()}/Items/{albumId}/Images/Primary?fillHeight=334&fillWidth=334&quality=96"
			alt="{name} album art"
		/>
		{#if hovering || isCurrentlyPlaying}
			<div
				class="playing-overlay"
				transition:fade={{
					duration: 100
				}}
			>
				<div class="icon">
					{#if type === 'song'}
						{#if $queueStore?.items.length > $queueStore.currentIndex && isCurrentlyPlaying}
							<img
								style="height: 100%; width: 100%;"
								src="/icons/now-playing.svg"
								alt="now playing"
							/>
						{:else}
							<MdPlayArrow />
						{/if}
					{/if}
				</div>
			</div>
		{/if}
	</div>
	<p class="name">{name}</p>
	<p class="artist">{artist}</p>
</button>

<style lang="scss">
	.item-container {
		all: unset;
		cursor: pointer;

		text-align: center;
		width: 10rem;

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

		.image-container {
			img {
				height: 10rem;
				object-fit: contain;
				border-radius: 10px;
			}

			position: relative;

			.playing-overlay {
				position: absolute;
				z-index: 1;

				height: 100%;
				width: 100%;

				top: 0;
				left: 0;

				display: flex;
				align-items: center;
				justify-content: center;

				background-color: rgb(0, 0, 0, 0.5);

				.icon {
					height: 3rem;
					width: 3rem;
				}
			}
		}
	}
</style>
