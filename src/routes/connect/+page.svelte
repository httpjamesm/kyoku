<script lang="ts">
	import { getVersion } from '@tauri-apps/api/app';
	import { onMount } from 'svelte';
	import getApiKey from '$lib/api/getApiKey';
	import toast from 'svelte-french-toast';
	import { goto } from '$app/navigation';
	import { getLibraries } from '$lib/api/libraries';
	import TextInput from '$lib/components/input/TextInput.svelte';

	let version = '0.0.0';

	const tryGetVersion = async () => {
		try {
			version = await getVersion();
		} catch {}
	};

	onMount(() => {
		tryGetVersion();
	});

	let serverUrl = 'http://';
	let username = '';
	let password = '';

	const onFormSubmitHandler = async () => {
		window.localStorage.setItem('serverUrl', serverUrl);
		try {
			const res = await getApiKey(username, password);

			const token = res.AccessToken;

			if (!token) {
				throw new Error("Server didn't return an access token");
			}

			const id = res.User.Id;

			if (!id) {
				throw new Error("Server didn't return a user ID");
			}

			window.localStorage.setItem('accessToken', token);
			window.localStorage.setItem('userId', id);

			const libraries = await getLibraries();

			const musicLibrary = libraries.find((library: any) => library.Name.toLowerCase() === 'music');

			if (!musicLibrary) {
				throw new Error("Couldn't identify the music library");
			}

			window.localStorage.setItem('libraryId', musicLibrary.Id);

			goto('/app/home');
		} catch (e) {
			toast.error((e as Error).message);
		}
	};
</script>

<div class="wrapper">
	<div class="container">
		<p class="app-name">Kyoku for Jellyfin</p>
		<div class="form-container">
			<h1>Connect to <span class="jellyfin">Jellyfin</span></h1>
			<br />
			<form on:submit|preventDefault={onFormSubmitHandler}>
				<TextInput
					label="Server URL"
					id="server-url-input"
					type="url"
					placeholder="https://server.com..."
					bind:value={serverUrl}
					required
				/>
				<br />
				<TextInput
					label="Username"
					id="username-input"
					type="text"
					placeholder="musician"
					bind:value={username}
					required
				/>
				<br />
				<TextInput
					label="Password"
					id="password-input"
					type="password"
					placeholder="•••••••"
					bind:value={password}
					required
				/>
				<br />
				<button type="submit">Connect</button>
			</form>
		</div>
		<p class="version">Version {version}</p>
	</div>
</div>
<div class="blob-wrapper">
	<div class="blob" />
</div>

<style lang="scss">
	.wrapper {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;

		position: absolute;

		z-index: 1;

		.container {
			color: white;

			.app-name {
				font-weight: bold;
				text-align: center;
			}

			.version {
				text-align: center;
				font-size: 0.8rem;
			}

			.form-container {
				padding: 2rem 5rem;
				box-sizing: border-box;
				background-color: #1c1c1c;
				border-radius: 10px;
				text-align: center;

				h1 {
					margin: 0;
				}

				.jellyfin {
					background: linear-gradient(91.62deg, #aa5cc3 66.43%, #00a4dc 98.63%);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
					background-clip: text;
				}

				form {
					padding: 1rem 0;
					width: 100%;
					box-sizing: border-box;

					button {
						background-color: #8b6eff;
						border-radius: 10px;
						padding: 0.5rem 2rem;
						box-sizing: border-box;
						color: white;
						font-size: 1rem;
						border: none;
						cursor: pointer;

						&:hover {
							filter: brightness(0.7);
						}
					}
				}
			}
		}
	}

	.blob-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
		width: 100%;
		position: relative;

		.blob {
			height: 15rem;
			width: 15rem;
			border-radius: 100%;

			box-shadow: 0 0 250px 10rem #9039ff;
		}
	}
</style>
