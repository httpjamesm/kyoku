<script lang="ts">
	import TextInput from '$lib/components/input/TextInput.svelte';
	import { searchLibrary } from '$lib/api/getMusic';
	import TopResult from '$lib/components/TopResult.svelte';

	let searchTerm = '';

	let results: any[] = [];

	const onSearchHandler = async () => {
		try {
			const items = await searchLibrary(searchTerm);
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
					albumId={results[0].AlbumId}
					itemId={results[0].Id}
					type={'song'}
					artist={results[0].AlbumArtist}
					year={results[0].ProductionYear}
					album={results[0].Album}
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
