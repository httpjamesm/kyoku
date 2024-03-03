<script lang="ts">
	import { formatMinutesShort, ticksToMinutes } from '$lib/utils/ticks';

	export let itemId: string;
	export let albumId: string;
	export let name: string;
	export let index: number;
	export let artists: string[];
	export let ticks: number;
</script>

<tr class="track-row" role="button" tabindex="0" on:click>
	<td class="index">
		{index}
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
		}

		.index {
			font-weight: bold;
			padding-left: 1rem;
		}

		.name {
			font-weight: bold;
			color: white;
		}
	}
</style>
