export const getArtistItemFromJellyfinArtistItem = (item: any) => {
	return {
		id: item.Id,
		name: item.Name
	};
};
