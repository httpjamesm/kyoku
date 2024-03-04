<script lang="ts">
	import { onMount } from 'svelte';
	import { getRecentlyPlayed, getSuggestions } from '$lib/api/getMusic';
	import toast from 'svelte-french-toast';
	import RectangularItem from '$lib/components/RectangularItem.svelte';
	import { Item } from '$lib/enums/item';
	import CircularItem from '$lib/components/CircularItem.svelte';

	let recentlyPlayed: any[] = [];
	let quickPicks: any[] = [];
	let albums: any[] = [];
	let artists: any[] = [];

	const init = async () => {
		try {
			recentlyPlayed = await getRecentlyPlayed();
			quickPicks = await getSuggestions();
			albums = await getSuggestions('MusicAlbum');
			artists = await getSuggestions('MusicArtist');
		} catch (e) {
			toast.error((e as Error).message);
		}
	};

	onMount(() => {
		init();
	});
</script>

<h3>Recently Played</h3>

<div class="row">
	{#each recentlyPlayed as item (item.Id)}
		<RectangularItem
			itemId={item.Id}
			albumId={item.AlbumId}
			name={item.Name}
			artist={item.AlbumArtist}
			album={item.Album}
			year={item.ProductionYear}
			favourite={item.UserData.IsFavorite}
			artistId={item.AlbumArtists[0].Id}
		/>
	{/each}
</div>

<br />

<h4 class="above-heading">SUGGESTIONS</h4>
<h3 style="margin-top: 0;">Quick Picks</h3>
<div class="row">
	{#each quickPicks as item (item.Id)}
		<RectangularItem
			itemId={item.Id}
			albumId={item.AlbumId}
			name={item.Name}
			artist={item.AlbumArtist}
			album={item.Album}
			year={item.ProductionYear}
			artistId={item.AlbumArtists[0].Id}
		/>
	{/each}
</div>

<br />

<h4 class="above-heading">SUGGESTIONS</h4>
<h3 style="margin-top: 0;">From your library</h3>
<div class="row">
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

<h4 class="above-heading">SUGGESTIONS</h4>
<h3 style="margin-top: 0;">Artists</h3>
<div class="row">
	{#each artists as item (item.Id)}
		<CircularItem artistId={item.Id} artist={item.Name} />
	{/each}
</div>

<style lang="scss">
	.row {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		gap: 1rem;
		overflow: none;
		height: fit-content;
		width: 100%;
	}

	.above-heading {
		font-weight: 200;
		margin-bottom: 0;
		font-size: 0.7rem;
	}
</style>
