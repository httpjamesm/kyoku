<script lang="ts">
	import { getLibrary } from '$lib/api/getMusic';
	import toast from 'svelte-french-toast';
	import RectangularItem from '$lib/components/RectangularItem.svelte';
	import { onMount } from 'svelte';
	import { Item } from '$lib/enums/item';
	import { getArtistItemFromJellyfinArtistItem } from '$lib/utils/artist';
	import InteractionButton from '$lib/components/buttons/InteractionButton.svelte';
	import MdShuffle from 'svelte-icons/md/MdShuffle.svelte';
	import { getShuffledLibrarySongs } from '$lib/api/getMusic';
	import { setQueue, getQueueItemFromJellyfinItem } from '$lib/utils/queue';

	let items: any = [];

	const init = async () => {
		try {
			items = await getLibrary();
		} catch (e) {
			toast.error((e as Error).message);
		}
	};

	onMount(() => {
		init();
	});

	const shuffleHandler = async () => {
		try {
			const songs = await getShuffledLibrarySongs();
			const queueItems = songs.map((song) => getQueueItemFromJellyfinItem(song));
			setQueue(queueItems);
		} catch (e) {
			toast.error((e as Error).message);
		}
	};
</script>

<br />
<InteractionButton icon={MdShuffle} on:click={shuffleHandler}>Shuffle</InteractionButton>
<div class="content">
	{#each items as item (item.Id)}
		<RectangularItem
			itemId={item.Id}
			albumId={item.Id}
			name={item.Name}
			album={item.Album}
			year={item.ProductionYear}
			type={Item.ALBUM}
			favourite={item.UserData.IsFavorite}
			artists={item.ArtistItems.map((item) => getArtistItemFromJellyfinArtistItem(item))}
		/>
	{/each}
</div>

<style lang="scss">
	.content {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
		gap: 1rem;
		padding-top: 1rem;
	}
</style>
