export interface PlayerContextKey {
	play: () => void;
	pause: () => void;
	setSrc: (url: string) => void;
	isPlaying: () => boolean;
	skip: () => void;
	prev: () => void;
	setProgress: (percentage: number) => void;
}

export const playerContextKey = {} as PlayerContextKey;
