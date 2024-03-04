<script lang="ts">
	export let loading = false;
</script>

<button class="icon-button" on:click disabled={loading}>
	{#if loading}
		<img src="/icons/loading-oval.svg" class="loading-icon" alt="loading" />
	{:else}
		<slot />
	{/if}
</button>

<style lang="scss">
	.icon-button {
		cursor: pointer;
		height: 3rem;
		width: 3rem;
		padding: 0.75rem;
		box-sizing: border-box;
		background: transparent;
		border: none;
		border-radius: 100%;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;

		&:hover {
			background-color: rgb(255, 255, 255, 0.3);
		}

		.loading-icon {
			height: 100%;
			width: 100%;
		}
	}
</style>
