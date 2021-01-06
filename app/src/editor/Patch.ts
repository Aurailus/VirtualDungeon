import * as Phaser from 'phaser';

import { Vec2, Vec4 } from './util/Vec';

export async function tileset(scene: Phaser.Scene, tileset_key: string, tile_size: number): Promise<void> {
	return new Promise<void>(resolve => {
		const s = Date.now();

		const canvas = new Phaser.GameObjects.RenderTexture(scene, 0, 0, 10 * tile_size, 5 * tile_size);
		canvas.draw(tileset_key);

		let part: Phaser.GameObjects.Sprite | Phaser.GameObjects.RenderTexture
			= new Phaser.GameObjects.Sprite(scene, 0, 0, tileset_key, '__BASE');
		part.setOrigin(0, 0);

		function draw(source: Vec4, dest: Vec2) {
			part.setCrop(source.x * tile_size, source.y * tile_size, (source.z - source.x) * tile_size, (source.w - source.y) * tile_size);
			part.setPosition((dest.x - source.x) * tile_size, (dest.y - source.y) * tile_size);
			canvas.draw(part);
		}

		// End Pieces and Walls

		draw(new Vec4(2, 0, 3, 0.5), new Vec2(7, 0));
		draw(new Vec4(2, 1.5, 3, 2), new Vec2(7, 0.5));

		draw(new Vec4(2, 0, 2.5, 1), new Vec2(8, 0));
		draw(new Vec4(3.5, 0, 4, 1), new Vec2(8.5, 0));

		draw(new Vec4(1, 0, 2, 0.5), new Vec2(9, 0));
		draw(new Vec4(0, 1.5, 1, 2), new Vec2(9, 0.5));

		draw(new Vec4(2, 1, 2.5, 2), new Vec2(7, 1));
		draw(new Vec4(3.5, 1, 4, 2), new Vec2(7.5, 1));

		draw(new Vec4(3, 0, 4, 0.5), new Vec2(8, 1));
		draw(new Vec4(3, 1.5, 4, 2), new Vec2(8, 1.5));

		draw(new Vec4(0, 0, 0.5, 1), new Vec2(9, 1));
		draw(new Vec4(1.5, 1, 2, 2), new Vec2(9.5, 1));

		// Advanced Corners (Orange)

		draw(new Vec4(6, 1, 7, 1.5), new Vec2(0, 2));
		draw(new Vec4(6, 0.5, 7, 1), new Vec2(0, 2.5));

		draw(new Vec4(6, 1, 6.5, 2), new Vec2(1, 2));
		draw(new Vec4(5.5, 1, 6, 2), new Vec2(1.5, 2));

		draw(new Vec4(5, 0, 6, 1), new Vec2(2, 2));
		draw(new Vec4(6, 1, 6.5, 1.5), new Vec2(2, 2));

		draw(new Vec4(6, 0, 6.5, 1), new Vec2(0, 3));
		draw(new Vec4(5.5, 0, 6, 1), new Vec2(0.5, 3));

		draw(new Vec4(5, 1, 6, 1.5), new Vec2(1, 3));
		draw(new Vec4(5, 0.5, 6, 1), new Vec2(1, 3.5));

		draw(new Vec4(6, 0, 7, 1), new Vec2(2, 3));
		draw(new Vec4(5.5, 1, 6, 1.5), new Vec2(2.5, 3));

		draw(new Vec4(5.5, 1, 6, 1.5), new Vec2(0.5, 4));
		draw(new Vec4(6, 1, 6.5, 1.5), new Vec2(0, 4));
		draw(new Vec4(6, 0.5, 6.5, 1), new Vec2(0, 4.5));
		draw(new Vec4(5.5, 0.5, 6, 1), new Vec2(0.5, 4.5));

		/**
		 * So here's why this is horrible:
		 * - Phaser doesn't let you copy a region of a RenderTexture to the same RenderTexture.
		 * - Creating a new RenderTexture and drawing the original directly onto it flips it upside down for some reason?
		 * - Scaling that upside-down RenderTexture to upside-right fucks with the draw() function's positioning.
		 *
		 * In other words, yeah, it's fucked man. The janky solution below is the only way I've found to make it work,
		 * so if future-Auri is looking at this and making a snarky comment to her friends about how she could do it
		 * *so much better*, please, just don't. Don't do it.
		 */

		part.setCrop();
		part = new Phaser.GameObjects.RenderTexture(scene, 0, 0, canvas.width, canvas.height);
		part.setOrigin(0, 0);
		const temp = new Phaser.GameObjects.Sprite(scene, 0, 0, canvas.texture);
		temp.setOrigin(0, 0);
		part.draw(temp);

		// Derived Forms (Pink)

		draw(new Vec4(2, 0, 3, 1), new Vec2(3, 2));
		draw(new Vec4(5.5, 0.5, 6, 1), new Vec2(3.5, 2.5));

		draw(new Vec4(3, 0, 4, 1), new Vec2(4, 2));
		draw(new Vec4(6, 0.5, 6.5, 1), new Vec2(4, 2.5));

		draw(new Vec4(1, 0, 2, 1), new Vec2(5, 2));
		draw(new Vec4(5.5, 0.5, 6, 1), new Vec2(5.5, 2.5));

		draw(new Vec4(1, 0, 2, 1), new Vec2(6, 2));
		draw(new Vec4(0, 3.5, 1, 4), new Vec2(6, 2.5));

		draw(new Vec4(1, 0, 2, 1), new Vec2(7, 2));
		draw(new Vec4(6, 0.5, 6.5, 1), new Vec2(7, 2.5));

		draw(new Vec4(0, 0, 1, 1), new Vec2(8, 2));
		draw(new Vec4(5.5, 0.5, 6, 1), new Vec2(8.5, 2.5));

		draw(new Vec4(1, 1, 2, 2), new Vec2(9, 2));
		draw(new Vec4(6, 0.5, 6.5, 1), new Vec2(9, 2.5));



		draw(new Vec4(2, 1, 3, 2), new Vec2(3, 3));
		draw(new Vec4(5.5, 1, 6, 1.5), new Vec2(3.5, 3));

		draw(new Vec4(3, 1, 4, 2), new Vec2(4, 3));
		draw(new Vec4(6, 1, 6.5, 1.5), new Vec2(4, 3));

		draw(new Vec4(0, 1, 1, 2), new Vec2(5, 3));
		draw(new Vec4(5.5, 1, 6, 1.5), new Vec2(5.5, 3));

		draw(new Vec4(0, 1, 1, 2), new Vec2(6, 3));
		draw(new Vec4(1, 2, 2, 2.5), new Vec2(6, 3));

		draw(new Vec4(0, 1, 1, 2), new Vec2(7, 3));
		draw(new Vec4(6, 1, 6.5, 1.5), new Vec2(7, 3));

		draw(new Vec4(0, 0, 1, 1), new Vec2(8, 3));
		draw(new Vec4(1.5, 3, 2, 4), new Vec2(8.5, 3));

		draw(new Vec4(1, 1, 2, 2), new Vec2(9, 3));
		draw(new Vec4(0, 2, 0.5, 3), new Vec2(9, 3));



		draw(new Vec4(0, 2, 1, 3), new Vec2(4, 4));
		draw(new Vec4(5.5, 1, 6, 1.5), new Vec2(4.5, 4));

		draw(new Vec4(1, 3, 2, 4), new Vec2(5, 4));
		draw(new Vec4(6, 1, 6.5, 1.5), new Vec2(5, 4));

		draw(new Vec4(0, 2, 1, 3), new Vec2(6, 4));
		draw(new Vec4(5.5, 0.5, 6, 1), new Vec2(6.5, 4.5));

		draw(new Vec4(1, 3, 2, 4), new Vec2(7, 4));
		draw(new Vec4(6, 0.5, 6.5, 1), new Vec2(7, 4.5));

		draw(new Vec4(0, 0, 1, 1), new Vec2(8, 4));
		draw(new Vec4(5.5, 1, 6, 1.5), new Vec2(8.5, 4));

		draw(new Vec4(1, 1, 2, 2), new Vec2(9, 4));
		draw(new Vec4(6, 1, 6.5, 1.5), new Vec2(9, 4));

		canvas.snapshot((img: any) => {
			scene.textures.removeKey(tileset_key);
			scene.textures.addSpriteSheet(tileset_key, img, { frameWidth: tile_size, frameHeight: tile_size });

			console.log(`Patched '${tileset_key}' in ${Date.now() - s} ms.`);

			resolve();
		});
	});
}
