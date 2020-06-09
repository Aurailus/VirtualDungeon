function clamp(x: number, min: number, max: number) {
	if (min > max) {
		let t = max;
		max = min;
		min = t;
	}
	return Math.max(Math.min(x, max), min);
}

function dec2hex(dec: number) {
  return ('0' + dec.toString(16)).substr(-2)
}

function generateId(len: number): string {
  let arr = new Uint8Array((len || 40) / 2)
  window.crypto.getRandomValues(arr);
  let stringArr: string[] = [];
  for (let i = 0; i < arr.length; i++) stringArr.push(dec2hex(arr[i]));
	return stringArr.join('');
}
