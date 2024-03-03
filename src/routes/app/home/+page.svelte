<script lang="ts">
	import { onMount } from 'svelte';
	import { getRecentlyPlayed } from '$lib/api/getMusic';
	import toast from 'svelte-french-toast';
	import RectangularItem from '$lib/components/RectangularItem.svelte';

	let recentlyPlayed: any[] = [];

	const init = async () => {
		try {
			recentlyPlayed = await getRecentlyPlayed();
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
		/>
	{/each}
</div>

<style lang="scss">
	.row {
		display: flex;
		gap: 1rem;
		overflow-x: auto;
		height: fit-content;
		width: 100%;
	}
</style>
