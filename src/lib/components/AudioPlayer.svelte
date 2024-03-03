<script lang="ts">
	import { queueStore } from '$lib/stores/queue';
	import { getUrl } from '$lib/api/url';
	import { onDestroy } from 'svelte';
	import { playingStore, isPlayingStore } from '$lib/stores/playing';
	import type { QueueStore } from '$lib/stores/queue';
	import { playbackProgressStore } from '$lib/stores/playing';
	import { getItemThumbnail } from '$lib/api/image';

	let audioElement: HTMLAudioElement;
	let previousQueueState = {
		items: [],
		currentIndex: 0
	} as QueueStore;

	export function play() {
		console.log(audioElement.currentTime);
		audioElement.play();
		isPlayingStore.set(true);
	}

	export function pause() {
		audioElement.pause();
		console.log(audioElement.currentTime);
		isPlayingStore.set(false);
	}

	export function isPlaying() {
		return !audioElement.paused;
	}

	export function skip() {
		queueStore.update((store) => ({
			...store,
			currentIndex: Math.min(store.currentIndex + 1, store.items.length - 1)
		}));
	}

	export function prev() {
		queueStore.update((store) => ({
			...store,
			currentIndex: Math.max(store.currentIndex - 1, 0)
		}));
	}

	export function setProgress(percentage: number) {
		audioElement.currentTime = audioElement.duration * percentage;
	}

	// Function to update the player with a new track
	function updatePlayer(track: any) {
		if ('mediaSession' in navigator) {
			navigator.mediaSession.metadata = new MediaMetadata({
				title: track.name,
				artist: track.artist,
				album: track.album,
				artwork: [
					{ src: getItemThumbnail(track.albumId, 96, 96), sizes: '96x96', type: 'image/jpeg' },
					{ src: getItemThumbnail(track.albumId, 512, 512), sizes: '512x512', type: 'image/jpeg' }
				]
			});
		}

		audioElement.src = getSrcFromItemId(track.id);
		audioElement.load();
		playingStore.set({
			track: {
				albumId: track.albumId,
				name: track.name,
				album: track.album,
				artist: track.artist,
				year: track.year
			}
		});
		audioElement.oncanplay = () => {
			play();
		};
	}

	queueStore.subscribe(($queueStore) => {
		if (!audioElement) return;

		const { items: currentQueueItems, currentIndex } = $queueStore;
		const currentQueueItem = currentQueueItems[currentIndex];

		// Only update the player if the track has ended or on initial load
		if (previousQueueState.currentIndex !== currentIndex || !previousQueueState.items.length) {
			if (currentQueueItem) {
				updatePlayer(currentQueueItem);
			}
		}

		previousQueueState = { items: [...currentQueueItems], currentIndex };
	});

	const getSrcFromItemId = (id: string) => {
		return `${getUrl(false)}/Audio/${id}/universal?audioCodec=mp3&api_key=${window.localStorage.getItem('accessToken')}&Container=mp3,aac,m4a|aac,m4b|aac,flac,alac,m4a|alac,m4b|alac,wav&StartTimeTicks=0`;
	};

	$: if (audioElement) {
		audioElement.onended = () => {
			skip();
			// Explicitly call updatePlayer for the next track after skip
			const { items, currentIndex } = $queueStore;
			if (items[currentIndex]) {
				updatePlayer(items[currentIndex]);
			}
		};

		audioElement.ontimeupdate = () => {
			const currentTime = audioElement.currentTime;
			const duration = audioElement.duration;
			const progress = (currentTime / duration) * 100;
			playbackProgressStore.set(progress);
		};
	}

	onDestroy(() => {
		if (audioElement) {
			audioElement.oncanplay = null;
			audioElement.onended = null;
		}
	});
</script>

<audio style="display: none;" bind:this={audioElement}>
	<source type="audio/mp3" />
	Your browser does not support the audio element.
</audio>
