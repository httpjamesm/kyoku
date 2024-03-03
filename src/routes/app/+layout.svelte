<script lang="ts">
	import AudioPlayer from '$lib/components/AudioPlayer.svelte';
	import { playerContextKey } from '$lib/context/player';
	import { setContext } from 'svelte';
	import PlayingFooter from '$lib/components/PlayingFooter.svelte';

	let menuItems = ['Home', 'Library', 'Search'];

	let audioPlayer: any;

	let playerSrc = '';

	// Define the functions you want to pass down
	function play() {
		audioPlayer.play();
	}

	function pause() {
		audioPlayer.pause();
	}

	function setSrc(src: string) {
		playerSrc = src;
	}

	function isPlaying() {
		return audioPlayer.isPlaying();
	}

	function skip() {
		audioPlayer.skip();
	}

	function prev() {
		audioPlayer.prev();
	}

	// Set the context
	setContext(playerContextKey, { play, pause, setSrc, isPlaying, skip, prev });
</script>

<div class="blob-container">
	<div class="blob" />
</div>

<div class="content">
	<div class="interactive">
		<header class="header">
			<nav>
				{#each menuItems as menuItem}
					<a
						href="/app/{menuItem}"
						class:selected={window.location.pathname === `/app/${menuItem.toLowerCase()}`}
						>{menuItem}</a
					>
				{/each}
			</nav>
		</header>

		<slot />

		<PlayingFooter />
	</div>
</div>

<AudioPlayer bind:this={audioPlayer} bind:src={playerSrc} />

<style lang="scss">
	.content {
		position: absolute;
		z-index: 1;
		top: 0;
		left: 0;
		min-height: 100vh;
		width: 100%;

		.interactive {
			position: relative;
			padding: 4rem 1rem;
			padding-bottom: 10rem;
			box-sizing: border-box;
			color: white;
			min-height: 100vh;

			.header {
				width: 100%;

				nav {
					display: flex;
					gap: 1.25rem;
					align-items: center;

					a {
						color: white;

						&.selected {
							font-weight: 900;
						}

						font-size: 2rem;
						text-decoration: none;
					}
				}
			}
		}
	}

	.blob-container {
		position: absolute;
		z-index: 0;
		top: 0;
		left: 0;
		width: 15rem;
		box-shadow: 0 0 250px 10rem blue;
	}
</style>
