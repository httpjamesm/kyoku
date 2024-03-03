import { getVersion } from '@tauri-apps/api/app';

export const getHeaders = async (token: string = '') => {
	let version = '0.0.0';

	try {
		version = await getVersion();
	} catch { }

	return {
		'X-Emby-Authorization': `MediaBrowser Client="kyoku", Device="Computer", DeviceId="${generateRandomId(16)}", Version="${version}"${token.length > 0 ? `, Token=${token}` : ''}`
	};
};

const generateRandomId = (length: number): string => {
	const array = new Uint8Array(length);
	window.crypto.getRandomValues(array);
	return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
};
