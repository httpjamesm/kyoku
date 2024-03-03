import { getAlbumTracks, getById, getInstantMixFromSong, getParentItems } from '$lib/api/getMusic';
import { Item } from '$lib/enums/item';
import type { QueueStore } from '$lib/stores/queue';
import { queueStore } from '$lib/stores/queue';

export const getNewQueue = async (type: Item, id: string) => {
	let items: any[] = [];

	switch (type) {
		case Item.SONG:
			items = await getInstantMixFromSong('Items', id);
			break;
		case Item.ALBUM:
			items = [...(await getParentItems(id)), ...(await getInstantMixFromSong('Albums', id))];
			break;
	}

	const newQueue = items.map((item: any) => getQueueItemFromJellyfinItem(item));

	return newQueue;
};

export const getQueueItemFromJellyfinItem = (item: any) => {
	return {
		albumId: item.AlbumId,
		name: item.Name,
		artist: item.AlbumArtist,
		album: item.Album,
		year: item.ProductionYear,
		id: item.Id
	};
};

export const getRelevantItems = async (type: Item, id: string) => {
	let items: any[] = [];

	switch (type) {
		case Item.SONG:
			const jellyfinItem = await getById(id);

			items = [getQueueItemFromJellyfinItem(jellyfinItem)];
			break;
		case Item.ALBUM:
			const jellyfinItems = await getAlbumTracks(id);
			items = jellyfinItems.map((item: any) => getQueueItemFromJellyfinItem(item));
			break;
	}

	return items;
};

export const playNext = async (type: Item, id: string) => {
	const relevantItems = await getRelevantItems(type, id);

	queueStore.update((store: QueueStore) => ({
		...store,
		items: [
			...store.items.slice(0, store.currentIndex + 1),
			...relevantItems,
			...store.items.slice(store.currentIndex + 1)
		]
	}));
};
