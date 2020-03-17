class HistoryManager {
	scene: MapScene;

	history: HistoryElement[] = [];
	historyHead: number = -1;

	timeHoldingHistoryKey: number = 0;

	constructor(scene: MapScene) {
		this.scene = scene;
	}

	update() {
		if (this.scene.i.keyPressed('Z')) {
			this.timeHoldingHistoryKey = 0;
			if (!this.scene.i.keyDown('SHIFT')) this.undo();
			else this.redo();
		}
		if (this.scene.i.keyPressed('Y')) {
			this.timeHoldingHistoryKey = 0;
			this.redo();
		}

		if (this.scene.i.keyDown('Z') || this.scene.i.keyDown('Y')) {
			if (this.timeHoldingHistoryKey > 12 && this.timeHoldingHistoryKey % 3 == 0) {
				if (this.scene.i.keyDown('Y') || (this.scene.i.keyDown('Z') && this.scene.i.keyDown('SHIFT'))) this.redo();
				else this.undo();
			}
			this.timeHoldingHistoryKey++;
		}
		else this.timeHoldingHistoryKey = 0;
	}

	push(type: string, data: any): void {
		this.history.splice(this.historyHead + 1, this.history.length - this.historyHead, new HistoryElement(this.scene, type, data));
		this.historyHead = this.history.length - 1;
	}

	undo() {
		if (this.historyHead >= 0) {
			this.history[this.historyHead].undo();
			this.historyHead--;
		}
	}

	redo() {
		if (this.historyHead < this.history.length - 1) {
			this.historyHead++;
			this.history[this.historyHead].redo();
		}
	}
}
