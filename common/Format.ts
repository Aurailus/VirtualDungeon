const tiers: string[] = ['B', 'KB', 'MB', 'GB'];

export function bytes(bytes: number): string {
	bytes = Math.round(bytes);

	let tier = 0;
	while (bytes > 800 && tier < tiers.length - 1) {
		tier++;
		bytes /= 1024;
	}

	return Math.ceil(bytes) + " " + tiers[tier];
}

export function vector(v: {x: number, y: number}, suffix?: string): string {
	return `${v.x}×${v.y} ${suffix || ""}`;
}

// export function date(date: number) {
// 	let d = new Date(date);
// 	if (Date.now() - +d < 1000 * 60 * 60 * 24 * 3) return moment(date).fromNow();
// 	else if (d.getFullYear() == new Date().getFullYear()) return "on " + moment(date).format("MMMM Do");
// 	else return "on " + moment(date).format("MMMM Do, YYYY");
// }

export function name(name: string, len?: number) {
	let preExtension = name.substr(0, name.lastIndexOf('.') < 0 ? name.length : name.lastIndexOf('.'));
	let cleanName = preExtension.replace(/[_-]+/g, ' ').split(' ').map((str) => {
		if (str.length < 2) return str;
		const firstChar = str[0];
		const rest = str.substr(1);
		return firstChar.toUpperCase() + rest.toLowerCase();
	}).join(' ');
	if (len && cleanName.length > len) cleanName = cleanName.substr(0, len);
	return cleanName;
}

export function identifier(str: string, sanitize: boolean = false) {
	if (sanitize && (typeof str != "string" || str.length < 1)) throw "Name must not be empty.";
	const sanitized = str.toLowerCase().replace(/[ -]/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
	if (sanitize && sanitized.length == 0) throw "Name must include at least one alphanumeric character.";
	return sanitized;
}
