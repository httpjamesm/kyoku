export interface PlayerContextKey {
	play: () => void;
	pause: () => void;
	setSrc: (url: string) => void;
	isPlaying: () => boolean;
	skip: () => void;
	prev: () => void;
}

export const playerContextKey = {} as PlayerContextKey;
