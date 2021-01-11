export function serialize(buf: ArrayBuffer): string {
	return String.fromCharCode.apply(null, new Uint16Array(buf) as any);
}

export function deserialize(str: string): ArrayBuffer {
	let buf = new ArrayBuffer(str.length * 2);
	let bufView = new Uint16Array(buf);
	for (let i = 0, strLen = str.length; i < strLen; i++) bufView[i] = str.charCodeAt(i);
	return buf;
}
