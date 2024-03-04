import { setSetting } from '$lib/utils/settings';
import { getClient } from '@tauri-apps/api/http';

export const getUrl = (userSpecific: boolean = false) => {
	const serverUrl =
		window.localStorage.getItem('useServer') === 'backup'
			? window.localStorage.getItem('backupServerUrl')
			: (window.localStorage.getItem('serverUrl') as string);

	let url = serverUrl;

	if (userSpecific) {
		const userId = window.localStorage.getItem('userId') as string;

		url += `/Users/${userId}`;
	}

	return url;
};

const checkServerConnection = async (primary: boolean) => {
	const client = await getClient();

	const serverUrl = window.localStorage.getItem(
		primary ? 'serverUrl' : 'backupServerUrl'
	) as string;

	console.log(`checking ${serverUrl}`);

	await client.get(serverUrl, {
		timeout: 3
	});
};

export const primaryOrBackupServerConnectivity = async () => {
	if (!window.localStorage.getItem('backupServerUrl')) return;

	console.log('checking connectivity');
	try {
		await checkServerConnection(true);
	} catch {
		setSetting('useServer', 'backup');
		return;
	}
	setSetting('useServer', 'primary');
};
