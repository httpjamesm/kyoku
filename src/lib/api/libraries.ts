import { fetch } from '@tauri-apps/plugin-http';
import { getHeaders } from './header';
import { getUrl } from './url';

export const getLibraries = async () => {
	const res = await fetch(`${getUrl(true)}/Views`, {
		headers: await getHeaders()
	});

	if (!res.ok) {
		throw new Error('Failed to get libraries');
	}

	return ((await res.json()) as any).Items;
};
