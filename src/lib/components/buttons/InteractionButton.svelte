<script lang="ts">
	import type { ComponentType, SvelteComponent } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let type: 'primary' | 'secondary' = 'primary';
	export let icon: ComponentType<SvelteComponent>;

	const handleClick = (e: Event) => {
		e.stopPropagation();
		console.log('stopped propa');
		dispatch('click');
	};
</script>

<button
	class="button"
	class:primary={type === 'primary'}
	class:secondary={type === 'secondary'}
	on:click={handleClick}
>
	<div class="icon">
		<svelte:component this={icon} />
	</div>
	<slot />
</button>

<style lang="scss">
	.button {
		padding: 0.5rem 2rem;
		box-sizing: border-box;
		border-radius: 10px;
		box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
		border: none;
		font-size: 1rem;
		font-weight: bold;
		display: flex;
		gap: 0.25rem;
		align-items: center;
		color: black;
		transition-duration: 250ms;
		cursor: pointer;

		&.primary {
			background-color: #ffffff;

			&:hover {
				background-color: rgb(255, 255, 255, 0.7);
			}
		}

		&.secondary {
			border: 2px solid white;
			color: white;
			background-color: transparent;

			&:hover {
				border-color: #b2b2b2;
			}
		}

		.icon {
			height: 1.5rem;
			width: 1.5rem;
		}
	}
</style>
