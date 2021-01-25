const CHUNK_SIZE = 100000;
export function serialize(buf: ArrayBuffer): string {
	let str = '';
	for (let i = 0; i < buf.byteLength / CHUNK_SIZE; i++) {
		const slice = new Uint16Array(buf.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE));
		str += String.fromCharCode.apply(undefined, new Uint16Array(slice) as any);
	}
	return str;
}

export function deserialize(str: string): ArrayBuffer {
	let buf = new ArrayBuffer(str.length * 2);
	let bufView = new Uint16Array(buf);
	for (let i = 0, strLen = str.length; i < strLen; i++) bufView[i] = str.charCodeAt(i);
	return buf;
}
