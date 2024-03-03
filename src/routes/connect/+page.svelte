<script lang="ts">
	import { getVersion } from '@tauri-apps/api/app';
	import { onMount } from 'svelte';

	let version = '0.0.0';

	const tryGetVersion = async () => {
		try {
			version = await getVersion();
		} catch {}
	};

	onMount(() => {
		tryGetVersion();
	});
</script>

<div class="wrapper">
	<div class="container">
		<p class="app-name">Kyoku for Jellyfin</p>
		<div class="form-container">
			<h1>Connect to <span class="jellyfin">Jellyfin</span></h1>
			<br />
			<form>
				<div class="form-control">
					<label for="server-url-input">Server URL</label>
					<input id="server-url-input" type="url" placeholder="https://server.com..." required />
				</div>
				<br />
				<div class="form-control">
					<label for="username-input">Username</label>
					<input id="username-input" type="text" placeholder="musician" required />
				</div>
				<br />
				<div class="form-control">
					<label for="password-input">Password</label>
					<input id="password-input" type="password" placeholder="•••••••" required />
				</div>
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

					.form-control {
						display: flex;
						flex-direction: column;
						justify-content: flex-start;

						label {
							margin-bottom: 0.5rem;
							text-align: left;
						}

						input {
							background-color: #303030;
							border: 1px solid #606060;
							padding: 0.5rem 1rem;
							border-radius: 10px;
							font-size: 1rem;
							width: 100%;
							box-sizing: border-box;
							color: white;
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
