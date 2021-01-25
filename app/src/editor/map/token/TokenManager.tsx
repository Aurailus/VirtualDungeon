import * as Phaser from 'phaser';

import EventHandler from '../../EventHandler';
import Token, { TokenData, TokenMetaData, TokenRenderData, TokenRenderEvent } from './Token';

import { Vec2 } from '../../util/Vec';

/** Token Event emitted by the TokenManager */
export type TokenEvent = {
	uuid: string;
} & ((
	{ type: 'modify' } & TokenRenderEvent
) | {
	type: 'create';
	token: Token;
} | {
	type: 'destroy';
});

export default class TokenManager {
	readonly event = new EventHandler<TokenEvent>();
	
	private scene: Phaser.Scene = null as any;
	private tokens: Token[] = [];

	init(scene: Phaser.Scene) {
		this.scene = scene;
	}


	/**
	 * Gets a token based on it's UUID.
	 *
	 * @param {string} token - The token's UUID string.
	 * @returns the token instance if it exists, or undefined.
	 */

	getToken(token: string): Token | undefined {
		for (let i = 0; i < this.tokens.length; i++)
			if (this.tokens[i].getUUID() === token)
				return this.tokens[i];
		return undefined;
	}

	
	/**
	 * Gets a list of token instances stored within this manager.
	 *
	 * @returns the array of token game objects.
	 */

	getAllTokens(): Token[] {
		return this.tokens;
	}


	/**
	 * Creates a new token with the provided token data.
	 *
	 * @param {string} data - The TokenData to create the token from.
	 * @returns the new token instance.
	 */

	createToken(pos: Vec2, meta: Partial<TokenMetaData>, sprite?: string, index?: number): Token {
		const token = new Token(this.scene, meta, pos, sprite, index);
		token.on_render.bind(this.onChange);
		this.scene.add.existing(token);
		this.tokens.push(token);
		
		this.event.dispatch({
			type: 'create',
			uuid: token.getUUID(),
			token: token
		});
		
		return token;
	}


	/**
	 * Deletes a token based on it's UUID or direct object.
	 *
	 * @param {string | Token} token - Either a token's UUID string, or the token instance itself.
	 * @returns the token's data prior to deletion, or undefined if the token was not found.
	 */

	deleteToken(token: string | Token): TokenData | undefined {
		for (let i = 0; i < this.tokens.length; i++) {
			if (typeof token === 'string' ? this.tokens[i].getUUID() === token : this.tokens[i] === token) {
				token = this.tokens[i];
				const data = token.serialize();

				token.destroy();
				this.tokens.splice(i, 1);

				this.event.dispatch({
					type: 'destroy',
					uuid: token.getUUID()
				});

				return data;
			}
		}
		return undefined;
	}


	/**
	 * Deletes all tokens, and optionally deserializes new ones into the scene.
	 *
	 * @param {TokenData[]} to - New tokens to deserialize.
	 * @returns an array of the new token instances.
	 */

	resetTokens(data?: TokenData[]): Token[] {
		while (this.tokens.length > 0) this.deleteToken(this.tokens[this.tokens.length - 1]);
		data?.forEach(d => this.createToken(new Vec2(d.render.pos as any), d.meta,
			d.render.appearance.sprite, d.render.appearance.index));
		return this.getAllTokens();
	}


	/**
	 * Returns the serialized form of all tokens.
	 *
	 * @returns a TokenData[] of all token instances.
	 */

	serializeAllTokens(): TokenData[] {
		return this.tokens.map(t => t.serialize());
	}


	/**
	 * Gets serialized token data for all the tokens within this manager.
	 * This data is cloned, and safe to modify.
	 *
	 * @returns an array of cloned TokenData objects corresponding to each token.
	 */

	getAllMeta(): TokenMetaData[] {
		return this.tokens.map(t => t.getMeta());
	}


	/**
	 * Updates a token with the specified token data.
	 *
	 * @param {Partial<TokenMetaData>} data - The data to update the token with.
	 * @returns the token instance, if it exists.
	 */

	setMeta(uuid: string, data: Partial<TokenMetaData>): Token | undefined {
		const token = this.getToken(uuid);
		if (!token) return undefined;
		token.setMeta(data);
		return token;
	}


	/**
	 *
	 */

	setRender(uuid: string, data: Partial<TokenRenderData>): Token | undefined {
		const token = this.getToken(uuid);
		if (!token) return undefined;
		token.setRender(data);
		return token;
	}


	/**
	 * Called by Tokens upon changing, triggers an event dispatch.
	 *
	 * @param {TokenModifyEvent} event - The event object from the token's change.
	 */

	private onChange = (event: TokenRenderEvent) => {
		this.event.dispatch({
			type: 'modify',
			uuid: event.token.getUUID(),
			...event
		});
	};
}
