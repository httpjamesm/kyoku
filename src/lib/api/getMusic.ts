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

	console.log(res.data);

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

	console.log(res);

	return (res.data as any).Items;
};

export const getInstantMixFromSong = async (type: string = 'Items', itemId: string) => {
	const client = await getClient();

	const res = await client.get(`${getUrl(false)}/${type}/${itemId}/InstantMix`, {
		headers: await getHeaders(),
		responseType: ResponseType.JSON
	});

	console.log(res.data);

	return (res.data as any).Items;
};
