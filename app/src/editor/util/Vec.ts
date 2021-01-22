export class Vec2 {

	x: number = 0;
	y: number = 0;

	constructor(x?: number | { x: number; y: number }, y?: number) {
		if (x == null) return;

		if (typeof(x) === 'number') {
			this.x = x;
			if (y != null) this.y = y;
			else this.y = x;
		}
		else {
			this.x = (x as { x: number; y: number }).x;
			this.y = (x as { x: number; y: number }).y;
		}
	}

	normalize(): Vec2 {
		const l = this.length();
		return new Vec2(this.x / l, this.y / l);
	}

	equals(o: Vec2): boolean {
		return this.x === o.x && this.y === o.y;
	}

	floor(): Vec2 {
		return new Vec2(Math.floor(this.x), Math.floor(this.y));
	}

	length(): number {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	}
}

export class Vec3 {
	x: number = 0;
	y: number = 0;
	z: number = 0;

	constructor(x?: number | { x: number; y: number; z: number }, y?: number, z?: number) {
		if (x == null) return;

		if (typeof(x) === 'number') {
			this.x = x;
			if (y != null) {
				this.y = y;
				this.z = z!;
			}
			else {
				this.y = x;
				this.z = x;
			}
		}
		else {
			this.x = (x as { x: number; y: number; z: number }).x;
			this.y = (x as { x: number; y: number; z: number }).y;
			this.z = (x as { x: number; y: number; z: number }).z;
		}
	}

	equals(o: Vec3) {
		return this.x === o.x && this.y === o.y && this.z === o.z;
	}

	floor() {
		return new Vec3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
	}
}

export class Vec4 {
	x: number = 0;
	y: number = 0;
	z: number = 0;
	w: number = 0;

	constructor(x?: number | { x: number; y: number; z: number; w: number }, y?: number, z?: number, w?: number) {
		if (x == null) return;

		if (typeof(x) === 'number') {
			this.x = x;
			if (y != null) {
				this.y = y;
				this.z = z!;
				this.w = w!;
			}
			else {
				this.y = x;
				this.z = x;
				this.w = w!;
			}
		}
		else {
			this.x = (x as { x: number; y: number; z: number; w: number }).x;
			this.y = (x as { x: number; y: number; z: number; w: number }).y;
			this.z = (x as { x: number; y: number; z: number; w: number }).z;
			this.w = (x as { x: number; y: number; z: number; w: number }).w;
		}
	}

	equals(o: Vec4) {
		return this.x === o.x && this.y === o.y && this.z === o.z && this.w === o.w;
	}

	floor() {
		return new Vec4(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z), Math.floor(this.w));
	}
}
