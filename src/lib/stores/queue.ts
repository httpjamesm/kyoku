import type { ArtistItem } from '$lib/interfaces/artist';
import { writable } from 'svelte/store';

export interface QueueStore {
	items: QueueItem[];
	currentIndex: number;
}

export interface QueueItem {
	albumId: string;
	name: string;
	artists: ArtistItem[];
	album: string;
	year: number;
	id: string;
	ticks: number;
	artistId: string;
}

export const queueStore = writable<QueueStore>({
	items: [],
	currentIndex: 0
});
