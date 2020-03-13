class HistoryElement {
	scene: MapScene;
	type: string;
	data: any;

	constructor(scene: MapScene, type: string, data: any) {
		this.scene = scene;
		this.type = type;
		this.data = data;
	}	

	undo() {
		console.log("Undo", this.type);
		if (this.type == "tile") {
			for (let tile of this.data as {pos: Vec2, lastWall: number, wall: number}[])
				this.scene.map.setWall(tile.pos.x, tile.pos.y, tile.lastWall);
		}
		else if (this.type == "token_modify") {
			let data = this.data as { old: string, new: string };
			let uuid = JSON.parse(this.data.old).uuid;
			
			for (let token of this.scene.tokens) {
				if (token.uuid == uuid) {
					token.loadSerializedData(this.data.old);
					return;
				}
			}
			let token = new Token(this.scene, 0, 0, "");
			token.loadSerializedData(this.data.old);
			this.scene.add.existing(token);
			this.scene.tokens.push(token);
		}
		else if (this.type == "token_create") {
			let uuid = JSON.parse(this.data.data).uuid;
			for (let i = 0; i < this.scene.tokens.length; i++) {
				if (this.scene.tokens[i].uuid == uuid) {
					if (this.scene.token.selectedToken == this.scene.tokens[i]) this.scene.token.selectedToken = null;
					if (this.scene.token.hoveredToken == this.scene.tokens[i]) this.scene.token.hoveredToken = null;
					this.scene.tokens[i].destroy();
					this.scene.tokens.splice(i, 1);
				}
			}
		}
	}

	redo() {
		console.log("Redo", this.type);
		if (this.type == "tile") {
			for (let tile of this.data as {pos: Vec2, lastWall: number, wall: number}[])
				this.scene.map.setWall(tile.pos.x, tile.pos.y, tile.wall);
		}
		else if (this.type == "token_modify") {
			let data = this.data as { old: string, new: string };
			let uuid = JSON.parse(this.data.old).uuid;

			for (let token of this.scene.tokens) {
				if (token.uuid == uuid) {
					token.loadSerializedData(this.data.new);
					return;
				}
			}
			let token = new Token(this.scene, 0, 0, "");
			token.loadSerializedData(this.data.new);
			this.scene.add.existing(token);
			this.scene.tokens.push(token);
		}
		else if (this.type == "token_create") {
			let data = JSON.parse(this.data.data);
			let token = new Token(this.scene, 0, 0, "");
			token.loadSerializedData(this.data.data);
			this.scene.add.existing(token);
			this.scene.tokens.push(token);
		}
	}
}
