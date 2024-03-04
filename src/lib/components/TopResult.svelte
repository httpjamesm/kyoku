<script lang="ts">
	import { getItemThumbnail } from '$lib/api/image';
	import MdPlayArrow from 'svelte-icons/md/MdPlayArrow.svelte';
	import MdQueue from 'svelte-icons/md/MdQueue.svelte';
	import { queueStore } from '$lib/stores/queue';
	import { getNewQueue } from '$lib/utils/queue';
	import { playNext } from '$lib/utils/queue';
	import type { Item } from '$lib/enums/item';
	import InteractionButton from './buttons/InteractionButton.svelte';
	export let name: string;
	export let albumId: string;
	export let album: string;
	export let itemId: string;
	export let type: Item;
	export let artist: string;
	export let year: number;

	const onPlayHandler = async () => {
		queueStore.set({
			currentIndex: 0,
			items: await getNewQueue(type, itemId)
		});
	};

	const onPlayNextHandler = async () => {
		playNext(type, itemId);
	};
</script>

<div
	class="result-container"
	style="background-image: url('{getItemThumbnail(albumId, 1024, 512)}')"
>
	<div class="result-overlay" />
	<div class="result-info-parent">
		<div class="result-info-container">
			<div class="art-container">
				<a class="link" href="/app/album?id={albumId}">
					<img src={getItemThumbnail(albumId, 512, 512)} alt="album art" class="album-art" />
				</a>
			</div>
			<div class="details">
				<div class="metadata">
					<h1>{name}</h1>
					<p>
						{type} • {artist} • {album} ({year})
					</p>
				</div>
				<div class="buttons">
					<InteractionButton on:click={onPlayHandler} icon={MdPlayArrow}>Play</InteractionButton>
					<InteractionButton type="secondary" on:click={onPlayNextHandler} icon={MdQueue}
						>Play Next</InteractionButton
					>
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.result-container {
		width: 100%;
		height: 20rem;
		border-radius: 10px;
		background-size: cover;
		position: relative;
		background-position: center;

		.result-overlay {
			border-radius: 10px;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			position: absolute;
			z-index: 1;
			-webkit-backdrop-filter: blur(30px);
			backdrop-filter: blur(30px);
			background-color: rgb(0, 0, 0, 0.5);
		}

		.result-info-parent {
			border-radius: 10px;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			position: absolute;
			z-index: 2;

			padding: 2rem;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: center;

			.result-info-container {
				width: 100%;
				height: 100%;
				display: flex;
				gap: 2rem;
				position: relative;
				overflow: hidden;

				.art-container {
					height: 100%;
					.album-art {
						object-fit: contain;
						height: 100%;
						border-radius: 10px;
						box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
					}
				}

				.details {
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.metadata {
						width: 100%;

						h1 {
							margin: 0;
							font-size: 2.5rem;
							text-overflow: ellipsis;
							overflow: hidden;
							white-space: nowrap;
							max-width: 25rem;
						}

						p {
							color: #cecece;
							font-size: 1.25rem;
							margin: 0;
						}
					}

					.buttons {
						display: flex;
						gap: 1rem;

						button {
							padding: 0.5rem 2rem;
							box-sizing: border-box;
							border-radius: 10px;
							box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
							border: none;
							font-size: 1rem;
							font-weight: bold;
							display: flex;
							gap: 0.25rem;
							align-items: center;
							color: black;
							transition-duration: 250ms;
							cursor: pointer;
						}

						.primary {
							background-color: #ffffff;

							&:hover {
								background-color: rgb(255, 255, 255, 0.7);
							}
						}

						.secondary {
							border: 2px solid white;
							color: white;
							background-color: transparent;

							&:hover {
								border-color: #b2b2b2;
							}
						}

						.icon {
							height: 1.5rem;
							width: 1.5rem;
						}
					}
				}
			}
		}
	}

	.link {
		all: unset;
		cursor: pointer;
	}
</style>
