<script lang="ts">
	import TextInput from '$lib/components/input/TextInput.svelte';
	import { searchLibrary } from '$lib/api/getMusic';
	import TopResult from '$lib/components/TopResult.svelte';
	import { getItemEnumFromJellyfinItem } from '$lib/enums/item';
	import { Item } from '$lib/enums/item';

	let searchTerm = '';

	let results: any[] = [];

	const onSearchHandler = async () => {
		try {
			const items = await searchLibrary(searchTerm);
			console.log(items);
			results = items;
		} catch {}
	};
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
