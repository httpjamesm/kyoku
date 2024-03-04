<script lang="ts">
	import MdRefresh from 'svelte-icons/md/MdRefresh.svelte';
	import IconButton from '../buttons/IconButton.svelte';

	export let name: string;
	export let subtitle = '';
	export let refresh: () => Promise<void>;
	let loading = false;
</script>

<div class="header">
	<div>
		{#if subtitle}
			<h4 class="above-heading">{subtitle}</h4>
		{/if}
		<h3 class:noMarginTop={subtitle} class="name">{name}</h3>
	</div>
	<div class="buttons">
		<IconButton
			{loading}
			on:click={() => {
				loading = true;
				refresh().finally(() => {
					loading = false;
				});
			}}
		>
			<MdRefresh />
		</IconButton>
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
	}
</style>
