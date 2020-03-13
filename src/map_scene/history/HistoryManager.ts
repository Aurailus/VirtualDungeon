class HistoryManager {
	scene: MapScene;

	history: HistoryElement[] = [];
	historyHead: number = -1;

	constructor(scene: MapScene) {
		this.scene = scene;
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
