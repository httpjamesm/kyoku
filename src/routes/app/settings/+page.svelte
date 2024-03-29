<script lang="ts">
	import SettingsSection from '$lib/components/settings/SettingsSection.svelte';
	import Setting from '$lib/components/settings/Setting.svelte';
	import Select from '$lib/components/input/Select.svelte';
	import TextInput from '$lib/components/input/TextInput.svelte';
	import { getSetting, setSetting } from '$lib/utils/settings';
	import InteractionButton from '$lib/components/buttons/InteractionButton.svelte';
	import MdClearAll from 'svelte-icons/md/MdClearAll.svelte';
	import { goto } from '$app/navigation';
	import Toggle from '$lib/components/input/Toggle.svelte';

	let audioQuality = getSetting('playback.audioQuality');
	let audioCodec = getSetting('playback.audioCodec');

	let serverUrl = getSetting('serverUrl');
	let backupServerUrl = getSetting('backupServerUrl');

	let incognito = getSetting('account.incognito') === 'true';

	let wikipedia = getSetting('metadata.wikipedia') === 'true';

	$: {
		setSetting('playback.audioQuality', audioQuality);
		setSetting('playback.audioCodec', audioCodec);
		setSetting('serverUrl', serverUrl);
		setSetting('backupServerUrl', backupServerUrl);
		setSetting('account.incognito', incognito.toString());
		setSetting('metadata.wikipedia', wikipedia.toString());
	}
</script>

<SettingsSection name="Connectivity">
	<Setting name="Server URL">
		<TextInput id="server-url-input" bind:value={serverUrl} placeholder="https://server.com..." />
	</Setting>
	<Setting name="Backup Server URL">
		<TextInput
			id="backup-server-url-input"
			bind:value={backupServerUrl}
			placeholder="https://server.com..."
		/>
	</Setting>
</SettingsSection>

<SettingsSection name="Metadata">
	<Setting name="Supplement from Wikipedia">
		<Toggle id="wikipedia-toggle" bind:checked={wikipedia} />
	</Setting>
</SettingsSection>

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
				{ value: 'flac', label: 'FLAC' },
				{ value: 'ogg', label: 'OGG' }
			]}
		/>
	</Setting>
</SettingsSection>

<SettingsSection name="Account">
	<Setting name="Incognito">
		<Toggle id="incognito-toggle" bind:checked={incognito} />
	</Setting>
</SettingsSection>

<SettingsSection name="App">
	<Setting name="Logout & Reset">
		<InteractionButton
			icon={MdClearAll}
			on:click={() => {
				window.localStorage.clear();
				goto('/');
			}}>Reset</InteractionButton
		>
	</Setting>
</SettingsSection>
