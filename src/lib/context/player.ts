export interface PlayerContextKey {
	play: () => void;
	pause: () => void;
	setSrc: (url: string) => void;
}

export const playerContextKey = {} as PlayerContextKey;
