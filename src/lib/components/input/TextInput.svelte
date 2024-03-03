<script lang="ts">
	export let id: string;
	export let label = '';
	export let value = '';
	export let placeholder = '';
	export let required = false;
	export let type = 'text';

	let input: HTMLInputElement;

	export const focus = () => {
		input.focus();
	};
</script>

<div class="form-control">
	{#if label}
		<label for={id}>{label}</label>
	{/if}
	{#if type === 'text'}
		<input {id} type="text" {placeholder} bind:value on:change bind:this={input} {required} />
	{:else if type === 'password'}
		<input {id} type="password" {placeholder} bind:value on:change bind:this={input} {required} />
	{:else if type === 'url'}
		<input {id} type="url" {placeholder} bind:value on:change bind:this={input} {required} />
	{/if}
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

		input {
			background-color: #303030;
			border: 1px solid #606060;
			padding: 0.5rem 1rem;
			border-radius: 10px;
			font-size: 1rem;
			width: 100%;
			box-sizing: border-box;
			color: white;
		}
	}
</style>
