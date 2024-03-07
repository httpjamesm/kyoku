<script lang="ts">
	import { getLibrary } from '$lib/api/getMusic';
	import toast from 'svelte-french-toast';
	import RectangularItem from '$lib/components/RectangularItem.svelte';
	import { onMount } from 'svelte';
	import { Item } from '$lib/enums/item';
	import { getArtistItemFromJellyfinArtistItem } from '$lib/utils/artist';

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
</script>

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
