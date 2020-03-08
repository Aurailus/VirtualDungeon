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
var HistoryElement = /** @class */ (function () {
    function HistoryElement(scene, type, data) {
        this.scene = scene;
        this.type = type;
        this.data = data;
    }
    HistoryElement.prototype.undo = function () {
        if (this.type == "tile") {
            for (var _i = 0, _a = this.data; _i < _a.length; _i++) {
                var tile = _a[_i];
                this.scene.map.setSolid(tile.pos.x, tile.pos.y, !tile.solid);
            }
        }
        else if (this.type == "token_move") {
            var data = this.data;
            data.token.setPosition(data.start.x, data.start.y);
        }
    };
    HistoryElement.prototype.redo = function () {
        if (this.type == "tile") {
            for (var _i = 0, _a = this.data; _i < _a.length; _i++) {
                var tile = _a[_i];
                this.scene.map.setSolid(tile.pos.x, tile.pos.y, tile.solid);
            }
        }
        else if (this.type == "token_move") {
            var data = this.data;
            data.token.setPosition(data.end.x, data.end.y);
        }
    };
    return HistoryElement;
}());
var HistoryManager = /** @class */ (function () {
    function HistoryManager(scene) {
        this.history = [];
        this.historyHead = -1;
        this.scene = scene;
    }
    HistoryManager.prototype.push = function (type, data) {
        this.history.splice(this.historyHead + 1, this.history.length - this.historyHead, new HistoryElement(this.scene, type, data));
        this.historyHead = this.history.length - 1;
    };
    HistoryManager.prototype.undo = function () {
        if (this.historyHead >= 0) {
            this.history[this.historyHead].undo();
            this.historyHead--;
        }
    };
    HistoryManager.prototype.redo = function () {
        if (this.historyHead < this.history.length - 1) {
            this.historyHead++;
            this.history[this.historyHead].redo();
        }
    };
    return HistoryManager;
}());
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
        var _this = _super.call(this, { key: "MainScene" }) || this;
        _this.TILESET_COUNT = 3;
        _this.mode = 0;
        _this.tokens = [];
        _this.timeHoldingHistoryKey = 0;
        return _this;
    }
    MainScene.prototype.preload = function () {
        this.load.image("cursor", "res/cursor.png");
        for (var i = 1; i <= this.TILESET_COUNT; i++)
            this.load.image("tileset_" + i, "res/tileset_" + i + ".png");
        this.load.image("grid_tile", "res/grid.png");
        this.load.image("player", "res/player.png");
        this.load.spritesheet("ui_mode_switch", "res/button_edit_mode.png", { frameWidth: 39, frameHeight: 18 });
        this.load.spritesheet("ui_history_manipulation", "res/button_undo_redo.png", { frameWidth: 39, frameHeight: 18 });
    };
    MainScene.prototype.create = function () {
        var _this = this;
        this.snapKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.modifierKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
        this.switchModeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
        this.undoRedoKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.redoKeyWin = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);
        this.switchModeKey.addListener('down', function () { _this.mode = _this.mode == 0 ? 1 : 0; });
        this.undoRedoKey.addListener('down', function () {
            if (!_this.modifierKey.isDown)
                return;
            _this.timeHoldingHistoryKey = 0;
            _this.snapKey.isDown ? _this.history.redo() : _this.history.undo();
        });
        this.redoKeyWin.addListener('down', function () {
            _this.timeHoldingHistoryKey = 0;
            if (!_this.modifierKey.isDown)
                return;
            _this.history.redo();
        });
        this.game.renderer.addPipeline('outline', new OutlinePipeline(this.game));
        this.history = new HistoryManager(this);
        this.world = new WorldView(this);
        this.ui = new UIView(this);
        this.map = new TileMap("gameMap", this, 300, 300);
        this.map.fillMap(10);
        this.architect = new ArchitectMode(this);
        this.token = new TokenMode(this);
        var edit = new UIModeSwitchButton(this, 1, 1);
        this.ui.o.add(edit);
        var history = new UIHistoryManipulation(this, 16, 1);
        this.ui.o.add(history);
        this.tokens.push(new Token(this, 64, 64, "player"));
    };
    MainScene.prototype.update = function (time, delta) {
        this.world.update();
        this.ui.update();
        if ((this.redoKeyWin.isDown || this.undoRedoKey.isDown) && this.modifierKey.isDown) {
            if (this.timeHoldingHistoryKey > 12 && this.timeHoldingHistoryKey % 3 == 0) {
                if (this.redoKeyWin.isDown)
                    this.history.redo();
                else if (this.snapKey.isDown)
                    this.history.redo();
                else
                    this.history.undo();
            }
            this.timeHoldingHistoryKey++;
        }
        else {
            this.timeHoldingHistoryKey = 0;
        }
        if (this.mode == 0) {
            if (this.ui.uiActive)
                this.architect.cleanup();
            else {
                this.architect.update();
                this.token.cleanup();
            }
        }
        else {
            if (this.ui.uiActive)
                this.token.cleanup();
            else {
                this.token.update();
                this.architect.cleanup();
            }
        }
    };
    return MainScene;
}(Phaser.Scene));
var OutlinePipeline = /** @class */ (function (_super) {
    __extends(OutlinePipeline, _super);
    function OutlinePipeline(game) {
        var _this = this;
        var config = { game: game,
            renderer: game.renderer,
            fragShader: "\n\t\t\tprecision mediump float;\n\t\t\tuniform sampler2D uMainSampler;\n\t\t\tvarying vec2 outTexCoord;\n\t\t\tvoid main(void) {\n\t\t\t\tvec4 color = texture2D(uMainSampler, outTexCoord);\n\t\t\t\tvec4 colorU = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y - 0.055));\n\t\t\t\tvec4 colorD = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y + 0.055));\n\t\t\t\tvec4 colorL = texture2D(uMainSampler, vec2(outTexCoord.x + 0.055, outTexCoord.y));\n\t\t\t\tvec4 colorR = texture2D(uMainSampler, vec2(outTexCoord.x - 0.055, outTexCoord.y));\n\t\t\t\t\n\t\t\t\tgl_FragColor = color;\n\t\t\t\t\n\t\t\t\tif (color.a == 0.0 && (colorU.a != 0.0 || colorD.a != 0.0 || colorL.a != 0.0 || colorR.a != 0.0)  ) {\n\t\t\t\t\tgl_FragColor = vec4(1.0, 1.0, 1.0, .2);\n\t\t\t\t}\n\t\t\t}"
        };
        _this = _super.call(this, config) || this;
        return _this;
    }
    return OutlinePipeline;
}(Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline));
var TileMap = /** @class */ (function () {
    function TileMap(key, scene, xwid, ywid) {
        this.SOLID = 10;
        this.layers = [];
        this.key = key;
        this.scene = scene;
        this.dimensions = { x: xwid, y: ywid };
        this.solid_at = [];
        for (var i = 0; i < xwid; i++) {
            this.solid_at[i] = [];
            for (var j = 0; j < ywid; j++) {
                this.solid_at[i][j] = -1;
            }
        }
        this.map = this.scene.add.tilemap(null, 16, 16, 0, 0);
        for (var i = 1; i < this.scene.TILESET_COUNT; i++) {
            var tileset = this.map.addTilesetImage("tileset_" + i, "tileset " + i, 16, 16, 0, 0);
            this.map.setLayer("layer_" + i);
            this.layers[i - 1] = this.map.createBlankDynamicLayer("layer_" + i, "tileset_" + i, 0, 0, 50 * 16, 50 * 16, 16, 16);
            this.layers[i - 1].setScale(4, 4);
        }
        this.layers[0].setInteractive();
        this.map.addTilesetImage("grid_tile", "grid_tile", 16, 16, 0, 0);
        this.map.setLayer("grid");
        var gridlayer = this.map.createBlankDynamicLayer("grid", "grid_tile", 0, 0, 50 * 16, 50 * 16, 16, 16);
        gridlayer.setScale(4, 4);
        for (var i = 0; i < xwid; i++) {
            for (var j = 0; j < ywid; j++) {
                if ((j % 2 == 0 && i % 2 == 0) || (j % 2 != 0 && i % 2 != 0))
                    gridlayer.putTileAt(0, i, j);
            }
        }
    }
    TileMap.prototype.fillMap = function (pid) {
        if (!pid)
            pid = 1;
        for (var x = 0; x < this.dimensions.x; x++) {
            for (var y = 0; y < this.dimensions.y; y++) {
                this.setTile(x, y, pid, 13);
            }
        }
    };
    TileMap.prototype.setSolid = function (x, y, palette, solid) {
        var alreadySolid = this.getSolid(x, y);
        if (alreadySolid == solid)
            return false;
        if (solid)
            this.setTile(x, y, 0, this.SOLID);
        else
            this.setTile(x, y, 0, 13);
        this.calculateEdgesAround(x, y);
        return true;
    };
    TileMap.prototype.getSolid = function (x, y) {
        return this.getTile(x, y, 0) == this.SOLID;
    };
    TileMap.prototype.setTile = function (x, y, palette, tid) {
        this.layers[0].removeTileAt(x, y, true);
        this.layers[0].putTileAt(tid, x, y);
    };
    TileMap.prototype.getTile = function (x, y, palette) {
        if (x < 0 || y < 0 || x > this.dimensions.x - 1 || y > this.dimensions.y - 1)
            return this.SOLID;
        return this.layers[0].getTileAt(x, y, true).index;
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
                //TODO: Make this palette independant
                tiles.push(this.getTile(x + j, y + i, 0));
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
        if (this.getTile(x, y, 0) == this.SOLID)
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
        this.setTile(x, y, 0, tile);
    };
    return TileMap;
}());
var Token = /** @class */ (function (_super) {
    __extends(Token, _super);
    function Token(scene, x, y, tex) {
        var _this = _super.call(this, scene, x, y) || this;
        _this.shadow = new Phaser.GameObjects.Sprite(scene, -4, -4, tex);
        _this.shadow.setOrigin(0, 0);
        _this.shadow.setScale(4, 1);
        _this.shadow.setTint(0x000000);
        _this.shadow.setAlpha(0.1, 0.1, 0.3, 0.3);
        _this.list.push(_this.shadow);
        _this.width = _this.shadow.width * 4;
        _this.height = _this.shadow.height * 4;
        _this.shadow.y = _this.height - 24;
        _this.sprite = new Phaser.GameObjects.Sprite(scene, -4, -4, tex);
        _this.sprite.setOrigin(0, 0);
        _this.sprite.setScale(4, 4);
        _this.setPosition(x, y);
        _this.list.push(_this.sprite);
        _this.scene.add.existing(_this);
        return _this;
    }
    Token.prototype.toggleOutline = function (outline) {
        if (outline)
            this.sprite.setPipeline("outline");
        else
            this.sprite.resetPipeline();
    };
    Token.prototype.setPosition = function (x, y, z, w) {
        Phaser.GameObjects.Container.prototype.setPosition.call(this, x * 4, y * 4, z, w);
        return this;
    };
    Token.prototype.getPosition = function () {
        return new Vec2(this.x / 4, this.y / 4);
    };
    return Token;
}(Phaser.GameObjects.Container));
var UIView = /** @class */ (function () {
    function UIView(scene) {
        this.uiActive = false;
        this.scene = scene;
        this.camera = this.scene.cameras.add(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height, false, "ui_camera");
        this.camera.scrollX = -10000;
        this.o = this.scene.add.container(-10000, 0);
    }
    UIView.prototype.update = function () {
        this.uiActive = false;
        for (var _i = 0, _a = this.o.list; _i < _a.length; _i++) {
            var o = _a[_i];
            o.update();
            if (!this.uiActive && o.mouseIntersects())
                this.uiActive = true;
        }
    };
    return UIView;
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
var WorldView = /** @class */ (function () {
    function WorldView(scene) {
        this.cursorScreen = new Vec2();
        this.lastCursorScreen = new Vec2();
        this.cursorWorld = new Vec2();
        this.lastCursorWorld = new Vec2();
        this.zoomLevels = [10, 17, 25, 33, 40, 50, 60, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500];
        this.zoomLevel = 11;
        this.scene = scene;
        this.camera = this.scene.cameras.main;
        this.init();
    }
    WorldView.prototype.init = function () {
        var _this = this;
        this.camera.setBackgroundColor("#090d24");
        // Bind the scroll wheel event
        this.onWheel = this.onWheel.bind(this);
        document.documentElement.addEventListener("wheel", this.onWheel);
        this.scene.events.on('destroy', function () { return document.documentElement.removeEventListener("wheel", _this.onWheel); });
    };
    WorldView.prototype.onWheel = function (e) {
        var dir = (e.deltaY < 0 ? 1 : -1);
        this.zoomLevel = clamp(this.zoomLevel + dir, 0, this.zoomLevels.length - 1);
        this.camera.setZoom(this.zoomLevels[this.zoomLevel] / 100);
    };
    WorldView.prototype.pan = function () {
        if (this.scene.input.mousePointer.middleButtonDown()) {
            this.camera.scrollX += Math.round((this.lastCursorScreen.x - this.cursorScreen.x) / this.camera.zoom);
            this.camera.scrollY += Math.round((this.lastCursorScreen.y - this.cursorScreen.y) / this.camera.zoom);
        }
    };
    WorldView.prototype.update = function () {
        this.lastCursorScreen = this.cursorScreen;
        this.lastCursorWorld = this.cursorWorld;
        this.cursorScreen = new Vec2(this.scene.input.mousePointer.x, this.scene.input.mousePointer.y);
        this.cursorWorld = new Vec2(this.cursorScreen.x / this.camera.zoom + this.camera.scrollX - ((this.camera.displayWidth - this.camera.width) / 2), this.cursorScreen.y / this.camera.zoom + this.camera.scrollY - ((this.camera.displayHeight - this.camera.height) / 2));
        this.pan();
    };
    return WorldView;
}());
var ArchitectMode = /** @class */ (function () {
    function ArchitectMode(scene) {
        this.active = false;
        this.pointerDown = false;
        this.manipulated = [];
        this.scene = scene;
        // Create cursor hover sprite
        this.cursor = this.scene.add.sprite(0, 0, "cursor");
        this.cursor.setScale(4, 4);
        this.cursor.setDepth(1000);
        this.cursor.setOrigin(0, 0);
    }
    ArchitectMode.prototype.update = function () {
        this.active = true;
        this.cursor.setVisible(true);
        var selectedTilePos = new Vec2(Math.floor(this.scene.world.cursorWorld.x / 64), Math.floor(this.scene.world.cursorWorld.y / 64));
        this.cursor.setPosition(selectedTilePos.x * 64, selectedTilePos.y * 64);
        this.cursor.setVisible((selectedTilePos.x >= 0 && selectedTilePos.y >= 0 &&
            selectedTilePos.x < this.scene.map.dimensions.x && selectedTilePos.y < this.scene.map.dimensions.y));
        if (this.scene.input.activePointer.isDown && !this.pointerDown)
            this.pointerDown = true;
        else if (!this.scene.input.activePointer.isDown && this.pointerDown) {
            if (this.manipulated.length != 0) {
                this.scene.history.push("tile", this.manipulated);
                this.manipulated = [];
            }
            this.pointerDown = false;
        }
        if (this.scene.input.mousePointer.leftButtonDown() || this.scene.input.mousePointer.rightButtonDown()) {
            var change = new Vec2(this.scene.world.cursorWorld.x - this.scene.world.lastCursorWorld.x, this.scene.world.cursorWorld.y - this.scene.world.lastCursorWorld.y);
            var normalizeFactor = Math.sqrt(change.x * change.x + change.y * change.y);
            change.x /= normalizeFactor;
            change.y /= normalizeFactor;
            var place = new Vec2(this.scene.world.lastCursorWorld.x, this.scene.world.lastCursorWorld.y);
            while (Math.abs(this.scene.world.cursorWorld.x - place.x) >= 1 || Math.abs(this.scene.world.cursorWorld.y - place.y) >= 1) {
                if (this.scene.map.setSolid(Math.floor(place.x / 64), Math.floor(place.y / 64), this.scene.input.mousePointer.rightButtonDown())) {
                    this.manipulated.push({ pos: new Vec2(Math.floor(place.x / 64), Math.floor(place.y / 64)), solid: this.scene.input.mousePointer.rightButtonDown() });
                }
                place.x += change.x;
                place.y += change.y;
            }
            if (this.scene.map.setSolid(selectedTilePos.x, selectedTilePos.y, this.scene.input.mousePointer.rightButtonDown())) {
                this.manipulated.push({ pos: selectedTilePos, solid: this.scene.input.mousePointer.rightButtonDown() });
            }
        }
    };
    ArchitectMode.prototype.cleanup = function () {
        if (!this.active)
            return;
        this.active = false;
        this.cursor.setVisible(false);
    };
    return ArchitectMode;
}());
var TokenMode = /** @class */ (function () {
    function TokenMode(scene) {
        this.active = false;
        this.currentToken = null;
        this.pointerDown = false;
        this.scene = scene;
    }
    TokenMode.prototype.update = function () {
        this.active = true;
        for (var _i = 0, _a = this.scene.tokens; _i < _a.length; _i++) {
            var token = _a[_i];
            if (this.scene.world.cursorWorld.x >= token.x && this.scene.world.cursorWorld.y >= token.y
                && this.scene.world.cursorWorld.x <= token.x + token.width && this.scene.world.cursorWorld.y <= token.y + token.height) {
                token.toggleOutline(true);
                if (this.scene.input.mousePointer.leftButtonDown() && !this.pointerDown && this.currentToken == null) {
                    this.grabOffset = new Vec2(this.scene.world.cursorWorld.x - token.x, this.scene.world.cursorWorld.y - token.y);
                    this.startPosition = token.getPosition();
                    this.currentToken = token;
                    this.pointerDown = true;
                }
            }
            else
                token.toggleOutline(false);
        }
        if (!this.scene.input.mousePointer.leftButtonDown() && this.pointerDown && this.currentToken != null) {
            for (var _b = 0, _c = this.scene.tokens; _b < _c.length; _b++) {
                var token = _c[_b];
                token.toggleOutline(false);
            }
            if (this.currentToken.getPosition().x != this.startPosition.x || this.currentToken.getPosition().y != this.startPosition.y)
                this.scene.history.push("token_move", { start: this.startPosition, end: this.currentToken.getPosition(), token: this.currentToken });
            this.currentToken = null;
            this.pointerDown = false;
        }
        if (this.currentToken != null) {
            var pos = new Vec2(Math.round((this.scene.world.cursorWorld.x - this.grabOffset.x) / 4), Math.round((this.scene.world.cursorWorld.y - this.grabOffset.y) / 4));
            if (!this.scene.snapKey.isDown) {
                pos.x = Math.round(pos.x / 16) * 16;
                pos.y = Math.round(pos.y / 16) * 16;
            }
            this.currentToken.setPosition(pos.x, pos.y);
        }
    };
    TokenMode.prototype.cleanup = function () {
        if (!this.active)
            return;
        this.active = false;
        for (var _i = 0, _a = this.scene.tokens; _i < _a.length; _i++) {
            var token = _a[_i];
            token.toggleOutline(false);
        }
        this.currentToken = null;
    };
    return TokenMode;
}());
var UIComponent = /** @class */ (function (_super) {
    __extends(UIComponent, _super);
    function UIComponent(scene, x, y, tex) {
        var _this = _super.call(this, scene, x, y, tex) || this;
        _this.setOrigin(0, 0);
        _this.setScale(3, 3);
        _this.setPos(x * 3, y * 3);
        _this.scene.add.existing(_this);
        return _this;
    }
    UIComponent.prototype.setPos = function (x, y) {
        this.setPosition(x * 3, y * 3);
    };
    UIComponent.prototype.mouseIntersects = function () {
        var pointer = this.scene.input.mousePointer;
        return (pointer.x >= this.x && pointer.y >= this.y && pointer.x <= this.x + this.width * 3 && pointer.y <= this.y + this.height * 3);
    };
    UIComponent.prototype.mousePos = function () {
        var pointer = this.scene.input.mousePointer;
        return new Vec2(Math.round((pointer.x - this.x) / 3), Math.round((pointer.y - this.y) / 3));
    };
    return UIComponent;
}(Phaser.GameObjects.Sprite));
var UIHistoryManipulation = /** @class */ (function (_super) {
    __extends(UIHistoryManipulation, _super);
    function UIHistoryManipulation(scene, x, y) {
        var _this = _super.call(this, scene, x, y, "ui_history_manipulation") || this;
        _this.mouseDown = false;
        _this.scene = scene;
        _this.setActive(true);
        return _this;
    }
    UIHistoryManipulation.prototype.update = function () {
        var hasNext = this.scene.history.historyHead < this.scene.history.history.length - 1;
        var hasPrev = this.scene.history.historyHead >= 0;
        if (hasNext && hasPrev) {
            if (this.mouseIntersects() && this.mousePos().x > 19) {
                this.setFrame(2);
                if (this.scene.input.activePointer.isDown && !this.mouseDown) {
                    this.scene.history.redo();
                    this.mouseDown = true;
                }
            }
            else if (this.mouseIntersects()) {
                this.setFrame(5);
                if (this.scene.input.activePointer.isDown && !this.mouseDown) {
                    this.scene.history.undo();
                    this.mouseDown = true;
                }
            }
            else
                this.setFrame(1);
        }
        else if (!hasNext && hasPrev) {
            if (this.mouseIntersects() && this.mousePos().x <= 19) {
                this.setFrame(7);
                if (this.scene.input.activePointer.isDown && !this.mouseDown) {
                    this.scene.history.undo();
                    this.mouseDown = true;
                }
            }
            else
                this.setFrame(3);
        }
        else if (hasNext && !hasPrev) {
            if (this.mouseIntersects() && this.mousePos().x > 19) {
                this.setFrame(6);
                if (this.scene.input.activePointer.isDown && !this.mouseDown) {
                    this.scene.history.redo();
                    this.mouseDown = true;
                }
            }
            else
                this.setFrame(0);
        }
        else
            this.setFrame(4);
        if (!this.scene.input.mousePointer.isDown)
            this.mouseDown = false;
    };
    return UIHistoryManipulation;
}(UIComponent));
var UIModeSwitchButton = /** @class */ (function (_super) {
    __extends(UIModeSwitchButton, _super);
    function UIModeSwitchButton(scene, x, y) {
        var _this = _super.call(this, scene, x, y, "ui_mode_switch") || this;
        _this.scene = scene;
        _this.setActive(true);
        return _this;
    }
    UIModeSwitchButton.prototype.update = function () {
        if (this.mouseIntersects()) {
            if (this.scene.mode == 0) {
                if (this.mousePos().x > 19) {
                    this.setFrame(2);
                    if (this.scene.input.mousePointer.leftButtonDown())
                        this.scene.mode = 1;
                }
                else
                    this.setFrame(1);
            }
            else {
                if (this.mousePos().x <= 19) {
                    this.setFrame(3);
                    if (this.scene.input.mousePointer.leftButtonDown())
                        this.scene.mode = 0;
                }
                else
                    this.setFrame(0);
            }
        }
        else {
            if (this.scene.mode == 0)
                this.setFrame(1);
            else
                this.setFrame(0);
        }
    };
    return UIModeSwitchButton;
}(UIComponent));
