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
var Chat = /** @class */ (function (_super) {
    __extends(Chat, _super);
    function Chat(scene, x, y) {
        var _this = _super.call(this, scene, x, y) || this;
        _this.messages = [];
        _this.textInput = new TextInput(scene, 0, 0);
        _this.list.push(_this.textInput);
        _this.messageContainer = new Phaser.GameObjects.Container(scene, 0, 0);
        _this.list.push(_this.messageContainer);
        return _this;
    }
    Chat.prototype.update = function () {
        this.textInput.y = -this.textInput.getHeight();
        this.messageContainer.y = this.textInput.y - 3;
    };
    Chat.prototype.pushMessage = function (message) {
        this.messages.unshift(new ChatBox(this.scene, 0, 0, message));
        this.messageContainer.list.push(this.messages[0]);
        this.scene.tweens.add({
            targets: this.messages[0],
            alpha: { from: 0, to: 1 },
            ease: 'Cubic',
            duration: 300,
            repeat: 0
        });
        this.reflowMessages();
    };
    Chat.prototype.reflowMessages = function () {
        var y = 0;
        for (var _i = 0, _a = this.messages; _i < _a.length; _i++) {
            var message = _a[_i];
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
    };
    return Chat;
}(Phaser.GameObjects.Container));
var ChatBox = /** @class */ (function (_super) {
    __extends(ChatBox, _super);
    function ChatBox(scene, x, y, str, tex) {
        var _this = _super.call(this, scene, x, y) || this;
        _this.texture = "ui_text_box";
        _this.FONT_SIZE = 4.3;
        _this.chatboxHeight = 0;
        _this.str = str;
        if (tex != undefined)
            _this.texture = tex;
        _this.setText(str);
        return _this;
    }
    ChatBox.prototype.setText = function (text) {
        this.list.forEach(function (e) { return e.destroy(); });
        this.list = [];
        this.str = text;
        var testObj = new Phaser.GameObjects.BitmapText(this.scene, 15, 4, "font2x", "AB", this.FONT_SIZE, 0);
        var letterWidth = testObj.getTextBounds().global.width / 2;
        var maxLetters = 95 / letterWidth;
        var split = this.str.split(/( )/g);
        var lines = [];
        function nextLine() {
            var newLine = "";
            while ((newLine + " " + split[0]).length < maxLetters && split.length)
                newLine += split.shift();
            lines.push(newLine.trim());
            if (split.length)
                nextLine();
        }
        nextLine();
        var top = new Phaser.GameObjects.Sprite(this.scene, 0, 0, this.texture, 0);
        top.setScale(3, 3);
        top.setOrigin(0, 0);
        top.setAlpha(0.6);
        this.list.push(top);
        var i = 0;
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            var elem = new Phaser.GameObjects.BitmapText(this.scene, 12, 7 + i * 18, "font2x", line, this.FONT_SIZE, 0);
            elem.setScale(3, 3);
            elem.setOrigin(0, 0);
            this.list.push(elem);
            i++;
        }
        var lastElem = this.list[this.list.length - 1];
        var height = Math.max(lastElem.y + lastElem.getTextBounds().global.height - 36, 2);
        var middle = new Phaser.GameObjects.Sprite(this.scene, 0, 18, "ui_text_box", 1);
        middle.setScale(3, height / 6);
        middle.setOrigin(0, 0);
        middle.setAlpha(0.6);
        this.list.push(middle);
        this.sendToBack(middle);
        var bottom = new Phaser.GameObjects.Sprite(this.scene, 0, height + 18, this.texture, 2);
        bottom.setScale(3, 3);
        bottom.setOrigin(0, 0);
        bottom.setAlpha(0.6);
        this.list.push(bottom);
        this.sendToBack(bottom);
        this.chatboxHeight = height + 18 * 2;
    };
    ChatBox.prototype.getHeight = function () {
        return this.chatboxHeight;
    };
    return ChatBox;
}(Phaser.GameObjects.Container));
var HistoryElement = /** @class */ (function () {
    function HistoryElement(scene, type, data) {
        this.scene = scene;
        this.type = type;
        this.data = data;
    }
    HistoryElement.prototype.undo = function () {
        console.log("Undo", this.type);
        if (this.type == "tile") {
            for (var _i = 0, _a = this.data; _i < _a.length; _i++) {
                var tile = _a[_i];
                this.scene.map.setWall(tile.pos.x, tile.pos.y, tile.lastWall);
            }
        }
        else if (this.type == "token_modify") {
            var data = this.data;
            var uuid = JSON.parse(this.data.old).uuid;
            for (var _b = 0, _c = this.scene.tokens; _b < _c.length; _b++) {
                var token_1 = _c[_b];
                if (token_1.uuid == uuid) {
                    token_1.loadSerializedData(this.data.old);
                    return;
                }
            }
            var token = new Token(this.scene, 0, 0, "");
            token.loadSerializedData(this.data.old);
            this.scene.add.existing(token);
            this.scene.tokens.push(token);
        }
        else if (this.type == "token_create") {
            var uuid = JSON.parse(this.data.data).uuid;
            for (var i = 0; i < this.scene.tokens.length; i++) {
                if (this.scene.tokens[i].uuid == uuid) {
                    this.scene.tokens[i].destroy();
                    this.scene.tokens.splice(i, 1);
                }
            }
        }
    };
    HistoryElement.prototype.redo = function () {
        console.log("Redo", this.type);
        if (this.type == "tile") {
            for (var _i = 0, _a = this.data; _i < _a.length; _i++) {
                var tile = _a[_i];
                this.scene.map.setWall(tile.pos.x, tile.pos.y, tile.wall);
            }
        }
        else if (this.type == "token_modify") {
            var data = this.data;
            var uuid = JSON.parse(this.data.old).uuid;
            for (var _b = 0, _c = this.scene.tokens; _b < _c.length; _b++) {
                var token_2 = _c[_b];
                if (token_2.uuid == uuid) {
                    token_2.loadSerializedData(this.data.new);
                    return;
                }
            }
            var token = new Token(this.scene, 0, 0, "");
            token.loadSerializedData(this.data.new);
            this.scene.add.existing(token);
            this.scene.tokens.push(token);
        }
        else if (this.type == "token_create") {
            var data = JSON.parse(this.data.data);
            var token = new Token(this.scene, 0, 0, "");
            token.loadSerializedData(this.data.data);
            this.scene.add.existing(token);
            this.scene.tokens.push(token);
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
        scene: [GetAssetsScene, LoadScene, MainScene],
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
var OutlinePipeline = /** @class */ (function (_super) {
    __extends(OutlinePipeline, _super);
    function OutlinePipeline(game) {
        var _this = this;
        var config = { game: game,
            renderer: game.renderer,
            fragShader: "\n\t\t\tprecision mediump float;\n\n\t\t\tuniform sampler2D uMainSampler;\n\t\t\tuniform float tex_size;\n\n\t\t\tvarying vec2 outTexCoord;\n\t\t\t\n\t\t\tvoid main(void) {\n\t\t\t\tfloat factor = 1.0 / tex_size;\n\n\t\t\t\tvec4 color  = texture2D(uMainSampler, outTexCoord);\n\t\t\t\tvec4 colorU = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y + factor));\n\t\t\t\tvec4 colorD = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y - factor));\n\t\t\t\tvec4 colorL = texture2D(uMainSampler, vec2(outTexCoord.x + factor, outTexCoord.y));\n\t\t\t\tvec4 colorR = texture2D(uMainSampler, vec2(outTexCoord.x - factor, outTexCoord.y));\n\t\t\t\t\n\t\t\t\tif (color.a == 0.0 && (colorU.a != 0.0 || colorD.a != 0.0 || colorL.a != 0.0 || colorR.a != 0.0)  ) {\n\t\t\t\t\tgl_FragColor = vec4(1.0, 1.0, 1.0, .2);\n\t\t\t\t}\n\t\t\t\telse {\n\t\t\t\t\tif (color.a == 0.0) discard;\n\t\t\t\t\tcolor += vec4(0.1, 0.1, 0.1, 0);\n\t\t\t\t\tgl_FragColor = color;\n\t\t\t\t}\n\t\t\t\t\n\t\t\t}"
        };
        _this = _super.call(this, config) || this;
        return _this;
    }
    return OutlinePipeline;
}(Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline));
var SmartTiler;
(function (SmartTiler) {
    function wall(walls, current) {
        var TL = 0, T = 1, TR = 2, L = 3, C = 4, R = 5, BL = 6, B = 7, BR = 8;
        if (current == -1)
            return -1;
        var empty = walls.map(function (b) { return !b; });
        var tile = 54;
        if (empty[T]) {
            if (empty[B]) {
                if (empty[L]) {
                    if (empty[R])
                        tile = 33;
                    else
                        tile = 15;
                }
                else if (empty[R])
                    tile = 5;
                else
                    tile = 2;
            }
            else if (empty[L]) {
                if (empty[R])
                    tile = 14;
                else if (empty[BR])
                    tile = 0;
                else
                    tile = 7;
            }
            else if (empty[R]) {
                if (empty[BL])
                    tile = 1;
                else
                    tile = 8;
            }
            else {
                if (empty[BL]) {
                    if (empty[BR])
                        tile = 3;
                    else
                        tile = 40;
                }
                else if (empty[BR])
                    tile = 41;
                else
                    tile = 31;
            }
        }
        else if (empty[B]) {
            if (empty[L]) {
                if (empty[R])
                    tile = 6;
                else if (empty[TR])
                    tile = 9;
                else
                    tile = 16;
            }
            else if (empty[R]) {
                if (empty[TL])
                    tile = 10;
                else
                    tile = 17;
            }
            else {
                if (empty[TL]) {
                    if (empty[TR])
                        tile = 4;
                    else
                        tile = 49;
                }
                else if (empty[TR])
                    tile = 50;
                else
                    tile = 32;
            }
        }
        else if (empty[L]) {
            if (empty[R])
                tile = 11;
            else {
                if (empty[TR]) {
                    if (empty[BR])
                        tile = 12;
                    else
                        tile = 38;
                }
                else if (empty[BR])
                    tile = 47;
                else
                    tile = 22;
            }
        }
        else if (empty[R]) {
            if (empty[TL]) {
                if (empty[BL])
                    tile = 13;
                else
                    tile = 39;
            }
            else if (empty[BL])
                tile = 48;
            else
                tile = 23;
        }
        else if (empty[TL]) {
            if (empty[TR]) {
                if (empty[BL]) {
                    if (empty[BR])
                        tile = 25;
                    else
                        tile = 36;
                }
                else if (empty[BR])
                    tile = 37;
                else
                    tile = 21;
            }
            else if (empty[BL]) {
                if (empty[BR])
                    tile = 45;
                else
                    tile = 30;
            }
            else if (empty[BR])
                tile = 51;
            else
                tile = 21;
        }
        else if (empty[TR]) {
            if (empty[BL]) {
                if (empty[BR])
                    tile = 46;
                else
                    tile = 42;
            }
            else if (empty[BR])
                tile = 29;
            else
                tile = 27;
        }
        else if (empty[BL]) {
            if (empty[BR])
                tile = 20;
            else
                tile = 19;
        }
        else if (empty[BR])
            tile = 18;
        else {
            if (current >= 54 && current <= 60)
                return -1;
            tile = 54 + Math.floor(Math.random() * 6);
        }
        return tile;
    }
    SmartTiler.wall = wall;
    function ground(walls, current) {
        var TL = 0, T = 1, TR = 2, L = 3, C = 4, R = 5, BL = 6, B = 7, BR = 8;
        if (current == -1)
            return -1;
        var tile = 10;
        if (walls[C])
            tile = 10;
        else if (walls[B]) {
            if (walls[T]) {
                if (walls[R]) {
                    if (walls[L])
                        tile = 49;
                    else
                        tile = 26;
                }
                else if (walls[L])
                    tile = 8;
                else
                    tile = 17;
            }
            else if (walls[L]) {
                if (walls[R])
                    tile = 48;
                else if (walls[TR])
                    tile = 45;
                else
                    tile = 21;
            }
            else if (walls[R]) {
                if (walls[TL])
                    tile = 47;
                else
                    tile = 23;
            }
            else if (walls[TL]) {
                if (walls[TR])
                    tile = 46;
                else
                    tile = 41;
            }
            else if (walls[TR])
                tile = 40;
            else
                tile = 1;
        }
        else if (walls[T]) {
            if (walls[L]) {
                if (walls[R])
                    tile = 30;
                else if (walls[BR])
                    tile = 27;
                else
                    tile = 3;
            }
            else if (walls[R]) {
                if (walls[BL])
                    tile = 29;
                else
                    tile = 5;
            }
            else if (walls[BL]) {
                if (walls[BR])
                    tile = 28;
                else
                    tile = 32;
            }
            else if (walls[BR])
                tile = 31;
            else
                tile = 19;
        }
        else if (walls[L]) {
            if (walls[R])
                tile = 39;
            else if (walls[TR]) {
                if (walls[BR])
                    tile = 36;
                else
                    tile = 51;
            }
            else if (walls[BR])
                tile = 42;
            else
                tile = 11;
        }
        else if (walls[R]) {
            if (walls[TL]) {
                if (walls[BL])
                    tile = 38;
                else
                    tile = 52;
            }
            else if (walls[BL])
                tile = 43;
            else
                tile = 9;
        }
        else if (walls[TL]) {
            if (walls[TR]) {
                if (walls[BL]) {
                    if (walls[BR])
                        tile = 37;
                    else
                        tile = 6;
                }
                else if (walls[BR])
                    tile = 7;
                else
                    tile = 4;
            }
            else if (walls[BL]) {
                if (walls[BR])
                    tile = 15;
                else
                    tile = 12;
            }
            else if (walls[BR])
                tile = 33;
            else
                tile = 20;
        }
        else if (walls[TR]) {
            if (walls[BL]) {
                if (walls[BR])
                    tile = 16;
                else
                    tile = 34;
            }
            else if (walls[BR])
                tile = 14;
            else
                tile = 18;
        }
        else if (walls[BL]) {
            if (walls[BR])
                tile = 22;
            else
                tile = 2;
        }
        else if (walls[BR])
            tile = 0;
        else {
            if (current >= 54 && current <= 60)
                return -1;
            tile = 54 + Math.floor(Math.random() * 6);
        }
        return tile;
    }
    SmartTiler.ground = ground;
})(SmartTiler || (SmartTiler = {}));
var TextInput = /** @class */ (function (_super) {
    __extends(TextInput, _super);
    function TextInput(scene, x, y) {
        var _this = _super.call(this, scene, x, y, " ", "ui_text_input") || this;
        _this.text = "";
        document.addEventListener("keydown", function (e) {
            var code = e.keyCode;
            if (code == 8) {
                _this.text = _this.text.substr(0, _this.text.length - 1);
                _this.setText(_this.text);
                return;
            }
            else if (code == 13) {
                //Send
                return;
            }
            else if (e.key.length != 1)
                return;
            _this.text += e.key;
            _this.setText(_this.text.length == 0 ? " " : _this.text);
        });
        return _this;
    }
    return TextInput;
}(ChatBox));
var Tilemap = /** @class */ (function () {
    function Tilemap(key, scene, xwid, ywid) {
        this.dimensions = new Vec2();
        this.layers = {};
        this.scene = scene;
        this.dimensions = new Vec2(xwid, ywid);
        this.groundAt = [];
        this.wallAt = [];
        for (var i = 0; i < xwid; i++) {
            this.groundAt[i] = [];
            this.wallAt[i] = [];
            for (var j = 0; j < ywid; j++) {
                this.groundAt[i][j] = -1;
                this.wallAt[i][j] = -1;
            }
        }
        this.manager = new TilesetManager(scene);
        this.map = this.scene.add.tilemap(null, 16, 16, 0, 0);
        for (var _i = 0, _a = Object.keys(this.manager.canvases); _i < _a.length; _i++) {
            var res = _a[_i];
            this.createLayers(parseInt(res));
        }
        for (var x = 0; x < this.dimensions.x; x++) {
            for (var y = 0; y < this.dimensions.y; y++) {
                this.setTileRaw(x, y, 1, 54 + Math.floor(Math.random() * 6), 0 /* GROUND */);
            }
        }
        this.map.addTilesetImage("grid_tile", "grid_tile", 16, 16, 0, 0);
        this.map.setLayer("grid");
        var gridlayer = this.map.createBlankDynamicLayer("grid", "grid_tile", 0, 0, this.dimensions.x, this.dimensions.y, 16, 16);
        gridlayer.setScale(4, 4);
        gridlayer.setDepth(500);
        for (var i = 0; i < xwid; i++) {
            for (var j = 0; j < ywid; j++) {
                if ((j % 2 == 0 && i % 2 == 0) || (j % 2 != 0 && i % 2 != 0))
                    gridlayer.putTileAt(0, i, j);
            }
        }
    }
    Tilemap.prototype.createLayers = function (res) {
        this.map.addTilesetImage("tileset_" + res + "_ground", "tileset_" + res + "_ground", res, res, 0, 4);
        this.map.addTilesetImage("tileset_" + res + "_wall", "tileset_" + res + "_wall", res, res, 0, 4);
        this.map.setLayer("layer_" + res + "_ground");
        var ground = this.map.createBlankDynamicLayer("layer_" + res + "_ground", "tileset_" + res + "_ground", 0, 0, this.dimensions.x, this.dimensions.y, res, res);
        ground.setScale(4 / (res / 16), 4 / (res / 16));
        ground.setDepth(-1000 + res);
        this.map.setLayer("layer_" + res + "_wall");
        var wall = this.map.createBlankDynamicLayer("layer_" + res + "_wall", "tileset_" + res + "_wall", 0, 0, this.dimensions.x, this.dimensions.y, res, res);
        wall.setScale(4 / (res / 16), 4 / (res / 16));
        wall.setDepth(-500 + res);
        this.layers[res] = [ground, wall];
    };
    Tilemap.prototype.getWall = function (x, y) {
        return this.wallAt[clamp(x, 0, this.dimensions.x - 1)][clamp(y, 0, this.dimensions.y - 1)];
    };
    Tilemap.prototype.setWall = function (x, y, tileset) {
        return this.setTile(x, y, tileset, 1 /* WALL */);
    };
    Tilemap.prototype.getGround = function (x, y) {
        return this.groundAt[clamp(x, 0, this.dimensions.x - 1)][clamp(y, 0, this.dimensions.y - 1)];
    };
    Tilemap.prototype.setGround = function (x, y, tileset) {
        return this.setTile(x, y, tileset, 0 /* GROUND */);
    };
    Tilemap.prototype.setTile = function (x, y, tileset, layer) {
        if (x < 0 || y < 0 || x > this.dimensions.x - 1 || y > this.dimensions.y - 1)
            return false;
        var arr = (layer == 0 /* GROUND */ ? this.groundAt : this.wallAt);
        if (arr[x][y] == tileset)
            return false;
        if (arr[x][y] != -1)
            this.layers[this.manager.getTilesetRes(arr[x][y])][layer].removeTileAt(x, y, true);
        if (tileset != -1)
            this.layers[this.manager.getTilesetRes(tileset)][layer].putTileAt(this.manager.getGlobalTileIndex(tileset, (layer == 0 /* GROUND */ ? 54 : 13), layer), x, y);
        arr[x][y] = tileset;
        this.calculateSmartTilesAround(x, y);
        return true;
    };
    Tilemap.prototype.setTileRaw = function (x, y, tileset, tile, layer) {
        var arr = (layer == 0 /* GROUND */ ? this.groundAt : this.wallAt);
        var loc = this.manager.locations[tileset].res;
        if (arr[x][y] != -1) {
            this.layers[loc][layer].removeTileAt(x, y, true);
            arr[x][y] = -1;
        }
        this.layers[loc][layer].putTileAt(this.manager.canvases[loc][layer].getGlobalIndex(tileset, tile), x, y);
        arr[x][y] = tileset;
    };
    Tilemap.prototype.calculateSmartTilesAround = function (x, y) {
        for (var i = clamp(x - 1, this.dimensions.x - 1, 0); i <= clamp(x + 1, this.dimensions.x - 1, 0); i++) {
            for (var j = clamp(y - 1, this.dimensions.y - 1, 0); j <= clamp(y + 1, this.dimensions.y - 1, 0); j++) {
                var wall = SmartTiler.wall(this.getWallsAround(i, j), this.wallAt[i][j]);
                if (wall != -1)
                    this.setTileRaw(i, j, this.wallAt[i][j], wall, 1 /* WALL */);
                var ground = SmartTiler.ground(this.getWallsAround(i, j), this.groundAt[i][j]);
                if (ground != -1)
                    this.setTileRaw(i, j, this.groundAt[i][j], ground, 0 /* GROUND */);
            }
        }
    };
    Tilemap.prototype.getWallsAround = function (x, y) {
        var solid = [];
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                solid.push(this.getWall(x + j, y + i) != -1);
            }
        }
        return solid;
    };
    return Tilemap;
}());
var TilesetCanvas = /** @class */ (function () {
    function TilesetCanvas(manager, res, wall) {
        this.indexes = [];
        this.indMap = [];
        this.pad = 2;
        this.manager = manager;
        this.res = res;
        this.width = Math.floor(1024 / ((this.res + this.pad * 2) * 9));
        this.height = Math.floor(1024 / ((this.res + this.pad * 2) * 7));
        this.canvas = manager.scene.textures.createCanvas("tileset_" + res + (wall ? "_wall" : "_ground"), this.width * 9 * (this.res + this.pad * 2) - 2, this.height * 7 * (this.res + this.pad * 2) - 2);
    }
    TilesetCanvas.prototype.addTileset = function (key) {
        var x = this.indexes.length % this.width;
        var y = Math.floor(this.indexes.length / this.width);
        this.drawTileset(key, x, y);
        this.indMap[this.manager.currentInd] = this.indexes.length;
        this.indexes.push(this.manager.currentInd++);
    };
    TilesetCanvas.prototype.getGlobalIndex = function (tileset, tile) {
        var lX = tile % 9;
        var lY = Math.floor(tile / 9);
        var gX = tileset % this.width;
        var gY = Math.floor(tileset / this.width);
        var xx = lX + gX * 9;
        var yy = lY + gY * 9;
        return yy * this.width * 9 + xx;
    };
    TilesetCanvas.prototype.drawTileset = function (key, x, y) {
        // this.canvas.drawFrame(key, 0, 9*this.res * x, 7*this.res * y);
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 7; j++) {
                var frame = i + j * 9;
                for (var r = 0; r < 4; r++) {
                    var xo = r < 2 ? -this.pad : +this.pad;
                    var yo = r % 2 == 0 ? -this.pad : +this.pad;
                    this.canvas.drawFrame(key, frame, 9 * (this.res + this.pad * 2) * x + i * (this.res + this.pad * 2) + xo, 7 * (this.res + this.pad * 2) * y + j * (this.res + this.pad * 2) + yo);
                }
                this.canvas.drawFrame(key, frame, 9 * (this.res + this.pad * 2) * x + i * (this.res + this.pad * 2), 7 * (this.res + this.pad * 2) * y + j * (this.res + this.pad * 2));
            }
        }
    };
    return TilesetCanvas;
}());
var TilesetManager = /** @class */ (function () {
    function TilesetManager(scene) {
        this.currentInd = 0;
        this.canvases = {};
        this.locations = {};
        this.indexes = {};
        this.scene = scene;
        for (var _i = 0, WALLS_1 = WALLS; _i < WALLS_1.length; _i++) {
            var tileset = WALLS_1[_i];
            this.addTileset(tileset.key, 1 /* WALL */);
        }
        for (var _a = 0, GROUNDS_1 = GROUNDS; _a < GROUNDS_1.length; _a++) {
            var tileset = GROUNDS_1[_a];
            this.addTileset(tileset.key, 0 /* GROUND */);
        }
    }
    TilesetManager.prototype.addTileset = function (key, layer) {
        var res = this.scene.textures.get(key).getSourceImage(0).width / 9;
        if (this.canvases[res] == undefined)
            this.canvases[res] = [new TilesetCanvas(this, res, false), new TilesetCanvas(this, res, true)];
        var canvas = this.canvases[res];
        this.locations[this.currentInd] = { res: res, layer: layer, ind: this.currentInd, key: key };
        this.indexes[key] = this.currentInd;
        canvas[layer].addTileset(key);
    };
    TilesetManager.prototype.getTilesetRes = function (tileset) {
        return this.locations[tileset].res;
    };
    TilesetManager.prototype.getGlobalTileIndex = function (tileset, tile, layer) {
        return this.canvases[this.getTilesetRes(tileset)][layer].getGlobalIndex(tileset, tile);
    };
    return TilesetManager;
}());
var Token = /** @class */ (function (_super) {
    __extends(Token, _super);
    function Token(scene, x, y, tex) {
        var _this = _super.call(this, scene, x, y) || this;
        _this.sprite = null;
        _this.shadow = null;
        _this.currentFrame = 0;
        _this.setTexture(tex);
        _this.uuid = generateId(32);
        return _this;
    }
    Token.prototype.setTexture = function (tex) {
        if (this.shadow != null)
            this.shadow.setTexture(tex);
        else {
            this.shadow = new Phaser.GameObjects.Sprite(this.scene, -4, -4, tex);
            this.shadow.setOrigin(0, 0);
            this.shadow.setScale(4, 1);
            this.shadow.setTint(0x000000);
            this.shadow.setAlpha(0.1, 0.1, 0.3, 0.3);
            this.list.push(this.shadow);
        }
        this.width = this.shadow.width * 4;
        this.height = this.shadow.height * 4;
        this.shadow.y = this.height - 24;
        if (this.sprite != null)
            this.sprite.setTexture(tex);
        else {
            this.sprite = new Phaser.GameObjects.Sprite(this.scene, -4, -4, tex);
            this.sprite.setOrigin(0, 0);
            this.sprite.setScale(4, 4);
            this.setPosition(this.x / 4, this.y / 4);
            this.list.push(this.sprite);
        }
    };
    Token.prototype.setFrame = function (frame) {
        this.currentFrame = frame;
        this.sprite.setFrame(frame);
        this.shadow.setFrame(frame);
    };
    Token.prototype.getFrame = function () {
        return this.currentFrame;
    };
    Token.prototype.frameCount = function () {
        return Object.keys(this.sprite.texture.frames).length - 1;
    };
    Token.prototype.toggleOutline = function (outline) {
        if (outline) {
            this.sprite.setPipeline("outline");
            this.sprite.pipeline.setFloat1("tex_size", this.sprite.texture.source[0].width);
        }
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
    // For converting token to / from serialized data
    Token.prototype.serialize = function () {
        return JSON.stringify({
            uuid: this.uuid,
            sprite: this.sprite.texture.key,
            frame: this.currentFrame,
            x: this.x / 4,
            y: this.y / 4
        });
    };
    Token.deserialize = function (scene, serialized) {
        var tkn = new Token(scene, 0, 0, "");
        tkn.loadSerializedData(serialized);
        return tkn;
    };
    Token.prototype.loadSerializedData = function (serialized) {
        var tbl = JSON.parse(serialized);
        this.uuid = tbl.uuid;
        this.setTexture(tbl.sprite);
        this.setFrame(tbl.frame);
        this.setPosition(tbl.x, tbl.y);
    };
    return Token;
}(Phaser.GameObjects.Container));
var UIView = /** @class */ (function () {
    function UIView(scene) {
        this.visibleMenu = 0;
        this.uiActive = false;
        this.scene = scene;
        this.camera = this.scene.cameras.add(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height, false, "ui_camera");
        this.camera.scrollX = -10000;
        this.o = this.scene.add.container(-10000, 0);
    }
    UIView.prototype.createElements = function () {
        this.o.add(new UIModeSwitchButton(this.scene, 14 + 10, 1));
        this.o.add(new UIHistoryManipulation(this.scene, 14 + 25, 1));
        this.tokenSidebar = new UITokenSidebar(this.scene, -205, 0);
        this.o.add(this.tokenSidebar);
        for (var _i = 0, TOKENS_1 = TOKENS; _i < TOKENS_1.length; _i++) {
            var t = TOKENS_1[_i];
            this.tokenSidebar.addToken(t.key);
        }
        this.tileSidebar = new UITileSidebar(this.scene, 0, 0);
        this.o.add(this.tileSidebar);
    };
    UIView.prototype.update = function () {
        this.uiActive = false;
        for (var _i = 0, _a = this.o.list; _i < _a.length; _i++) {
            var o = _a[_i];
            o.update();
            if (!this.uiActive && o.mouseIntersects())
                this.uiActive = true;
        }
        if (this.visibleMenu != this.scene.mode) {
            this.visibleMenu = this.scene.mode;
            if (this.scene.mode == 0) {
                this.displayArchitect();
                this.hideToken();
            }
            else {
                this.hideArchitect();
                this.displayToken();
            }
        }
    };
    UIView.prototype.displayArchitect = function () {
        this.o.bringToTop(this.tileSidebar);
        this.scene.tweens.add({
            targets: this.tileSidebar,
            x: 0,
            ease: 'Cubic',
            duration: 300,
            repeat: 0
        });
    };
    UIView.prototype.hideToken = function () {
        this.scene.tweens.add({
            targets: this.tokenSidebar,
            x: -205,
            ease: 'Cubic',
            duration: 300,
            repeat: 0
        });
    };
    UIView.prototype.displayToken = function () {
        this.o.bringToTop(this.tokenSidebar);
        this.scene.tweens.add({
            targets: this.tokenSidebar,
            x: 0,
            ease: 'Cubic',
            duration: 300,
            repeat: 0
        });
    };
    UIView.prototype.hideArchitect = function () {
        this.scene.tweens.add({
            targets: this.tileSidebar,
            x: -205,
            ease: 'Cubic',
            duration: 300,
            repeat: 0
        });
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
function dec2hex(dec) {
    return ('0' + dec.toString(16)).substr(-2);
}
function generateId(len) {
    var arr = new Uint8Array((len || 40) / 2);
    window.crypto.getRandomValues(arr);
    var stringArr = [];
    for (var i = 0; i < arr.length; i++)
        stringArr.push(dec2hex(arr[i]));
    return stringArr.join('');
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
var Vec4 = /** @class */ (function () {
    function Vec4(x, y, z, w) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 0;
        if (x == null)
            return;
        if (typeof (x) == "number") {
            this.x = x;
            if (y != null) {
                this.y = y;
                this.z = z;
                this.w = w;
            }
            else {
                this.y = x;
                this.z = x;
                this.w = w;
            }
        }
        else {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
            this.w = x.w;
        }
    }
    return Vec4;
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
        if (!(this.scene.mode == 1 && this.scene.token.currentToken != null)) {
            var dir = (e.deltaY < 0 ? 1 : -1);
            this.zoomLevel = clamp(this.zoomLevel + dir, 0, this.zoomLevels.length - 1);
            this.camera.setZoom(this.zoomLevels[this.zoomLevel] / 100);
        }
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
var WALLS = [
    { name: "Dungeon Wall", key: "wall_dungeon", file: "res/tileset/wall_dungeon", res: 16 },
    { name: "Wood Wall", key: "wall_wood", file: "res/tileset/wall_wood", res: 16 },
    { name: "Dungeon Wall", key: "wall_dungeon_2", file: "res/tileset/wall_dungeon", res: 16 },
    { name: "Wood Wall", key: "wall_wood_2", file: "res/tileset/wall_wood", res: 16 },
    { name: "Dungeon Wall", key: "wall_dungeon_3", file: "res/tileset/wall_dungeon", res: 16 },
    { name: "Wood Wall", key: "wall_wood_3", file: "res/tileset/wall_wood", res: 16 },
];
var GROUNDS = [
    { name: "Cave Floor", key: "ground_cave", file: "res/tileset/ground_cave", res: 16 },
    { name: "Lawn", key: "ground_wood", file: "res/tileset/ground_grass", res: 16 },
    { name: "Cave Floor", key: "ground_cave_2", file: "res/tileset/ground_cave", res: 16 },
    { name: "Lawn", key: "ground_wood_2", file: "res/tileset/ground_grass", res: 16 },
    { name: "Cave Floor", key: "ground_cave_3", file: "res/tileset/ground_cave", res: 16 },
    { name: "Lawn", key: "ground_wood_3", file: "res/tileset/ground_grass", res: 16 },
];
var TOKENS = [
    { name: "Armor 1", key: "tkn_armor_1", file: "res/token/armor_1", split_by: 18 },
    { name: "Cadin 1", key: "tkn_cadin_1", file: "res/token/cadin_1", split_by: 18 },
    { name: "Cadin 2", key: "tkn_cadin_2", file: "res/token/cadin_2", split_by: 18 },
    { name: "Cadin 3", key: "tkn_cadin_3", file: "res/token/cadin_3", split_by: 18 },
    { name: "Cleric F", key: "tkn_cleric_f", file: "res/token/cleric_female", split_by: 18 },
    { name: "Cleric M", key: "tkn_cleric_m", file: "res/token/cleric_male", split_by: 18 },
    { name: "Dragonfolk 1", key: "tkn_dragonfolk_1", file: "res/token/dragonfolk_1", split_by: 18 },
    { name: "Dragonfolk 2", key: "tkn_dragonfolk_2", file: "res/token/dragonfolk_2", split_by: 18 },
    { name: "Dragonfolk 3", key: "tkn_dragonfolk_3", file: "res/token/dragonfolk_3", split_by: 18 },
    { name: "Tori 1", key: "tkn_tori_1", file: "res/token/tori_1", split_by: 18 },
    { name: "Tori 2", key: "tkn_tori_2", file: "res/token/tori_2", split_by: 18 },
    { name: "Tori 3", key: "tkn_tori_3", file: "res/token/tori_3", split_by: 18 },
    { name: "Tori 4", key: "tkn_tori_4", file: "res/token/tori_4", split_by: 18 },
    { name: "Dragonfolk Knight 1", key: "tkn_dragonknight_1", file: "res/token/dragonfolk_knight_1", split_by: 18 },
    { name: "Dragonfolk Knight 2", key: "tkn_dragonknight_2", file: "res/token/dragonfolk_knight_2", split_by: 18 },
    { name: "Dragonfolk Knight 3", key: "tkn_dragonknight_3", file: "res/token/dragonfolk_knight_3", split_by: 18 },
    { name: "Druid M", key: "tkn_druid_m", file: "res/token/druid_male", split_by: 18 },
    { name: "Feline 1", key: "tkn_feline_1", file: "res/token/feline_1", split_by: 18 },
    { name: "Knight 1", key: "tkn_knight_1", file: "res/token/knight_1", split_by: 18 },
    { name: "Robot 1", key: "tkn_robot_1", file: "res/token/robot_1", split_by: 18 },
    { name: "Rockfriend Green", key: "tkn_rockfriend_g", file: "res/token/rockfriend_1", split_by: 18 },
    { name: "Rockfriend Blue", key: "tkn_rockfriend_b", file: "res/token/rockfriend_2", split_by: 18 },
    { name: "Rockfriend Red", key: "tkn_rockfriend_r", file: "res/token/rockfriend_3", split_by: 18 },
    { name: "Rockfriend Teal", key: "tkn_rockfriend_t", file: "res/token/rockfriend_4", split_by: 18 },
    { name: "Wizard F", key: "tkn_wizard_f", file: "res/token/wizard_female", split_by: 18 },
    { name: "Wizard M", key: "tkn_wizard_m", file: "res/token/wizard_male", split_by: 18 },
    { name: "Cloaked Person", key: "tkn_cloaked_person", file: "res/token/cloaked_person", split_by: 18 },
    { name: "Dwarf M 1", key: "tkn_dwarf_m_1", file: "res/token/dwarf_m_1", split_by: 18 },
    { name: "Dwarf M 2", key: "tkn_dwarf_m_2", file: "res/token/dwarf_m_2", split_by: 18 },
    { name: "Skeleton", key: "tkn_skeleton", file: "res/token/skeleton", split_by: 18 },
    { name: "Naexi", key: "tkn_naexi", file: "res/token/naexi_human_noweapon", split_by: 18 },
    { name: "Naexi w/ Yklwa", key: "tkn_naexi_yklwa", file: "res/token/naexi_human_yklwa", split_by: 18 },
    { name: "Naexi Anthro Form", key: "tkn_naexi_anthro", file: "res/token/naexi_anthro", split_by: 18 },
    { name: "bones", key: "tkn_bones", file: "res/token/bones" },
    { name: "treasure", key: "tkn_treasure", file: "res/token/treasure" },
];
var ArchitectMode = /** @class */ (function () {
    function ArchitectMode(scene) {
        var _this = this;
        this.active = false;
        this.primitives = [];
        this.startTilePos = new Vec2();
        this.placeMode = "brush";
        this.pointerDown = false;
        this.pointerPrimaryDown = false;
        this.manipulated = [];
        this.scene = scene;
        // Create cursor hover sprite
        this.cursor = this.scene.add.sprite(0, 0, "cursor");
        this.cursor.setScale(4, 4);
        this.cursor.setDepth(1000);
        this.cursor.setOrigin(0, 0);
        this.scene.snapKey.addListener("down", function () { if (!_this.scene.input.activePointer.isDown)
            _this.placeMode = "line"; });
        this.scene.modifierKey.addListener("down", function () { if (!_this.scene.input.activePointer.isDown)
            _this.placeMode = "rect"; });
        this.scene.snapKey.addListener("up", function () { if (!_this.scene.input.activePointer.isDown)
            _this.placeMode = "brush"; });
        this.scene.modifierKey.addListener("up", function () { if (!_this.scene.input.activePointer.isDown)
            _this.placeMode = "brush"; });
    }
    ArchitectMode.prototype.update = function () {
        this.active = true;
        this.cursor.setVisible(true);
        var selectedTilePos = new Vec2(Math.floor(this.scene.world.cursorWorld.x / 64), Math.floor(this.scene.world.cursorWorld.y / 64));
        this.cursor.setPosition(selectedTilePos.x * 64, selectedTilePos.y * 64);
        this.cursor.setVisible((selectedTilePos.x >= 0 && selectedTilePos.y >= 0 &&
            selectedTilePos.x < this.scene.map.dimensions.x && selectedTilePos.y < this.scene.map.dimensions.y));
        // Place Tiles
        switch (this.placeMode) {
            case "brush": {
                this.drawBrush(selectedTilePos);
                break;
            }
            case "line": {
                this.drawLine(selectedTilePos);
                break;
            }
            case "rect": {
                this.drawRect(selectedTilePos);
                break;
            }
        }
        // Push history to HistoryManager
        if (this.scene.input.activePointer.isDown && !this.pointerDown) {
            this.pointerDown = true;
            this.pointerPrimaryDown = this.scene.input.activePointer.leftButtonDown();
        }
        else if (!this.scene.input.activePointer.isDown && this.pointerDown) {
            if (this.manipulated.length != 0) {
                this.scene.history.push("tile", this.manipulated);
                this.manipulated = [];
            }
            this.pointerDown = false;
            this.pointerPrimaryDown = false;
        }
    };
    ArchitectMode.prototype.drawLine = function (selectedTilePos) {
        if (this.scene.input.mousePointer.leftButtonDown() || this.scene.input.mousePointer.rightButtonDown()) {
            if (!this.pointerDown)
                this.startTilePos = selectedTilePos;
            var a = new Vec2(this.startTilePos.x, this.startTilePos.y);
            var b = new Vec2(selectedTilePos.x, selectedTilePos.y);
            if (Math.abs(b.x - a.x) > Math.abs(b.y - a.y))
                b.y = a.y;
            else
                b.x = a.x;
            this.cursor.setPosition(b.x * 64, b.y * 64);
            this.primitives.forEach(function (v) { return v.destroy(); });
            this.primitives = [];
            this.primitives.push(this.scene.add.line(0, 0, a.x + 0.5, a.y + 0.5, b.x + 0.5, b.y + 0.5, 0xffffff, 1));
            this.primitives.forEach(function (v) {
                v.setOrigin(0, 0);
                v.setScale(64, 64);
                v.setLineWidth(0.03);
                v.setDepth(300);
            });
            this.primitives.push(this.scene.add.sprite(this.startTilePos.x * 64, this.startTilePos.y * 64, "cursor"));
            this.primitives[1].setOrigin(0, 0);
            this.primitives[1].setScale(4, 4);
            this.primitives[1].setAlpha(0.5);
        }
        else if (!this.scene.input.mousePointer.leftButtonDown() && !this.scene.input.mousePointer.rightButtonDown() && this.pointerDown) {
            var a = new Vec2(this.startTilePos.x * 64, this.startTilePos.y * 64);
            var b = new Vec2(selectedTilePos.x * 64, selectedTilePos.y * 64);
            if (Math.abs(b.x - a.x) > Math.abs(b.y - a.y))
                b.y = a.y;
            else
                b.x = a.x;
            var change = new Vec2(b.x - a.x, b.y - a.y);
            var normalizeFactor = Math.sqrt(change.x * change.x + change.y * change.y);
            change.x /= normalizeFactor;
            change.y /= normalizeFactor;
            while (Math.abs(b.x - a.x) >= 1 || Math.abs(b.y - a.y) >= 1) {
                this.placeTileAndPushManip(new Vec2(Math.floor(a.x / 64), Math.floor(a.y / 64)), this.pointerPrimaryDown);
                a.x += change.x;
                a.y += change.y;
            }
            this.placeTileAndPushManip(new Vec2(b.x / 64, b.y / 64), this.pointerPrimaryDown);
            this.primitives.forEach(function (v) { return v.destroy(); });
            this.primitives = [];
        }
    };
    ArchitectMode.prototype.drawRect = function (selectedTilePos) {
        if (this.scene.input.mousePointer.leftButtonDown() || this.scene.input.mousePointer.rightButtonDown()) {
            if (!this.pointerDown)
                this.startTilePos = selectedTilePos;
            var a = new Vec2(Math.min(this.startTilePos.x, selectedTilePos.x), Math.min(this.startTilePos.y, selectedTilePos.y));
            var b = new Vec2(Math.max(this.startTilePos.x, selectedTilePos.x), Math.max(this.startTilePos.y, selectedTilePos.y));
            this.primitives.forEach(function (v) { return v.destroy(); });
            this.primitives = [];
            var fac = 0.03;
            this.primitives.push(this.scene.add.line(0, 0, a.x + fac, a.y + fac, b.x + 1 - fac, a.y + fac, 0xffffff, 1));
            this.primitives.push(this.scene.add.line(0, 0, a.x + fac, a.y + fac / 2, a.x + fac, b.y + 1 - fac / 2, 0xffffff, 1));
            this.primitives.push(this.scene.add.line(0, 0, a.x + fac, b.y + 1 - fac, b.x + 1 - fac, b.y + 1 - fac, 0xffffff, 1));
            this.primitives.push(this.scene.add.line(0, 0, b.x + 1 - fac, a.y + fac / 2, b.x + 1 - fac, b.y + 1 - fac / 2, 0xffffff, 1));
            this.primitives.forEach(function (v) {
                v.setOrigin(0, 0);
                v.setScale(64, 64);
                v.setLineWidth(0.03);
                v.setDepth(300);
            });
        }
        else if (!this.scene.input.mousePointer.leftButtonDown() && !this.scene.input.mousePointer.rightButtonDown() && this.pointerDown) {
            var a = new Vec2(Math.min(this.startTilePos.x, selectedTilePos.x), Math.min(this.startTilePos.y, selectedTilePos.y));
            var b = new Vec2(Math.max(this.startTilePos.x, selectedTilePos.x), Math.max(this.startTilePos.y, selectedTilePos.y));
            for (var i = a.x; i <= b.x; i++) {
                for (var j = a.y; j <= b.y; j++) {
                    this.placeTileAndPushManip(new Vec2(i, j), this.pointerPrimaryDown);
                }
            }
            this.primitives.forEach(function (v) { return v.destroy(); });
            this.primitives = [];
        }
    };
    ArchitectMode.prototype.drawBrush = function (selectedTilePos) {
        if (this.scene.input.mousePointer.leftButtonDown() || this.scene.input.mousePointer.rightButtonDown()) {
            var change = new Vec2(this.scene.world.cursorWorld.x - this.scene.world.lastCursorWorld.x, this.scene.world.cursorWorld.y - this.scene.world.lastCursorWorld.y);
            var normalizeFactor = Math.sqrt(change.x * change.x + change.y * change.y);
            change.x /= normalizeFactor;
            change.y /= normalizeFactor;
            var place = new Vec2(this.scene.world.lastCursorWorld.x, this.scene.world.lastCursorWorld.y);
            while (Math.abs(this.scene.world.cursorWorld.x - place.x) >= 1 || Math.abs(this.scene.world.cursorWorld.y - place.y) >= 1) {
                this.placeTileAndPushManip(new Vec2(Math.floor(place.x / 64), Math.floor(place.y / 64)), this.scene.input.mousePointer.leftButtonDown());
                place.x += change.x;
                place.y += change.y;
            }
            this.placeTileAndPushManip(new Vec2(selectedTilePos.x, selectedTilePos.y), this.scene.input.mousePointer.leftButtonDown());
        }
    };
    ArchitectMode.prototype.placeTileAndPushManip = function (manipPos, solid) {
        var tile = solid ? this.scene.activeTileset : -1;
        var lastWall = this.scene.map.getWall(manipPos.x, manipPos.y);
        if (tile == lastWall)
            return;
        this.scene.map.setWall(manipPos.x, manipPos.y, tile);
        this.manipulated.push({
            pos: manipPos,
            lastWall: lastWall,
            wall: tile
        });
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
        var _this = this;
        this.active = false;
        this.currentToken = null;
        this.pointerDown = false;
        this.currentSerialized = "";
        this.scene = scene;
        this.onWheel = this.onWheel.bind(this);
        document.documentElement.addEventListener("wheel", this.onWheel);
        this.scene.events.on('destroy', function () { return document.documentElement.removeEventListener("wheel", _this.onWheel); });
    }
    TokenMode.prototype.onWheel = function (e) {
        if (this.currentToken != null) {
            var dir = e.deltaY > 0 ? 1 : -1;
            var frame = this.currentToken.getFrame() + dir;
            if (frame < 0)
                frame += this.currentToken.frameCount();
            frame %= this.currentToken.frameCount();
            this.currentToken.setFrame(frame);
        }
    };
    TokenMode.prototype.update = function () {
        this.active = true;
        var foundToHighlight = false;
        for (var i = this.scene.tokens.length - 1; i >= 0; i--) {
            var token = this.scene.tokens[i];
            if (!foundToHighlight && this.scene.world.cursorWorld.x >= token.x && this.scene.world.cursorWorld.y >= token.y
                && this.scene.world.cursorWorld.x <= token.x + token.width && this.scene.world.cursorWorld.y <= token.y + token.height) {
                token.toggleOutline(true);
                foundToHighlight = true;
                if (this.scene.input.mousePointer.leftButtonDown() && !this.pointerDown && this.currentToken == null) {
                    this.grabOffset = new Vec2(this.scene.world.cursorWorld.x - token.x, this.scene.world.cursorWorld.y - token.y);
                    this.startPosition = token.getPosition();
                    this.currentToken = token;
                    this.currentSerialized = this.currentToken.serialize();
                    this.pointerDown = true;
                }
            }
            else if (this.currentToken != token)
                token.toggleOutline(false);
        }
        if (this.currentToken == null && this.scene.input.mousePointer.leftButtonDown()) {
            var token = new Token(this.scene, Math.floor(this.scene.world.cursorWorld.x / 4 / 16) * 16, Math.floor(this.scene.world.cursorWorld.y / 4 / 16) * 16, this.scene.activeToken);
            this.scene.add.existing(token);
            this.scene.tokens.push(token);
            this.scene.history.push("token_create", { data: token.serialize() });
        }
        if (!this.scene.input.mousePointer.leftButtonDown() && this.pointerDown && this.currentToken != null) {
            for (var _i = 0, _a = this.scene.tokens; _i < _a.length; _i++) {
                var token = _a[_i];
                if (token != this.currentToken)
                    token.toggleOutline(false);
            }
            if (JSON.stringify(this.currentToken.serialize()) != JSON.stringify(this.currentSerialized))
                this.scene.history.push("token_modify", { old: this.currentSerialized, new: this.currentToken.serialize() });
            this.currentToken = null;
            this.currentSerialized = "";
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
var GetAssetsScene = /** @class */ (function (_super) {
    __extends(GetAssetsScene, _super);
    function GetAssetsScene() {
        return _super.call(this, { key: "GetAssetsScene" }) || this;
    }
    GetAssetsScene.prototype.preload = function () {
        this.cameras.main.setBackgroundColor("#6a655a");
        this.load.image('splash', '/res/splash.png');
        this.load.text("assets", "res/_assets.txt");
    };
    GetAssetsScene.prototype.create = function () {
        var assets = this.cache.text.get("assets");
        var lines = assets.split("\n");
        var assetsParsed = "";
        var prefixes = {};
        lines.forEach(function (v) {
            if (v.substr(0, "FOLDERPREFIX".length) == "FOLDERPREFIX") {
                var tokens = v.split(" ");
                prefixes[tokens[1]] = tokens[2];
                return;
            }
            if (v.length == 0)
                return;
            var slash = v.indexOf('/');
            var prefix = "";
            if (slash != -1 && prefixes[v.substr(0, slash)] != undefined)
                prefix = prefixes[v.substr(0, slash)];
            if (slash == -1)
                assetsParsed += v.split(" ")[0] + " " + v + "\n";
            else
                assetsParsed += "" + prefix + v.substring(slash + 1, v.length).split(" ")[0] + " " + v + "\n";
        });
        this.cache.text.remove("assets");
        this.cache.text.add("assets", assetsParsed);
        this.game.scene.start('LoadScene');
        this.game.scene.stop('GetAssetsScene');
        this.game.scene.swapPosition('LoadScene', 'GetAssetsScene');
    };
    return GetAssetsScene;
}(Phaser.Scene));
var LoadScene = /** @class */ (function (_super) {
    __extends(LoadScene, _super);
    function LoadScene() {
        return _super.call(this, { key: "LoadScene" }) || this;
    }
    LoadScene.prototype.preload = function () {
        this.cameras.main.setBackgroundColor("#6a655a");
        this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, "splash");
        this.load.bitmapFont('font1x', '/res/font/font1.png', '/res/font/font1.fnt');
        this.load.bitmapFont('font2x', '/res/font/font2.png', '/res/font/font2.fnt');
        for (var _i = 0, _a = this.cache.text.get("assets").split("\n"); _i < _a.length; _i++) {
            var s = _a[_i];
            var tokens = s.split(" ");
            if (tokens.length == 2)
                this.load.image(tokens[0], "/res/" + tokens[1] + ".png");
            else if (tokens.length == 4)
                this.load.spritesheet(tokens[0], "/res/" + tokens[1] + ".png", { frameWidth: parseInt(tokens[2]), frameHeight: parseInt(tokens[3]) });
        }
        for (var _b = 0, TOKENS_2 = TOKENS; _b < TOKENS_2.length; _b++) {
            var t = TOKENS_2[_b];
            if (t.split_by != undefined)
                this.load.spritesheet(t.key, t.file + ".png", { frameWidth: t.split_by, frameHeight: t.split_by });
            else
                this.load.image(t.key, t.file + ".png");
        }
        for (var _c = 0, WALLS_2 = WALLS; _c < WALLS_2.length; _c++) {
            var t = WALLS_2[_c];
            this.load.spritesheet(t.key, t.file + ".png", { frameWidth: t.res, frameHeight: t.res });
        }
        for (var _d = 0, GROUNDS_2 = GROUNDS; _d < GROUNDS_2.length; _d++) {
            var t = GROUNDS_2[_d];
            this.load.spritesheet(t.key, t.file + ".png", { frameWidth: t.res, frameHeight: t.res });
        }
    };
    LoadScene.prototype.create = function () {
        var _this = this;
        this.cache.text.remove("assets");
        setTimeout(function () {
            _this.game.scene.start('MainScene');
            _this.game.scene.stop('LoadScene');
            _this.game.scene.swapPosition('MainScene', 'LoadScene');
        }, 50);
    };
    return LoadScene;
}(Phaser.Scene));
var MainScene = /** @class */ (function (_super) {
    __extends(MainScene, _super);
    function MainScene() {
        var _this = _super.call(this, { key: "MainScene" }) || this;
        _this.mode = 0;
        _this.tokens = [];
        _this.timeHoldingHistoryKey = 0;
        _this.activeTileset = 0;
        _this.activeToken = "tkn_treasure";
        return _this;
    }
    MainScene.prototype.preload = function () {
        var _this = this;
        window.addEventListener('resize', function () {
            var frame = document.getElementById("game");
            _this.game.scale.resize(frame.offsetWidth, frame.offsetHeight);
            _this.chat.x = -10000 + _this.cameras.main.width - 309;
        });
    };
    MainScene.prototype.create = function () {
        var _this = this;
        this.snapKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.modifierKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
        this.switchModeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
        this.undoRedoKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.redoKeyWin = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);
        this.switchModeKey.addListener("down", function () { _this.mode = _this.mode == 0 ? 1 : 0; });
        this.undoRedoKey.addListener("down", function () {
            if (!_this.modifierKey.isDown)
                return;
            _this.timeHoldingHistoryKey = 0;
            _this.snapKey.isDown ? _this.history.redo() : _this.history.undo();
        });
        this.redoKeyWin.addListener("down", function () {
            _this.timeHoldingHistoryKey = 0;
            if (!_this.modifierKey.isDown)
                return;
            _this.history.redo();
        });
        this.game.renderer.addPipeline('outline', new OutlinePipeline(this.game));
        this.history = new HistoryManager(this);
        this.world = new WorldView(this);
        this.ui = new UIView(this);
        this.ui.createElements();
        this.chat = new Chat(this, -10000 + this.cameras.main.width - 309, this.cameras.main.height - 9);
        this.add.existing(this.chat);
        this.map = new Tilemap("gameMap", this, 300, 300);
        var bg = this.add.sprite(-300, 0, "cursor");
        bg.setScale(this.textures.get("tileset_16_ground").getSourceImage(0).width / 16, this.textures.get("tileset_16_ground").getSourceImage(0).height / 16);
        this.add.sprite(-300, 0, "tileset_16_ground");
        this.add.sprite(-300, 600, "tileset_16_wall");
        this.architect = new ArchitectMode(this);
        this.token = new TokenMode(this);
    };
    MainScene.prototype.update = function (time, delta) {
        this.world.update();
        this.ui.update();
        this.chat.update();
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
var UIComponent = /** @class */ (function (_super) {
    __extends(UIComponent, _super);
    function UIComponent(scene, x, y, tex) {
        var _this = _super.call(this, scene, x, y, tex) || this;
        _this.setOrigin(0, 0);
        _this.setScale(3, 3);
        _this.setPos(x * 3, y * 3);
        _this.setActive(true);
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
var UIContainer = /** @class */ (function (_super) {
    __extends(UIContainer, _super);
    function UIContainer(scene, x, y) {
        var _this = _super.call(this, scene, x, y) || this;
        _this.intersects = [];
        _this.setPos(x * 3, y * 3);
        _this.setActive(true);
        _this.scene.add.existing(_this);
        return _this;
    }
    UIContainer.prototype.setPos = function (x, y) {
        this.setPosition(x * 3, y * 3);
    };
    UIContainer.prototype.mouseIntersects = function () {
        for (var _i = 0, _a = this.list; _i < _a.length; _i++) {
            var i = _a[_i];
            if (i.mouseIntersects != null)
                if (i.mouseIntersects())
                    return true;
        }
        for (var _b = 0, _c = this.intersects; _b < _c.length; _b++) {
            var i = _c[_b];
            var pointer = this.scene.input.mousePointer;
            if (pointer.x >= this.x + i.x && pointer.y >= this.y + i.y
                && pointer.x <= this.x + i.x + i.width * i.scaleX && pointer.y <= this.y + i.y + i.height * i.scaleY)
                return true;
        }
        return false;
    };
    UIContainer.prototype.mousePos = function () {
        var pointer = this.scene.input.mousePointer;
        return new Vec2(Math.round((pointer.x - this.x) / 3), Math.round((pointer.y - this.y) / 3));
    };
    return UIContainer;
}(Phaser.GameObjects.Container));
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
var UISideMenuButton = /** @class */ (function (_super) {
    __extends(UISideMenuButton, _super);
    function UISideMenuButton(scene, x, y) {
        var _this = _super.call(this, scene, x, y, "ui_button_side_menu") || this;
        _this.scene = scene;
        _this.setActive(true);
        return _this;
    }
    UISideMenuButton.prototype.update = function () {
        if (this.mouseIntersects()) {
            if (this.scene.input.mousePointer.leftButtonDown()) {
                this.setFrame(2);
            }
            else
                this.setFrame(1);
        }
        else {
            this.setFrame(0);
        }
    };
    return UISideMenuButton;
}(UIComponent));
var UISidebar = /** @class */ (function (_super) {
    __extends(UISidebar, _super);
    function UISidebar(scene, x, y) {
        var _this = _super.call(this, scene, x, y) || this;
        _this.backgrounds = [];
        _this.elems = [];
        _this.sprites = [];
        _this.hoveredElem = null;
        _this.scene = scene;
        for (var i = 0; i < 15; i++) {
            var background = new Phaser.GameObjects.Sprite(_this.scene, 0, 21 * 3 * i, "ui_sidebar_bg", 1);
            background.setScale(3);
            background.setOrigin(0, 0);
            _this.backgrounds.push(background);
            _this.list.push(background);
        }
        _this.activeSpriteCursor = new Phaser.GameObjects.Sprite(_this.scene, 9, 9, "ui_sidebar_cursor");
        _this.activeSpriteCursor.setScale(3);
        _this.activeSpriteCursor.setOrigin(0);
        _this.list.push(_this.activeSpriteCursor);
        _this.hoverSpriteCursor = new Phaser.GameObjects.Sprite(_this.scene, 3, 3, "ui_sidebar_cursor");
        _this.hoverSpriteCursor.setScale(3);
        _this.hoverSpriteCursor.setOrigin(0);
        _this.hoverSpriteCursor.setAlpha(0.35);
        _this.hoverSpriteCursor.setVisible(false);
        _this.list.push(_this.hoverSpriteCursor);
        return _this;
    }
    UISidebar.prototype.mouseIntersects = function () {
        return (this.mousePos().x < 69);
    };
    UISidebar.prototype.update = function () {
        var hovered = undefined;
        if (this.mouseIntersects()) {
            if (this.mousePos().x % 21 >= 4 && this.mousePos().y % 21 >= 4) {
                var mousePos = this.mousePos();
                var x = Math.floor(mousePos.x / 21);
                var y = Math.floor(mousePos.y / 21);
                hovered = this.sprites[x + y * 3];
                if (hovered != undefined) {
                    this.hoverSpriteCursor.setVisible(true);
                    this.hoverSpriteCursor.setPosition(9 + x * 21 * 3, 9 + y * 21 * 3);
                }
                else {
                    this.hoverSpriteCursor.setVisible(false);
                    return;
                }
                if (hovered == undefined && this.hoveredElem != null) {
                    this.elemUnhover(this.hoveredElem.x, this.hoveredElem.y);
                    this.hoveredElem = null;
                    return;
                }
                if (this.hoveredElem != null && this.hoveredElem.x != x && this.hoveredElem.y != y)
                    this.elemUnhover(this.hoveredElem.x, this.hoveredElem.y);
                this.elemHover(x, y);
                this.hoveredElem = new Vec2(x, y);
                if (this.scene.input.mousePointer.leftButtonDown()) {
                    this.activeSpriteCursor.setPosition(9 + x * 21 * 3, 9 + y * 21 * 3);
                    this.elemClick(x, y);
                }
            }
            else {
                if (this.hoveredElem != null)
                    this.elemUnhover(this.hoveredElem.x, this.hoveredElem.y);
                this.hoveredElem = null;
                this.hoverSpriteCursor.setVisible(false);
            }
        }
        else
            this.hoverSpriteCursor.setVisible(false);
    };
    UISidebar.prototype.elemHover = function (x, y) { };
    UISidebar.prototype.elemUnhover = function (x, y) { };
    UISidebar.prototype.elemClick = function (x, y) { };
    return UISidebar;
}(UIContainer));
var UITileSelector = /** @class */ (function (_super) {
    __extends(UITileSelector, _super);
    function UITileSelector(scene, x, y) {
        var _this = _super.call(this, scene, x, y) || this;
        _this.tiles = [];
        _this.scene = scene;
        _this.background = new Phaser.GameObjects.Sprite(_this.scene, 0, 0, "ui_quick_selector");
        _this.background.setScale(3, 3);
        _this.background.setOrigin(0, 0);
        _this.intersects.push(_this.background);
        _this.add(_this.background);
        _this.selectSprite = new Phaser.GameObjects.Sprite(_this.scene, 0, 0, "cursor");
        _this.selectSprite.setScale(3, 3);
        _this.selectSprite.setOrigin(0, 0);
        _this.add(_this.selectSprite);
        _this.positionSelect(0);
        return _this;
    }
    UITileSelector.prototype.positionSelect = function (slot) {
        this.selectSprite.setPosition(12, 18 + slot * 60);
    };
    UITileSelector.prototype.update = function () {
        if (this.mouseIntersects() && this.scene.input.mousePointer.leftButtonDown()) {
            var mousePos = this.mousePos();
            if (mousePos.x < 4 || mousePos.x > 4 + 16)
                return;
            mousePos.y -= 6;
            if (mousePos.y % 20 > 16)
                return;
            var slot = Math.floor(mousePos.y / 20);
            if (slot < 0 || slot >= this.tiles.length)
                return;
            this.scene.activeTileset = this.tiles[slot];
            this.positionSelect(slot);
        }
    };
    UITileSelector.prototype.addTile = function (tile) {
        var pos = this.tiles.length;
        this.tiles.push(tile);
        var spr = new Phaser.GameObjects.Sprite(this.scene, 12 - 22 * 2, 18 - 22 * 2 + pos * 60, "tileset_" + tile);
        spr.setOrigin(0, 0);
        spr.setCrop(22, 22, 24, 24);
        spr.setScale(2);
        this.add(spr);
        this.sendToBack(spr);
        this.sendToBack(this.background);
    };
    return UITileSelector;
}(UIContainer));
var UITileSidebar = /** @class */ (function (_super) {
    __extends(UITileSidebar, _super);
    function UITileSidebar(scene, x, y) {
        var _this = _super.call(this, scene, x, y) || this;
        for (var _i = 0, WALLS_3 = WALLS; _i < WALLS_3.length; _i++) {
            var tileset = WALLS_3[_i];
            _this.addTileset(tileset.key);
        }
        for (var _a = 0, GROUNDS_3 = GROUNDS; _a < GROUNDS_3.length; _a++) {
            var tileset = GROUNDS_3[_a];
            _this.addTileset(tileset.key);
        }
        return _this;
    }
    UITileSidebar.prototype.elemClick = function (x, y) {
        console.log(this.scene.map.manager.indexes[this.elems[x + y * 3]]);
        this.scene.activeTileset = this.scene.map.manager.indexes[this.elems[x + y * 3]];
    };
    UITileSidebar.prototype.addTileset = function (tileset) {
        var p = this.elems.length;
        var x = p % 3;
        var y = Math.floor(p / 3);
        this.elems.push(tileset);
        var spr = new Phaser.GameObjects.Sprite(this.scene, 12 + x * 21 * 3 - 187, 12 + y * 21 * 3 - 2, tileset);
        spr.setOrigin(0, 0);
        spr.setCrop(112, 0, 32, 32);
        spr.setScale(1.65);
        this.sprites.push(spr);
        this.list.push(spr);
        var spr2 = new Phaser.GameObjects.Sprite(this.scene, 9 + x * 21 * 3, 9 + y * 21 * 3, "ui_sidebar_overlay");
        spr2.setScale(3);
        spr2.setOrigin(0, 0);
        this.list.push(spr2);
        this.bringToTop(this.hoverSpriteCursor);
        this.bringToTop(this.activeSpriteCursor);
    };
    return UITileSidebar;
}(UISidebar));
var UITokenSelector = /** @class */ (function (_super) {
    __extends(UITokenSelector, _super);
    function UITokenSelector(scene, x, y) {
        var _this = _super.call(this, scene, x, y) || this;
        _this.tokens = [];
        _this.scene = scene;
        _this.background = new Phaser.GameObjects.Sprite(_this.scene, 0, 0, "ui_quick_selector");
        _this.background.setScale(3, 3);
        _this.background.setOrigin(0, 0);
        _this.intersects.push(_this.background);
        _this.add(_this.background);
        _this.selectSprite = new Phaser.GameObjects.Sprite(_this.scene, 0, 0, "cursor");
        _this.selectSprite.setScale(3, 3);
        _this.selectSprite.setOrigin(0, 0);
        _this.add(_this.selectSprite);
        _this.positionSelect(0);
        return _this;
    }
    UITokenSelector.prototype.positionSelect = function (slot) {
        this.selectSprite.setPosition(12, 18 + slot * 60);
    };
    UITokenSelector.prototype.update = function () {
        if (this.mouseIntersects() && this.scene.input.mousePointer.leftButtonDown()) {
            var mousePos = this.mousePos();
            if (mousePos.x < 4 || mousePos.x > 4 + 16)
                return;
            mousePos.y -= 6;
            if (mousePos.y % 20 > 16)
                return;
            var slot = Math.floor(mousePos.y / 20);
            if (slot < 0 || slot >= this.tokens.length)
                return;
            this.scene.activeToken = this.tokens[slot];
            this.positionSelect(slot);
        }
    };
    UITokenSelector.prototype.addToken = function (sprite) {
        var pos = this.tokens.length;
        this.tokens.push(sprite);
        var spr = new Phaser.GameObjects.Sprite(this.scene, 12 - 3, 18 - 3 + pos * 60, sprite);
        spr.setOrigin(0, 0);
        spr.setScale(3);
        this.add(spr);
        this.sendToBack(spr);
        this.sendToBack(this.background);
    };
    return UITokenSelector;
}(UIContainer));
var UITokenSidebar = /** @class */ (function (_super) {
    __extends(UITokenSidebar, _super);
    function UITokenSidebar(scene, x, y) {
        var _this = _super.call(this, scene, x, y) || this;
        _this.spinTimer = 0;
        return _this;
    }
    UITokenSidebar.prototype.elemHover = function (x, y) {
        var hoveredToken = this.sprites[x + y * 3];
        this.spinTimer++;
        if (this.spinTimer > 20) {
            var frame = hoveredToken.getFrame() + 1;
            frame %= hoveredToken.frameCount();
            hoveredToken.setFrame(frame);
            this.spinTimer = 0;
        }
    };
    UITokenSidebar.prototype.elemUnhover = function (x, y) {
        this.sprites.forEach(function (t) { return t.setFrame(0); });
    };
    UITokenSidebar.prototype.elemClick = function (x, y) {
        this.scene.activeToken = this.elems[x + y * 3];
    };
    UITokenSidebar.prototype.addToken = function (sprite) {
        var p = this.elems.length;
        var x = p % 3;
        var y = Math.floor(p / 3);
        this.elems.push(sprite);
        if (x == 0)
            this.backgrounds[y].setFrame(0);
        var token = new Token(this.scene, 0, 0, sprite);
        Phaser.GameObjects.Sprite.prototype.setPosition.call(token, 12 + x * 21 * 3, 12 + y * 21 * 3);
        token.setScale(3 / 4);
        this.sprites.push(token);
        this.list.push(token);
        this.bringToTop(this.activeSpriteCursor);
        this.bringToTop(this.hoverSpriteCursor);
    };
    return UITokenSidebar;
}(UISidebar));
