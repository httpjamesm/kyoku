<script lang="ts">
	import SettingsSection from '$lib/components/settings/SettingsSection.svelte';
	import Setting from '$lib/components/settings/Setting.svelte';
	import Select from '$lib/components/input/Select.svelte';
	import { getSetting, setSetting } from '$lib/utils/settings';
	import Toggle from '$lib/components/input/Toggle.svelte';

	let audioQuality = getSetting('playback.audioQuality');
	let audioCodec = getSetting('playback.audioCodec');
	let gaplessPlayback = getSetting('playback.gapless') === 'true';

	$: {
		setSetting('playback.audioQuality', audioQuality);
		setSetting('playback.audioCodec', audioCodec);
		setSetting('playback.gapless', gaplessPlayback.toString());
	}
</script>

<SettingsSection name="Playback">
	<Setting name="Audio Quality">
		<Select
			id="audio-quality-select"
			bind:value={audioQuality}
			options={[
				{ value: '96000', label: 'Low (96kbps)' },
				{
					value: '128000',
					label: 'Medium (128kbps)'
				},
				{
					label: 'High (256kbps)',
					value: '256000'
				},
				{
					label: 'Very High (320kbps)',
					value: '320000'
				},
				{
					label: 'Automatic (Source)',
					value: 'auto'
				}
			]}
		/>
	</Setting>
	<Setting name="Audio Codec">
		<Select
			id="audio-codec-select"
			bind:value={audioCodec}
			options={[
				{ value: 'mp3', label: 'MP3' },
				{ value: 'aac', label: 'AAC' },
				{ value: 'flac', label: 'FLAC' }
			]}
		/>
	</Setting>
	<Setting name="Gapless Playback">
		<Toggle id="gapless-toggle" bind:checked={gaplessPlayback} />
	</Setting>
</SettingsSection>
