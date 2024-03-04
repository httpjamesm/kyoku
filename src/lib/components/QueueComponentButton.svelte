<script lang="ts">
	import QueueComponent from './QueueComponent.svelte';

	export let albumId: string;
	export let name: string;
	export let artist: string;
	export let ticks = 0;
	export let itemId: string;
	export let isInQueue: boolean;
</script>

<button class="queue-component-button" on:click>
	<QueueComponent {albumId} {name} {artist} {itemId} {ticks} {isInQueue} />
</button>

<style lang="scss">
	.queue-component-button {
		all: unset;
		width: 100%;
	}
</style>
