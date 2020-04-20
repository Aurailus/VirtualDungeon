class ChatBox extends Phaser.GameObjects.Container {
	str: string;
	texture: string = "ui_text_box";

	private FONT_SIZE = 4.3;
	private chatboxHeight: number = 0;

	constructor(scene: Phaser.Scene, x: number, y: number, str: string, tex?: string) {
		super(scene, x, y);
		this.str = str;
		if (tex != undefined) this.texture = tex;

		this.setText(str);
	}

	setText(text: string): void {
		this.list.forEach((e) => e.destroy());
		this.list = [];
		this.str = text;

		let testObj = new Phaser.GameObjects.BitmapText(this.scene, 15, 4, "font2x", "AB", this.FONT_SIZE, 0);

		const letterWidth = testObj.getTextBounds().global.width / 2;
    const maxLetters = 95 / letterWidth;

		const split = this.str.split(/( )/g);
    let lines = [];

    function nextLine() {
      let newLine = "";
      while (`${newLine} ${split[0]}`.length < maxLetters && split.length) newLine += split.shift();
      lines.push(newLine.trim());
      if (split.length) nextLine();
    }

    nextLine();

    let top = new Phaser.GameObjects.Sprite(this.scene, 0, 0, this.texture, 0);
		top.setScale(3, 3);
		top.setOrigin(0, 0);
		top.setAlpha(0.6);
		this.list.push(top);

		let i = 0;
    for (let line of lines) {
			let elem = new Phaser.GameObjects.BitmapText(this.scene, 12, 7 + i * 18, "font2x", line, this.FONT_SIZE, 0);
			elem.setScale(3, 3);
			elem.setOrigin(0, 0);
			this.list.push(elem);
			i++;
    }

    let lastElem = (this.list[this.list.length - 1] as Phaser.GameObjects.BitmapText);
    let height = Math.max(lastElem.y + lastElem.getTextBounds().global.height - 36, 2);
    
    let middle = new Phaser.GameObjects.Sprite(this.scene, 0, 18, "ui_text_box", 1);
		middle.setScale(3, height / 6);
		middle.setOrigin(0, 0);
		middle.setAlpha(0.6);
		this.list.push(middle);
		this.sendToBack(middle);

    let bottom = new Phaser.GameObjects.Sprite(this.scene, 0, height + 18, this.texture, 2);
		bottom.setScale(3, 3);
		bottom.setOrigin(0, 0);
		bottom.setAlpha(0.6);
		this.list.push(bottom);
		this.sendToBack(bottom);

		this.chatboxHeight = height + 18 * 2;
	}

	getHeight() {
		return this.chatboxHeight;
	}
}
