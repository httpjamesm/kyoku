import { writable } from 'svelte/store';

export const songColourStore = writable<string | null>(null);
