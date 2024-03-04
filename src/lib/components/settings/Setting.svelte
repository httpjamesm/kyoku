<script lang="ts">
	export let name: string;
</script>

<div class="setting">
	<p>{name}</p>
	<slot />
</div>

<style lang="scss">
	.setting {
		display: flex;
		justify-content: space-between;
		align-items: center;
		p {
			margin: 0;
		}
	}
</style>
