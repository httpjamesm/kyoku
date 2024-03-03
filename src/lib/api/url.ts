export const getUrl = (userSpecific: boolean = false) => {
	const serverUrl = window.localStorage.getItem('serverUrl') as string;

	let url = serverUrl;

	if (userSpecific) {
		const userId = window.localStorage.getItem('userId') as string;

		url += `/Users/${userId}`;
	}

	return url;
};
