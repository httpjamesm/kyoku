import {
	getAlbumTracks,
	getArtistTopTracks,
	getById,
	getInstantMixFromSong,
	getParentItems
} from '$lib/api/getMusic';
import { Item } from '$lib/enums/item';
import type { QueueItem, QueueStore } from '$lib/stores/queue';
import { queueStore } from '$lib/stores/queue';
import { getArtistItemFromJellyfinArtistItem } from './artist';

export const getNewQueue = async (type: Item, id: string) => {
	let items: any[] = [];

	switch (type) {
		case Item.SONG:
			items = await getInstantMixFromSong('Items', id);
			break;
		case Item.ALBUM:
			items = [...(await getParentItems(id)), ...(await getInstantMixFromSong('Albums', id))];
			break;
		case Item.ARTIST:
			items = await getArtistTopTracks(id);
			break;
	}

	const uniqueItems = removeDuplicatesFromJellyfinItems(items);

	const newQueue = uniqueItems.map((item: any) => getQueueItemFromJellyfinItem(item));

	return newQueue;
};

export const getQueueItemFromJellyfinItem = (item: any) => {
	console.log(item);
	return {
		id: item.Id,
		albumId: item.AlbumId,
		name: item.Name,
		artists: item.ArtistItems.map((item) => getArtistItemFromJellyfinArtistItem(item)),
		album: item.Album,
		year: item.ProductionYear,
		ticks: item.RunTimeTicks,
		artistId: item.ArtistItems.length > 0 ? item.ArtistItems[0].Id : null
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

	const uniqueItems = removeDuplicatesFromJellyfinItems(items);

	return uniqueItems;
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

export const addItemsNextInQueue = (items: QueueItem[]) => {
	queueStore.update((store: QueueStore) => ({
		...store,
		items: [
			...store.items.slice(0, store.currentIndex + 1),
			...items,
			...store.items.slice(store.currentIndex + 1)
		]
	}));
};

export const playNow = async (type: Item, id: string) => {
	const relevantItems = await getNewQueue(type, id);

	queueStore.set({
		currentIndex: 0,
		items: relevantItems
	});
};

export const setQueue = async (items: QueueItem[]) => {
	queueStore.set({
		currentIndex: 0,
		items
	});
};

const removeDuplicatesFromJellyfinItems = (items: any[]) => {
	const seenIds: { [key: string]: boolean } = {};
	const uniqueItems = items.filter((item: any) => {
		if (!item.Id) {
			return false;
		}
		if (!seenIds[item.Id]) {
			seenIds[item.Id] = true;
			return true;
		}
		return false;
	});

	return uniqueItems;
};

export const deleteFromQueueById = (deleteItemId: string) => {
	queueStore.update((store) => ({
		...store,
		items: store.items.filter((item) => item.id !== deleteItemId)
	}));
};
