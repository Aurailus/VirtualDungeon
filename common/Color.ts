
/**
 * HSV Struct
 * all fields are from 0-1.
 * undefined a == 1
 */

export type HSV = {
	h: number;
	s: number;
	v: number;
	a?: number;
}


/**
 * RGB Struct
 * r, g, b are from 0-255
 * a is from 0-1, undefined == 1
 */

export type RGB = {
	r: number;
	g: number;
	b: number;
	a?: number;
}


/**
 * Converts an HSV Color to RGB.
 * Source: https://stackoverflow.com/questions/17242144/#comment24984878_17242144
 *
 * @param {HSV} hsv - The HSV value to convert.
 * @returns {RGB} the RGB representation.
 */

export function HSVToRGB(hsv: HSV = { h: 0, s: 0, v: 0}): RGB {
	let r: number = 0, g: number = 0, b: number = 0;

	let i = Math.floor(hsv.h * 6);
	let f = hsv.h * 6 - i;
	let p = hsv.v * (1 - hsv.s);
	let q = hsv.v * (1 - f * hsv.s);
	let t = hsv.v * (1 - (1 - f) * hsv.s);

	switch(i % 6) {
	default: break;
	case 0: r = hsv.v; g = t; b = p; break;
	case 1: r = q; g = hsv.v; b = p; break;
	case 2: r = p; g = hsv.v; b = t; break;
	case 3: r = p; g = q; b = hsv.v; break;
	case 4: r = t; g = p; b = hsv.v; break;
	case 5: r = hsv.v; g = p; b = q; break;
	}

	return { r: r * 255, g: g * 255, b: b * 255 };
}


/**
 * Converts an RGB Color to HSV.
 * Source: https://stackoverflow.com/questions/8022885/rgb-to-hsv-color-in-javascript
 *
 * @param {RGB} rgb - The RGB value to convert.
 * @returns {HSV} the HSV representation.
 */

export function RGBToHSV(rgb: RGB = { r: 0, g: 0, b: 0}): HSV {
	let rabs, gabs, babs, rr, gg, bb, h = 0, s, v: any, diff: any, diffc;
	rabs = rgb.r / 255;
	gabs = rgb.g / 255;
	babs = rgb.b / 255;
	v = Math.max(rabs, gabs, babs);
	diff = v - Math.min(rabs, gabs, babs);
	diffc = (c: any) => (v - c) / 6 / diff + 1 / 2;
	
	if (diff === 0) h = s = 0;
	else {
		s = diff / v;
		rr = diffc(rabs);
		gg = diffc(gabs);
		bb = diffc(babs);

		if (rabs === v) h = bb - gg;
		else if (gabs === v) h = (1 / 3) + rr - bb;
		else if (babs === v) h = (2 / 3) + gg - rr;

		if (h < 0) h += 1;
		else if (h > 1) h -= 1;
	}
	
	return { h, s, v };
}


/**
 * Converts a numeric value from 0-255
 * to a hexadecimal string from 00-ff.
 */

function componentToHex(c: number) {
	let hex = Math.round(c).toString(16);
	return hex.length === 1 ? '0' + hex : hex;
}

/**
 * Converts an RGB Color to a Hex string.
 * Source: https://stackoverflow.com/a/5624139
 *
 * @param {RGB} rgb - The RGB value to convert.
 * @returns {string} the hexadecimal string representation.
 */

export function RGBToHex(rgb: RGB = { r: 0, g: 0, b: 0}): string {
	return '#' + componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b);
}

/**
 * Converts a Hex string to an RGB Color.
 *
 * @param {string} hex - The hexadecimal string to convert.
 * @returns {RGB} the RGB representation.
 */

export function hexToRGB(hex: string): RGB {
	let r = parseInt('0x' + hex[1] + hex[2], 16);
	let g = parseInt('0x' + hex[3] + hex[4], 16);
	let b = parseInt('0x' + hex[5] + hex[6], 16);

	return { r, g, b };
}

/**
 * Converts an HSV Color to a Hex string.
 *
 * @param {HSV} hsv - The HSV value to convert.
 * @returns {string} the hexadecimal string representation.
 */

export function HSVToHex(hsv: HSV = { h: 0, s: 0, v: 0}): string {
	return RGBToHex(HSVToRGB(hsv));
}

/**
 * Converts a Hex string to an RGB Color.
 *
 * @param {string} hex - The hexadecimal string to convert.
 * @returns {RGB} the RGB representation.
 */

export function hexToHSV(hex: string): HSV {
	return RGBToHSV(hexToRGB(hex));
}

/**
 * Converts a HSV color to a hex integer value.
 *
 * @param {HSV} color - The color to convert.
 * @returns {number} the RGB representation of the color in an int.
 */

export function HSVToInt(color: HSV) {
	return parseInt(HSVToHex(color).substr(1), 16);
}
