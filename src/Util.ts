function clamp(x: number, min: number, max: number) {
	if (min > max) {
		let t = max;
		max = min;
		min = t;
	}
	return Math.max(Math.min(x, max), min);
}
