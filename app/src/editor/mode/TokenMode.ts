import * as Phaser from 'phaser';
import * as IO from 'socket.io-client';

import Mode from './Mode';
import Map from '../map/Map';
import Token from '../map/token/Token';
import InputManager from '../interact/InputManager';
import ActionManager from '../action/ActionManager';
import EntityController from '../interact/EntityController';

import { Vec2 } from '../util/Vec';
import { Asset, TokenAsset } from '../../../../common/DBStructs';


/** The mode key of this mode. */
export const TokenModeKey = 'TOKEN';

/** Handles placing, moving, and destroying tokens. */
export default class TokenMode extends Mode {

	/** The type of token to be placed. */
	private placeToken?: string;

	/** Whether or not the scroll event is bound. */
	private bound: boolean = false;

	/** The underlying entity controller that manages interactions. */
	private controller: EntityController<Token>;

	constructor(scene: Phaser.Scene, map: Map, socket: IO.Socket, actions: ActionManager, assets: Asset[]) {
		super(scene, map, socket, actions, assets);
		this.controller = new EntityController(scene, map.tokens.getAllTokens(), {
			canCreate: this.canCreate,
			handleCreate: this.handleCreate,
			handleDelete: this.handleDelete,
			onPreMove: this.onPreMove,
			onPostMove: this.onPostMove
		});

		this.controller.preview = new Token(scene, '', 50);
		this.scene.add.existing(this.controller.preview);
		this.controller.preview.setVisible(false);
		this.controller.preview.setAlpha(0.2);
	}


	/**
	 * Updates the underlying entity controller,
	 * allowing tokens to be moved, created, and destroyed.
	 *
	 * @param {Vec2} cursorPos - The cursor's position.
	 * @param {InputManager} input - The input manager.
	 */

	update(cursorPos: Vec2, input: InputManager) {
		if (!this.bound) {
			input.bindScrollEvent((delta: number) => {
				if (this.controller.mode !== 'move') return false;
				this.controller.selected.forEach(token => {
					let index = token.getFrameIndex() + delta;
					if (index < 0) index += token.getFrameCount();
					index %= token.getFrameCount();
					token.setIndex(index);
				});
				return true;
			});
			this.bound = true;
		}

		if (input.getContext() !== 'map') return;

		cursorPos = cursorPos.floor();
		this.controller.update(cursorPos, input);
	}

	activate() { /* No activation logic */ }


	/**
	 * Deactivates this mode, ceasing all events.
	 */

	deactivate() {
		this.controller.deactivate();
	}


	/**
	 * Gets the current type of token that will be placed.
	 *
	 * @returns a token type, or undefined.
	 */

	getPlaceToken() {
		return this.placeToken;
	}


	/**
	 * Sets the type of token to place.
	 *
	 * @param {string | undefined} - The token type, or undefined if no token should be placed.
	 */

	setPlaceToken(placeToken?: string) {
		this.placeToken = placeToken;
		(this.controller.preview as Token).setTexture(this.placeToken ?? '', 0);
	}


	/**
	 * Identifies if a token can be created if a click is triggered.
	 *
	 * @returns a boolean indicating if a token can be created.
	 */

	private canCreate = () => this.placeToken !== undefined;


	/**
	 * Creates a token of the currently selected type.
	 *
	 * @param {Vec2} pos - The position to create the token at.
	 * @returns the newly created token.
	 */

	private handleCreate = (pos: Vec2): Token => {
		const asset = this.assets.filter(a => a.identifier === this.placeToken)[0] as TokenAsset;
		const token = this.map.tokens.createToken('', this.map.getActiveLayer()?.index ?? 0,
			pos, { name: asset.name }, Number.parseInt(asset.tileSize.x as any, 10), this.placeToken);
		this.actions.push({ type: 'place_token', tokens: [{ uuid: token.uuid, ...token.getRenderData() }] });
		return token;
	};


	/**
	 * Deletes a set of tokens from the token manager.
	 *
	 * @param {Set<Token>} tokens - The tokens to delete.
	 */

	private handleDelete = (tokens: Set<Token>) => this.actions.push({ type: 'delete_token', tokens:
		Array.from(tokens).map(t => ({ uuid: t.uuid, ...this.map.tokens.deleteToken(t) as any }))});


	/**
	 * Creates serialized token data at the beginning of a move,
	 * which will be used when the move completes.
	 *
	 * @param {Set<Token>} tokens - The tokens that will be moved.
	 * @returns serialized data of the tokens' state.
	 */

	private onPreMove = (tokens: Set<Token>) => Array.from(tokens).map(t => t.getRenderData());


	/**
	 * Emits a modify event when tokens have been moved.
	 *
	 * @param {Set<Token>} tokens - The tokens that have been moved.
	 * @param {any[] | null} preData - The tokens' previous state, created by preMove.
	 */

	private onPostMove = (tokens: Set<Token>, preData: any[] | null) => this.actions.push({ type: 'modify_token', tokens:
			Array.from(tokens).map((t, i) => ({ uuid: t.uuid, pre: preData![i], post: t.getRenderData() })) });
}
