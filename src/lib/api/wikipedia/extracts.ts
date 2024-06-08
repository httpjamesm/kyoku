import { toQueryString } from '$lib/utils/query';
import { fetch } from '@tauri-apps/plugin-http';

export const getArtistWikipedia = async (name: string) => {
	const variations = [toSentenceCase(name), name, name.toLowerCase(), name.toUpperCase()];
	const allVariations =
		variations.join('|') + '|' + variations.map((variation) => variation + ' (musician)').join('|');

	const res = await fetch(
		`https://en.wikipedia.org/w/api.php${toQueryString({
			action: 'query',
			format: 'json',
			titles: allVariations,
			prop: 'extracts',
			exintro: 'True'
		})}`
	);

	if (!res.ok) {
		throw new Error('Wikipedia rejected the query');
	}

	const pages = (await res.json()).query.pages;

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
	const res = await fetch(
		`https://en.wikipedia.org/w/api.php${toQueryString({
			action: 'query',
			format: 'json',
			titles: title,
			prop: 'extracts',
			exintro: 'True'
		})}`,
		{}
	);

	if (!res.ok) {
		throw new Error('Wikipedia rejected the query');
	}

	const pages = (await res.json()).query.pages;

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
