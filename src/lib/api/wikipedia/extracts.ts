import { Body, getClient, ResponseType } from '@tauri-apps/api/http';

export const getArtistWikipedia = async (name: string) => {
	const client = await getClient();

	const variations = [toSentenceCase(name), name, name.toLowerCase(), name.toUpperCase()];
	const allVariations =
		variations.join('|') + '|' + variations.map((variation) => variation + ' (musician)').join('|');

	const res = await client.get('https://en.wikipedia.org/w/api.php', {
		query: {
			action: 'query',
			format: 'json',
			titles: allVariations,
			prop: 'extracts',
			exintro: 'True'
		},
		responseType: ResponseType.JSON
	});

	if (!res.ok) {
		throw new Error('Wikipedia rejected the query');
	}

	const pages = res.data.query.pages;

	const existingPageIds = Object.keys(pages).filter((id) => id > 0);

	const existingPages = existingPageIds.map((id) => pages[id]);

	// prioritize those that have "(musician)"

	const musicianPages = existingPages.filter((page) => page.title.endsWith('(musician)'));

	if (musicianPages.length > 0) {
		return musicianPages[0];
	}

	if (!existingPages.length) return null;

	return existingPages[0];
};

export const getWikipedia = async (title: string) => {
	const client = await getClient();

	const res = await client.get('https://en.wikipedia.org/w/api.php', {
		query: {
			action: 'query',
			format: 'json',
			titles: title,
			prop: 'extracts',
			exintro: 'True'
		},
		responseType: ResponseType.JSON
	});

	if (!res.ok) {
		throw new Error('Wikipedia rejected the query');
	}

	const pages = res.data.query.pages;

	const existingPageIds = Object.keys(pages).filter((id) => id > 0);

	const existingPages = existingPageIds.map((id) => pages[id]);

	if (!existingPages.length) return;

	return existingPages[0];
};

const toSentenceCase = (text: string): string => {
	const words = text.split(' ');
	if (words.length === 1) {
		text = text.toLowerCase();
		return text[0].toUpperCase() + text.slice(1);
	}

	const newWords = words.map((word) => toSentenceCase(word));

	return newWords.join(' ');
};
