<script lang="ts">
	export let id: string;
	export let label = '';
	export let value = '';
	export let options: { value: string; label: string }[] = [];
	export let required = false;

	let select: HTMLSelectElement;

	export const focus = () => {
		select.focus();
	};
</script>

<div class="form-control">
	{#if label}
		<label for={id}>{label}</label>
	{/if}
	<select {id} bind:value on:change bind:this={select} {required}>
		<option value="" disabled selected>Click to select</option>
		{#each options as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
</div>

<style lang="scss">
	.form-control {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;

		label {
			margin-bottom: 0.5rem;
			text-align: left;
		}

		select {
			background-color: #303030;
			border: 1px solid #606060;
			padding: 0.5rem 1rem;
			border-radius: 10px;
			font-size: 1rem;
			width: 100%;
			box-sizing: border-box;
			color: white;
			appearance: none;
			-webkit-appearance: none;
			-moz-appearance: none;
		}
	}
</style>
