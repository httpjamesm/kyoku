import { getUrl } from './url';

export const getItemThumbnail = (id: string, height = 334, width = 334) => {
	return `${getUrl()}/Items/${id}/Images/Primary?fillHeight=${height}&fillWidth=${width}&quality=96`;
};
