import { writable } from 'svelte/store';

export interface PlayingStore {
	track: {
		albumId: string;
		name: string;
		artist: string;
		album: string;
		year: number;
	};
}

export const playingStore = writable<PlayingStore | null>(null);
