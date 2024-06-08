import { getSetting } from '$lib/utils/settings';
import { secondsToTicks } from '$lib/utils/ticks';
import { fetch } from '@tauri-apps/plugin-http';
import { getHeaders } from './header';
import { getUrl } from './url';
import { toQueryString } from '$lib/utils/query';

export const reportPlayback = async (id: string, playing: boolean) => {
	if (getSetting('account.incognito') === 'true') return;

	if (playing) {
		await fetch(`${getUrl(true)}/PlayingItems/${id}`, {
			method: 'POST',
			headers: await getHeaders()
		});
	} else {
		await fetch(`${getUrl(true)}/PlayingItems/${id}`, {
			method: 'DELETE',
			headers: await getHeaders()
		});
	}
};

export const reportFinishedPlayback = async (id: string) => {
	if (getSetting('account.incognito') === 'true') return;

	await fetch(`${getUrl(true)}/PlayedItems/${id}`, {
		method: 'POST',
		headers: await getHeaders()
	});
};

export const reportPlaybackProgress = async (seconds: number, id: string) => {
	if (getSetting('account.incognito') === 'true') return;

	const ticks = secondsToTicks(seconds);

	await fetch(
		`${getUrl(true)}/PlayingItems/${id}/Progress${toQueryString({
			positionTicks: ticks.toString()
		})}`,
		{
			method: 'POST',
			headers: await getHeaders()
		}
	);
};
