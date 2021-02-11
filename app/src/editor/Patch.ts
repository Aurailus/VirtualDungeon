import * as Phaser from 'phaser';

import { Vec2, Vec4 } from './util/Vec';

const PATCH_TIMING = true;

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

	/*
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
	
	const tex = canvas.saveTexture(tileset_key);
	for (let i = 0; i < 5; i++) {
		for (let j = 0; j < 10; j++) {
			tex.add(j + i * 10, 0, j * tile_size, tile_size * 5 - (i + 1) * tile_size, tile_size, tile_size);
		}
	}

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
