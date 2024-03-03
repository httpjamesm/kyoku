<script lang="ts">
	let audioElement: HTMLAudioElement;

	export function play() {
		audioElement.play();
	}

	export function pause() {
		audioElement.pause();
	}

	export let src = '';

	$: if (src && audioElement) {
		pause();
		audioElement.src = src;
		audioElement.load();
		audioElement.oncanplay = () => {
			play();
		};
	}
</script>

<audio style="display: none;" bind:this={audioElement} controls>
	<source type="audio/mp3" />
	Your browser does not support the audio element.
</audio>
