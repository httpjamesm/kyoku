import { getUrl } from './url';

export const getItemThumbnail = (id: string) => {
	return `${getUrl()}/Items/${id}/Images/Primary?fillHeight=334&fillWidth=334&quality=96`;
};
