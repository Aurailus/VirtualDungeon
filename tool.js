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
                this.scene.map.setSolid(tile.pos.x, tile.pos.y, tile.oldPalette, tile.oldSolid);
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
                this.scene.map.setSolid(tile.pos.x, tile.pos.y, tile.palette, tile.solid);
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
var TileMap = /** @class */ (function () {
    function TileMap(key, scene, xwid, ywid) {
        this.SOLID = 10;
        this.layers = [];
        this.key = key;
        this.scene = scene;
        this.dimensions = { x: xwid, y: ywid };
        this.solid_at = [];
        this.palette_at = [];
        for (var i = 0; i < xwid; i++) {
            this.solid_at[i] = [];
            this.palette_at[i] = [];
            for (var j = 0; j < ywid; j++) {
                this.solid_at[i][j] = false;
                this.palette_at[i][j] = 1;
            }
        }
        this.map = this.scene.add.tilemap(null, 16, 16, 0, 0);
        for (var i = 0; i < this.scene.TILESET_COUNT; i++) {
            var tileset = this.map.addTilesetImage("tileset_" + i, "tileset_" + i, 16, 16, 0, 0);
            this.layers[i] = null;
        }
        this.createLayer(0);
        this.layers[0].setInteractive();
        this.map.addTilesetImage("grid_tile", "grid_tile", 16, 16, 0, 0);
        this.map.setLayer("grid");
        var gridlayer = this.map.createBlankDynamicLayer("grid", "grid_tile", 0, 0, 50 * 16, 50 * 16, 16, 16);
        gridlayer.setScale(4, 4);
        gridlayer.setDepth(500);
        for (var i = 0; i < xwid; i++) {
            for (var j = 0; j < ywid; j++) {
                if ((j % 2 == 0 && i % 2 == 0) || (j % 2 != 0 && i % 2 != 0))
                    gridlayer.putTileAt(0, i, j);
            }
        }
        for (var x = 0; x < this.dimensions.x; x++) {
            for (var y = 0; y < this.dimensions.y; y++) {
                this.setTile(x, y, 1, 13);
            }
        }
    }
    TileMap.prototype.createLayer = function (palette) {
        this.map.setLayer("layer_" + palette);
        this.layers[palette] = this.map.createBlankDynamicLayer("layer_" + palette, "tileset_" + palette, 0, 0, 50 * 16, 50 * 16, 16, 16);
        this.layers[palette].setScale(4, 4);
        this.layers[palette].setDepth(-500 + palette);
    };
    TileMap.prototype.setSolid = function (x, y, palette, solid) {
        if (x < 0 || y < 0 || x > this.dimensions.x - 1 || y > this.dimensions.y - 1)
            return false;
        var oldPalette = this.palette_at[x][y];
        var wasSolid = this.solid_at[x][y];
        if (wasSolid == solid && palette == oldPalette)
            return false;
        this.setTile(x, y, palette, (solid ? this.SOLID : 13));
        this.calculateEdgesAround(x, y);
        return true;
    };
    TileMap.prototype.getSolid = function (x, y) {
        if (x < 0 || y < 0 || x > this.dimensions.x - 1 || y > this.dimensions.y - 1)
            return -1;
        return (this.solid_at[x][y]) ? this.palette_at[x][y] : -1;
    };
    TileMap.prototype.getPalette = function (x, y) {
        if (x < 0 || y < 0 || x > this.dimensions.x - 1 || y > this.dimensions.y - 1)
            return -1;
        return this.palette_at[x][y];
    };
    TileMap.prototype.setTile = function (x, y, palette, tid) {
        if (this.layers[palette] == null)
            this.createLayer(palette);
        this.layers[this.palette_at[x][y]].removeTileAt(x, y, true);
        this.layers[palette].putTileAt(tid, x, y);
        this.palette_at[x][y] = palette;
        this.solid_at[x][y] = tid == this.SOLID;
    };
    TileMap.prototype.calculateEdgesAround = function (x, y) {
        for (var i = clamp(x - 1, this.dimensions.x - 1, 0); i <= clamp(x + 1, this.dimensions.x - 1, 0); i++) {
            for (var j = clamp(y - 1, this.dimensions.y - 1, 0); j <= clamp(y + 1, this.dimensions.y - 1, 0); j++) {
                var tile = this.calculateEdges(i, j);
                if (tile != -1)
                    this.setTile(i, j, this.palette_at[i][j], tile);
            }
        }
    };
    TileMap.prototype.getSurroundingSolid = function (x, y) {
        var solid = [];
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                solid.push(this.getSolid(x + j, y + i) != -1);
            }
        }
        return solid;
    };
    TileMap.prototype.calculateEdges = function (x, y) {
        if (this.getSolid(x, y) != -1)
            return -1;
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
        return tile;
    };
    return TileMap;
}());
var TilesetPatcher = /** @class */ (function () {
    function TilesetPatcher(scene) {
        var renderTex = new Phaser.GameObjects.RenderTexture(scene, 0, 0, 9 * 16, 7 * 16 * 8);
        renderTex.drawFrame("tileset_0", 0, 0, 7 * 16 * 0);
        renderTex.drawFrame("tileset_1", 0, 0, 7 * 16 * 1);
        renderTex.drawFrame("tileset_2", 0, 0, 7 * 16 * 2);
        scene.add.existing(renderTex);
        // scene.textures.addRenderTexture("tileset_16x", renderTex);
        // let spr = scene.add.sprite(300, 300, "tileset_16x");
        // console.log(spr);
    }
    return TilesetPatcher;
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
        this.tileSidebar.addPalette(0);
        this.tileSidebar.addPalette(1);
        this.tileSidebar.addPalette(2);
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
        var wasSolid = this.scene.map.getSolid(manipPos.x, manipPos.y) != -1;
        var lastPalette = this.scene.map.getPalette(manipPos.x, manipPos.y);
        var changed = this.scene.map.setSolid(manipPos.x, manipPos.y, this.scene.activePalette, solid);
        if (!changed)
            return;
        this.manipulated.push({
            pos: manipPos,
            solid: solid,
            oldSolid: wasSolid,
            palette: this.scene.activePalette,
            oldPalette: lastPalette
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
        this.load.bitmapFont('font3x', '/res/font/font3.png', '/res/font/font3.fnt');
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
        _this.TILESET_COUNT = 3;
        _this.mode = 0;
        _this.tokens = [];
        _this.timeHoldingHistoryKey = 0;
        _this.activePalette = 0;
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
        this.map = new TileMap("gameMap", this, 300, 300);
        this.architect = new ArchitectMode(this);
        this.token = new TokenMode(this);
        var tileset = new TilesetPatcher(this);
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
            this.scene.activePalette = this.tiles[slot];
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
        return _super.call(this, scene, x, y) || this;
    }
    UITileSidebar.prototype.elemClick = function (x, y) {
        this.scene.activePalette = this.elems[x + y * 3];
    };
    UITileSidebar.prototype.addPalette = function (tile) {
        var p = this.elems.length;
        var x = p % 3;
        var y = Math.floor(p / 3);
        this.elems.push(tile);
        var spr = new Phaser.GameObjects.Sprite(this.scene, 12 + x * 21 * 3 - 22 * 2, 12 + y * 21 * 3 - 22 * 2, "tileset_" + tile);
        spr.setOrigin(0, 0);
        spr.setCrop(21, 21, 26, 26);
        spr.setScale(2);
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
