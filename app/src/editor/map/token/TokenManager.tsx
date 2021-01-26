import * as Phaser from 'phaser';

import EventHandler from '../../EventHandler';
import Token, { TokenData, TokenMetaData, TokenRenderData, TokenRenderEvent } from './Token';

import { Vec2 } from '../../util/Vec';
import { generateId } from '../../util/Helpers';

/** Token Event emitted by the TokenManager */
export type TokenEvent = {
	uuid: string;
} & ((
	{ type: 'modify' } & TokenRenderEvent
) | {
	type: 'create';
	token: Token;
	render: TokenRenderData;
} | {
	type: 'destroy';
	render: TokenRenderData;
});


/** Default token meta data. */
const DEFAULT_METADATA: TokenMetaData = {
	name: '', note: '', sliders: []
};

export default class TokenManager {
	readonly event = new EventHandler<TokenEvent>();

	private tokens: Token[] = [];
	private scene: Phaser.Scene = null as any;
	private meta: Map<string, TokenMetaData> = new Map();

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
			if (this.tokens[i].uuid === token)
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

	createToken(uuid: string, layer: number, pos: Vec2, meta?: Partial<TokenMetaData>, sprite?: string, index?: number): Token {
		uuid = uuid || generateId(32);
		this.setMeta(uuid, meta);
		
		const token = new Token(this.scene, uuid, layer, pos, sprite, index);
		token.on_render.bind(this.onChange);
		this.scene.add.existing(token);
		this.tokens.push(token);
		
		this.event.dispatch({
			type: 'create',
			uuid: uuid,
			token: token,
			render: token.getRenderData()
		});
		
		return token;
	}


	/**
	 * Deletes a token based on it's UUID or direct object.
	 *
	 * @param {Token | string} token - Either a token's UUID string, or the token instance itself.
	 * @returns the token's data prior to deletion, or undefined if the token was not found.
	 */

	deleteToken(token: Token | string): TokenRenderData | undefined {
		if (typeof token === 'string') token = this.tokens.filter(t => t.uuid === token)[0];
		if (!token) return undefined;

		const data = token.getRenderData();
		this.tokens.splice(this.tokens.indexOf(token), 1);
		token.shadow?.destroy();
		token.destroy();

		this.event.dispatch({
			type: 'destroy',
			uuid: token.uuid,
			render: token.getRenderData()
		});

		return data;
	}


	/**
	 * Deletes all tokens, and optionally deserializes new ones into the scene.
	 *
	 * @param {TokenData[]} to - New tokens to deserialize.
	 * @returns an array of the new token instances.
	 */

	resetTokens(data?: TokenData[]): Token[] {
		while (this.tokens.length > 0) this.deleteToken(this.tokens[this.tokens.length - 1]);
		data?.forEach(d => this.createToken(
			d.uuid, d.render.layer, new Vec2(d.render.pos as any), d.meta,
			d.render.appearance.sprite, d.render.appearance.index));
		return this.getAllTokens();
	}


	/**
	 * Returns a serialized representation of a token.
	 *
	 * @param {Token | string} token - Either a token UUID or a token instance.
	 * @returns the serialized token data.
	 */

	serialize(token: Token | string): TokenData | undefined {
		if (typeof token === 'string') token = this.tokens.filter(t => t.uuid === token)[0];
		if (!token) return undefined;

		return {
			uuid: token.uuid,
			meta: this.meta.get(token.uuid)!,
			render: token.getRenderData()
		};
	}


	/**
	 * Returns an array of serialized tokens.
	 *
	 * @returns a TokenData[] of all token instances.
	 */

	serializeAll(): TokenData[] {
		return this.tokens.map(t => this.serialize(t)).filter(t => t) as TokenData[];
	}


	/**
	 * Gets serialized token data for all existing tokens managed by this manager.
	 * This data is cloned, and safe to modify.
	 *
	 * @returns an array of cloned TokenData objects corresponding to each token.
	 */

	getAllMeta(): { [key: string]: TokenMetaData } {
		const meta: { [key: string]: TokenMetaData } = {};
		for (let key of this.meta.keys()) {
			if (this.tokens.filter(f => f.uuid === key).length)
				meta[key] = JSON.parse(JSON.stringify(this.meta.get(key)));
		}
		return meta;
	}


	/**
	 * Updates a token with the specified token data.
	 *
	 * @param {string} uuid - The token's UUID.
	 * @param {Partial<TokenMetaData>} data - The data to update the token with.
	 */

	setMeta(uuid: string, data?: Partial<TokenMetaData>) {
		this.meta.set(uuid, { ...DEFAULT_METADATA, ...this.meta.get(uuid) ?? {}, ...data ?? {} });
	}


	/**
	 * Sets a token's render information to the object provided.
	 *
	 * @param {string} uuid - The token's UUID.
	 * @param {Partial<TokenRenderData>} data - The data to update the token with.
	 */

	setRenderData(uuid: string, data: Partial<TokenRenderData>): Token | undefined {
		const token = this.getToken(uuid);
		if (!token) return undefined;
		token.setRenderData(data);
		return token;
	}


	/**
	 * Called by Tokens upon render change, triggers an event dispatch.
	 *
	 * @param {TokenModifyEvent} event - The event object from the token's change.
	 */

	private onChange = (event: TokenRenderEvent) => {
		this.event.dispatch({ type: 'modify', ...event });
	};
}
