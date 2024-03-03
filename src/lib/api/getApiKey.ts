import { Body, getClient, ResponseType } from '@tauri-apps/api/http';
import { getHeaders } from './header';

export default async function(username: string, password: string) {
	const client = await getClient();

	const serverUrl = window.localStorage.getItem('serverUrl') as string;

	const res = await client.post(
		`${serverUrl}/Users/AuthenticateByName`,
		Body.json({
			Username: username,
			Pw: password
		}),
		{
			headers: await getHeaders(),
			responseType: ResponseType.JSON
		}
	);

	if (!res.ok) {
		throw new Error('Login failed');
	}

	return res.data as any;
}
