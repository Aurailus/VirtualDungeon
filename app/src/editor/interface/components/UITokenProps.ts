import UIContainer from './UIContainer';
import type MapScene from '../../scene/MapScene';

import { Vec2 } from '../../util/Vec';

export default class UITokenProps extends UIContainer {
	constructor(scene: MapScene, x: number, y: number) {
		super(scene, x, y);

		let dims = new Vec2(300, 400);

		let e = new Phaser.GameObjects.Sprite(scene, 0, 0, 'ui_background_9x', 0);
		e.setScale(3, 3);
		this.add(e);

		e = new Phaser.GameObjects.Sprite(scene, 6	*3, 0, 'ui_background_9x', 1);
		e.setScale((dims.x - 12*3) / 6, 3);
		this.add(e);

		e = new Phaser.GameObjects.Sprite(scene, dims.x - 6*3, 0, 'ui_background_9x', 2);
		e.setScale(3);
		this.add(e);

		e = new Phaser.GameObjects.Sprite(scene, 0, 6*3, 'ui_background_9x', 3);
		e.setScale(3, (dims.y - 12 * 3) / 6);
		this.add(e);

		e = new Phaser.GameObjects.Sprite(scene, 6*3, 6*3, 'ui_background_9x', 4);
		e.setScale((dims.x - 12*3) / 6, (dims.y - 12 * 3) / 6);
		this.add(e);

		e = new Phaser.GameObjects.Sprite(scene, dims.x - 6*3, 6*3, 'ui_background_9x', 5);
		e.setScale(3, (dims.y - 12 * 3) / 6);
		this.add(e);

		e = new Phaser.GameObjects.Sprite(scene, 0, (dims.y - 6*3), 'ui_background_9x', 6);
		e.setScale(3);
		this.add(e);

		e = new Phaser.GameObjects.Sprite(scene, 6*3, (dims.y - 6*3), 'ui_background_9x', 7);
		e.setScale((dims.x - 12*3) / 6, 3);
		this.add(e);

		e = new Phaser.GameObjects.Sprite(scene, dims.x - 6*3, (dims.y - 6*3), 'ui_background_9x', 8);
		e.setScale(3);
		this.add(e);

		this.list.forEach(e => (e as Phaser.GameObjects.Sprite).setOrigin(0, 0));

	}
}
