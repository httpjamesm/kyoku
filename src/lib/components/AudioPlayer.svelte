<script lang="ts">
	import { queueStore } from '$lib/stores/queue';
	import { getStreamURLFromItemId } from '$lib/utils/stream';
	import { onDestroy } from 'svelte';
	import { isPlayingStore } from '$lib/stores/playing';
	import type { QueueStore } from '$lib/stores/queue';
	import { playbackProgressStore } from '$lib/stores/playing';
	import { getItemThumbnail } from '$lib/api/image';
	import { reportFinishedPlayback, reportPlaybackProgress } from '$lib/api/playback';
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

	const attachEventListeners = (element: HTMLAudioElement) => {
		console.log(
			`Attaching event listeners to: ${element === audioElement ? 'audioElement' : 'nextAudioElement'}`
		);
		element.onplay = () => {
			console.log('Play event');
			isPlayingStore.set(true);
		};
		element.onpause = () => {
			console.log('Pause event');
			isPlayingStore.set(false);
		};
		element.onended = handleTrackEnd;
		element.ontimeupdate = updateTime;
	};

	const detachEventListeners = (element: HTMLAudioElement) => {
		console.log(
			`Detaching event listeners from: ${element === audioElement ? 'audioElement' : 'nextAudioElement'}`
		);
		element.onplay = null;
		element.onpause = null;
		element.onended = null;
		element.ontimeupdate = null;
		element.onloadeddata = null;
	};

	const preloadNextTrack = () => {
		const nextIndex = $queueStore.currentIndex + 1;
		if (nextIndex < $queueStore.items.length) {
			nextQueueItem = $queueStore.items[nextIndex];
			updatePlayer(nextQueueItem, true); // Preload the next track
		}
	};

	export const play = async () => {
		audioElement
			.play()
			.then(() => {
				isPlayingStore.set(true); // update isPlayingStore
			})
			.catch(() => {
				console.log('play failed - falling back to onloadeddata handler');
				audioElement.onloadeddata = () => {
					play().then(() => {
						console.log('resetting onloadeddata');
						audioElement.onloadeddata = null;
					});
				};
			});
	};

	export const pause = () => {
		audioElement.pause();
		isPlayingStore.set(false); // update isPlayingStore
	};

	export const isPlaying = () => {
		return !audioElement.paused;
	};

	export const skip = () => {
		queueStore.update((store) => ({
			...store,
			currentIndex: Math.min(store.currentIndex + 1, store.items.length - 1)
		}));
	};

	export const prev = () => {
		queueStore.update((store) => ({
			...store,
			currentIndex: Math.max(store.currentIndex - 1, 0)
		}));
	};

	export const setProgress = (percentage: number) => {
		audioElement.currentTime = audioElement.duration * percentage;
	};

	let audioType = '';

	const updatePlayer = (track: QueueItem, isNext = false) => {
		if (!isNext && 'mediaSession' in navigator) {
			navigator.mediaSession.metadata = new MediaMetadata({
				title: track.name,
				artist: track.artists.map((artist) => artist.name).join(', '),
				album: track.album,
				artwork: [
					{ src: getItemThumbnail(track.albumId, 96, 96), sizes: '96x96', type: 'image/jpeg' },
					{ src: getItemThumbnail(track.albumId, 512, 512), sizes: '512x512', type: 'image/jpeg' }
				]
			});
		}

		audioType = `audio/${getSetting('playback.audioCodec')}`;

		const targetElement = isNext ? nextAudioElement : audioElement;
		const previousElement = isNext ? audioElement : nextAudioElement;

		// Ensure the previous audio element is paused and its event listeners are detached
		if (!previousElement.paused) {
			previousElement.pause();
		}
		detachEventListeners(previousElement);

		// Set the new source and preload the track
		targetElement.src = getStreamURLFromItemId(track.id);
		targetElement.load(); // Preload the track

		// Attach event listeners only if this is the current track
		if (!isNext) {
			attachEventListeners(targetElement);
		}
	};

	const handleTrackEnd = () => {
		if (currentQueueItem) {
			reportFinishedPlayback(currentQueueItem.id);
		}

		pause();

		// Detach event listeners from the old audio element
		detachEventListeners(audioElement);

		// Swap audio elements
		[audioElement, nextAudioElement] = [nextAudioElement, audioElement];
		[currentQueueItem, nextQueueItem] = [nextQueueItem, null];

		// Ensure the nextAudioElement (new audioElement) is not playing
		nextAudioElement.pause();

		// Attach event listeners to the new audio element
		attachEventListeners(audioElement);

		// Update the queueStore to reflect the change
		const nextIndex = $queueStore.currentIndex + 1;
		if (nextIndex < $queueStore.items.length) {
			currentQueueItem = $queueStore.items[nextIndex];
			queueStore.update((store) => ({
				...store,
				currentIndex: nextIndex
			}));
		}
	};

	const isRelevantChange = (prevState: QueueStore, currentState: QueueStore) => {
		// Check if the current index has changed
		if (prevState.currentIndex !== currentState.currentIndex) {
			return true;
		}

		// Check if the current track has changed
		const currentTrackChanged =
			prevState.items[prevState.currentIndex]?.id !==
			currentState.items[currentState.currentIndex]?.id;

		return currentTrackChanged;
	};

	const updateTime = () => {
		const currentTime = audioElement.currentTime;
		console.log('Current time:', currentTime); // Debug log
		if (currentQueueItem) {
			reportPlaybackProgress(currentTime, currentQueueItem.id);
		}
		const duration = audioElement.duration;
		const progress = (currentTime / duration) * 100;
		playbackProgressStore.set(progress);

		if ('mediaSession' in navigator) {
			navigator.mediaSession.setPositionState({
				duration,
				playbackRate: audioElement.playbackRate,
				position: currentTime
			});
		}
	};

	queueStore.subscribe(($queueStore) => {
		if (!audioElement) return;

		const { items: currentQueueItems, currentIndex } = $queueStore;

		// Only update the player if the track has ended or on initial load
		if (isRelevantChange(previousQueueState, $queueStore)) {
			currentQueueItem = currentQueueItems[currentIndex];
			if (currentQueueItem) {
				updatePlayer(currentQueueItem);
				console.log('updating player');
				play();
			}
		}

		previousQueueState = { items: [...currentQueueItems], currentIndex };
	});

	onDestroy(() => {
		if (audioElement) audioElement.pause();
		if (nextAudioElement) nextAudioElement.pause();
		detachEventListeners(audioElement);
		detachEventListeners(nextAudioElement);
	});

	// Ensure the initial setup attaches event listeners
	$: if (audioElement) {
		attachEventListeners(audioElement);
	}
</script>

<audio style="display: none;" bind:this={audioElement}>
	<source type={audioType} />
	Your browser does not support the audio element.
</audio>
<audio bind:this={nextAudioElement} style="display: none;">
	<!-- Preload element -->
	<source type={audioType} />
</audio>
