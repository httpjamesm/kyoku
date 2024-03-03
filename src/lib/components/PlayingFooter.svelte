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
	import { playingStore } from '$lib/stores/playing';
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

	let showExpanded = false;

	let favourite = false;

	let currentTrackId = '';

	const checkFavourite = async () => {
		const item = await getById(currentTrackId);
		favourite = item.UserData.IsFavorite;
	};

	$: if ($queueStore && $queueStore.items.length > $queueStore.currentIndex) {
		currentTrackId = $queueStore.items[$queueStore.currentIndex].id;
		checkFavourite();
	}

	const onToggleFavouriteHandler = async () => {
		try {
			if (favourite) {
				await unmarkFavourite(currentTrackId);
			} else {
				await markFavourite(currentTrackId);
			}
			await checkFavourite();
		} catch (e) {
			toast.error((e as Error).message);
		}
	};

	const { play, prev, pause, skip } = getContext<PlayerContextKey>(playerContextKey);
</script>

{#if showExpanded}
	<NowPlayingExpanded />
{/if}

<footer class="footer">
	<TrackProgressBar progress={$playbackProgressStore} />
	<div class="buttons">
		<button on:click={prev}>
			<MdSkipPrevious />
		</button>
		<button
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
		</button>
		<button on:click={skip}>
			<MdSkipNext />
		</button>
	</div>
	<div class="current-track-container">
		{#if $playingStore}
			<img
				src="{getUrl()}/Items/{$playingStore?.track
					.albumId}/Images/Primary?fillHeight=334&fillWidth=334&quality=96"
				alt="{$playingStore?.track.name} album art"
			/>
			<div class="details">
				<p class="name">{$playingStore?.track.name}</p>
				<p class="metadata">
					{$playingStore?.track.artist} • {$playingStore?.track.album} • {$playingStore?.track.year}
				</p>
			</div>
			<div class="buttons">
				<button on:click={onToggleFavouriteHandler}>
					{#if favourite}
						<MdFavorite />
					{:else}
						<MdFavoriteBorder />
					{/if}
				</button>
			</div>
		{/if}
	</div>
	<div class="buttons">
		<button
			on:click={() => {
				showExpanded = !showExpanded;
			}}
		>
			{#if !showExpanded}
				<MdArrowDropUp />
			{:else}
				<MdArrowDropDown />
			{/if}
		</button>
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
