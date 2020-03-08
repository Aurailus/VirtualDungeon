class Vec2 {
	x: number = 0;
	y: number = 0;

	constructor(x?: number | {x: number, y: number}, y?: number) {
		if (x == null) return;

		if (typeof(x) == "number") {
			this.x = x;
			if (y != null) this.y = y;
			else this.y = x;
		}
		else {
			this.x = (x as any as {x: number, y:number}).x;
			this.y = (x as any as {x: number, y:number}).y;
		}
	}
}

class Vec3 {
	x: number = 0;
	y: number = 0;
	z: number = 0;

	constructor(x?: number | {x: number, y: number}, y?: number, z?: number) {
		if (x == null) return;

		if (typeof(x) == "number") {
			this.x = x;
			if (y != null) {
				this.y = y;
				this.z = z;
			}
			else {
				this.y = x;
				this.z = x;
			}
		}
		else {
			this.x = (x as any as {x: number, y:number, z:number}).x;
			this.y = (x as any as {x: number, y:number, z:number}).y;
			this.z = (x as any as {x: number, y:number, z:number}).z;
		}
	}
}
