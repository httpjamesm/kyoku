import { getSetting } from '$lib/utils/settings';
import { secondsToTicks } from '$lib/utils/ticks';
import { Body, getClient } from '@tauri-apps/api/http';
import { getHeaders } from './header';
import { getUrl } from './url';

export const reportPlayback = async (id: string, playing: boolean) => {
	if (getSetting('account.incognito') === 'true') return;

	const client = await getClient();

	if (playing) {
		await client.post(`${getUrl(true)}/PlayingItems/${id}`, Body.text(''), {
			headers: await getHeaders()
		});
	} else {
		await client.delete(`${getUrl(true)}/PlayingItems/${id}`, {
			headers: await getHeaders()
		});
	}
};

export const reportFinishedPlayback = async (id: string) => {
	if (getSetting('account.incognito') === 'true') return;

	const client = await getClient();

	await client.post(`${getUrl(true)}/PlayedItems/${id}`, Body.text(''), {
		headers: await getHeaders()
	});
};

export const reportPlaybackProgress = async (seconds: number, id: string) => {
	if (getSetting('account.incognito') === 'true') return;

	const ticks = secondsToTicks(seconds);

	const client = await getClient();

	await client.post(`${getUrl(true)}/PlayingItems/${id}/Progress`, Body.text(''), {
		query: {
			positionTicks: ticks.toString()
		},
		headers: await getHeaders()
	});
};
