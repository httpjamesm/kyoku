<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		if (window.localStorage.getItem('accessToken')) {
			goto('/app/home');
			return;
		}
		goto('/connect');
	});
</script>
