/// <reference path="./@types/phaser.d.ts"/>

// Prevent scrolling hotkeys as the app implements its own scrolling.
document.addEventListener('keydown', (e: KeyboardEvent) => {
	if (e.ctrlKey 
		&&(e.which == 61  // +/= key
		|| e.which == 107 // Numpad +
		|| e.which == 173 // -/_ key
		|| e.which == 109 // Numpad -
		|| e.which == 187 // Numpad =
		|| e.which == 189 // Numpad -
	)) e.preventDefault();
});

window.addEventListener('wheel', (e) => {
	if (e.ctrlKey) e.preventDefault();
}, { passive: false });

let game;
window.onload = () => {
	game = new DNDMapper({
		title: "DNDMapper",
		width: 1,
		height: 1,
		fps: { target: 60 },
		parent: "root",
		backgroundColor: "#000000",
		antialias: false,
		scene: [InitScene, LoadScene, MapScene],
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
		let frame = document.getElementById("root")!;
		config.width = frame.offsetWidth;
		config.height = frame.offsetHeight;
		super(config);
		frame.oncontextmenu = function (e) { e.preventDefault(); }
	}
}
