<script lang="ts">
	import { queueStore } from '$lib/stores/queue';
	import { getUrl } from '$lib/api/url';
	import { onDestroy } from 'svelte';
	import { isPlayingStore } from '$lib/stores/playing';
	import type { QueueStore } from '$lib/stores/queue';
	import { playbackProgressStore } from '$lib/stores/playing';
	import { getItemThumbnail } from '$lib/api/image';
	import {
		reportPlayback,
		reportFinishedPlayback,
		reportPlaybackProgress
	} from '$lib/api/playback';
	import type { QueueItem } from '$lib/stores/queue';
	import { getSetting } from '$lib/utils/settings';

	let audioElement: HTMLAudioElement;
	let nextAudioElement: HTMLAudioElement = new Audio();
	let previousQueueState = {
		items: [],
		currentIndex: 0
	} as QueueStore;

	let currentQueueItem: QueueItem | null = null;
	let nextQueueItem: QueueItem | null = null;

	$: if ($queueStore) {
		if ($queueStore.items.length > $queueStore.currentIndex) {
			currentQueueItem = $queueStore.items[$queueStore.currentIndex];
			// Preload the next track when the current track is set
			preloadNextTrack();
		}
	}

	function preloadNextTrack() {
		const nextIndex = $queueStore.currentIndex + 1;
		if (nextIndex < $queueStore.items.length) {
			nextQueueItem = $queueStore.items[nextIndex];
			updatePlayer(nextQueueItem, true); // Preload the next track
		}
	}

	export function play() {
		if (nextAudioElement.src && !nextAudioElement.paused) return;
		audioElement.play();
	}

	export function pause() {
		audioElement.pause();
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

	let audioType = '';

	function updatePlayer(track: QueueItem, isNext = false) {
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

		audioType = `audio/${getSetting('playback.audioCodec')}`;

		const targetElement = isNext ? nextAudioElement : audioElement;

		targetElement.src = getSrcFromItemId(track.id);
		targetElement.load(); // Preload the track

		if (!isNext) {
			// Only attach event listeners to the current track
			targetElement.oncanplaythrough = () => {
				play();
			};

			targetElement.ontimeupdate = () => {
				const currentTime = targetElement.currentTime;
				if (currentQueueItem) {
					reportPlaybackProgress(currentTime, currentQueueItem.id);
				}
				const duration = targetElement.duration;
				const progress = (currentTime / duration) * 100;
				playbackProgressStore.set(progress);
			};

			targetElement.onended = () => {
				handleTrackEnd();
			};
		}
	}

	const handleTrackEnd = () => {
		if (currentQueueItem) {
			reportFinishedPlayback(currentQueueItem.id);
		}

		// Swapping logic remains the same but is encapsulated in a function
		[audioElement, nextAudioElement] = [nextAudioElement, audioElement];
		[currentQueueItem, nextQueueItem] = [nextQueueItem, null];

		preloadNextTrack(); // Preload the next track

		play(); // Play the next track
	};

	function isRelevantChange(prevState: QueueStore, currentState: QueueStore) {
		// Check if the current index has changed
		if (prevState.currentIndex !== currentState.currentIndex) {
			return true;
		}

		// Check if the current track has changed
		const currentTrackChanged =
			prevState.items[prevState.currentIndex]?.id !==
			currentState.items[currentState.currentIndex]?.id;

		return currentTrackChanged;
	}

	queueStore.subscribe(($queueStore) => {
		if (!audioElement) return;

		const { items: currentQueueItems, currentIndex } = $queueStore;

		// Only update the player if the track has ended or on initial load
		if (isRelevantChange(previousQueueState, $queueStore)) {
			const currentQueueItem = currentQueueItems[currentIndex];
			if (currentQueueItem) {
				updatePlayer(currentQueueItem);
			}
		}

		previousQueueState = { items: [...currentQueueItems], currentIndex };
	});

	const getSrcFromItemId = (id: string) => {
		let url = `${getUrl(false)}/Audio/${id}/universal?audioCodec=${getSetting('playback.audioCodec')}&api_key=${window.localStorage.getItem('accessToken')}&Container=mp3,aac,m4a|aac,m4b|aac,flac,alac,m4a|alac,m4b|alac,wav&StartTimeTicks=0`;

		const quality = getSetting('playback.audioQuality');
		if (quality !== 'auto') {
			url += `&audioBitRate=${quality}`;
		}

		return url;
	};

	$: if (audioElement) {
		audioElement.onended = () => {
			if (currentQueueItem) {
				reportFinishedPlayback(currentQueueItem.id);
			}

			queueStore.update((store) => {
				const nextIndex = Math.min(store.currentIndex + 1, store.items.length - 1);
				return { ...store, currentIndex: nextIndex };
			});

			[audioElement, nextAudioElement] = [nextAudioElement, audioElement];
			[nextQueueItem, currentQueueItem] = [null, nextQueueItem]; // Correctly update queue items

			play();

			preloadNextTrack();
		};

		audioElement.ontimeupdate = () => {
			const currentTime = audioElement.currentTime;
			if (currentQueueItem) {
				reportPlaybackProgress(currentTime, currentQueueItem.id);
			}
			const duration = audioElement.duration;
			const progress = (currentTime / duration) * 100;
			playbackProgressStore.set(progress);
		};
	}

	onDestroy(() => {
		if (audioElement) {
			audioElement.oncanplaythrough = null;
			audioElement.onended = null;
		}
	});
</script>

<audio
	style="display: none;"
	bind:this={audioElement}
	on:play={() => {
		isPlayingStore.set(true);
		if (currentQueueItem) {
			reportPlayback(currentQueueItem.id, true);
		}
	}}
	on:pause={() => {
		isPlayingStore.set(false);
		if (currentQueueItem) {
			reportPlayback(currentQueueItem.id, false);
		}
	}}
>
	<source type={audioType} />
	Your browser does not support the audio element.
</audio>
<audio bind:this={nextAudioElement} style="display: none;">
	<!-- Preload element -->
	<source type={audioType} />
</audio>
