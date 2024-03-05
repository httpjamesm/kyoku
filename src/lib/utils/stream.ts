import { getUrl } from '$lib/api/url';
import { getSetting } from './settings';

export const getStreamURLFromItemId = (id: string) => {
	let url = `${getUrl(false)}/Audio/${id}/universal?audioCodec=${getSetting('playback.audioCodec')}&api_key=${window.localStorage.getItem('accessToken')}&Container=mp3,aac,m4a|aac,m4b|aac,flac,alac,m4a|alac,m4b|alac,wav&StartTimeTicks=0`;

	const quality = getSetting('playback.audioQuality');
	if (quality !== 'auto') {
		url += `&audioBitRate=${quality}`;
	}

	return url;
};
