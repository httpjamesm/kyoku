<script lang="ts">
	export let id: string;
	export let label = '';
	export let checked = false;
	export let required = false;

	// Function to toggle the checked state
	const toggle = () => {
		checked = !checked;
	};
</script>

<div class="form-control">
	{#if label}
		<label for={id}>{label}</label>
	{/if}
	<button class="toggle-switch" on:click={toggle} tabindex="0">
		<input type="checkbox" {id} bind:checked {required} hidden />
		<span class="slider"></span>
	</button>
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

		.toggle-switch {
			all: unset;
			position: relative;
			display: inline-block;
			width: 60px;
			height: 34px;

			input {
				opacity: 0;
				width: 0;
				height: 0;
			}
		}

		.slider {
			position: absolute;
			cursor: pointer;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: #303030;
			transition: 0.4s;
			border-radius: 34px;

			&::before {
				position: absolute;
				content: '';
				height: 26px;
				width: 26px;
				left: 4px;
				bottom: 4px;
				background-color: white;
				transition: 0.4s;
				border-radius: 50%;
			}
		}

		input:checked + .slider {
			background: rgb(170, 92, 195);
			background: linear-gradient(127deg, rgba(170, 92, 195, 1) 0%, rgba(0, 164, 220, 1) 100%);
		}

		input:focus + .slider {
			box-shadow: 0 0 1px #2196f3;
		}

		input:checked + .slider:before {
			transform: translateX(26px);
		}
	}
</style>
