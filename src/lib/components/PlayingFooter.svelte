<script lang="ts">
	import MdSkipPrevious from 'svelte-icons/md/MdSkipPrevious.svelte';
	import MdSkipNext from 'svelte-icons/md/MdSkipNext.svelte';
	import MdPause from 'svelte-icons/md/MdPause.svelte';
	import MdPlayArrow from 'svelte-icons/md/MdPlayArrow.svelte';
	import MdArrowDropUp from 'svelte-icons/md/MdArrowDropUp.svelte';
	import MdArrowDropDown from 'svelte-icons/md/MdArrowDropDown.svelte';
	import { playerContextKey } from '$lib/context/player';
	import type { PlayerContextKey } from '$lib/context/player';
	import { getContext } from 'svelte';
	import { getUrl } from '$lib/api/url';
	import { isPlayingStore } from '$lib/stores/playing';
	import { playbackProgressStore } from '$lib/stores/playing';
	import NowPlayingExpanded from './NowPlayingExpanded.svelte';
	import TrackProgressBar from './TrackProgressBar.svelte';
	import MdFavorite from 'svelte-icons/md/MdFavorite.svelte';
	import MdFavoriteBorder from 'svelte-icons/md/MdFavoriteBorder.svelte';
	import { queueStore } from '$lib/stores/queue';
	import { getById } from '$lib/api/getMusic';
	import { markFavourite, unmarkFavourite } from '$lib/api/favourite';
	import toast from 'svelte-french-toast';
	import { onDestroy } from 'svelte';
	import type { QueueItem } from '$lib/stores/queue';
	import { slide } from 'svelte/transition';
	import IconButton from './buttons/IconButton.svelte';

	let showExpanded = false;

	let favourite = false;

	let currentQueueItem: QueueItem | null = null;

	const checkFavourite = async () => {
		if (!currentQueueItem) return;
		const item = await getById(currentQueueItem.id);
		favourite = item.UserData.IsFavorite;
	};

	$: if ($queueStore && $queueStore.items.length > $queueStore.currentIndex) {
		currentQueueItem = $queueStore.items[$queueStore.currentIndex];
		checkFavourite();
	}

	let favouriteLoading = false;

	const onToggleFavouriteHandler = async () => {
		if (!currentQueueItem) return;
		favouriteLoading = true;
		try {
			if (favourite) {
				await unmarkFavourite(currentQueueItem.id);
			} else {
				await markFavourite(currentQueueItem.id);
			}
			await checkFavourite();
		} catch (e) {
			toast.error((e as Error).message);
		} finally {
			favouriteLoading = false;
		}
	};

	const { play, prev, pause, skip } = getContext<PlayerContextKey>(playerContextKey);

	const checkShortcut = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			showExpanded = false;
		}
	};

	onDestroy(() => {
		window.removeEventListener('keydown', checkShortcut);
	});
</script>

{#if showExpanded}
	<NowPlayingExpanded />
{/if}

<footer
	transition:slide
	class="footer"
	role="button"
	tabindex="0"
	on:click={(e) => {
		if (e.target === e.currentTarget) {
			showExpanded = !showExpanded;
		}
	}}
>
	<TrackProgressBar progress={$playbackProgressStore} />
	<div class="buttons">
		<IconButton on:click={prev}>
			<MdSkipPrevious />
		</IconButton>
		<IconButton
			on:click={() => {
				if ($isPlayingStore) {
					pause();
					return;
				}

				play();
			}}
		>
			{#if $isPlayingStore}
				<MdPause />
			{:else}
				<MdPlayArrow />
			{/if}
		</IconButton>
		<IconButton on:click={skip}>
			<MdSkipNext />
		</IconButton>
	</div>
	<div class="current-track-container">
		{#if currentQueueItem}
			<img
				src="{getUrl()}/Items/{currentQueueItem.albumId}/Images/Primary?fillHeight=334&fillWidth=334&quality=96"
				alt="{currentQueueItem.name} album art"
			/>
			<div class="details">
				<p class="name">{currentQueueItem.name}</p>
				<p class="metadata">
					<a href="/app/artist?id={currentQueueItem.artistId}">{currentQueueItem.artist}</a> •
					<a href="/app/album?id={currentQueueItem.albumId}">{currentQueueItem.album}</a>
					• {currentQueueItem.year}
				</p>
			</div>
			<div class="buttons">
				<IconButton on:click={onToggleFavouriteHandler} loading={favouriteLoading}>
					{#if favourite}
						<MdFavorite />
					{:else}
						<MdFavoriteBorder />
					{/if}
				</IconButton>
			</div>
		{/if}
	</div>
	<div class="buttons">
		<IconButton
			on:click={() => {
				showExpanded = !showExpanded;
				window.addEventListener('keydown', checkShortcut);
			}}
		>
			{#if !showExpanded}
				<MdArrowDropUp />
			{:else}
				<MdArrowDropDown />
			{/if}
		</IconButton>
	</div>
</footer>

<style lang="scss">
	.footer {
		width: 100%;
		background-color: #202020;
		height: 4rem;
		position: fixed;
		bottom: 0;
		left: 0;
		padding: 0.5rem 1rem;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		z-index: 5;
		align-items: center;

		box-shadow: 0 0 15px 8px black;

		user-select: none;
		-webkit-user-select: none;

		.buttons {
			display: flex;
			gap: 0.5rem;

			button {
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0.5rem;
				box-sizing: border-box;

				cursor: pointer;

				border-radius: 100%;

				&:hover {
					background-color: rgb(255, 255, 255, 0.3);
				}

				border: none;
				background: none;
				color: white;
				width: 54px;
				height: 54px;
			}
		}

		.current-track-container {
			display: flex;
			align-items: center;
			gap: 1rem;

			img {
				width: 3rem;
				height: 3rem;
				border-radius: 5px;
			}

			.details {
				p {
					margin: 0;
				}

				.name {
					font-weight: bold;
				}

				.metadata {
					color: #7c7c7c;

					a {
						color: inherit;
						text-decoration: none;

						&:hover {
							text-decoration: underline;
						}
					}
				}
			}

			.buttons {
				button {
					height: 2.5rem;
					width: 2.5rem;
				}
			}
		}
	}
</style>
