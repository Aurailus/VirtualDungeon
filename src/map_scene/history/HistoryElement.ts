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
			let data = this.data as { old: string[], new: string[] };

			console.log(data.old.length);

			for (let i = 0; i < data.old.length; i++) {
				let uuid = JSON.parse(this.data.old[i]).uuid;
					
				let found = false;
				for (let token of this.scene.tokens) {
					if (token.uuid == uuid) {
						token.loadSerializedData(this.data.old[i]);
						found = true;
						break;
					}
				}

				if (found) continue;

				let token = new Token(this.scene, 0, 0, "");
				token.loadSerializedData(this.data.old[i]);
				this.scene.add.existing(token);
				this.scene.tokens.push(token);
			}
		}
		else if (this.type == "token_create") {
			let uuid = JSON.parse(this.data.data).uuid;
			for (let i = 0; i < this.scene.tokens.length; i++) {
				if (this.scene.tokens[i].uuid == uuid) {
					this.scene.token.removeToken(this.scene.tokens[i]);
					break;
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
			let data = this.data as { old: string[], new: string[] };

			console.log(data.new.length);

			for (let i = 0; i < data.new.length; i++) {
				let uuid = JSON.parse(this.data.new[i]).uuid;
					
				let found = false;
				for (let token of this.scene.tokens) {
					if (token.uuid == uuid) {
						token.loadSerializedData(this.data.new[i]);
						found = true;
						break;
					}
				}

				if (found) continue;

				let token = new Token(this.scene, 0, 0, "");
				token.loadSerializedData(this.data.new[i]);
				this.scene.add.existing(token);
				this.scene.tokens.push(token);
			}
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
