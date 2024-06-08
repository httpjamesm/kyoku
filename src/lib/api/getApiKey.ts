import { fetch } from '@tauri-apps/plugin-http';
import { getHeaders } from './header';

export default async function (username: string, password: string) {
	const serverUrl = window.localStorage.getItem('serverUrl') as string;

	const res = await fetch(`${serverUrl}/Users/AuthenticateByName`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...(await getHeaders())
		},
		body: JSON.stringify({
			Username: username,
			Pw: password
		})
	});

	if (!res.ok) {
		throw new Error('Login failed');
	}

	return (await res.json()) as any;
}
