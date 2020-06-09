class LightSource {
	light: Lighting;

	x: number;
	y: number;
	radius: number = 32;
	intensity: number = 1.0;

	constructor(light: Lighting, x: number, y: number) {
		this.light = light;
		this.x = x;
		this.y = y;
	}

	setRadius(radius: number) {
		this.radius = radius;
	}

	setIntensity(intensity: number) {
		this.intensity = intensity;
	}
}
