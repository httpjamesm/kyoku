import { fetch } from '@tauri-apps/plugin-http';
import { getHeaders } from './header';
import { getUrl } from './url';
import { toQueryString } from '$lib/utils/query';

export const getById = async (id: string) => {
	const res = await fetch(`${getUrl(true)}/Items/${id}`, {
		headers: {
			'Content-Type': 'application/json',
			...(await getHeaders())
		}
	});

	return (await res.json()) as any;
};

export const getRecentlyPlayed = async () => {
	const res = await fetch(
		`${getUrl(true)}/Items${toQueryString({
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
		})}`,
		{
			headers: await getHeaders()
		}
	);

	return ((await res.json()) as any).Items;
};

export const getLibrary = async (sort = 'DateCreated', order = 'Descending') => {
	const res = await fetch(
		`${getUrl(true)}/Items${toQueryString({
			ParentId: window.localStorage.getItem('libraryId') as string,
			SortBy: sort,
			SortOrder: order,
			IncludeItemTypes: 'MusicAlbum',
			Limit: '100',
			Recursive: 'true'
		})}`,
		{
			headers: await getHeaders()
		}
	);

	return ((await res.json()) as any).Items;
};

export const getShuffledLibrarySongs = async () => {
	const res = await fetch(
		`${getUrl(true)}/Items${toQueryString({
			ParentId: window.localStorage.getItem('libraryId') as string,
			Filters: 'IsNotFolder',
			SortBy: 'Random',
			IncludeItemTypes: 'Audio',
			Limit: '300',
			Recursive: 'true'
		})}`,
		{
			headers: await getHeaders()
		}
	);

	return ((await res.json()) as any).Items;
};

export const searchLibrary = async (term: string) => {
	const res = await fetch(
		`${getUrl(true)}/Items${toQueryString({
			ParentId: window.localStorage.getItem('libraryId') as string,
			SearchTerm: term,
			Limit: '20',
			Recursive: 'true'
		})}`,
		{
			headers: await getHeaders()
		}
	);

	return ((await res.json()) as any).Items;
};

export const getAlbumTracks = async (albumId: string) => {
	const res = await fetch(
		`${getUrl(true)}/Items${toQueryString({
			ParentId: albumId,
			SortBy: 'ParentIndexNumber,IndexNumber,SortName'
		})}`,
		{
			headers: await getHeaders()
		}
	);

	return ((await res.json()) as any).Items;
};

export const getSuggestions = async (type: string = 'Audio') => {
	const res = await fetch(
		`${getUrl(true)}/suggestions${toQueryString({
			limit: '16',
			type
		})}`,
		{
			headers: await getHeaders()
		}
	);

	return ((await res.json()) as any).Items;
};

export const getParentItems = async (id: string) => {
	const res = await fetch(
		`${getUrl(true)}/Items${toQueryString({
			ParentId: id,
			SortBy: 'ParentIndexNumber,IndexNumber,SortName'
		})}`,
		{
			headers: await getHeaders()
		}
	);

	return ((await res.json()) as any).Items;
};

export const getInstantMixFromSong = async (type: string = 'Items', itemId: string) => {
	const res = await fetch(`${getUrl(false)}/${type}/${itemId}/InstantMix`, {
		headers: await getHeaders()
	});

	const items = ((await res.json()) as any).Items;

	return items;
};

export const getArtistTopTracks = async (artistId: string) => {
	const res = await fetch(
		`${getUrl(true)}/Items${toQueryString({
			ParentId: artistId,
			SortBy: 'PlayCount',
			Recursive: 'true',
			IncludeItemTypes: 'Audio',
			SortOrder: 'Descending',
			Limit: '20'
		})}`,
		{
			headers: await getHeaders()
		}
	);

	const items = ((await res.json()) as any).Items;

	return items;
};

export const getArtistRecentAlbums = async (artistId: string) => {
	const res = await fetch(
		`${getUrl(true)}/Items${toQueryString({
			ParentId: artistId,
			SortBy: 'PremiereDate',
			Recursive: 'true',
			IncludeItemTypes: 'MusicAlbum',
			SortOrder: 'Descending'
		})}`,
		{
			headers: await getHeaders()
		}
	);

	const items = ((await res.json()) as any).Items;

	return items;
};
