<script lang="ts">
	export let name: string;
</script>

<h3>{name}</h3>

<div class="settings">
	<slot />
</div>

<style lang="scss">
	.settings {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
