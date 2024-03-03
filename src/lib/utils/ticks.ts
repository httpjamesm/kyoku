export const ticksToMinutes = (ticks: number) => {
	const ticksPerSecond = 10000000;
	const secondsPerMinute = 60;
	const seconds = ticks / ticksPerSecond;
	const minutes = seconds / secondsPerMinute;
	return minutes;
};

export const formatMinutes = (totalMinutes: number) => {
	let hours = Math.floor(totalMinutes / 60);
	let minutes = totalMinutes % 60;

	let result = '';

	if (hours > 0) {
		result += hours + ' hour' + (hours > 1 ? 's' : '');
	}

	if (minutes > 0) {
		if (hours > 0) {
			result += ' and ';
		}
		result += Math.ceil(minutes) + ' minute' + (minutes > 1 ? 's' : '');
	}

	if (hours === 0 && minutes === 0) {
		result = '0 minutes';
	}

	return result;
};

export const formatMinutesShort = (minutes: number) => {
	const wholeMinutes = Math.floor(minutes);
	const seconds = Math.round((minutes - wholeMinutes) * 60);
	return `${wholeMinutes}:${seconds.toString().padStart(2, '0')}`;
};
