<script lang="ts">
	import { onMount } from 'svelte';
	import { getRecentlyPlayed, getSuggestions } from '$lib/api/getMusic';
	import toast from 'svelte-french-toast';
	import RectangularItem from '$lib/components/RectangularItem.svelte';
	import { Item } from '$lib/enums/item';
	import CircularItem from '$lib/components/CircularItem.svelte';
	import HomeSection from '$lib/components/home/HomeSection.svelte';
	import { getArtistItemFromJellyfinArtistItem } from '$lib/utils/artist';

	let recentlyPlayed: any[] = [];
	let quickPicks: any[] = [];
	let albums: any[] = [];
	let artists: any[] = [];

	const refreshRecentlyPlayed = async () => {
		recentlyPlayed = await getRecentlyPlayed();
	};

	const refreshQuickPicks = async () => {
		quickPicks = await getSuggestions();
	};

	const refreshAlbums = async () => {
		albums = await getSuggestions('MusicAlbum');
	};

	const refreshArtists = async () => {
		artists = await getSuggestions('MusicArtist');
	};

	const init = async () => {
		try {
			await refreshRecentlyPlayed();
			await refreshQuickPicks();
			await refreshAlbums();
			await refreshArtists();
		} catch (e) {
			toast.error((e as Error).message);
		}
	};

	onMount(() => {
		init();
	});
</script>

<HomeSection name="recently played" refresh={refreshRecentlyPlayed}>
	{#each recentlyPlayed as item (item.Id)}
		<RectangularItem
			itemId={item.Id}
			albumId={item.AlbumId}
			name={item.Name}
			album={item.Album}
			year={item.ProductionYear}
			favourite={item.UserData.IsFavorite}
			artists={item.ArtistItems.map((item) => getArtistItemFromJellyfinArtistItem(item))}
		/>
	{/each}
</HomeSection>

<br />

<HomeSection name="quick picks" subtitle="for you" refresh={refreshQuickPicks}>
	{#each quickPicks as item (item.Id)}
		<RectangularItem
			itemId={item.Id}
			albumId={item.AlbumId}
			name={item.Name}
			album={item.Album}
			year={item.ProductionYear}
			artists={item.ArtistItems.map((item) => getArtistItemFromJellyfinArtistItem(item))}
		/>
	{/each}
</HomeSection>

<br />

<HomeSection name="from your library" subtitle="for you" refresh={refreshAlbums}>
	{#each albums as item (item.Id)}
		<RectangularItem
			itemId={item.Id}
			albumId={item.Id}
			name={item.Name}
			album={item.Album}
			year={item.ProductionYear}
			type={Item.ALBUM}
			artists={item.ArtistItems.map((item) => getArtistItemFromJellyfinArtistItem(item))}
		/>
	{/each}
</HomeSection>

<br />

<HomeSection name="recommended artists" subtitle="for you" refresh={refreshArtists}>
	{#each artists as item (item.Id)}
		<CircularItem artistId={item.Id} artist={item.Name} />
	{/each}
</HomeSection>
