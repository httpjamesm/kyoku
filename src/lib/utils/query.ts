export const toQueryString = (params: Record<string, string>): string => {
	const queryParts: string[] = [];
	for (const [key, value] of Object.entries(params)) {
		const encodedKey = encodeURIComponent(key);
		const encodedValue = encodeURIComponent(value);
		queryParts.push(`${encodedKey}=${encodedValue}`);
	}
	return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
};
