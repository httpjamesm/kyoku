<script lang="ts">
	import { queueStore } from '$lib/stores/queue';
	import { getUrl } from '$lib/api/url';
	import { onDestroy } from 'svelte';
	import { playingStore } from '$lib/stores/playing';

	let audioElement: HTMLAudioElement;

	export function play() {
		console.log(audioElement.currentTime);
		audioElement.play();
	}

	export function pause() {
		audioElement.pause();
		console.log(audioElement.currentTime);
	}

	export function isPlaying() {
		return !audioElement.paused;
	}

	export function skip() {
		queueStore.update((store) => ({
			...store,
			currentIndex: Math.min(store.currentIndex + 1, store.items.length)
		}));
	}

	export function prev() {
		queueStore.update((store) => ({
			...store,
			currentIndex: Math.min(store.currentIndex - 1, 0)
		}));
	}

	export let src = '';

	queueStore.subscribe(($queueStore) => {
		if (!audioElement) return;
		pause();

		const currentQueueItem = $queueStore.items[$queueStore.currentIndex];

		audioElement.src = getSrcFromItemId(currentQueueItem.id);

		playingStore.set({
			track: {
				albumId: currentQueueItem.albumId,
				name: currentQueueItem.name,
				album: currentQueueItem.album,
				artist: currentQueueItem.artist,
				year: currentQueueItem.year
			}
		});

		audioElement.oncanplay = () => {
			play();
		};
		audioElement.onended = () => {
			skip();
		};
		audioElement.load();
	});

	const getSrcFromItemId = (id: string) => {
		return `${getUrl(false)}/Audio/${id}/universal?audioCodec=mp3&api_key=${window.localStorage.getItem('accessToken')}&Container=mp3,aac,m4a|aac,m4b|aac,flac,alac,m4a|alac,m4b|alac,wav&StartTimeTicks=0`;
	};

	onDestroy(() => {
		// Cleanup event listeners if the component is destroyed
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
