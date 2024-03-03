<script lang="ts">
	import TextInput from '$lib/components/input/TextInput.svelte';
	import { searchLibrary } from '$lib/api/getMusic';
	import TopResult from '$lib/components/TopResult.svelte';
	import { getItemEnumFromJellyfinItem } from '$lib/enums/item';
	import { Item } from '$lib/enums/item';
	import QueueComponentButton from '$lib/components/QueueComponentButton.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import { playNow } from '$lib/utils/queue';
	import { onMount } from 'svelte';
	import { pushState } from '$app/navigation';

	let searchInput: TextInput;

	let searchTerm = '';

	let results: any[] = [];

	$: songResults = results.filter((result) => result.Type === 'Audio');

	const onSearchHandler = async () => {
		try {
			const items = await searchLibrary(searchTerm);
			results = items;
		} catch {}
	};

	onMount(() => {
		searchInput.focus();
		searchTerm = new URLSearchParams(window.location.search).get('term') || '';
		console.log(searchTerm);
	});
</script>

<br />
<div class="wrapper">
	<div class="search-container">
		<form on:submit|preventDefault={onSearchHandler}>
			<TextInput
				type="text"
				id="search-input"
				placeholder="Search for songs, albums, artists..."
				bind:value={searchTerm}
				bind:this={searchInput}
				on:change={() => {
					pushState(`/app/search?term=${searchTerm}`, {});
				}}
				required
			/>
		</form>
		{#if results.length > 0}
			<br />
			<div class="results">
				<TopResult
					name={results[0].Name}
					albumId={results[0].Type === 'Audio' ? results[0].AlbumId : results[0].Id}
					itemId={results[0].Id}
					type={getItemEnumFromJellyfinItem(results[0].Type)}
					artist={results[0].AlbumArtist}
					year={results[0].ProductionYear}
					album={getItemEnumFromJellyfinItem(results[0].Type) === Item.ALBUM
						? results[0].Name
						: results[0].Album}
				/>
				{#if results.length > 1}
					<br />
					<h3>Songs</h3>

					{#each songResults as item, index (item.Id)}
						<QueueComponentButton
							albumId={item.AlbumId}
							name={item.Name}
							artist={item.AlbumArtist}
							itemId={item.Id}
							on:click={() => {
								playNow(getItemEnumFromJellyfinItem(item.Type), item.Id);
							}}
						/>
						{#if index !== songResults.length}
							<Divider />
						{/if}
					{/each}
				{/if}
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.wrapper {
		width: 100%;
		display: flex;
		justify-content: center;

		.search-container {
			width: 50rem;
		}
	}
</style>
