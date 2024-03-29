import { getClient, ResponseType } from '@tauri-apps/api/http';
import { getHeaders } from './header';
import { getUrl } from './url';

export const getById = async (id: string) => {
	const client = await getClient();

	const res = await client.get(`${getUrl(true)}/Items/${id}`, {
		headers: await getHeaders(),
		responseType: ResponseType.JSON
	});

	return res.data as any;
};

export const getRecentlyPlayed = async () => {
	const client = await getClient();

	const res = await client.get(`${getUrl(true)}/Items`, {
		headers: await getHeaders(),

		query: {
			SortBy: 'DatePlayed',
			SortOrder: 'Descending',
			IncludeItemTypes: 'audio',
			Limit: '16',
			Recursive: 'true',
			Fields: 'PrimaryImageAspectRatio,AudioInfo',
			Filters: 'IsPlayed',
			ImageTypeLimit: '1',
			EnableImageTypes: 'Primary',
			EnableTotalRecordCount: 'false',
			ParentId: window.localStorage.getItem('libraryId') as string
		},
		responseType: ResponseType.JSON
	});

	return (res.data as any).Items;
};

export const getLibrary = async (sort = 'DateCreated', order = 'Descending') => {
	const client = await getClient();

	const res = await client.get(`${getUrl(true)}/Items`, {
		headers: await getHeaders(),
		query: {
			ParentId: window.localStorage.getItem('libraryId') as string,
			SortBy: sort,
			SortOrder: order,
			IncludeItemTypes: 'MusicAlbum',
			Limit: '100',
			Recursive: 'true'
		}
	});

	return (res.data as any).Items;
};

export const getShuffledLibrarySongs = async () => {
	const client = await getClient();

	const res = await client.get(`${getUrl(true)}/Items`, {
		headers: await getHeaders(),
		query: {
			ParentId: window.localStorage.getItem('libraryId') as string,
			Filters: 'IsNotFolder',
			SortBy: 'Random',
			IncludeItemTypes: 'Audio',
			Limit: '300',
			Recursive: 'true'
		}
	});

	return (res.data as any).Items;
};

export const searchLibrary = async (term: string) => {
	const client = await getClient();

	const res = await client.get(`${getUrl(true)}/Items`, {
		headers: await getHeaders(),
		query: {
			ParentId: window.localStorage.getItem('libraryId') as string,
			SearchTerm: term,
			Limit: '20',
			Recursive: 'true'
		}
	});

	return (res.data as any).Items;
};

export const getAlbumTracks = async (albumId: string) => {
	const client = await getClient();

	const res = await client.get(`${getUrl(true)}/Items`, {
		headers: await getHeaders(),
		query: {
			ParentId: albumId,
			SortBy: 'ParentIndexNumber,IndexNumber,SortName'
		}
	});

	return (res.data as any).Items;
};

export const getSuggestions = async (type: string = 'Audio') => {
	const client = await getClient();
	const res = await client.get(`${getUrl(true)}/suggestions`, {
		headers: await getHeaders(),

		query: {
			limit: '16',
			type
		},
		responseType: ResponseType.JSON
	});

	return (res.data as any).Items;
};

export const getParentItems = async (id: string) => {
	const client = await getClient();

	const res = await client.get(`${getUrl(true)}/Items`, {
		headers: await getHeaders(),

		query: {
			ParentId: id,
			SortBy: 'ParentIndexNumber,IndexNumber,SortName'
		}
	});

	return (res.data as any).Items;
};

export const getInstantMixFromSong = async (type: string = 'Items', itemId: string) => {
	const client = await getClient();

	const res = await client.get(`${getUrl(false)}/${type}/${itemId}/InstantMix`, {
		headers: await getHeaders(),
		responseType: ResponseType.JSON
	});

	const items = (res.data as any).Items;

	return items;
};

export const getArtistTopTracks = async (artistId: string) => {
	const client = await getClient();

	const res = await client.get(`${getUrl(true)}/Items`, {
		query: {
			ParentId: artistId,
			SortBy: 'PlayCount',
			Recursive: 'true',
			IncludeItemTypes: 'Audio',
			SortOrder: 'Descending',
			Limit: '20'
		},
		headers: await getHeaders()
	});

	const items = (res.data as any).Items;

	return items;
};

export const getArtistRecentAlbums = async (artistId: string) => {
	const client = await getClient();

	const res = await client.get(`${getUrl(true)}/Items`, {
		query: {
			ParentId: artistId,
			SortBy: 'PremiereDate',
			Recursive: 'true',
			IncludeItemTypes: 'MusicAlbum',
			SortOrder: 'Descending'
		},
		headers: await getHeaders()
	});

	const items = (res.data as any).Items;

	return items;
};
