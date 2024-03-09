export const isColorTooDark = (color: string): boolean => {
	// Convert color to RGB
	const rgbColor = hexToRgb(color);

	// Calculate relative luminance
	const luminance = (0.2126 * rgbColor.r + 0.7152 * rgbColor.g + 0.0722 * rgbColor.b) / 255;

	// Check if luminance is below the threshold (e.g., 0.5)
	return luminance < 0.5;
};

export const increaseBrightness = (color: string, amount: number): string => {
	// Convert color to RGB
	const rgbColor = hexToRgb(color);

	// Increase each RGB component by the specified amount
	const newR = Math.min(255, rgbColor.r + amount);
	const newG = Math.min(255, rgbColor.g + amount);
	const newB = Math.min(255, rgbColor.b + amount);

	// Convert the new RGB color back to hex format
	return rgbToHex(newR, newG, newB);
};

export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
	const r = parseInt(hex.substring(1, 3), 16);
	const g = parseInt(hex.substring(3, 5), 16);
	const b = parseInt(hex.substring(5, 7), 16);
	return { r, g, b };
};

export const rgbToHex = (r: number, g: number, b: number): string => {
	const toHex = (c: number) => c.toString(16).padStart(2, '0');
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
