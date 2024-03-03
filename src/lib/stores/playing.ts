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

export const isPlayingStore = writable<boolean>(false);

export const playbackProgressStore = writable<number>(0);
