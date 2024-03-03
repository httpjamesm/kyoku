import { Body, getClient } from '@tauri-apps/api/http';
import { getHeaders } from './header';
import { getUrl } from './url';

export const markFavourite = async (id: string) => {
	const client = await getClient();

	const res = await client.post(`${getUrl(true)}/FavoriteItems/${id}`, Body.text(''), {
		headers: await getHeaders()
	});

	if (!res.ok) {
		throw new Error('Mark as favourite failed');
	}
};

export const unmarkFavourite = async (id: string) => {
	const client = await getClient();

	const res = await client.delete(`${getUrl(true)}/FavoriteItems/${id}`, {
		headers: await getHeaders()
	});

	if (!res.ok) {
		throw new Error('Unmark as favourite failed');
	}
};
