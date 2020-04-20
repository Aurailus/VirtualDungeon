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

	equals(o: Vec2) {
		return this.x == o.x && this.y == o.y;
	}
}

class Vec3 {
	x: number = 0;
	y: number = 0;
	z: number = 0;

	constructor(x?: number | {x: number, y: number, z: number}, y?: number, z?: number) {
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

	equals(o: Vec3) {
		return this.x == o.x && this.y == o.y && this.z == o.z;
	}
}

class Vec4 {
	x: number = 0;
	y: number = 0;
	z: number = 0;
	w: number = 0;

	constructor(x?: number | {x: number, y: number}, y?: number, z?: number, w?: number) {
		if (x == null) return;

		if (typeof(x) == "number") {
			this.x = x;
			if (y != null) {
				this.y = y;
				this.z = z;
				this.w = w;
			}
			else {
				this.y = x;
				this.z = x;
				this.w = w;
			}
		}
		else {
			this.x = (x as any).x;
			this.y = (x as any).y;
			this.z = (x as any).z;
			this.w = (x as any).w;
		}
	}

	equals(o: Vec4) {
		return this.x == o.x && this.y == o.y && this.z == o.z && this.w == o.w;
	}
}
