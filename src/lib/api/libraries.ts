import { getClient, ResponseType } from '@tauri-apps/api/http';
import { getHeaders } from './header';
import { getUrl } from './url';

export const getLibraries = async () => {
	const client = await getClient();

	const res = await client.get(`${getUrl(true)}/Views`, {
		headers: await getHeaders(),
		responseType: ResponseType.JSON
	});

	if (!res.ok) {
		throw new Error('Failed to get libraries');
	}

	return (res.data as any).Items;
};
