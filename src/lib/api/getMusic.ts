import { getClient, ResponseType } from '@tauri-apps/api/http';
import { getHeaders } from './header';
import { getUrl } from './url';

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

	console.log(res.data);

	return (res.data as any).Items;
};

export const getSuggestions = async () => {
	const client = await getClient();
	const res = await client.get(`${getUrl(true)}/suggestions`, {
		headers: await getHeaders(),

		query: {
			limit: '16',
			type: 'Audio'
		},
		responseType: ResponseType.JSON
	});

	console.log(res.data);

	return (res.data as any).Items;
};

export const getInstantMixFromSong = async (itemId: string) => {
	const client = await getClient();

	const res = await client.get(`${getUrl(false)}/Items/${itemId}/InstantMix`, {
		headers: await getHeaders(),
		responseType: ResponseType.JSON
	});

	console.log(res.data);

	return (res.data as any).Items;
};
