<script lang="ts">
	import { getItemThumbnail } from '$lib/api/image';
	import { page } from '$app/stores';
	import { getById, getArtistTopTracks, getArtistRecentAlbums } from '$lib/api/getMusic';
	import QueueComponentButton from '$lib/components/QueueComponentButton.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import RectangularItem from '$lib/components/RectangularItem.svelte';
	import { Item } from '$lib/enums/item';
	import InteractionButton from '$lib/components/buttons/InteractionButton.svelte';
	import MdPlayArrow from 'svelte-icons/md/MdPlayArrow.svelte';
	import { getQueueItemFromJellyfinItem } from '$lib/utils/queue';
	import { queueStore } from '$lib/stores/queue';
	import { playNow, addItemsNextInQueue, deleteFromQueueById } from '$lib/utils/queue';

	let name = '';
	let description = '';
	let genres: string[] = [];
	let topSongItems: any[] = [];
	let albums: any[] = [];

	let topTracksExpanded = false;

	const init = async () => {
		const artist = await getById(id);
		name = artist.Name;
		description = artist.Overview;
		genres = artist.Genres;

		topSongItems = await getArtistTopTracks(id);
		albums = await getArtistRecentAlbums(id);
	};

	$: id = $page.url.searchParams.get('id') as string;

	$: if (id) {
		init();
	}

	const onPlayHandler = async () => {
		queueStore.set({
			currentIndex: 0,
			items: topSongItems.map((item) => getQueueItemFromJellyfinItem(item))
		});
	};

	$: artistImage = getItemThumbnail(id, 512, 512);
</script>

{#if id}
	<div class="wrapper">
		<div class="header" style="background-image: url('{artistImage}')">
			<div class="overlay" />
			<div class="artist-info">
				<img
					src={artistImage}
					class="artist-image"
					alt="artist"
					on:error={() => {
						artistImage = '/icons/unknown-artist.webp';
					}}
				/>
				<div class="metadata">
					<h1>{name}</h1>
					<h2>{genres.join(', ')}</h2>
					{#if description}
						<p>{description}</p>
					{/if}
					<br />
					<InteractionButton on:click={onPlayHandler} icon={MdPlayArrow}>Play</InteractionButton>
				</div>
			</div>
		</div>

		<div class="content">
			<h3>Top Tracks</h3>
			<div class="top-tracks" class:expanded={topTracksExpanded}>
				{#each topSongItems as item, index (item.Id)}
					<QueueComponentButton
						albumId={item.AlbumId}
						name={item.Name}
						artist={item.AlbumArtist}
						itemId={item.Id}
						ticks={item.RunTimeTicks}
						isInQueue={false}
						on:click={async () => {
							await playNow(Item.SONG, item.Id);
							const remainingSongs = topSongItems.slice(index + 1);
							const remainingSongsQueueItems = remainingSongs.map((song) =>
								getQueueItemFromJellyfinItem(song)
							);
							for (const song of remainingSongsQueueItems) {
								deleteFromQueueById(song.id);
							}
							addItemsNextInQueue(remainingSongsQueueItems);
						}}
					/>
					{#if index !== topSongItems.length}
						<Divider />
					{/if}
				{/each}
				<div class="show-more-container" class:expanded={topTracksExpanded}>
					<button
						class="show-more"
						on:click={() => {
							topTracksExpanded = !topTracksExpanded;
						}}
					>
						{topTracksExpanded ? 'Show Less' : 'Show More'}
					</button>
				</div>
			</div>

			<h3>Albums</h3>
			<div class="row-wrap">
				{#each albums as item (item.Id)}
					<RectangularItem
						itemId={item.Id}
						albumId={item.Id}
						name={item.Name}
						artist={item.AlbumArtist}
						album={item.Album}
						year={item.ProductionYear}
						type={Item.ALBUM}
						artistId={item.ArtistId}
					/>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.wrapper {
		width: 100%;
		min-height: 100vh;
		padding-top: 2rem;

		.header {
			position: relative;
			width: 100%;
			background-size: cover;
			height: 15rem;
			border-top-right-radius: 10px;
			border-top-left-radius: 10px;
			background-position: center;
			background-color: #296383;

			.overlay {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				z-index: 1;
				background: rgb(255, 255, 255);
				background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 1) 78%);
				-webkit-backdrop-filter: blur(20px);
				backdrop-filter: blur(20px);
				border-top-right-radius: inherit;
				border-top-left-radius: inherit;
			}

			.artist-info {
				position: absolute;
				z-index: 2;
				bottom: 0;
				left: 0;
				padding: 0 2rem;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				gap: 3rem;

				.artist-image {
					border-radius: 100%;
					width: 10rem;
					height: 10rem;
				}

				h1,
				h2 {
					margin: 0;
				}

				h1 {
					font-size: 2.25rem;
				}

				h2 {
					font-size: 1.25rem;
					font-weight: 500;
				}

				p {
					margin-bottom: 0;
				}
			}
		}

		.content {
			padding: 1rem 3rem;
			box-sizing: border-box;
			width: 100%;

			.top-tracks {
				max-height: 20rem;
				overflow-y: hidden;
				position: relative;

				&.expanded {
					max-height: fit-content;
					padding-bottom: 3rem;
				}

				:not(&.expanded) + &::after {
					content: '';
					position: absolute;
					left: 0;
					width: 100%;
					top: 14rem;
					height: 100px; /* Adjust the height as needed */
					background: linear-gradient(to bottom, rgba(255, 255, 255, 0), 50%, rgba(0, 0, 0, 1));
				}

				.show-more-container {
					position: absolute;
					left: 0;
					width: 100%;
					top: 16rem;
					z-index: 1;
					display: flex;
					justify-content: center;

					&.expanded {
						position: absolute;
						top: auto;
					}

					.show-more {
						background-color: white;
						padding: 0.5rem 1rem;
						border-radius: 50px;
						border: none;
						font-size: 1rem;
						font-weight: bold;
						cursor: pointer;

						&:hover {
							background-color: rgb(255, 255, 255, 0.7);
						}
					}
				}
			}
		}
	}

	.row-wrap {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}
</style>
