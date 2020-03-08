// class IntroScene extends Phaser.Scene {
// 	stars: Star[] = [];
// 	pickups: Pickup[] = [];
// 	spark: Spark;
// 	text: Phaser.GameObjects.Text;

// 	speed: number;
// 	angleChange: number;
// 	controllingSpark: boolean;
// 	animationRange: number;
// 	starAngle: number;
// 	collided: boolean;

// 	canDie: boolean;

// 	constructor() {
// 		super({key: "IntroScene"});
// 	}

// 	preload(): void {
// 		this.load.spritesheet("star", "res/star.png", {frameWidth: 8, frameHeight: 8, startFrame: 0, endFrame: 16});
// 		this.load.spritesheet("spark", "res/spark.png", {frameWidth: 16, frameHeight: 16, startFrame: 0, endFrame: 64});
// 		this.load.spritesheet("pickup", "res/pickup.png", {frameWidth: 16, frameHeight: 16});
// 	}

// 	create(): void {
// 		this.stars = [];
// 		this.pickups = [];
// 		this.speed = 0.25;
// 		this.angleChange = 0.001;
// 		this.controllingSpark = false;
// 		this.animationRange = -1;
// 		this.starAngle = -(Math.PI / 1.5);
// 		this.collided = false;
// 		this.canDie = false;

// 		//@ts-ignore
// 		$("#game").removeClass('active');

// 		for (let i = 0; i < 200; i++) {
// 			let x = Math.round(Math.random() * (this.cameras.main.width / 4));
// 			let y = Math.round(Math.random() * (this.cameras.main.height / 4));
// 			this.stars.push(new Star(this, x, y));
// 		}

// 		for (let i = 0; i < 8; i++) {
// 			let x = Math.round(Math.random() * (this.cameras.main.width / 4));
// 			let y = Math.round(Math.random() * (this.cameras.main.height / 4));
// 			this.pickups.push(new Pickup(this, x, y));
// 		}

// 		this.spark = new Spark(this, this.cameras.main.width / 2, this.cameras.main.height / 2);

// 		// this.text = this.add.text(4, 4, this.collisions.toString());
// 	}

// 	update(time: number, delta: number): void {
// 		if (this.input.mousePointer.primaryDown && !this.controllingSpark) {
// 			if (this.input.mousePointer.x > this.cameras.main.width / 2 - 16 
// 			 && this.input.mousePointer.x < this.cameras.main.width / 2 + 16 
// 			 && this.input.mousePointer.y > this.cameras.main.height / 2 - 16 
// 			 && this.input.mousePointer.y < this.cameras.main.height / 2 + 16) {

// 				this.controllingSpark = true;
// 				this.canDie = true;
// 				//@ts-ignore
// 				$("#game").addClass('active');
// 				this.animationRange = 0;
// 			}
// 		}
// 		if (this.controllingSpark) {
// 			this.spark.setPosition(Math.round(this.input.mousePointer.x / 4) * 4, Math.round(this.input.mousePointer.y / 4) * 4);
// 		}
// 		if (this.animationRange != -1) {
// 			if (!this.collided) {
// 				this.fadeIn(this.animationRange*this.cameras.main.width);
// 				this.animationRange += 0.02;
// 				if (this.animationRange >= 1) this.animationRange = -1;
// 			}
// 			else {
// 				this.fadeOut(this.animationRange*this.cameras.main.width);
// 				this.animationRange -= 0.05;
// 				if (this.animationRange <= 0) this.scene.restart();
// 			}
// 		}

// 		if (this.speed < 5) {
// 			if (this.controllingSpark) {
// 				this.starAngle += this.angleChange;
// 				this.speed *= 1.001;
// 				this.angleChange *= 1.000005;
// 			}
// 		}
// 		else {
// 			this.controllingSpark = false;
// 			this.canDie = false;
// 			this.starAngle = Math.PI * 1.5;
// 			this.speed *= 1.02;

// 			if (this.speed < 10) this.spark.moveToCenter();
// 			if (this.speed > 10) this.spark.y += this.speed;
// 			if (this.speed > 15) this.spark.explode();

// 	    let hexColor = Phaser.Display.Color.Interpolate.ColorWithColor(new Phaser.Display.Color(15, 11, 31), new Phaser.Display.Color(255, 255, 255), 30, Math.min(Math.max(this.speed - 10, 0), 30));
// 			this.cameras.main.setBackgroundColor(hexColor);

// 			if (this.speed >= 60) {
// 				this.game.scene.start('MainScene');
// 				this.game.scene.stop('IntroScene');
// 				this.game.scene.swapPosition('MainScene', 'IntroScene');
// 				return;
// 			}
// 		}

// 		let yOff = Math.sin(this.starAngle);
// 		let xOff = Math.cos(this.starAngle);

// 		for (let star of this.stars) {
// 			star.push(xOff * this.speed, yOff * this.speed);
// 			star.stayOnScreen();
// 		}
// 		for (let pickup of this.pickups) {
// 			pickup.push(xOff * this.speed, yOff * this.speed);
// 			if (this.canDie) {
// 				let distance = Math.sqrt(Math.pow(Math.abs(pickup.x - this.spark.x), 2)
// 					+ Math.pow(Math.abs(pickup.y - this.spark.y), 2));
// 				if (distance < 32 && !this.collided) {
// 					this.collided = true;
// 					this.animationRange = 0.7;
// 					this.controllingSpark = false;
// 					this.spark.explode();
// 				}
// 			}
// 		}
// 	}

// 	fadeIn(range: number) {
// 		for (let star of this.stars) {
// 			let distance = Math.sqrt(Math.pow(Math.abs(star.x - this.cameras.main.width/2), 2)
// 				+ Math.pow(Math.abs(star.y - this.cameras.main.height/2), 2));
// 			if (range > distance && range < distance + 200) star.fadeIn();
// 			if (range > distance + 200) star.fadeReg();
// 		}

// 		for (let pickup of this.pickups) {
// 			let distance = Math.sqrt(Math.pow(Math.abs(pickup.x - this.cameras.main.width/2), 2)
// 				+ Math.pow(Math.abs(pickup.y - this.cameras.main.height/2), 2));
// 			if (range + 200 > distance) pickup.makeExists();
// 		}

//     let hexColor = Phaser.Display.Color.Interpolate.ColorWithColor(new Phaser.Display.Color(0, 0, 0), new Phaser.Display.Color(15, 11, 31), 1, this.animationRange);
// 		this.cameras.main.setBackgroundColor(hexColor);
// 	}

// 	fadeOut(range: number) {
// 		for (let star of this.stars) {
// 			let distance = Math.sqrt(Math.pow(Math.abs(star.x - this.cameras.main.width/2), 2)
// 				+ Math.pow(Math.abs(star.y - this.cameras.main.height/2), 2));
// 			if (range > distance && range < distance + 200) star.fadeIn();
// 			if (range < distance) star.fadeOut();
// 		}

// 		for (let i = 0; i < this.pickups.length; i++) {
// 			let pickup = this.pickups[i];
// 			let distance = Math.sqrt(Math.pow(Math.abs(pickup.x - this.cameras.main.width/2), 2)
// 				+ Math.pow(Math.abs(pickup.y - this.cameras.main.height/2), 2));
// 			if (range - 200 < distance) {
// 				pickup.setAlpha(0);
// 			}
// 		}

//     let hexColor = Phaser.Display.Color.Interpolate.ColorWithColor(new Phaser.Display.Color(0, 0, 0), new Phaser.Display.Color(15, 11, 31), 0.8, this.animationRange);
// 		this.cameras.main.setBackgroundColor(hexColor);
// 	}
// }
