import { getVersion } from '@tauri-apps/api/app';

export const getHeaders = async () => {
	let token = window.localStorage.getItem('accessToken');

	let version = '0.0.0';

	try {
		version = await getVersion();
	} catch { }

	let deviceId = window.localStorage.getItem('deviceId');

	if (!deviceId) {
		deviceId = generateRandomId(16);
		window.localStorage.setItem('deviceId', deviceId);
	}

	let headers = {
		'X-Emby-Authorization': `MediaBrowser Client="kyoku", Device="Computer", DeviceId="${deviceId}", Version="${version}"${token ? `, Token="${token}"` : ''}`
	};

	console.log(headers);

	return headers;
};

const generateRandomId = (length: number): string => {
	const array = new Uint8Array(length);
	window.crypto.getRandomValues(array);
	return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
};
