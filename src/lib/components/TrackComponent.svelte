<script lang="ts">
	import { formatMinutesShort, ticksToMinutes } from '$lib/utils/ticks';
	import { queueStore } from '$lib/stores/queue';

	export let itemId: string;
	export let albumId: string;
	export let name: string;
	export let index: number;
	export let artists: string[];
	export let ticks: number;

	$: currentInQueue =
		$queueStore?.items.length > 0
			? $queueStore?.items[$queueStore?.currentIndex].id === itemId
			: false;
</script>

<tr class="track-row" role="button" tabindex="0" on:click>
	<td class="index">
		{#if currentInQueue}
			<div class="icon">
				<img src="/icons/now-playing.svg" alt="Now playing" />
			</div>
		{:else}
			{index}
		{/if}
	</td>
	<td class="name">{name}</td>
	<td>{artists.join(', ')}</td>
	<td class="duration">{formatMinutesShort(ticksToMinutes(ticks))}</td>
</tr>

<style lang="scss">
	.track-row {
		cursor: pointer;

		&:hover {
			background-color: rgb(255, 255, 255, 0.1);
		}

		td {
			padding: 1rem 0;
			color: #7c7c7c;
		}

		.duration {
			text-align: right;

			padding-right: 1rem;
			border-radius: 0 10px 10px 0;
		}

		.index {
			font-weight: bold;
			padding-left: 1rem;

			border-radius: 10px 0 0 10px;

			.icon {
				img {
					height: 1rem;
					width: 1rem;
				}
			}
		}

		.name {
			font-weight: bold;
			color: white;
		}
	}
</style>
