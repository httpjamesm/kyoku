<script lang="ts">
	import { page } from '$app/stores';
	import { getById, getAlbumTracks } from '$lib/api/getMusic';
	import { getItemThumbnail } from '$lib/api/image';
	import { onMount } from 'svelte';
	import { ticksToMinutes, formatMinutes } from '$lib/utils/ticks';
	import TrackComponent from '$lib/components/TrackComponent.svelte';
	import { addItemsNextInQueue, playNow } from '$lib/utils/queue';
	import { Item } from '$lib/enums/item';
	import { getQueueItemFromJellyfinItem } from '$lib/utils/queue';
	import { queueStore } from '$lib/stores/queue';

	let name = '';
	let artists: string[] = [];
	let year = 0;
	let songItems: any[] = [];
	let id = '';
	let ticks = 0;

	const init = async () => {
		try {
			id = $page.url.searchParams.get('id') as string;
			const albumItem = await getById(id);

			name = albumItem.Name;
			artists = albumItem.Artists;
			year = albumItem.ProductionYear;
			ticks = albumItem.RunTimeTicks;

			songItems = await getAlbumTracks(albumItem.Id);
		} catch {}
	};

	onMount(() => {
		init();
	});
</script>

<div class="wrapper">
	<div class="info">
		<div class="art-container">
			<img src={getItemThumbnail(id, 512, 512)} alt="album art" />
		</div>
		<div class="metadata">
			<h2>{name}</h2>
			<br />
			<p class="details">
				Album • {artists.join(', ')} • {year}
			</p>
			<p class="details">
				{songItems.length} songs • {formatMinutes(ticksToMinutes(ticks))}
			</p>
		</div>
	</div>

	<table class="tracks">
		<thead>
			<tr>
				<th></th>
				<th></th>
				<th></th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each songItems as item, index (item.Id)}
				<TrackComponent
					itemId={item.Id}
					albumId={item.AlbumId}
					name={item.Name}
					artists={item.Artists}
					index={index + 1}
					ticks={item.RunTimeTicks}
					on:click={async () => {
						await playNow(Item.SONG, item.Id);
						const remainingSongs = songItems.slice(index + 1);
						const remainingSongsQueueItems = remainingSongs.map((song) =>
							getQueueItemFromJellyfinItem(song)
						);
						addItemsNextInQueue(remainingSongsQueueItems);
					}}
				/>
			{/each}
		</tbody>
	</table>
</div>

<style lang="scss">
	.wrapper {
		width: 100%;
		padding: 3rem;
		box-sizing: border-box;

		.info {
			display: flex;
			height: 20rem;
			gap: 3rem;

			.art-container {
				width: 20rem;
				img {
					width: 100%;
					border-radius: 10px;
				}
			}

			.metadata {
				h2 {
					margin: 0;
					font-size: 2.25rem;
				}

				.details {
					margin: 0;
					color: #ececec;
				}
			}
		}
	}

	.tracks {
		border-collapse: separate;
		border-spacing: 0 1rem;
		width: 100%;
		table-layout: fixed;

		th,
		td {
			text-align: left;
		}

		th:nth-child(1),
		td:nth-child(1) {
			width: 5%;
		}

		th:nth-child(2),
		td:nth-child(2) {
			width: 45%;
		}

		th:nth-child(3),
		td:nth-child(3) {
			width: 40%;
		}

		th:nth-child(4),
		td:nth-child(4) {
			width: 10%;
		}
	}
</style>
