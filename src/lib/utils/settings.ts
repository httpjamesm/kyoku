const defaultSettings = {
	playback: {
		audioQuality: 'auto',
		audioCodec: 'aac',
		gapless: 'true'
	},
	account: {
		incognito: 'false'
	}
};

export const getSetting = (key: string) => {
	const val = window.localStorage.getItem(key);

	if (val) return val;

	return getValueByDotNotation(defaultSettings, key);
};

export const setSetting = (key: string, val: string) => {
	window.localStorage.setItem(key, val);
};

const getValueByDotNotation = (obj: any, path: string) => {
	return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};
