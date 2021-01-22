import * as Phaser from 'phaser';

import Token, { TokenData, TokenModifyEvent } from './Token';
import EventHandler from '../../EventHandler';

export type TokenEvent = {
	uuid: string;
} & ((
	{ type: 'modify' } & TokenModifyEvent
) | {
	type: 'create';
	token: Token;
} | {
	type: 'destroy';
});

export default class TokenManager {
	private scene: Phaser.Scene = null as any;

	private tokens: Token[] = [];

	private evtHandler = new EventHandler<TokenEvent>();

	init(scene: Phaser.Scene) {
		this.scene = scene;
	}


	/**
	 * Gets a token based on it's UUID.
	 */

	getToken(token: string): Token | undefined {
		for (let i = 0; i < this.tokens.length; i++)
			if (this.tokens[i].getUUID() === token)
				return this.tokens[i];
		return undefined;
	}


	/**
	 * Sets the data for a token, based on a UUID internally within the data structure.
	 */

	setToken(data: Partial<TokenData>): Token | undefined {
		const token = this.tokens.filter(t => t.getUUID())[0];
		if (!token) return undefined;
		token.setToken(data);
		return token;
	}


	/**
	 * Creates a new token with the provided token
	 * data, and adds it to the token list.
	 */

	createToken(data: Partial<TokenData>): Token {
		const token = new Token(this.scene, data);
		token.change.bind(this.onChange);
		this.scene.add.existing(token);
		this.tokens.push(token);
		
		this.evtHandler.dispatch({
			type: 'create',
			uuid: token.getUUID(),
			token: token
		});
		
		return token;
	}


	/**
	 * Deletes a token based on it's UUID or direct object.
	 */

	deleteToken(token: string | Token): TokenData | undefined {
		for (let i = 0; i < this.tokens.length; i++) {
			if (typeof token === 'string' ? this.tokens[i].getUUID() === token : this.tokens[i] === token) {
				token = this.tokens[i];
				const data = token.getToken();

				this.tokens[i].destroy();
				this.tokens.splice(i, 1);

				this.evtHandler.dispatch({
					type: 'destroy',
					uuid: token.getUUID()
				});

				return data;
			}
		}
		return undefined;
	}

	
	/**
	 * Returns the array of token game objects.
	 */

	getTokens(): Token[] {
		return this.tokens;
	}


	/**
	 * Gets an array of token data, frozen at the time of the function call.
	 */

	getTokenData(): TokenData[] {
		return this.tokens.map(t => t.getToken());
	}


	/**
	 * Bind a callback to token change events.
	 */

	bind(cb: (evt: TokenEvent) => boolean | void) {
		this.evtHandler.bind(cb);
	}


	/**
	 * Unbind a callback from token change events.
	 */

	unbind(cb: (evt: TokenEvent) => boolean | void) {
		this.evtHandler.unbind(cb);
	}


	/**
	 * Callback to be called by Tokens when they change,
	 * triggers an event dispatch.
	 */

	private onChange = (event: TokenModifyEvent) => {
		this.evtHandler.dispatch({
			type: 'modify',
			uuid: event.token.getUUID(),
			...event
		});
	};
}
