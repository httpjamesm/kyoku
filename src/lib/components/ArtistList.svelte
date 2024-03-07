<script lang="ts">
	import type { ArtistItem } from '$lib/interfaces/artist';
	import { goto } from '$app/navigation';

	export let artists: ArtistItem[];
</script>

{#each artists as artist, index (artist.id)}
	<a
		href={null}
		class="item-reference-link"
		on:click|stopPropagation={() => {
			goto(`/app/artist?id=${artist.id}`);
		}}>{artist.name}</a
	>{#if index !== artists.length - 1}
		<span>, </span>
	{/if}
{/each}
