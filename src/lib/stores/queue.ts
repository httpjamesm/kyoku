import { writable } from 'svelte/store';

export interface QueueStore {
	items: QueueItem[];
	currentIndex: number;
}

export interface QueueItem {
	albumId: string;
	name: string;
	artist: string;
	album: string;
	year: number;
	id: string;
	// duration:
}

export const queueStore = writable<QueueStore>({
	items: [],
	currentIndex: 0
});
