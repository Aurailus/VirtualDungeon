class Chat extends Phaser.GameObjects.Container {
	textInput: TextInput;
	messageContainer: Phaser.GameObjects.Container;
	messages: ChatBox[] = [];

	constructor(scene: MainScene, x: number, y: number) {
		super(scene, x, y);

		this.textInput = new TextInput(scene, 0, 0);
		this.list.push(this.textInput);

		this.messageContainer = new Phaser.GameObjects.Container(scene, 0, 0);
		this.list.push(this.messageContainer);
	}

	update() {
		this.textInput.y = -this.textInput.getHeight();
		this.messageContainer.y = this.textInput.y - 3;
	}

	pushMessage(message: string): void {
		this.messages.unshift(new ChatBox(this.scene, 0, 0, message));
		this.messageContainer.list.push(this.messages[0]);
		this.scene.tweens.add({
			targets: this.messages[0],
			alpha: {from: 0, to: 1},
			ease: 'Cubic',
			duration: 300,
			repeat: 0
		});
		this.reflowMessages();
	}

	reflowMessages(): void {
		let y = 0;
		for (let message of this.messages) {
			y -= message.getHeight() + 9;

			if (y + message.getHeight() < -400) {
				this.scene.tweens.add({
					targets: message,
					alpha: 0,
					ease: 'Cubic',
					duration: 300,
					repeat: 0
				});
			}

			this.scene.tweens.add({
				targets: message,
				y: y,
				ease: 'Cubic',
				duration: 300,
				repeat: 0
			});
		}
	}
}
