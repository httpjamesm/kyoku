<script lang="ts">
	import QueueComponent from './QueueComponent.svelte';
	import type { ArtistItem } from '$lib/interfaces/artist';

	export let albumId: string;
	export let name: string;
	export let artists: ArtistItem[];
	export let ticks = 0;
	export let itemId: string;
	export let isInQueue: boolean;
</script>

<button class="queue-component-button" on:click>
	<QueueComponent {albumId} {name} {artists} {itemId} {ticks} {isInQueue} />
</button>

<style lang="scss">
	.queue-component-button {
		all: unset;
		width: 100%;
	}
</style>
