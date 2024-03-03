<script lang="ts">
	import { getLibrary } from '$lib/api/getMusic';
	import toast from 'svelte-french-toast';
	import RectangularItem from '$lib/components/RectangularItem.svelte';
	import { onMount } from 'svelte';

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
			artist={item.AlbumArtist}
			album={item.Album}
			year={item.ProductionYear}
			type="album"
		/>
	{/each}
</div>

<style lang="scss">
	.content {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 1rem;
		padding-top: 1rem;
	}
</style>
