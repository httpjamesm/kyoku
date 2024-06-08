import { fetch } from '@tauri-apps/plugin-http';
import { getHeaders } from './header';
import { getUrl } from './url';

export const markFavourite = async (id: string) => {
	const res = await fetch(`${getUrl(true)}/FavoriteItems/${id}`, {
		method: 'POST',
		headers: await getHeaders()
	});

	if (!res.ok) {
		throw new Error('Mark as favourite failed');
	}
};

export const unmarkFavourite = async (id: string) => {
	const res = await fetch(`${getUrl(true)}/FavoriteItems/${id}`, {
		method: 'DELETE',
		headers: await getHeaders()
	});

	if (!res.ok) {
		throw new Error('Unmark as favourite failed');
	}
};
