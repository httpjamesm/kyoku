import { writable } from 'svelte/store';

export const isPlayingStore = writable<boolean>(false);

export const playbackProgressStore = writable<number>(0);
