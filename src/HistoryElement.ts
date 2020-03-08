class HistoryElement {
	scene: MainScene;
	type: string;
	data: any;

	constructor(scene: MainScene, type: string, data: any) {
		this.scene = scene;
		this.type = type;
		this.data = data;
	}	

	undo() {
		if (this.type == "tile") {
			for (let tile of this.data as {pos: Vec2, solid: boolean}[]) {
				this.scene.map.setSolid(tile.pos.x, tile.pos.y, !tile.solid);
			}
		}
		else if (this.type == "token_move") {
			let data = this.data as { start: Vec2, end: Vec2, token: Token }
			data.token.setPosition(data.start.x, data.start.y);
		}
	}

	redo() {
		if (this.type == "tile") {
			for (let tile of this.data as {pos: Vec2, solid: boolean}[]) {
				this.scene.map.setSolid(tile.pos.x, tile.pos.y, tile.solid);
			}
		}
		else if (this.type == "token_move") {
			let data = this.data as { start: Vec2, end: Vec2, token: Token }
			data.token.setPosition(data.end.x, data.end.y);
		}
	}
}
