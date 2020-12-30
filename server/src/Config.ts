export interface Config {
	port?: number;
	https?: {
		port?: number;
		cert?: string;
		key?: string;
	};
	db?: {
		url?: string;
		name?: string;
	};
	verbose?: boolean;
	logLevel?: 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'off';
}

const props: string[] = [
	'port',
	'verbose',
	'logLevel'
];

export function mergeConfig(confA: Config, confB: Config): Config {
	let mConfA = JSON.parse(JSON.stringify(confA));
	let mConfB = JSON.parse(JSON.stringify(confB));

	for (let prop of props) if (mConfB[prop]) mConfA[prop] = mConfB[prop];

	return mConfA;
}
