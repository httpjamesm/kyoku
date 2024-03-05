<script lang="ts">
	import IconButton from './IconButton.svelte';
	import MdFavorite from 'svelte-icons/md/MdFavorite.svelte';
	import MdFavoriteBorder from 'svelte-icons/md/MdFavoriteBorder.svelte';
	import { getById } from '$lib/api/getMusic';
	import { markFavourite, unmarkFavourite } from '$lib/api/favourite';
	import toast from 'svelte-french-toast';

	export let itemId: string;
	export let favourite: boolean = false;

	let loading = false;

	const checkFavourite = async () => {
		const item = await getById(itemId);
		favourite = item.UserData.IsFavorite;
	};

	const onToggleFavouriteHandler = async () => {
		loading = true;
		try {
			if (favourite) {
				await unmarkFavourite(itemId);
			} else {
				await markFavourite(itemId);
			}
			await checkFavourite();
		} catch (e) {
			toast.error((e as Error).message);
		} finally {
			loading = false;
		}
	};

	$: if (itemId) {
		checkFavourite();
	}
</script>

<IconButton on:click={onToggleFavouriteHandler} {loading}>
	{#if favourite}
		<MdFavorite />
	{:else}
		<MdFavoriteBorder />
	{/if}
</IconButton>
