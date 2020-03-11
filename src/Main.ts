/// <reference path="../@types/phaser.d.ts"/>

let game;
window.onload = () => {
	game = new DNDMapper({
		title: "DNDMapper",
		width: 1,
		height: 1,
		fps: { target: 60 },
		parent: "game",
		backgroundColor: "#000000",
		antialias: false,
		scene: [GetAssetsScene, LoadScene, MainScene],
		physics: {
			default: "arcade",
			arcade: {
				debug: false
			}
		}
	});
}

class DNDMapper extends Phaser.Game {
	constructor(config: GameConfig) {
		let frame = document.getElementById("game");
		config.width = frame.offsetWidth;
		config.height = frame.offsetHeight;
		super(config);
		frame.oncontextmenu = function (e) { e.preventDefault(); }
	}
}
