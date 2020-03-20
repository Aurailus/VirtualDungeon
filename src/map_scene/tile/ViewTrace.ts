class TraceNode {
	x: number;
	y: number;

	l: boolean = true;
	r: boolean = true;
	u: boolean = true;
	d: boolean = true;

	distance: number;
	maxDistance: number;

	constructor(x: number, y: number, distance: number, maxDistance: number) {
		this.x = x;
		this.y = y;
		this.distance = distance;
		this.maxDistance = maxDistance;
	}

	setDirections(l: boolean, r: boolean, u: boolean, d: boolean) {
		this.l = l;
		this.r = r;
		this.u = u;
		this.d = d;
	}

	propagate(t: ViewTrace) {
		// Kill
		if (this.distance == this.maxDistance) return;

		// Left
		if (this.l && t.map.getWall(this.x - 1, this.y) == -1) {
			let newNode = new TraceNode(this.x - 1, this.y, this.distance + 1, this.maxDistance);
			newNode.setDirections(this.l, false, this.u, this.d);
			t.activeNodes.push(newNode);
		}
		// Right
		if (this.r && t.map.getWall(this.x + 1, this.y) == -1) {
			let newNode = new TraceNode(this.x + 1, this.y, this.distance + 1, this.maxDistance);
			newNode.setDirections(false, this.r, this.u, this.d);
			t.activeNodes.push(newNode);
		}
		// Up
		if (this.u && t.map.getWall(this.x, this.y - 1) == -1) {
			let newNode = new TraceNode(this.x, this.y - 1, this.distance + 1, this.maxDistance);
			newNode.setDirections(this.l, this.r, this.u, false);
			t.activeNodes.push(newNode);
		}
		// Down
		if (this.d && t.map.getWall(this.x, this.y + 1) == -1) {
			let newNode = new TraceNode(this.x, this.y + 1, this.distance + 1, this.maxDistance);
			newNode.setDirections(this.l, this.r, false, this.d);
			t.activeNodes.push(newNode);
		}
	}
}

class ViewTrace {
	commitedNodes: TraceNode[] = [];
	activeNodes: TraceNode[] = []; 

	map: Tilemap;
	distance: number;

	constructor(map: Tilemap, distance: number) {
		this.map = map;
		this.distance = distance;
	}

	go(startX: number, startY: number): TraceNode[] {
		this.activeNodes.push(new TraceNode(startX, startY, 0, this.distance));
		this.propagateNodes();
		return this.commitedNodes;
	}

	private propagateNodes() {
		while(this.activeNodes.length > 0) {
			let node = this.activeNodes[0];
			this.activeNodes.splice(0, 1);
			node.propagate(this);
			this.commitedNodes.push(node);
		}
	}
}
