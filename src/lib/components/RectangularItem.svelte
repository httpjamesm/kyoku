<script lang="ts">
	import { getUrl } from '$lib/api/url';
	import { isPlayingStore } from '$lib/stores/playing';
	import { queueStore } from '$lib/stores/queue';
	import MdPlayArrow from 'svelte-icons/md/MdPlayArrow.svelte';
	import MdPause from 'svelte-icons/md/MdPause.svelte';
	import { fade } from 'svelte/transition';
	import { showMenu } from 'tauri-plugin-context-menu';
	import { markFavourite, unmarkFavourite } from '$lib/api/favourite';
	import toast from 'svelte-french-toast';
	import { getNewQueue, playNext } from '$lib/utils/queue';
	import { Item } from '$lib/enums/item';
	import { goto } from '$app/navigation';

	export let itemId: string;
	export let albumId: string;
	export let album: string;
	export let artistId: string;
	export let name: string;
	export let artist: string;
	export let year: number;
	export let type: Item = Item.SONG;
	export let favourite = false;

	let hovering = false;

	const startTrack = async () => {
		queueStore.set({
			currentIndex: 0,
			items: await getNewQueue(type, itemId)
		});
	};

	let currentInQueue = false;

	$: if ($queueStore.items.length > $queueStore.currentIndex) {
		currentInQueue = $queueStore.items[$queueStore.currentIndex].id === itemId;
	}

	const playNextHandler = async () => {
		await playNext(type, itemId);
	};

	const onContextMenu = () => {
		showMenu({
			items: [
				{
					label: 'Play next',
					event: playNextHandler
				},
				{
					is_separator: true
				},
				{
					label: 'Go to album',
					event: () => {
						goto(`/app/album?id=${albumId}`);
					}
				},
				{
					label: 'Go to artist',
					event: () => {
						goto(`/app/artist?id=${artistId}`);
					}
				},
				{
					is_separator: true
				},
				{
					label: 'Favourite',
					checked: favourite,
					event: async () => {
						favourite = !favourite;
						try {
							if (!favourite) {
								unmarkFavourite(itemId);
							} else {
								markFavourite(itemId);
							}
						} catch (e) {
							favourite = !favourite;
							// @ts-ignore
							toast.error(e.message);
							return;
						}
					}
				}
			]
		});
	};
</script>

<button
	class="item-container"
	on:click={() => {
		startTrack();
	}}
	on:mouseenter={() => {
		hovering = true;
	}}
	on:mouseleave={() => {
		hovering = false;
	}}
	on:contextmenu|preventDefault={onContextMenu}
>
	<div class="image-container">
		<img
			src="{getUrl()}/Items/{albumId}/Images/Primary?fillHeight=334&fillWidth=334&quality=96"
			alt="{name} album art"
		/>
		{#if hovering || currentInQueue}
			<div
				class="playing-overlay"
				transition:fade={{
					duration: 100
				}}
			>
				<div class="icon">
					{#if type === Item.SONG}
						{#if $queueStore?.items.length > $queueStore?.currentIndex && currentInQueue}
							{#if $isPlayingStore}
								<img
									style="height: 100%; width: 100%;"
									src="/icons/now-playing.svg"
									alt="now playing"
								/>
							{:else}
								<MdPause />
							{/if}
						{:else}
							<MdPlayArrow />
						{/if}
					{:else}
						<MdPlayArrow />
					{/if}
				</div>
			</div>
		{/if}
	</div>
	<div class="metadata">
		<p class="name">{name}</p>
		<p class="artist">{type[0].toUpperCase()}{type.slice(1)} • {artist}</p>
	</div>
</button>

<style lang="scss">
	.item-container {
		all: unset;
		cursor: pointer;

		/* text-align: center; */
		width: 10rem;

		.metadata {
			margin-top: 0.25rem;

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
