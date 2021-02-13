import * as Phaser from 'phaser';

import { Vec2, Vec4 } from './util/Vec';

const PATCH_TIMING = false;

/**
 * Patches a partial tileset into a full tileset by combining parts of other textures.
 * Replaces the existing texture in the Phaser cache. Run this operation before using
 * the texture on GameObjects, as Phaser will not update them after this operation is
 * complete.
 *
 * @param {Phaser.Scene} scene - The scene containing the texture cache.
 * @param {string} tileset_key - The key of the tileset texture within the cache.
 * @param {number} tile_size - The size of the tiles within the tileset texture.
 *
 * @returns a promise that resolves when the texture has been updated.
 */

export function tileset(scene: Phaser.Scene, tileset_key: string, tile_size: number) {
	const s = PATCH_TIMING ? Date.now() : 0;

	const img = scene.textures.get(tileset_key).source[0].image as HTMLImageElement;
	scene.textures.removeKey(tileset_key);

	const canvas = scene.textures.createCanvas(tileset_key, 10 * tile_size, 5 * tile_size);
	canvas.draw(0, 0, img);

	const ctx = canvas.getContext();
	function draw(source: Vec4, dest: Vec2) {
		const data = ctx.getImageData(source.x * tile_size, source.y * tile_size,
			(source.z - source.x) * tile_size, (source.w - source.y) * tile_size);
		ctx.putImageData(data, dest.x * tile_size, dest.y * tile_size);
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

	draw(new Vec4(5, 0.5, 6, 1), new Vec2(2, 2.5));
	draw(new Vec4(5.5, 0, 6, 0.5), new Vec2(2.5, 2));
	draw(new Vec4(6, 1, 6.5, 1.5), new Vec2(2, 2));

	draw(new Vec4(6, 0, 6.5, 1), new Vec2(0, 3));
	draw(new Vec4(5.5, 0, 6, 1), new Vec2(0.5, 3));

	draw(new Vec4(5, 1, 6, 1.5), new Vec2(1, 3));
	draw(new Vec4(5, 0.5, 6, 1), new Vec2(1, 3.5));

	draw(new Vec4(6, 0, 6.5, 0.5), new Vec2(2, 3));
	draw(new Vec4(6, 0.5, 7, 1), new Vec2(2, 3.5));
	draw(new Vec4(5.5, 1, 6, 1.5), new Vec2(2.5, 3));

	draw(new Vec4(5.5, 1, 6, 1.5), new Vec2(0.5, 4));
	draw(new Vec4(6, 1, 6.5, 1.5), new Vec2(0, 4));
	draw(new Vec4(6, 0.5, 6.5, 1), new Vec2(0, 4.5));
	draw(new Vec4(5.5, 0.5, 6, 1), new Vec2(0.5, 4.5));

	// Derived Forms (Pink)

	draw(new Vec4(2, 0, 4, 0.5), new Vec2(3, 2));
	draw(new Vec4(2, 0.5, 2.5, 1.5), new Vec2(3, 2.5));
	draw(new Vec4(3.5, 0.5, 4, 1.5), new Vec2(4.5, 2.5));
	draw(new Vec4(2, 1.5, 4, 2), new Vec2(3, 3.5));
	draw(new Vec4(5.5, 0.5, 6.5, 1.5), new Vec2(3.5, 2.5));

	draw(new Vec4(1, 0, 2, 0.5), new Vec2(5, 2));
	draw(new Vec4(1, 0, 2, 0.5), new Vec2(6, 2));
	draw(new Vec4(1, 0, 2, 0.5), new Vec2(7, 2));
	draw(new Vec4(5, 0.5, 6.5, 1.5), new Vec2(5, 2.5));
	draw(new Vec4(5.5, 0.5, 7, 1.5), new Vec2(6.5, 2.5));
	draw(new Vec4(0, 1.5, 1, 2), new Vec2(5, 3.5));
	draw(new Vec4(0, 1.5, 1, 2), new Vec2(6, 3.5));
	draw(new Vec4(0, 1.5, 1, 2), new Vec2(7, 3.5));

	draw(new Vec4(5.5, 0, 6.5, 0.5), new Vec2(8.5, 2));
	draw(new Vec4(5.5, 1.5, 6.5, 2), new Vec2(8.5, 4.5));
	draw(new Vec4(1.5, 1, 2, 2), new Vec2(9.5, 2));
	draw(new Vec4(1.5, 1, 2, 2), new Vec2(9.5, 3));
	draw(new Vec4(1.5, 1, 2, 2), new Vec2(9.5, 4));
	draw(new Vec4(0, 0, 0.5, 1), new Vec2(8, 2));
	draw(new Vec4(0, 0, 0.5, 1), new Vec2(8, 3));
	draw(new Vec4(0, 0, 0.5, 1), new Vec2(8, 4));
	draw(new Vec4(5.5, 0.5, 6.5, 1.5), new Vec2(8.5, 2.5));
	draw(new Vec4(5.5, 0.5, 6.5, 1.5), new Vec2(8.5, 3.5));

	draw(new Vec4(0, 2, 0.5, 3), new Vec2(4, 4));
	draw(new Vec4(0.5, 2.5, 1, 3), new Vec2(4.5, 4.5));
	draw(new Vec4(5.5, 1, 6, 1.5), new Vec2(4.5, 4));

	draw(new Vec4(1.5, 3, 2, 4), new Vec2(5.5, 4));
	draw(new Vec4(1, 3.5, 1.5, 4), new Vec2(5, 4.5));
	draw(new Vec4(6, 1, 6.5, 1.5), new Vec2(5, 4));

	draw(new Vec4(0, 2, 0.5, 3), new Vec2(6, 4));
	draw(new Vec4(0.5, 2, 1, 2.5), new Vec2(6.5, 4));
	draw(new Vec4(5.5, 0.5, 6, 1), new Vec2(6.5, 4.5));

	draw(new Vec4(1.5, 3, 2, 4), new Vec2(7.5, 4));
	draw(new Vec4(1, 3, 1.5, 3.5), new Vec2(7, 4));
	draw(new Vec4(6, 0.5, 6.5, 1), new Vec2(7, 4.5));

	// for (let i = 0; i < canvas.width; i++) {
	// 	for (let j = 0; j < canvas.height; j++) {
	// 		const data = ctx.getImageData(i, j, 1, 1).data;
	// 		let color = false;
	// 		for (let k = 0; k < 3; k++) if (data[k] !== 0) {
	// 			color = true;
	// 			break;
	// 		}
	// 		if (color) ctx.clearRect(i, j, 1, 1);
	// 	}
	// }

	canvas.refresh();
	// console.log(scene.textures.get(tileset_key));

	for (let i = 0; i < 5; i++)
		for (let j = 0; j < 10; j++)
			canvas.add(j + i * 10, 0, j * tile_size, i * tile_size, tile_size, tile_size);

	if (PATCH_TIMING) console.log(`Patched Tileset '${tileset_key}' in ${Date.now() - s} ms.`);
}


/**
 */

export function floor(scene: Phaser.Scene, tileset_key: string, tile_size: number) {
	const s = PATCH_TIMING ? Date.now() : 0;

	const img = scene.textures.get(tileset_key).source[0].image as HTMLImageElement;
	scene.textures.removeKey(tileset_key);

	const canvas = scene.textures.createCanvas(tileset_key, 9 * tile_size, 7 * tile_size);
	canvas.draw(0, 0, img);
	canvas.refresh();

	for (let j = 0; j < 9; j++)
		for (let i = 0; i < 7; i++)
			canvas.add(j + i * 9, 0, j * tile_size, i * tile_size, tile_size, tile_size);

	if (PATCH_TIMING) console.log(`Patched Tileset '${tileset_key}' in ${Date.now() - s} ms.`);
}


/**
 * Patches a sprite texture, adding a 2 pixel gap around each frame, which is needed for OutlinePipeline.
 * Replaces the existing texture in the Phaser cache. Run this operation before using the
 * texture on GameObjects, as Phaser will not update them after this operation is complete.
 *
 * @param {Phaser.Scene} scene - The scene containing the texture cache.
 * @param {string} sprite_key - The key of the sprite texture within the cache.
 * @param {number} sprite_segments - The amount of frames across an axis of the sprite (e.g 2 for a 2*2 grid of frames).
 *
 * @returns a promise that resolves when the texture has been updated.
 */

export async function sprite(scene: Phaser.Scene, sprite_key: string, sprite_segments: number): Promise<void> {
	return new Promise<void>(resolve => {
		const s = PATCH_TIMING ? Date.now() : 0;

		let part: Phaser.GameObjects.Sprite = new Phaser.GameObjects.Sprite(scene, 0, 0, sprite_key);
		part.setOrigin(0, 0);

		const raw_width = part.width;
		const frame_width = raw_width + 2;
		const res_width = (frame_width + 2) * sprite_segments;

		const canvas = new Phaser.GameObjects.RenderTexture(scene, 0, 0, res_width, res_width);

		function draw(frame: Vec2) {
			part.setFrame(frame.x + frame.y * sprite_segments);
			part.setPosition(1 + frame.x * (frame_width + 2), 1 + frame.y * (frame_width + 2));
			canvas.draw(part);
		}

		for (let x = 0; x < sprite_segments; x++) {
			for (let y = 0; y < sprite_segments; y++) {
				draw(new Vec2(x, y));
			}
		}

		canvas.snapshot((img: any) => {
			scene.textures.removeKey(sprite_key);
			scene.textures.addSpriteSheet(sprite_key, img,
				{ frameWidth: frame_width, frameHeight: frame_width, spacing: 2 });

			if (PATCH_TIMING) console.log(`Patched Sprite '${sprite_key}' in ${Date.now() - s} ms.`);

			resolve();
		});
	});
}
