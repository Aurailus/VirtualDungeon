class LoadScene extends Phaser.Scene {
	constructor() {
		super({key: "LoadScene"});
	}

	preload(): void {
		this.cameras.main.setBackgroundColor("#300");
		
		//TODO: Find out why loaded assets aren't propogating
	}

	create(): void {
		this.game.scene.start('MainScene');
		this.game.scene.stop('LoadScene');
		this.game.scene.swapPosition('MainScene', 'LoadScene');
	}

	update(time: number, delta: number): void {

	}
}
 
