<script lang="ts">
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

	export let src = '';

	$: if (src && audioElement) {
		console.log('resetting to new src');
		pause();
		audioElement.src = src;
		audioElement.oncanplay = () => {
			console.log('on can play run');
			play();
		};
		audioElement.load();
	}
</script>

<audio style="display: none;" bind:this={audioElement}>
	<source type="audio/mp3" />
	Your browser does not support the audio element.
</audio>
