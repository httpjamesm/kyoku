<script lang="ts">
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
	import { getItemThumbnail } from '$lib/api/image';
	import type { ArtistItem } from '$lib/interfaces/artist';
	import ArtistList from './ArtistList.svelte';

	export let itemId: string;
	export let albumId: string;
	export let album: string;
	export let artists: ArtistItem[];
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
						goto(`/app/artist?id=${artistItems[0].id}`);
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

	let albumArt = getItemThumbnail(itemId);
</script>

<button
	class="item-container"
	on:click={() => {
		if (type === Item.ALBUM) {
			goto(`/app/album?id=${itemId}`);
			return;
		}
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
			src={albumArt}
			alt="{name} album art"
			on:error={() => {
				albumArt = '/icons/unknown-track.webp';
			}}
		/>
		{#if hovering || currentInQueue}
			<div
				class="playing-overlay"
				transition:fade={{
					duration: 100
				}}
				class:album={type === Item.ALBUM}
			>
				<div
					class="icon"
					class:album={type === Item.ALBUM}
					role={type === Item.ALBUM ? 'button' : 'none'}
					on:click={(e) => {
						if (type !== Item.ALBUM) return;
						e.stopPropagation();
						startTrack();
					}}
				>
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
		<p class="artist">{type[0].toUpperCase()}{type.slice(1)} • <ArtistList {artists} /></p>
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

				&.album {
					background-color: rgb(0, 0, 0, 0.2);
				}

				.icon {
					height: 3rem;
					width: 3rem;

					&.album {
						position: absolute;
						right: 1rem;
						bottom: 1rem;
						height: 2rem;
						width: 2rem;
						background-color: rgb(0, 0, 0, 0.7);
						border-radius: 100%;
						padding: 0.5rem;
						transition-duration: 250ms;

						&:hover {
							background-color: rgb(0, 0, 0, 1);
							transform: scale(1.15);
						}
					}
				}
			}
		}
	}
</style>
