<script lang="ts">
	import MdRefresh from 'svelte-icons/md/MdRefresh.svelte';

	export let name: string;
	export let subtitle = '';
	export let refresh = () => {};
</script>

<div class="header">
	<div>
		{#if subtitle}
			<h4 class="above-heading">{subtitle}</h4>
		{/if}
		<h3 class:noMarginTop={subtitle} class="name">{name}</h3>
	</div>
	<div class="buttons">
		<button on:click={refresh}>
			<MdRefresh />
		</button>
	</div>
</div>

<div class="row">
	<slot />
</div>

<style lang="scss">
	.noMarginTop {
		margin-top: 0;
	}

	.above-heading {
		font-weight: 200;
		margin-bottom: 0;
		font-size: 0.7rem;
		text-transform: uppercase;
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		gap: 1rem;
		overflow: none;
		height: fit-content;
		width: 100%;
	}

	.name {
		text-transform: capitalize;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.buttons {
			button {
				cursor: pointer;
				height: 3rem;
				width: 3rem;
				padding: 0.75rem;
				box-sizing: border-box;
				background: transparent;
				border: none;
				border-radius: 100%;
				color: white;

				&:hover {
					background-color: rgb(255, 255, 255, 0.3);
				}
			}
		}
	}
</style>
