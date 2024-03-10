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
	import Select from '$lib/components/input/Select.svelte';
	import IconButton from '$lib/components/buttons/IconButton.svelte';
	import MdArrowUpward from 'svelte-icons/md/MdArrowUpward.svelte';
	import MdArrowDownward from 'svelte-icons/md/MdArrowDownward.svelte';

	let items: any = [];

	let sort = 'DateCreated';
	let order = 'Descending';

	const init = async () => {
		try {
			items = await getLibrary(sort, order);
		} catch (e) {
			toast.error((e as Error).message);
		}
	};

	$: if (sort && order) {
		init();
	}

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
<div class="manager">
	<div class="buttons">
		<InteractionButton icon={MdShuffle} on:click={shuffleHandler}>Shuffle</InteractionButton>
	</div>
	<div class="options">
		<Select
			id="sort-select"
			bind:value={sort}
			options={[
				{
					label: 'Date Added',
					value: 'DateCreated'
				},
				{
					label: 'Release Date',
					value: 'ProductionYear'
				},
				{
					label: 'Name',
					value: 'Name'
				},
				{
					label: 'Artist',
					value: 'AlbumArtist'
				}
			]}
		/>
		<IconButton
			on:click={() => {
				order = order === 'Descending' ? 'Ascending' : 'Descending';
			}}
		>
			{#if order === 'Descending'}
				<MdArrowDownward />
			{:else}
				<MdArrowUpward />
			{/if}
		</IconButton>
	</div>
</div>
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

	.manager {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.options {
			display: flex;
			align-items: center;
			gap: 0.5rem;
		}
	}
</style>
