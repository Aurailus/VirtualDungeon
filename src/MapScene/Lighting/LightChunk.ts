class LightChunk {
	static CHUNK_SIZE = 512;

	private pos: Vec2;
	private light: Lighting;
	private canvas: Phaser.GameObjects.RenderTexture;

	constructor(light: Lighting, x: number, y: number) {
		this.pos = new Vec2(x, y);
		this.canvas = light.scene.add.renderTexture(
			// The magic + 2's are to prevent seeing the seams between chunks.
			x * LightChunk.CHUNK_SIZE * 4, y * LightChunk.CHUNK_SIZE * 4, LightChunk.CHUNK_SIZE, LightChunk.CHUNK_SIZE);

		this.light = light;
		this.canvas.setScale(4);
		this.canvas.setOrigin(0, 0);

		this.build();
	}

	build() {
		// Reset
		const reset = new Phaser.GameObjects.Rectangle(this.light.scene, 0, 0, LightChunk.CHUNK_SIZE, LightChunk.CHUNK_SIZE, 0x000000);
		reset.setDisplayOrigin(0, 0);
		reset.setOrigin(0, 0);
		this.canvas.draw(reset);
		reset.destroy();

		for (let light of this.light.lightSources) {
			let lp = new Vec2(light.x - this.pos.x * LightChunk.CHUNK_SIZE, light.y - this.pos.y * LightChunk.CHUNK_SIZE);
			if ((lp.x + light.radius > 0 || lp.x - light.radius < LightChunk.CHUNK_SIZE) &&
				(lp.y + light.radius > 0 || lp.y - light.radius < LightChunk.CHUNK_SIZE)) {

				this.drawRayTracedCircle(light, lp);

				// let poly = new Phaser.GameObjects.Ellipse(this.light.scene, lp.x, lp.y, light.radius, light.radius, 0xffffff, light.intensity)
				// poly.setScale(4, 4);
				// poly.setBlendMode('ERASE');
				// poly.setDisplayOrigin(0, 0);
				// poly.setOrigin(0.5, 0.5);

				// this.canvas.draw(poly);
			}
		}
	}

	drawRayTracedCircle(light: LightSource, lp: Vec2) {
		console.log('light');
		
		let start = new Vec2(Math.floor(light.x / 16), Math.floor(light.y / 16))
		let points: Vec2[] = [];

		for (let i = 0; i < 288; i++) {
			let ray = new Vec2(0.5, 0.5);
			let dir = new Vec2(Math.cos(i * 1.25 * (Math.PI / 180)) / 32, Math.sin(i * 1.25 * (Math.PI / 180)) / 32);

			let dist = 0;
			while (this.light.scene.map.getTileset(Layer.wall, Math.floor(start.x + ray.x), Math.floor(start.y + ray.y)) == -1 && 
				(dist = Math.sqrt(Math.pow(ray.x, 2) + Math.pow(ray.y, 2))) < light.radius / 16) {

				ray.x += dir.x;
				ray.y += dir.y;
			}

			ray.x += dir.x * 0.3;
			ray.y += dir.y * 0.3;
			ray.x += dir.x * ((light.radius / 16) - dist) * 0.5;
			ray.y += dir.y * ((light.radius / 16) - dist) * 0.5;

			points.push(new Vec2(ray.x * 4, ray.y * 4));
		}

		let render = new Phaser.GameObjects.RenderTexture(this.light.scene, lp.x - light.radius, lp.y - light.radius, light.radius * 2, light.radius * 2);

		let gfx = new Phaser.GameObjects.Graphics(this.light.scene, {x: light.radius, y: light.radius});
		gfx.setScale(4, 4);
		gfx.fillStyle(0xffffff, light.intensity / 3);
		gfx.fillPoints(points, true);
		
		for (let i = 0; i < 6; i++) {
			gfx.scaleX += 0.02;
			gfx.scaleY += 0.02;
			render.draw(gfx);
		}

		let spr = new Phaser.GameObjects.Sprite(this.light.scene, 0, 0, "shader_light_mask");
		spr.setScale(light.radius / 128, light.radius / 128);
		spr.setOrigin(0, 0);
		spr.setBlendMode(Phaser.BlendModes.ERASE);
		render.draw(spr);

		render.setBlendMode(Phaser.BlendModes.ERASE);
		this.canvas.draw(render);
		render.destroy();
	}
}
