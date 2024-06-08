<script lang="ts">
	import '../main.scss';
	import { Toaster } from 'svelte-french-toast';
	import { onMount } from 'svelte';
	import { invoke } from '@tauri-apps/api/core';

	const checkAndSetHostname = async () => {
		const hostname: string = await invoke('get_hostname');

		window.localStorage.setItem('hostname', hostname);
	};

	onMount(() => {
		checkAndSetHostname();
	});
</script>

<slot />
<Toaster />
