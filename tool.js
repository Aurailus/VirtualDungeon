var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var LoadScene = /** @class */ (function (_super) {
    __extends(LoadScene, _super);
    function LoadScene() {
        return _super.call(this, { key: "LoadScene" }) || this;
    }
    LoadScene.prototype.preload = function () {
        this.cameras.main.setBackgroundColor("#300");
        //TODO: Find out why loaded assets aren't propogating
    };
    LoadScene.prototype.create = function () {
        this.game.scene.start('MainScene');
        this.game.scene.stop('LoadScene');
        this.game.scene.swapPosition('MainScene', 'LoadScene');
    };
    LoadScene.prototype.update = function (time, delta) {
    };
    return LoadScene;
}(Phaser.Scene));
/// <reference path="../@types/phaser.d.ts"/>
var game;
window.onload = function () {
    game = new DNDMapper({
        title: "DNDMapper",
        width: 1,
        height: 1,
        fps: { target: 60 },
        parent: "game",
        backgroundColor: "#000000",
        antialias: false,
        scene: [MainScene, LoadScene],
        physics: {
            default: "arcade",
            arcade: {
                debug: false
            }
        }
    });
};
var DNDMapper = /** @class */ (function (_super) {
    __extends(DNDMapper, _super);
    function DNDMapper(config) {
        var _this = this;
        var frame = document.getElementById("game");
        config.width = frame.offsetWidth;
        config.height = frame.offsetHeight;
        _this = _super.call(this, config) || this;
        frame.oncontextmenu = function (e) { e.preventDefault(); };
        return _this;
    }
    return DNDMapper;
}(Phaser.Game));
var MainScene = /** @class */ (function (_super) {
    __extends(MainScene, _super);
    function MainScene() {
        return _super.call(this, { key: "MainScene" }) || this;
    }
    MainScene.prototype.preload = function () {
        this.cameras.main.setBackgroundColor("#003");
        this.load.image("cursor", "res/cursor.png");
        this.load.image("tileset", "res/tileset_3.png");
    };
    MainScene.prototype.create = function () {
        var _this = this;
        // Create cursor hover sprite
        this.cursor = this.add.sprite(0, 0, "cursor");
        this.cursor.setScale(2, 2);
        this.cursor.setDepth(1000);
        this.cursor.setOrigin(0, 0);
        this.map = new TileMap("gameMap", this, 300, 300);
        this.map.fillMap(10);
        // Bind the scroll wheel event
        this.onWheel = this.onWheel.bind(this);
        document.documentElement.addEventListener("wheel", this.onWheel);
        this.events.on('destroy', function () { return document.documentElement.removeEventListener("wheel", _this.onWheel); });
        // Create UI
        // let cam = this.cameras.add(0, 0, 512, 512, false, "ui");
        // cam.setScroll(-10000, -10000);
        // let spr = this.add.sprite(-10000 + 64, -10000 + 64, "cursor");
    };
    MainScene.prototype.onWheel = function (e) {
        var dir = e.deltaY < 0;
        this.cameras.main.setZoom(this.cameras.main.zoom * (dir ? 1.1 : 0.9));
    };
    MainScene.prototype.handleArchitectMode = function (cursorScreenPos, cursorWorldPos) {
        var selectedTilePos = new Vec2(Math.floor(cursorWorldPos.x / 64), Math.floor(cursorWorldPos.y / 64));
        this.cursor.setPosition(selectedTilePos.x * 64, selectedTilePos.y * 64);
        if (this.input.mousePointer.leftButtonDown() || this.input.mousePointer.rightButtonDown()) {
            var change = new Vec2(cursorWorldPos.x - this.lastCursorWorldPos.x, cursorWorldPos.y - this.lastCursorWorldPos.y);
            var normalizeFactor = Math.sqrt(change.x * change.x + change.y * change.y);
            change.x /= normalizeFactor;
            change.y /= normalizeFactor;
            var place = new Vec2(this.lastCursorWorldPos.x, this.lastCursorWorldPos.y);
            while (Math.abs(cursorWorldPos.x - place.x) >= 1 || Math.abs(cursorWorldPos.y - place.y) >= 1) {
                this.map.setSolid(Math.floor(place.x / 64), Math.floor(place.y / 64), this.input.mousePointer.rightButtonDown());
                place.x += change.x;
                place.y += change.y;
            }
            this.map.setSolid(selectedTilePos.x, selectedTilePos.y, this.input.mousePointer.rightButtonDown());
        }
    };
    MainScene.prototype.handlePanning = function (cursorScreenPos, cursorWorldPos) {
        if (this.input.mousePointer.middleButtonDown()) {
            this.cameras.main.scrollX += (this.lastCursorScreenPos.x - cursorScreenPos.x) / this.cameras.main.zoom;
            this.cameras.main.scrollY += (this.lastCursorScreenPos.y - cursorScreenPos.y) / this.cameras.main.zoom;
        }
    };
    MainScene.prototype.update = function (time, delta) {
        console.log(this.cameras.main.displayWidth - this.cameras.main.width);
        var cursorScreenPos = new Vec2(this.input.mousePointer.x, this.input.mousePointer.y);
        var cursorWorldPos = new Vec2(cursorScreenPos.x / this.cameras.main.zoom + this.cameras.main.scrollX - ((this.cameras.main.displayWidth - this.cameras.main.width) / 2), cursorScreenPos.y / this.cameras.main.zoom + this.cameras.main.scrollY - ((this.cameras.main.displayHeight - this.cameras.main.height) / 2));
        this.handleArchitectMode(cursorScreenPos, cursorWorldPos);
        this.handlePanning(cursorScreenPos, cursorWorldPos);
        this.lastCursorScreenPos = cursorScreenPos;
        this.lastCursorWorldPos = cursorWorldPos;
    };
    return MainScene;
}(Phaser.Scene));
var TileMap = /** @class */ (function () {
    function TileMap(key, scene, xwid, ywid) {
        this.SOLID = 10;
        this.key = key;
        this.scene = scene;
        this.dimensions = { x: xwid, y: ywid };
        this.map = this.scene.add.tilemap(null, 16, 16, 50 * 16, 50 * 16);
        var tileset = this.map.addTilesetImage("tileset", "tileset", 16, 16, 0, 0);
        this.layer = this.map.createBlankDynamicLayer("layer", "tileset", 0, 0, 50 * 16, 50 * 16, 16, 16);
        this.layer.setScale(4, 4);
    }
    TileMap.prototype.fillMap = function (tid) {
        if (!tid)
            tid = this.SOLID;
        for (var x = 0; x < this.dimensions.x; x++) {
            for (var y = 0; y < this.dimensions.y; y++) {
                this.setTile(x, y, tid);
            }
        }
    };
    TileMap.prototype.setSolid = function (x, y, solid) {
        var alreadySolid = this.getSolid(x, y);
        if (alreadySolid == solid)
            return;
        if (solid)
            this.setTile(x, y, this.SOLID);
        else
            this.setTile(x, y, 13);
        this.calculateEdgesAround(x, y);
    };
    TileMap.prototype.getSolid = function (x, y) {
        return this.getTile(x, y) == this.SOLID;
    };
    TileMap.prototype.setTile = function (x, y, tid) {
        this.layer.removeTileAt(x, y, true);
        this.layer.putTileAt(tid, x, y);
    };
    TileMap.prototype.getTile = function (x, y) {
        if (x < 0 || y < 0 || x > this.dimensions.x - 1 || y > this.dimensions.y - 1)
            return this.SOLID;
        return this.layer.getTileAt(x, y, true).index;
    };
    TileMap.prototype.calculateEdgesAround = function (x, y) {
        for (var i = clamp(x - 1, this.dimensions.x - 1, 0); i <= clamp(x + 1, this.dimensions.x + 1, 0); i++) {
            for (var j = clamp(y - 1, this.dimensions.y - 1, 0); j <= clamp(y + 1, this.dimensions.y + 1, 0); j++) {
                this.calculateEdges(i, j);
            }
        }
    };
    TileMap.prototype.getSurroundingTiles = function (x, y) {
        var tiles = [];
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                tiles.push(this.getTile(x + j, y + i));
            }
        }
        return tiles;
    };
    TileMap.prototype.getSurroundingSolid = function (x, y) {
        var tiles = this.getSurroundingTiles(x, y);
        for (var i = 0; i < 9; i++) {
            tiles[i] = (tiles[i] == this.SOLID);
        }
        return tiles;
    };
    TileMap.prototype.calculateEdges = function (x, y) {
        if (this.getTile(x, y) == this.SOLID)
            return;
        var adjacents = this.getSurroundingSolid(x, y);
        var tile = 13;
        if (adjacents[7] /*Bottom*/) {
            if (adjacents[1] /*Top*/) {
                if (adjacents[5] /*Right*/) {
                    if (adjacents[3] /*Left*/)
                        tile = 49;
                    else
                        tile = 59;
                }
                else if (adjacents[3] /*Left*/)
                    tile = 57;
                else
                    tile = 58;
            }
            else if (adjacents[3] /*Left*/) {
                if (adjacents[5] /*Right*/)
                    tile = 48;
                else if (adjacents[2] /*Top right*/)
                    tile = 45;
                else
                    tile = 21;
            }
            else if (adjacents[5] /*Right*/) {
                if (adjacents[0] /*Top left*/)
                    tile = 47;
                else
                    tile = 23;
            }
            else if (adjacents[0] /*Top left*/) {
                if (adjacents[2] /*Top Right*/)
                    tile = 46;
                else
                    tile = 41;
            }
            else if (adjacents[2] /*Top Right*/)
                tile = 40;
            else
                tile = 1;
        }
        else if (adjacents[1] /*Top*/) {
            if (adjacents[3] /*Left*/) {
                if (adjacents[5] /*Right*/)
                    tile = 30;
                else if (adjacents[8] /*Bottom right*/)
                    tile = 27;
                else
                    tile = 3;
            }
            else if (adjacents[5] /*Right*/) {
                if (adjacents[6] /*Bottom left*/)
                    tile = 29;
                else
                    tile = 5;
            }
            else if (adjacents[6] /*Bottom left*/) {
                if (adjacents[8] /*Bottom right*/)
                    tile = 28;
                else
                    tile = 32;
            }
            else if (adjacents[8] /*Bottom right*/)
                tile = 31;
            else
                tile = 19;
        }
        else if (adjacents[3] /*Left*/) {
            if (adjacents[5] /*Right*/)
                tile = 39;
            else if (adjacents[2] /*Top right*/) {
                if (adjacents[8] /*Bottom right*/)
                    tile = 36;
                else
                    tile = 51;
            }
            else if (adjacents[8] /*Bottom right*/)
                tile = 42;
            else
                tile = 11;
        }
        else if (adjacents[5] /*Right*/) {
            if (adjacents[0] /*Top left*/) {
                if (adjacents[6] /*Bottom left*/)
                    tile = 38;
                else
                    tile = 52;
            }
            else if (adjacents[6] /*Bottom left*/)
                tile = 43;
            else
                tile = 9;
        }
        else if (adjacents[0] /*Top Left*/) {
            if (adjacents[2] /*Top right*/) {
                if (adjacents[6] /*Bottom left*/) {
                    if (adjacents[8] /*Bottom right*/)
                        tile = 37;
                    else
                        tile = 6;
                }
                else if (adjacents[8] /*Bottom right*/)
                    tile = 7;
                else
                    tile = 4;
            }
            else if (adjacents[6] /*Bottom left*/) {
                if (adjacents[8] /*Bottom right*/)
                    tile = 15;
                else
                    tile = 12;
            }
            else if (adjacents[8] /*Bottom right*/)
                tile = 33;
            else
                tile = 20;
        }
        else if (adjacents[2] /*Top right*/) {
            if (adjacents[6] /*Bottom left*/) {
                if (adjacents[8] /*Bottom right*/)
                    tile = 16;
                else
                    tile = 34;
            }
            else if (adjacents[8] /*Bottom right*/)
                tile = 14;
            else
                tile = 18;
        }
        else if (adjacents[6] /*Bottom left*/) {
            if (adjacents[8] /*Bottom Right*/)
                tile = 22;
            else
                tile = 2;
        }
        else if (adjacents[8] /*Bottom right*/)
            tile = 0;
        this.setTile(x, y, tile);
    };
    return TileMap;
}());
function clamp(x, min, max) {
    if (min > max) {
        var t = max;
        max = min;
        min = t;
    }
    return Math.max(Math.min(x, max), min);
}
var Vec2 = /** @class */ (function () {
    function Vec2(x, y) {
        this.x = 0;
        this.y = 0;
        if (x == null)
            return;
        if (typeof (x) == "number") {
            this.x = x;
            if (y != null)
                this.y = y;
            else
                this.y = x;
        }
        else {
            this.x = x.x;
            this.y = x.y;
        }
    }
    return Vec2;
}());
var Vec3 = /** @class */ (function () {
    function Vec3(x, y, z) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        if (x == null)
            return;
        if (typeof (x) == "number") {
            this.x = x;
            if (y != null) {
                this.y = y;
                this.z = z;
            }
            else {
                this.y = x;
                this.z = x;
            }
        }
        else {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
        }
    }
    return Vec3;
}());
