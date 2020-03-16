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
var InitScene = /** @class */ (function (_super) {
    __extends(InitScene, _super);
    function InitScene() {
        return _super.call(this, { key: "InitScene" }) || this;
    }
    InitScene.prototype.preload = function () {
        this.cameras.main.setBackgroundColor("#6a655a");
        this.load.image('splash', '/res/splash.png');
        this.load.text("assets", "res/_assets.txt");
    };
    InitScene.prototype.create = function () {
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
        this.game.scene.stop('InitScene');
        this.game.scene.swapPosition('LoadScene', 'InitScene');
    };
    return InitScene;
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
        for (var _b = 0, TOKENS_1 = TOKENS; _b < TOKENS_1.length; _b++) {
            var t = TOKENS_1[_b];
            if (t.split_by != undefined)
                this.load.spritesheet(t.key, t.file + ".png", { frameWidth: t.split_by, frameHeight: t.split_by });
            else
                this.load.image(t.key, t.file + ".png");
        }
        for (var _c = 0, WALLS_1 = WALLS; _c < WALLS_1.length; _c++) {
            var t = WALLS_1[_c];
            this.load.spritesheet(t.key, t.file + ".png", { frameWidth: t.res, frameHeight: t.res });
        }
        for (var _d = 0, GROUNDS_1 = GROUNDS; _d < GROUNDS_1.length; _d++) {
            var t = GROUNDS_1[_d];
            this.load.spritesheet(t.key, t.file + ".png", { frameWidth: t.res, frameHeight: t.res });
        }
    };
    LoadScene.prototype.create = function () {
        var _this = this;
        this.cache.text.remove("assets");
        setTimeout(function () {
            _this.game.scene.start('MapScene');
            _this.game.scene.stop('LoadScene');
            _this.game.scene.swapPosition('MapScene', 'LoadScene');
        }, 50);
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
        scene: [InitScene, LoadScene, MapScene],
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
var WALLS = [
    { name: "Dungeon Wall", key: "wall_dungeon", file: "res/tileset/wall_dungeon", res: 16 },
    { name: "Wood Wall", key: "wall_wood", file: "res/tileset/wall_wood", res: 16 },
];
var GROUNDS = [
    { name: "Cave Floor", key: "ground_cave", file: "res/tileset/ground_cave", res: 16 },
    { name: "Lawn", key: "ground_wood", file: "res/tileset/ground_grass", res: 16 },
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
    { name: "Tori 5", key: "tkn_tori_5", file: "res/token/tori_5", split_by: 18 },
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
    { name: "Lich", key: "tkn_lich", file: "res/token/lich", split_by: 18 },
    { name: "Squidman", key: "tkn_squidman", file: "res/token/squidman", split_by: 18 },
    { name: "Dwarf M 1", key: "tkn_dwarf_m_1", file: "res/token/dwarf_m_1", split_by: 18 },
    { name: "Dwarf M 2", key: "tkn_dwarf_m_2", file: "res/token/dwarf_m_2", split_by: 18 },
    { name: "Skeleton", key: "tkn_skeleton", file: "res/token/skeleton", split_by: 18 },
    { name: "Tiefling 1", key: "tkn_tiefling_1", file: "res/token/tiefling_1", split_by: 18 },
    { name: "Dark Wolf", key: "tkn_wolf_dark", file: "res/token/wolf_dark", split_by: 18 },
    { name: "Light Wolf", key: "tkn_wolf_light", file: "res/token/wolf_light", split_by: 18 },
    { name: "Tan Dog", key: "tkn_tan_dog", file: "res/token/tan_dog", split_by: 18 },
    { name: "Chest", key: "tkn_chest", file: "res/token/chest", split_by: 18 },
    { name: "Mimic", key: "tkn_mimic", file: "res/token/mimic", split_by: 18 },
    { name: "Baby Tin Dragon", key: "tkn_baby_tin_dragon", file: "res/token/baby_tin_dragon", split_by: 18 },
    { name: "Baby Gold Dragon", key: "tkn_baby_gold_dragon", file: "res/token/baby_gold_dragon", split_by: 18 },
    { name: "Baby Amethyst Dragon", key: "tkn_baby_amethyst_dragon", file: "res/token/baby_amethyst_dragon", split_by: 18 },
    { name: "Baby Black Dragon", key: "tkn_baby_black_dragon", file: "res/token/baby_black_dragon", split_by: 18 },
    { name: "Baby Blue Dragon", key: "tkn_baby_blue_dragon", file: "res/token/baby_blue_dragon", split_by: 18 },
    { name: "Baby Green Dragon", key: "tkn_baby_green_dragon", file: "res/token/baby_green_dragon", split_by: 18 },
    { name: "Baby Red Dragon", key: "tkn_baby_red_dragon", file: "res/token/baby_red_dragon", split_by: 18 },
    { name: "Dino", key: "tkn_dino", file: "res/token/dino", split_by: 18 },
    { name: "Crab", key: "tkn_crab", file: "res/token/crab", split_by: 18 },
    { name: "Naexi", key: "tkn_naexi", file: "res/token/naexi_human_noweapon", split_by: 18 },
    { name: "Naexi w/ Yklwa", key: "tkn_naexi_yklwa", file: "res/token/naexi_human_yklwa", split_by: 18 },
    { name: "Naexi Anthro Form", key: "tkn_naexi_anthro", file: "res/token/naexi_anthro", split_by: 18 },
    { name: "bones", key: "tkn_bones", file: "res/token/bones" },
    { name: "treasure", key: "tkn_treasure", file: "res/token/treasure" },
];
var MapScene = /** @class */ (function (_super) {
    __extends(MapScene, _super);
    function MapScene() {
        var _this = _super.call(this, { key: "MapScene" }) || this;
        _this.mode = 0;
        _this.tokens = [];
        _this.timeHoldingHistoryKey = 0;
        _this.activeTileset = 0;
        return _this;
    }
    MapScene.prototype.preload = function () {
        var _this = this;
        window.addEventListener('resize', function () {
            var frame = document.getElementById("game");
            _this.game.scale.resize(frame.offsetWidth, frame.offsetHeight);
            _this.chat.x = -10000 + _this.cameras.main.width - 309;
        });
    };
    MapScene.prototype.create = function () {
        this.i = new InputManager(this);
        this.game.renderer.addPipeline('outline', new OutlinePipeline(this.game));
        this.game.renderer.addPipeline('brighten', new BrightenPipeline(this.game));
        this.history = new HistoryManager(this);
        this.world = new WorldView(this);
        this.ui = new UIView(this);
        this.ui.createElements();
        this.chat = new Chat(this, -10000 + this.cameras.main.width - 309, this.cameras.main.height - 9);
        this.add.existing(this.chat);
        this.map = new Tilemap("gameMap", this, 300, 300);
        this.architect = new ArchitectMode(this);
        this.token = new TokenMode(this);
    };
    MapScene.prototype.update = function (time, delta) {
        this.i.update();
        this.world.update();
        this.ui.update();
        this.chat.update();
        if (this.i.keyPressed('TAB'))
            this.mode = (this.mode == 0 ? 1 : 0);
        if (this.i.keyPressed('Z')) {
            this.timeHoldingHistoryKey = 0;
            if (!this.i.keyDown('SHIFT'))
                this.history.undo();
            else
                this.history.redo();
        }
        if (this.i.keyPressed('Y')) {
            this.timeHoldingHistoryKey = 0;
            this.history.redo();
        }
        if (this.i.keyDown('Z') || this.i.keyDown('Y')) {
            if (this.timeHoldingHistoryKey > 12 && this.timeHoldingHistoryKey % 3 == 0) {
                if (this.i.keyDown('Y') || (this.i.keyDown('Z') && this.i.keyDown('SHIFT')))
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
    return MapScene;
}(Phaser.Scene));
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
        this.shadow.y = this.height - 26;
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
    Token.prototype.setHovered = function (hovered) {
        if (this.hovered == hovered)
            return;
        this.hovered = hovered;
        if (!hovered && !this.selected) {
            this.sprite.resetPipeline();
            return;
        }
        if (!this.selected)
            this.sprite.setPipeline("brighten");
    };
    Token.prototype.setSelected = function (selected) {
        if (this.selected == selected)
            return;
        this.selected = selected;
        if (!selected) {
            if (!this.hovered)
                this.sprite.resetPipeline();
            else
                this.sprite.setPipeline("brighten");
        }
        else {
            this.sprite.setPipeline("outline");
            this.sprite.pipeline.setFloat1("tex_size", this.sprite.texture.source[0].width);
        }
    };
    Token.prototype.setPosition = function (x, y, z, w) {
        Phaser.GameObjects.Container.prototype.setPosition.call(this, x * 4, y * 4, z, w);
        return this;
    };
    Token.prototype.getPosition = function () {
        return new Vec2(this.x / 4, this.y / 4);
    };
    // Serialization Methods
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
        if (!this.scene.token.movingTokens) {
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
var HistoryElement = /** @class */ (function () {
    function HistoryElement(scene, type, data) {
        this.scene = scene;
        this.type = type;
        this.data = data;
    }
    HistoryElement.prototype.undo = function () {
        var _this = this;
        console.log("Undo", this.type);
        if (this.type == "tile") {
            for (var _i = 0, _a = this.data; _i < _a.length; _i++) {
                var tile = _a[_i];
                this.scene.map.setWall(tile.pos.x, tile.pos.y, tile.lastWall);
            }
        }
        else if (this.type == "token_modify") {
            var data = this.data;
            for (var i = 0; i < data.old.length; i++) {
                var uuid = JSON.parse(this.data.old[i]).uuid;
                var found = false;
                for (var _b = 0, _c = this.scene.tokens; _b < _c.length; _b++) {
                    var token_1 = _c[_b];
                    if (token_1.uuid == uuid) {
                        token_1.loadSerializedData(this.data.old[i]);
                        found = true;
                        break;
                    }
                }
                if (found)
                    continue;
                var token = new Token(this.scene, 0, 0, "");
                token.loadSerializedData(this.data.old[i]);
                this.scene.add.existing(token);
                this.scene.tokens.push(token);
            }
        }
        else if (this.type == "token_create") {
            var uuid = JSON.parse(this.data.data).uuid;
            for (var i = 0; i < this.scene.tokens.length; i++) {
                if (this.scene.tokens[i].uuid == uuid) {
                    this.scene.token.removeToken(this.scene.tokens[i]);
                    break;
                }
            }
        }
        else if (this.type == "token_delete") {
            this.data.data.forEach(function (ser) {
                var token = new Token(_this.scene, 0, 0, "");
                token.loadSerializedData(ser);
                _this.scene.add.existing(token);
                _this.scene.tokens.push(token);
            });
        }
    };
    HistoryElement.prototype.redo = function () {
        var _this = this;
        console.log("Redo", this.type);
        if (this.type == "tile") {
            for (var _i = 0, _a = this.data; _i < _a.length; _i++) {
                var tile = _a[_i];
                this.scene.map.setWall(tile.pos.x, tile.pos.y, tile.wall);
            }
        }
        else if (this.type == "token_modify") {
            var data = this.data;
            for (var i = 0; i < data.new.length; i++) {
                var uuid = JSON.parse(this.data.new[i]).uuid;
                var found = false;
                for (var _b = 0, _c = this.scene.tokens; _b < _c.length; _b++) {
                    var token_2 = _c[_b];
                    if (token_2.uuid == uuid) {
                        token_2.loadSerializedData(this.data.new[i]);
                        found = true;
                        break;
                    }
                }
                if (found)
                    continue;
                var token = new Token(this.scene, 0, 0, "");
                token.loadSerializedData(this.data.new[i]);
                this.scene.add.existing(token);
                this.scene.tokens.push(token);
            }
        }
        else if (this.type == "token_create") {
            var data = JSON.parse(this.data.data);
            var token = new Token(this.scene, 0, 0, "");
            token.loadSerializedData(this.data.data);
            this.scene.add.existing(token);
            this.scene.tokens.push(token);
        }
        else if (this.type == "token_delete") {
            this.data.data.forEach(function (ser) {
                var t = JSON.parse(ser);
                if (_this.scene.token.hoveredToken != null && _this.scene.token.hoveredToken.uuid == t.uuid)
                    _this.scene.token.hoveredToken = null;
                for (var i = 0; i < _this.scene.token.selectedTokens.length; i++) {
                    if (_this.scene.token.selectedTokens[i].uuid == t.uuid) {
                        _this.scene.token.selectedTokens.splice(i, 1);
                        break;
                    }
                }
                for (var i = 0; i < _this.scene.tokens.length; i++) {
                    if (_this.scene.tokens[i].uuid == t.uuid) {
                        _this.scene.tokens[i].destroy();
                        _this.scene.tokens.splice(i, 1);
                        break;
                    }
                }
            });
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
var TextInput = /** @class */ (function (_super) {
    __extends(TextInput, _super);
    function TextInput(scene, x, y) {
        var _this = _super.call(this, scene, x, y, " ", "ui_text_input") || this;
        _this.text = "";
        return _this;
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
    return TextInput;
}(ChatBox));
var UIView = /** @class */ (function () {
    function UIView(scene) {
        this.visibleMenu = 0;
        this.uiActive = false;
        this.sidebarOpen = true;
        this.scene = scene;
        this.camera = this.scene.cameras.add(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height, false, "ui_camera");
        this.camera.scrollX = -10000;
        this.o = this.scene.add.container(-10000, 0);
    }
    UIView.prototype.createElements = function () {
        this.o.add(new UISidebarToggle(this.scene, 16, 1));
        this.o.add(new UIModeSwitchButton(this.scene, 28, 1));
        this.o.add(new UIHistoryManipulation(this.scene, 43, 1));
        this.tokenSidebar = new UITokenSidebar(this.scene, -205, 0);
        this.o.add(this.tokenSidebar);
        for (var _i = 0, TOKENS_2 = TOKENS; _i < TOKENS_2.length; _i++) {
            var t = TOKENS_2[_i];
            this.tokenSidebar.addToken(t.key);
        }
        this.tileSidebar = new UITileSidebar(this.scene, 0, 0);
        this.o.add(this.tileSidebar);
        this.tokenProps = new UITokenProps(this.scene, 24, 0);
        this.tokenProps.y = this.camera.height - 400 - 9;
        this.o.add(this.tokenProps);
    };
    UIView.prototype.toggleSidebarOpen = function () {
        var _this = this;
        var sidebarOpen = !this.sidebarOpen;
        this.scene.tweens.add({
            targets: this.o,
            x: { from: (sidebarOpen ? -10204 : -10000), to: (sidebarOpen ? -10000 : -10204) },
            ease: 'Cubic',
            duration: 225,
            repeat: 0
        });
        this.scene.tweens.add({
            targets: [this.tileSidebar, this.tokenSidebar],
            alpha: { from: (sidebarOpen ? 0 : 2.5), to: (sidebarOpen ? 1 : 0) },
            ease: 'Cubic',
            duration: 225,
            repeat: 0
        });
        setTimeout(function () { return _this.sidebarOpen = sidebarOpen; }, 0); // Hack to prevent multiple UI items from triggering.
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
        this.tileSidebar.x = -205;
        this.scene.tweens.add({
            targets: this.tileSidebar,
            x: { from: -205, to: 0 },
            ease: 'Cubic',
            duration: 300,
            repeat: 0
        });
    };
    UIView.prototype.hideToken = function () {
        this.scene.tweens.add({
            targets: this.tokenSidebar,
            x: { from: 0, to: -60 },
            ease: 'Cubic',
            duration: 300,
            repeat: 0
        });
        this.scene.tweens.add({
            targets: this.tokenProps,
            alpha: 0,
            y: this.camera.height,
            ease: 'Cubic',
            duration: 300,
            repeat: 0
        });
    };
    UIView.prototype.displayToken = function () {
        this.o.bringToTop(this.tokenSidebar);
        this.tokenSidebar.x = -205;
        this.scene.tweens.add({
            targets: this.tokenSidebar,
            x: { from: -205, to: 0 },
            ease: 'Cubic',
            duration: 300,
            repeat: 0
        });
        this.o.bringToTop(this.tokenProps);
        this.scene.tweens.add({
            targets: this.tokenProps,
            alpha: 1,
            y: this.camera.height - 400 - 9,
            ease: 'Cubic',
            duration: 300,
            repeat: 0
        });
    };
    UIView.prototype.hideArchitect = function () {
        this.scene.tweens.add({
            targets: this.tileSidebar,
            x: { from: 0, to: -60 },
            ease: 'Cubic',
            duration: 300,
            repeat: 0
        });
    };
    return UIView;
}());
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
        var xO = (this.scene.ui.sidebarOpen) ? 0 : 204;
        return (pointer.x + xO >= this.x && pointer.y >= this.y && pointer.x + xO <= this.x + this.width * 3 && pointer.y <= this.y + this.height * 3);
    };
    UIComponent.prototype.mousePos = function () {
        var pointer = this.scene.input.mousePointer;
        var xO = (this.scene.ui.sidebarOpen) ? 0 : 204;
        return new Vec2(Math.round((pointer.x + xO - this.x) / 3), Math.round((pointer.y - this.y) / 3));
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
            var xO = (this.scene.ui.sidebarOpen) ? 0 : 204;
            if (pointer.x + xO >= this.x + i.x && pointer.y >= this.y + i.y
                && pointer.x + xO <= this.x + i.x + i.width * i.scaleX && pointer.y <= this.y + i.y + i.height * i.scaleY)
                return true;
        }
        return false;
    };
    UIContainer.prototype.mousePos = function () {
        var pointer = this.scene.input.mousePointer;
        var xO = (this.scene.ui.sidebarOpen) ? 0 : 204;
        return new Vec2(Math.round((pointer.x + xO - this.x) / 3), Math.round((pointer.y - this.y) / 3));
    };
    return UIContainer;
}(Phaser.GameObjects.Container));
var UIHistoryManipulation = /** @class */ (function (_super) {
    __extends(UIHistoryManipulation, _super);
    function UIHistoryManipulation(scene, x, y) {
        var _this = _super.call(this, scene, x, y, "ui_history_manipulation") || this;
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
                if (this.scene.i.mouseLeftPressed()) {
                    this.scene.history.redo();
                }
            }
            else if (this.mouseIntersects()) {
                this.setFrame(5);
                if (this.scene.i.mouseLeftPressed()) {
                    this.scene.history.undo();
                }
            }
            else
                this.setFrame(1);
        }
        else if (!hasNext && hasPrev) {
            if (this.mouseIntersects() && this.mousePos().x <= 19) {
                this.setFrame(7);
                if (this.scene.i.mouseLeftPressed()) {
                    this.scene.history.undo();
                }
            }
            else
                this.setFrame(3);
        }
        else if (hasNext && !hasPrev) {
            if (this.mouseIntersects() && this.mousePos().x > 19) {
                this.setFrame(6);
                if (this.scene.i.mouseLeftPressed()) {
                    this.scene.history.redo();
                }
            }
            else
                this.setFrame(0);
        }
        else
            this.setFrame(4);
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
                    if (this.scene.i.mouseLeftPressed())
                        this.scene.mode = 1;
                }
                else
                    this.setFrame(1);
            }
            else {
                if (this.mousePos().x <= 19) {
                    this.setFrame(3);
                    if (this.scene.i.mouseLeftPressed())
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
            if (this.scene.i.mouseLeftPressed()) {
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
        for (var i = 0; i < 30; i++) {
            var background = new Phaser.GameObjects.Sprite(_this.scene, 0, 21 * 3 * i, "ui_sidebar_bg", 1);
            background.setScale(3);
            background.setOrigin(0, 0);
            _this.backgrounds.push(background);
            _this.list.push(background);
        }
        _this.activeSpriteCursor = new Phaser.GameObjects.Sprite(_this.scene, 9, 9 + 21 * 3, "ui_sidebar_cursor");
        _this.activeSpriteCursor.setScale(3);
        _this.activeSpriteCursor.setOrigin(0);
        _this.activeSpriteCursor.setVisible(false);
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
        var hovered = null;
        if (this.mouseIntersects()) {
            if (this.mousePos().x % 21 >= 4 && this.mousePos().y % 21 >= 4) {
                var mousePos = this.mousePos();
                var x = Math.floor(mousePos.x / 21);
                var y = Math.floor(mousePos.y / 21) - 1;
                for (var i = 0; i < this.sprites.length; i++) {
                    if (Math.floor(this.sprites[i].x / 21 / 3) == x && Math.floor(this.sprites[i].y / 21 / 3) - 1 == y) {
                        hovered = this.sprites[i];
                        break;
                    }
                }
                if (hovered != null) {
                    this.hoverSpriteCursor.setVisible(true);
                    this.hoverSpriteCursor.setPosition(9 + x * 21 * 3, 9 + (y + 1) * 21 * 3);
                }
                else {
                    this.hoverSpriteCursor.setVisible(false);
                    return;
                }
                if (hovered == null && this.hoveredElem != null) {
                    this.elemUnhover(this.hoveredElem.x, this.hoveredElem.y);
                    this.hoveredElem = null;
                    return;
                }
                if (this.hoveredElem != null && this.hoveredElem.x != x && this.hoveredElem.y != y)
                    this.elemUnhover(this.hoveredElem.x, this.hoveredElem.y);
                this.elemHover(x, y);
                this.hoveredElem = new Vec2(x, y);
                if (this.scene.i.mouseLeftPressed()) {
                    this.activeSpriteCursor.setPosition(9 + x * 21 * 3, 9 + (y + 1) * 21 * 3);
                    this.activeSpriteCursor.setVisible(true);
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
var UISidebarToggle = /** @class */ (function (_super) {
    __extends(UISidebarToggle, _super);
    function UISidebarToggle(scene, x, y) {
        var _this = _super.call(this, scene, x, y, "ui_button_sidebar_toggle") || this;
        _this.scene = scene;
        _this.setActive(true);
        return _this;
    }
    UISidebarToggle.prototype.update = function () {
        if (this.mouseIntersects() && this.mousePos().x >= 20) {
            this.setFrame(2 + (this.scene.ui.sidebarOpen ? 0 : 1));
            if (this.scene.i.mouseLeftPressed())
                this.scene.ui.toggleSidebarOpen();
        }
        else
            this.setFrame(0 + (this.scene.ui.sidebarOpen ? 0 : 1));
        if (this.scene.i.keyPressed('F'))
            this.scene.ui.toggleSidebarOpen();
    };
    return UISidebarToggle;
}(UIComponent));
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
        if (this.mouseIntersects() && this.scene.i.mouseLeftPressed()) {
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
        _this.walls = [];
        _this.grounds = [];
        _this.holes = [];
        var add_wall = new Phaser.GameObjects.Sprite(_this.scene, 9 + x * 21 * 3, 9 + y * 21 * 3, "ui_sidebar_browse");
        add_wall.setName("add_wall");
        add_wall.setScale(3);
        add_wall.setOrigin(0, 0);
        _this.list.push(add_wall);
        _this.sprites.push(add_wall);
        for (var _i = 0, WALLS_2 = WALLS; _i < WALLS_2.length; _i++) {
            var tileset = WALLS_2[_i];
            _this.addWall(tileset.key);
        }
        var add_ground = new Phaser.GameObjects.Sprite(_this.scene, 9 + x * 21 * 3, 9 + y * 21 * 3, "ui_sidebar_browse");
        add_ground.setName("add_ground");
        add_ground.setScale(3);
        add_ground.setOrigin(0, 0);
        _this.list.push(add_ground);
        _this.sprites.push(add_ground);
        for (var _a = 0, GROUNDS_2 = GROUNDS; _a < GROUNDS_2.length; _a++) {
            var tileset = GROUNDS_2[_a];
            _this.addGround(tileset.key);
        }
        var add_hole = new Phaser.GameObjects.Sprite(_this.scene, 9 + x * 21 * 3, 9 + 9 * 21 * 3, "ui_sidebar_browse");
        add_hole.setName("add_hole");
        add_hole.setScale(3);
        add_hole.setOrigin(0, 0);
        _this.list.push(add_hole);
        _this.sprites.push(add_hole);
        for (var i = 0; i < 12; i++) {
            if (i % 4 != 0)
                _this.backgrounds[i].setFrame(0);
        }
        return _this;
    }
    UITileSidebar.prototype.elemClick = function (x, y) {
        if (y < 4)
            this.scene.activeTileset = this.scene.map.manager.indexes[this.walls[x + y * 3]];
        else
            this.scene.activeTileset = this.scene.map.manager.indexes[this.grounds[x + (y - 4) * 3]];
    };
    UITileSidebar.prototype.addWall = function (tileset) {
        this.addTilesetSprite(tileset, this.walls.length % 3, Math.floor(this.walls.length / 3) + 1, 17);
        this.getByName("add_wall").x = 9 + ((this.walls.length + 1) % 3 * 21 * 3);
        this.getByName("add_wall").y = 9 + (Math.floor((this.walls.length + 1) / 3 + 1) * 21 * 3);
        this.walls.push(tileset);
    };
    UITileSidebar.prototype.addGround = function (tileset) {
        this.addTilesetSprite(tileset, this.grounds.length % 3, Math.floor(this.grounds.length / 3) + 5, 13);
        this.getByName("add_ground").x = 9 + ((this.grounds.length + 1) % 3 * 21 * 3);
        this.getByName("add_ground").y = 9 + (Math.floor((this.grounds.length + 1) / 3 + 5) * 21 * 3);
        this.grounds.push(tileset);
    };
    UITileSidebar.prototype.addTilesetSprite = function (key, x, y, frame) {
        var spr = new Phaser.GameObjects.Sprite(this.scene, 12 + x * 21 * 3, 12 + y * 21 * 3, key, frame);
        spr.setOrigin(0, 0);
        spr.setScale(3);
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
var UITokenProps = /** @class */ (function (_super) {
    __extends(UITokenProps, _super);
    function UITokenProps(scene, x, y) {
        var _this = _super.call(this, scene, x, y) || this;
        var dims = new Vec2(300, 400);
        var e = new Phaser.GameObjects.Sprite(scene, 0, 0, "ui_background_9x", 0);
        e.setScale(3, 3);
        _this.add(e);
        e = new Phaser.GameObjects.Sprite(scene, 8 * 3, 0, "ui_background_9x", 1);
        e.setScale((dims.x - 16 * 3) / 8, 3);
        _this.add(e);
        e = new Phaser.GameObjects.Sprite(scene, dims.x - 8 * 3, 0, "ui_background_9x", 2);
        e.setScale(3);
        _this.add(e);
        e = new Phaser.GameObjects.Sprite(scene, 0, 8 * 3, "ui_background_9x", 3);
        e.setScale(3, (dims.y - 16 * 3) / 8);
        _this.add(e);
        e = new Phaser.GameObjects.Sprite(scene, 8 * 3, 8 * 3, "ui_background_9x", 4);
        e.setScale((dims.x - 16 * 3) / 8, (dims.y - 16 * 3) / 8);
        _this.add(e);
        e = new Phaser.GameObjects.Sprite(scene, dims.x - 8 * 3, 8 * 3, "ui_background_9x", 5);
        e.setScale(3, (dims.y - 16 * 3) / 8);
        _this.add(e);
        e = new Phaser.GameObjects.Sprite(scene, 0, (dims.y - 8 * 3), "ui_background_9x", 6);
        e.setScale(3);
        _this.add(e);
        e = new Phaser.GameObjects.Sprite(scene, 8 * 3, (dims.y - 8 * 3), "ui_background_9x", 7);
        e.setScale((dims.x - 16 * 3) / 8, 3);
        _this.add(e);
        e = new Phaser.GameObjects.Sprite(scene, dims.x - 8 * 3, (dims.y - 8 * 3), "ui_background_9x", 8);
        e.setScale(3);
        _this.add(e);
        _this.list.forEach(function (e) { return e.setOrigin(0, 0); });
        return _this;
    }
    return UITokenProps;
}(UIContainer));
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
        if (this.mouseIntersects() && this.scene.i.mouseLeftPressed()) {
            var mousePos = this.mousePos();
            if (mousePos.x < 4 || mousePos.x > 4 + 16)
                return;
            mousePos.y -= 6;
            if (mousePos.y % 20 > 16)
                return;
            var slot = Math.floor(mousePos.y / 20);
            if (slot < 0 || slot >= this.tokens.length)
                return;
            this.scene.token.selectedTokenType = this.tokens[slot];
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
        _this.cursorMode = new UIComponent(scene, 15 - 2 / 3, 1, "ui_button_select_cursor");
        _this.add(_this.cursorMode);
        return _this;
    }
    UITokenSidebar.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.scene.token.selectedTokenType == "")
            this.cursorMode.setFrame(0);
        else
            this.cursorMode.setFrame(2);
        if (this.cursorMode.mouseIntersects()) {
            this.cursorMode.setFrame(1);
            if (this.scene.i.mouseLeftPressed())
                this.toggleSelectMode(this.scene.token.selectedTokenType != "");
        }
        if (this.scene.i.keyPressed('S'))
            this.toggleSelectMode(this.scene.token.selectedTokenType != "");
    };
    UITokenSidebar.prototype.toggleSelectMode = function (select) {
        if (select) {
            this.scene.token.selectedTokenType = "";
            this.activeSpriteCursor.setVisible(false);
        }
        else {
            this.scene.token.selectedTokenType = this.elems[this.lastSelectedToken];
            this.activeSpriteCursor.setVisible(true);
        }
    };
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
        this.lastSelectedToken = x + y * 3;
        this.scene.token.selectedTokenType = this.elems[x + y * 3];
    };
    UITokenSidebar.prototype.addToken = function (sprite) {
        var p = this.elems.length;
        var x = p % 3;
        var y = Math.floor(p / 3) + 1;
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
var ArchitectMode = /** @class */ (function () {
    function ArchitectMode(scene) {
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
        if (!this.scene.i.mouseDown()) {
            if (this.scene.i.keyDown('SHIFT'))
                this.placeMode = "line";
            if (this.scene.i.keyDown('CTRL'))
                this.placeMode = "rect";
            if (!this.scene.i.keyDown('SHIFT') && this.placeMode == "line")
                this.placeMode = "brush";
            if (!this.scene.i.keyDown('CTRL') && this.placeMode == "rect")
                this.placeMode = "brush";
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
        this.primitives = [];
        this.selectedTokenType = "";
        this.hoveredToken = null;
        this.selectedTokens = [];
        this.startTilePos = null;
        this.prevSerialized = [];
        this.movingTokens = null;
        this.movedTokens = false;
        this.scene = scene;
        this.onWheel = this.onWheel.bind(this);
        document.documentElement.addEventListener("wheel", this.onWheel);
        this.scene.events.on('destroy', function () { return document.documentElement.removeEventListener("wheel", _this.onWheel); });
        // Create cursor hover sprite
        this.cursor = this.scene.add.sprite(0, 0, "cursor");
        this.cursor.setScale(4, 4);
        this.cursor.setDepth(1000);
        this.cursor.setOrigin(0, 0);
        this.cursor.setVisible(false);
        this.tokenPreview = new Token(scene, 0, 0, "");
        this.scene.add.existing(this.tokenPreview);
        this.tokenPreview.setVisible(false);
        this.tokenPreview.setAlpha(0.2);
    }
    TokenMode.prototype.onWheel = function (e) {
        if (this.movingTokens) {
            var dir_1 = e.deltaY > 0 ? 1 : -1;
            this.selectedTokens.forEach(function (token) {
                var frame = token.getFrame() + dir_1;
                if (frame < 0)
                    frame += token.frameCount();
                frame %= token.frameCount();
                token.setFrame(frame);
            });
        }
    };
    TokenMode.prototype.update = function () {
        this.active = true;
        var selectedTilePos = new Vec2(Math.floor(this.scene.world.cursorWorld.x / 64), Math.floor(this.scene.world.cursorWorld.y / 64));
        if (this.movingTokens)
            this.moving();
        if (!this.movingTokens)
            this.selecting();
        if (this.selectedTokens.length > 0 && !this.movingTokens)
            this.tokenMoveControls();
        this.tokenPreview.setPosition(selectedTilePos.x * 16, selectedTilePos.y * 16);
        this.cursor.setPosition(selectedTilePos.x * 64, selectedTilePos.y * 64);
        if (this.selectedTokenType == "")
            this.tokenPreview.setVisible(false);
        if (this.selectedTokenType != "")
            this.cursor.setVisible(false);
        if (this.selectedTokenType != "")
            this.tokenPreview.setVisible(this.hoveredToken == null);
        if (this.selectedTokenType == "")
            this.cursor.setVisible(this.hoveredToken == null);
        if (this.tokenPreview.sprite.texture.key != this.selectedTokenType)
            this.tokenPreview.setTexture(this.selectedTokenType);
    };
    TokenMode.prototype.tokenMoveControls = function () {
        if (this.scene.i.keyPressed('UP')) {
            this.moveToken(0, -16, 2);
        }
        if (this.scene.i.keyPressed('LEFT')) {
            this.moveToken(-16, 0, 1);
        }
        if (this.scene.i.keyPressed('DOWN')) {
            this.moveToken(0, 16, 0);
        }
        if (this.scene.i.keyPressed('RIGHT')) {
            this.moveToken(16, 0, 3);
        }
    };
    TokenMode.prototype.selectedIncludes = function (t) {
        for (var _i = 0, _a = this.selectedTokens; _i < _a.length; _i++) {
            var token = _a[_i];
            if (token == t)
                return true;
        }
        return false;
    };
    TokenMode.prototype.moveToken = function (x, y, frame) {
        var prevSerialized = [];
        this.selectedTokens.forEach(function (token) {
            prevSerialized.push(token.serialize());
            token.x += x * 4;
            token.y += y * 4;
            token.setFrame(frame);
        });
        var identical = true;
        var currSerialized = [];
        for (var s = 0; s < prevSerialized.length; s++) {
            currSerialized.push(this.selectedTokens[s].serialize());
            if (prevSerialized[s] != currSerialized[s])
                identical = false;
        }
        if (!identical)
            this.scene.history.push("token_modify", { old: prevSerialized, new: currSerialized });
    };
    TokenMode.prototype.selecting = function () {
        var _this = this;
        var cursor = this.scene.world.cursorWorld;
        var clickedAddedThisFrame = false;
        // Find the currently hovered token, and remove all outlines. 
        this.hoveredToken = null;
        for (var i = this.scene.tokens.length - 1; i >= 0; i--) {
            var token = this.scene.tokens[i];
            if (cursor.x >= token.x && cursor.y >= token.y && cursor.x <= token.x + token.width - 8 && cursor.y <= token.y + token.height - 8) {
                this.hoveredToken = token;
                break;
            }
        }
        // Apply outline to hovered token, remove it from non-hovered tokens
        for (var _i = 0, _a = this.scene.tokens; _i < _a.length; _i++) {
            var token = _a[_i];
            if (token != this.hoveredToken)
                token.setHovered(false);
        }
        if (this.hoveredToken != null)
            this.hoveredToken.setHovered(true);
        if (this.scene.i.mouseLeftPressed()) {
            // Start moving if left pressed down on selected token
            if (this.selectedIncludes(this.hoveredToken)) {
                this.startMovingTokens();
            }
            else if (this.hoveredToken == null) {
                // Create a new token and move
                if (this.selectedTokenType != "") {
                    var token = this.createToken();
                    if (this.scene.i.keyDown('CTRL')) {
                        if (!this.selectedIncludes(token))
                            this.selectedTokens.push(token);
                    }
                    else {
                        this.selectedTokens.forEach(function (t) { return t.setSelected(false); });
                        this.selectedTokens = [token];
                    }
                    this.clickedLastFrame = true;
                    clickedAddedThisFrame = true;
                    token.setSelected(true);
                    this.startMovingTokens();
                }
                // Start a rectangle selection
                else {
                    this.startTilePos = new Vec2(Math.floor(cursor.x / 64), Math.floor(cursor.y / 64));
                }
            }
            // Selecting existing token to move
            else if (this.hoveredToken != null) {
                if (this.scene.i.keyDown('CTRL')) {
                    this.clickedLastFrame = true;
                    clickedAddedThisFrame = true;
                    if (!this.selectedIncludes(this.hoveredToken))
                        this.selectedTokens.push(this.hoveredToken);
                    this.hoveredToken.setSelected(true);
                    this.startMovingTokens();
                }
                else {
                    this.selectedTokens.forEach(function (t) { return t.setSelected(false); });
                    this.selectedTokens = [this.hoveredToken];
                    this.clickedLastFrame = true;
                    clickedAddedThisFrame = true;
                    this.hoveredToken.setSelected(true);
                    this.startMovingTokens();
                }
            }
        }
        if (this.scene.i.mouseLeftReleased()) {
            // Deselect current token if CTRL is down, or deselect all and select current token.
            if (this.startTilePos != null) {
                this.primitives.forEach(function (v) { return v.destroy(); });
                this.primitives = [];
                var selectedTilePos = new Vec2(Math.floor(cursor.x / 64), Math.floor(cursor.y / 64));
                var a = new Vec2(Math.min(this.startTilePos.x, selectedTilePos.x), Math.min(this.startTilePos.y, selectedTilePos.y));
                var b = new Vec2(Math.max(this.startTilePos.x, selectedTilePos.x), Math.max(this.startTilePos.y, selectedTilePos.y));
                if (!this.scene.i.keyDown('CTRL')) {
                    for (var _b = 0, _c = this.selectedTokens; _b < _c.length; _b++) {
                        var s = _c[_b];
                        s.setSelected(false);
                    }
                    this.selectedTokens = [];
                }
                for (var _d = 0, _e = this.scene.tokens; _d < _e.length; _d++) {
                    var token = _e[_d];
                    var tokenTilePos = new Vec2(Math.floor(token.x / 64), Math.floor(token.y / 64));
                    if (tokenTilePos.x >= a.x && tokenTilePos.y >= a.y && tokenTilePos.x <= b.x && tokenTilePos.y <= b.y) {
                        var selected = this.scene.i.keyDown('CTRL') ? !this.selectedIncludes(token) : true;
                        token.setSelected(selected);
                        if (selected && !this.selectedIncludes(token))
                            this.selectedTokens.push(token);
                        else if (!selected && this.selectedIncludes(token)) {
                            for (var i = 0; i < this.selectedTokens.length; i++) {
                                if (this.selectedTokens[i] == token)
                                    this.selectedTokens.splice(i, 1);
                            }
                        }
                    }
                }
                this.startTilePos = null;
                this.clickedLastFrame = true;
                clickedAddedThisFrame = true;
            }
            else if (!this.movedTokens && !this.clickedLastFrame && this.selectedIncludes(this.hoveredToken)) {
                if (this.scene.i.keyDown('CTRL')) {
                    for (var i = 0; i < this.selectedTokens.length; i++) {
                        if (this.selectedTokens[i] == this.hoveredToken) {
                            this.selectedTokens[i].setSelected(false);
                            this.selectedTokens.splice(i, 1);
                            break;
                        }
                    }
                }
                else {
                    this.selectedTokens.forEach(function (t) { return t.setSelected(false); });
                    this.selectedTokens = [this.hoveredToken];
                    this.hoveredToken.setSelected(true);
                    this.startMovingTokens();
                }
            }
            this.movedTokens = false;
        }
        if (this.scene.i.keyDown('DELETE') && this.selectedTokens.length > 0) {
            var serializedData_1 = [];
            this.selectedTokens.forEach(function (t) {
                for (var i = 0; i < _this.scene.tokens.length; i++) {
                    if (_this.scene.tokens[i] == t) {
                        _this.scene.tokens.splice(i, 1);
                        break;
                    }
                }
                serializedData_1.push(t.serialize());
                if (_this.hoveredToken == t)
                    _this.hoveredToken = null;
                t.destroy();
            });
            this.selectedTokens = [];
            this.scene.history.push("token_delete", { data: serializedData_1 });
        }
        if (!clickedAddedThisFrame)
            this.clickedLastFrame = null;
        if (this.scene.i.mouseLeftDown())
            this.updateRectangleSelect();
    };
    TokenMode.prototype.updateRectangleSelect = function () {
        var cursor = this.scene.world.cursorWorld;
        var selectedTilePos = new Vec2(Math.floor(cursor.x / 64), Math.floor(cursor.y / 64));
        this.primitives.forEach(function (v) { return v.destroy(); });
        this.primitives = [];
        if (this.startTilePos != null) {
            var a = new Vec2(Math.min(this.startTilePos.x, selectedTilePos.x), Math.min(this.startTilePos.y, selectedTilePos.y));
            var b = new Vec2(Math.max(this.startTilePos.x, selectedTilePos.x), Math.max(this.startTilePos.y, selectedTilePos.y));
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
    };
    TokenMode.prototype.moving = function () {
        this.cursor.setVisible(false);
        var cursor = this.scene.world.cursorWorld;
        if (this.selectedTokens.length > 0) {
            if (!this.scene.i.mouseLeftDown()) {
                this.movingTokens = false;
                var identical = true;
                var currSerialized = [];
                for (var s = 0; s < this.selectedTokens.length; s++) {
                    currSerialized.push(this.selectedTokens[s].serialize());
                    if (this.prevSerialized[s] != currSerialized[s])
                        identical = false;
                }
                if (!identical)
                    this.scene.history.push("token_modify", { old: this.prevSerialized, new: currSerialized });
                return;
            }
            var newTileGrabPos = new Vec2(Math.floor(cursor.x / 64), Math.floor(cursor.y / 64));
            var offset_1 = new Vec2(newTileGrabPos.x - this.tileGrabPos.x, newTileGrabPos.y - this.tileGrabPos.y);
            if (offset_1.x == 0 && offset_1.y == 0)
                return;
            this.movedTokens = true;
            this.tileGrabPos = newTileGrabPos;
            this.selectedTokens.forEach(function (tkn) { return tkn.setPosition(tkn.x / 4 + offset_1.x * 16, tkn.y / 4 + offset_1.y * 16); });
        }
    };
    TokenMode.prototype.startMovingTokens = function () {
        var _this = this;
        this.movedTokens = false;
        this.movingTokens = true;
        var cursor = this.scene.world.cursorWorld;
        this.tileGrabPos = new Vec2(Math.floor(cursor.x / 64), Math.floor(cursor.y / 64));
        this.prevSerialized = [];
        this.selectedTokens.forEach(function (t) { return _this.prevSerialized.push(t.serialize()); });
    };
    TokenMode.prototype.createToken = function () {
        var token = new Token(this.scene, Math.floor(this.scene.world.cursorWorld.x / 4 / 16) * 16, Math.floor(this.scene.world.cursorWorld.y / 4 / 16) * 16, this.selectedTokenType);
        this.scene.add.existing(token);
        this.scene.tokens.push(token);
        this.scene.history.push("token_create", { data: token.serialize() });
        return token;
    };
    TokenMode.prototype.removeToken = function (t) {
        for (var i = 0; i < this.selectedTokens.length; i++)
            if (this.selectedTokens[i] == t)
                this.selectedTokens.splice(i, 1);
        for (var i = 0; i < this.scene.tokens.length; i++)
            if (this.scene.tokens[i] == t)
                this.scene.tokens.splice(i, 1);
        if (this.scene.token.hoveredToken == t)
            this.scene.token.hoveredToken = null;
        t.destroy();
    };
    TokenMode.prototype.cleanup = function () {
        if (!this.active)
            return;
        this.active = false;
        this.selectedTokens.forEach(function (t) { return t.setSelected(false); });
        this.selectedTokens = [];
        if (this.hoveredToken != null)
            this.hoveredToken.setHovered(false);
        this.hoveredToken = null;
        this.primitives.forEach(function (e) { return e.destroy(); });
        this.primitives = [];
        this.cursor.setVisible(false);
        this.tokenPreview.setVisible(false);
        this.movingTokens = false;
    };
    return TokenMode;
}());
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
        for (var _i = 0, WALLS_3 = WALLS; _i < WALLS_3.length; _i++) {
            var tileset = WALLS_3[_i];
            this.addTileset(tileset.key, 1 /* WALL */);
        }
        for (var _a = 0, GROUNDS_3 = GROUNDS; _a < GROUNDS_3.length; _a++) {
            var tileset = GROUNDS_3[_a];
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
var BrightenPipeline = /** @class */ (function (_super) {
    __extends(BrightenPipeline, _super);
    function BrightenPipeline(game) {
        var _this = this;
        var config = { game: game,
            renderer: game.renderer,
            fragShader: "\n\t\t\tprecision mediump float;\n\n\t\t\tuniform sampler2D uMainSampler;\n\n\t\t\tvarying vec2 outTexCoord;\n\t\t\t\n\t\t\tvoid main(void) {\n\t\t\t\tvec4 color  = texture2D(uMainSampler, outTexCoord);\n\t\t\t\tif (color.a == 0.0) discard;\n\t\t\t\tcolor += vec4(0.2, 0.2, 0.2, 0);\n\t\t\t\tgl_FragColor = color;\n\t\t\t}"
        };
        _this = _super.call(this, config) || this;
        return _this;
    }
    return BrightenPipeline;
}(Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline));
var OutlinePipeline = /** @class */ (function (_super) {
    __extends(OutlinePipeline, _super);
    function OutlinePipeline(game) {
        var _this = this;
        var config = { game: game,
            renderer: game.renderer,
            fragShader: "\n\t\t\tprecision mediump float;\n\n\t\t\tuniform sampler2D uMainSampler;\n\t\t\tuniform float tex_size;\n\n\t\t\tvarying vec2 outTexCoord;\n\t\t\t\n\t\t\tvoid main(void) {\n\t\t\t\tfloat factor = 1.0 / tex_size;\n\n\t\t\t\tvec4 color  = texture2D(uMainSampler, outTexCoord);\n\t\t\t\tvec4 colorU = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y + factor));\n\t\t\t\tvec4 colorD = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y - factor));\n\t\t\t\tvec4 colorL = texture2D(uMainSampler, vec2(outTexCoord.x + factor, outTexCoord.y));\n\t\t\t\tvec4 colorR = texture2D(uMainSampler, vec2(outTexCoord.x - factor, outTexCoord.y));\n\t\t\t\t\n\t\t\t\tif (color.a == 0.0 && (colorU.a != 0.0 || colorD.a != 0.0 || colorL.a != 0.0 || colorR.a != 0.0)) {\n\t\t\t\t\tgl_FragColor = vec4(1.0, 1.0, 1.0, 1);\n\t\t\t\t}\n\t\t\t\telse {\n\t\t\t\t\tif (color.a == 0.0) discard;\n\t\t\t\t\tcolor += vec4(0.1, 0.1, 0.1, 0);\n\t\t\t\t\tgl_FragColor = color;\n\t\t\t\t}\n\t\t\t\t\n\t\t\t}"
        };
        _this = _super.call(this, config) || this;
        return _this;
    }
    return OutlinePipeline;
}(Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline));
var InputManager = /** @class */ (function () {
    function InputManager(scene) {
        this.leftMouseState = false;
        this.rightMouseState = false;
        this.leftMouseStateLast = false;
        this.rightMouseStateLast = false;
        this.keys = {};
        this.keysDown = {};
        this.keysDownLast = {};
        this.scene = scene;
        this.keys.TAB = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
        this.keys.SHIFT = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.keys.CTRL = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
        this.keys.UP = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keys.DOWN = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.keys.LEFT = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keys.RIGHT = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.keys.DELETE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DELETE);
        for (var i = 0; i < 26; i++) {
            var letter = (i + 10).toString(36).toUpperCase();
            this.keys[letter] = scene.input.keyboard.addKey(letter);
        }
        for (var i = 0; i <= 9; i++) {
            this.keys[i + ""] = scene.input.keyboard.addKey(i + "");
        }
        for (var key in this.keys) {
            this.keysDown[key] = false;
            this.keysDownLast[key] = false;
        }
    }
    InputManager.prototype.update = function () {
        this.leftMouseStateLast = this.leftMouseState;
        this.leftMouseState = this.scene.input.mousePointer.leftButtonDown();
        this.rightMouseStateLast = this.rightMouseState;
        this.rightMouseState = this.scene.input.mousePointer.rightButtonDown();
        for (var key in this.keys)
            this.keysDownLast[key] = this.keysDown[key];
        for (var key in this.keys)
            this.keysDown[key] = this.keys[key].isDown;
    };
    InputManager.prototype.mouseDown = function () {
        return this.leftMouseState || this.rightMouseState;
    };
    InputManager.prototype.mousePressed = function () {
        return (this.leftMouseState && !this.leftMouseStateLast) || (this.rightMouseState && !this.rightMouseStateLast);
    };
    InputManager.prototype.mouseReleased = function () {
        return (!this.leftMouseState && this.leftMouseStateLast) || (!this.rightMouseState && this.rightMouseStateLast);
    };
    InputManager.prototype.mouseLeftDown = function () {
        return this.leftMouseState;
    };
    InputManager.prototype.mouseLeftPressed = function () {
        return this.leftMouseState && !this.leftMouseStateLast;
    };
    InputManager.prototype.mouseLeftReleased = function () {
        return !this.leftMouseState && this.leftMouseStateLast;
    };
    InputManager.prototype.mouseRightDown = function () {
        return this.rightMouseState;
    };
    InputManager.prototype.mouseRightPressed = function () {
        return this.rightMouseState && !this.rightMouseStateLast;
    };
    InputManager.prototype.mouseRightReleased = function () {
        return !this.rightMouseState && this.rightMouseStateLast;
    };
    InputManager.prototype.keyDown = function (key) {
        return this.keysDown[key.toUpperCase()];
    };
    InputManager.prototype.keyPressed = function (key) {
        return this.keysDown[key.toUpperCase()] && !this.keysDownLast[key.toUpperCase()];
    };
    InputManager.prototype.keyReleased = function (key) {
        return !this.keysDown[key.toUpperCase()] && this.keysDownLast[key.toUpperCase()];
    };
    return InputManager;
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
