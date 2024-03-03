export enum Item {
	SONG = 'Song',
	ALBUM = 'Album',
	ARTIST = 'Artist'
}

export const JellyfinItems: { [key: string]: Item } = {
	Audio: Item.SONG,
	MusicAlbum: Item.ALBUM,
	MusicArtist: Item.ARTIST
};

export const getItemEnumFromJellyfinItem = (item: string) => {
	return JellyfinItems[item];
};
