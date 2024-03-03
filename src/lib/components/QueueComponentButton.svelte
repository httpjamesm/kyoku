<script lang="ts">
	import QueueComponent from './QueueComponent.svelte';

	export let albumId: string;
	export let name: string;
	export let artist: string;
	export let duration = 0;
	export let itemId: string;
</script>

<button class="queue-component-button" on:click>
	<QueueComponent {albumId} {name} {artist} {itemId} />
</button>

<style lang="scss">
	.queue-component-button {
		all: unset;
		cursor: pointer;

		transition-duration: 100ms;

		&:hover {
			opacity: 0.5;
		}
	}
</style>
