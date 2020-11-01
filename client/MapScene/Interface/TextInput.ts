class TextInput extends ChatBox {
	text: string = "";

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, " ", "ui_text_input");

		// document.addEventListener("keydown", (e) => {
		// 	let code = e.keyCode;

		// 	if (code == 8) {
		// 		this.text = this.text.substr(0, this.text.length - 1);
		// 		this.setText(this.text);
		// 		return;
		// 	}
		// 	else if (code == 13) {
		// 		//Send
		// 		return;
		// 	}
		// 	else if (e.key.length != 1) return;

		// 	this.text += e.key;
		// 	this.setText(this.text.length == 0 ? " " : this.text);
		// })
	}
}
