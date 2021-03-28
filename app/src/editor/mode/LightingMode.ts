import * as Phaser from 'phaser';
import * as IO from 'socket.io-client';

import Mode from './Mode';
import GameMap from '../map/Map';
// import light from '../map/light/light';
// import EventHandler from '../EventHandler';
import InputManager from '../interact/InputManager';
import ActionManager from '../action/ActionManager';
// import ArchitectController from '../interact/ArchitectController';

import LightEntity from '../map/lighting/LightEntity';

import { Vec2 } from '../util/Vec';
import { Asset } from '../../../../common/DBStructs';
	
export const LightingModeKey = 'LIGHTING';

export default class DrawMode extends Mode {
	private lightEntities: LightEntity[] = [];
	private hovered: LightEntity | null = null;

	constructor(scene: Phaser.Scene, map: GameMap, socket: IO.Socket, actions: ActionManager, assets: Asset[]) {
		super(scene, map, socket, actions, assets);
	}

	update(cursorPos: Vec2, _input: InputManager) {
		cursorPos = cursorPos.floor();
		if (!this.hovered || cursorPos.x < this.hovered.x || cursorPos.y < this.hovered.y
			|| cursorPos.x > this.hovered.x || cursorPos.y > this.hovered.y) {
			this.hovered?.setHovered(false);
			this.hovered = null;

			for (let i = this.lightEntities.length - 1; i >= 0; i--) {
				let light = this.lightEntities[i];
				if (cursorPos.x >= light.x && cursorPos.y >= light.y
					&& cursorPos.x < light.x + 1 && cursorPos.y < light.y + 1) {
					
					this.hovered = light;
					console.log(light);
					this.hovered.setHovered(true);
					break;
				}
			}
		}
	}

	activate() {
		this.map.lighting.listLights().forEach((light) => {
			const entity = new LightEntity(this.scene, light.pos);
			this.lightEntities.push(entity);
			this.scene.add.existing(entity);
		});
		// if (this.drawTool === 'tile') this.controller.activate();;
	}

	deactivate() {
		// this.controller.deactivate();
	}
}
