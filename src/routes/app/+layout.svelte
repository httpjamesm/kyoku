<script lang="ts">
	import AudioPlayer from '$lib/components/AudioPlayer.svelte';
	import { playerContextKey } from '$lib/context/player';
	import { setContext } from 'svelte';
	import PlayingFooter from '$lib/components/PlayingFooter.svelte';
	import { page } from '$app/stores';
	import MdHome from 'svelte-icons/md/MdHome.svelte';
	import MdLibraryMusic from 'svelte-icons/md/MdLibraryMusic.svelte';
	import MdSearch from 'svelte-icons/md/MdSearch.svelte';
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import MdSettings from 'svelte-icons/md/MdSettings.svelte';
	import { primaryOrBackupServerConnectivity } from '$lib/api/url';
	import { navigating } from '$app/stores';
	import { queueStore } from '$lib/stores/queue';

	let menuItems = [
		{
			name: 'Home',
			icon: MdHome,
			type: 'full'
		},
		{ name: 'Library', icon: MdLibraryMusic, type: 'full' },
		{ name: 'Search', icon: MdSearch, type: 'full' },
		{
			name: 'Settings',
			icon: MdSettings,
			type: 'icon'
		}
	];

	let audioPlayer: any;

	// Define the functions you want to pass down
	function play() {
		audioPlayer.play();
	}

	function pause() {
		audioPlayer.pause();
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

	function setProgress(percentage: number) {
		pause();
		audioPlayer.setProgress(percentage);
		play();
	}

	const checkShortcut = (e: KeyboardEvent) => {
		if (!e.ctrlKey && !e.metaKey) return;
		const key = e.key.toLowerCase();
		switch (key) {
			case '3':
			case 'k':
				e.preventDefault();
				goto('/app/search');
				return;
			case '2':
			case 'l':
				e.preventDefault();
				goto('/app/library');
				return;
			case '1':
				e.preventDefault();
				goto('/app/home');
				return;
		}
	};

	$: if (navigating) {
		primaryOrBackupServerConnectivity();
	}

	onMount(() => {
		window.addEventListener('keydown', checkShortcut);
		window.addEventListener('focus', primaryOrBackupServerConnectivity);
	});

	onDestroy(() => {
		window.removeEventListener('keydown', checkShortcut);
		window.removeEventListener('focus', primaryOrBackupServerConnectivity);
	});

	// Set the context
	setContext(playerContextKey, { play, pause, isPlaying, skip, prev, setProgress });
</script>

<div class="blob-container">
	<div class="blob" />
</div>

<div class="content">
	<div class="interactive">
		<header class="header">
			<nav>
				{#each menuItems.filter((item) => item.type === 'full') as menuItem}
					<a
						draggable={false}
						href="/app/{menuItem.name.toLowerCase()}"
						class:selected={$page.url.pathname === `/app/${menuItem.name.toLowerCase()}`}
					>
						<div class="icon"><svelte:component this={menuItem.icon} /></div>
						{menuItem.name}
					</a>
				{/each}
			</nav>
			<div class="icon-nav">
				{#each menuItems.filter((item) => item.type === 'icon') as menuItem}
					<a
						draggable={false}
						href="/app/{menuItem.name.toLowerCase()}"
						class:selected={$page.url.pathname === `/app/${menuItem.name.toLowerCase()}`}
					>
						<svelte:component this={menuItem.icon} />
					</a>
				{/each}
			</div>
		</header>

		<slot />

		{#if $queueStore?.items.length > 0}
			<PlayingFooter />
		{/if}
	</div>
</div>

<AudioPlayer bind:this={audioPlayer} />

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
				display: flex;
				justify-content: space-between;
				align-items: center;

				nav {
					display: flex;
					gap: 1.25rem;
					align-items: center;

					a {
						color: white;
						padding: 0.5rem;
						border-radius: 10px;
						transition-duration: 250ms;

						display: flex;
						gap: 0.5rem;
						align-items: center;

						&:hover {
							background-color: rgb(255, 255, 255, 0.2);
						}

						&.selected {
							font-weight: 900;
							background-color: rgb(255, 255, 255, 0.4);
						}

						.icon {
							height: 2rem;
							width: 2rem;
						}

						font-size: 2rem;
						text-decoration: none;
					}
				}

				.icon-nav {
					a {
						background: transparent;
						border: none;
						border-radius: 100%;
						height: 3rem;
						width: 3rem;
						padding: 0.5rem;
						box-sizing: border-box;
						color: white;
						display: flex;
						align-items: center;
						justify-content: center;
						cursor: pointer;

						&:hover {
							background-color: rgb(255, 255, 255, 0.2);
						}

						&.selected {
							font-weight: 900;
							background-color: rgb(255, 255, 255, 0.4);
						}
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
