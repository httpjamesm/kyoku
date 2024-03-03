export interface PlayerContextKey {
	play: () => void;
	pause: () => void;
	setSrc: (url: string) => void;
	isPlaying: () => boolean;
}

export const playerContextKey = {} as PlayerContextKey;
