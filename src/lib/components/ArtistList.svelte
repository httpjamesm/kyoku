<script lang="ts">
	import type { ArtistItem } from '$lib/interfaces/artist';
	export let artists: ArtistItem[];
</script>

{#each artists as artist, index (artist.id)}
	<a class="item-reference-link" href="/app/artist?id={artist.id}" on:click|stopPropagation
		>{artist.name}</a
	>{#if index !== artists.length - 1}
		<span>, </span>
	{/if}
{/each}
