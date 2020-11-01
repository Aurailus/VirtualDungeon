"use strict";
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var InitScene = /** @class */ (function (_super) {
    __extends(InitScene, _super);
    function InitScene() {
        return _super.call(this, { key: "InitScene" }) || this;
    }
    InitScene.prototype.preload = function () {
        this.cameras.main.setBackgroundColor("#090d24");
        this.load.image("logo", "/public/res/loader/logo.png");
        this.load.spritesheet("loader_filled", "/public/res/loader/loader_filled.png", { frameWidth: 18, frameHeight: 18 });
        this.load.spritesheet("loader_unfilled", "/public/res/loader/loader_unfilled.png", { frameWidth: 18, frameHeight: 18 });
        this.load.text("data", "/data/" + CAMPAIGN_NAME + "/" + MAP_NAME);
        this.load.text("assets", "/assets/" + CAMPAIGN_NAME);
    };
    InitScene.prototype.create = function () {
        this.game.scene.start('LoadScene');
        this.game.scene.stop('InitScene');
        this.game.scene.swapPosition('LoadScene', 'InitScene');
    };
    return InitScene;
}(Phaser.Scene));
var LoadScene = /** @class */ (function (_super) {
    __extends(LoadScene, _super);
    function LoadScene() {
        var _this = _super.call(this, { key: "LoadScene" }) || this;
        _this.loaderOutline = null;
        _this.loaderFilled = null;
        _this.assets = [];
        return _this;
    }
    LoadScene.prototype.setup = function () {
        var _this = this;
        this.loaderOutline = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100, "loader_unfilled", 0);
        this.loaderFilled = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100, "loader_filled", 0);
        this.loaderOutline.setScale(6);
        this.loaderFilled.setScale(6);
        this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height - 140, "logo");
        this.load.on('progress', function (val) {
            _this.loaderFilled.setCrop(0, _this.loaderFilled.height - _this.loaderFilled.height * val, _this.loaderFilled.width, _this.loaderFilled.height * val);
        });
    };
    LoadScene.prototype.preload = function () {
        var e_1, _a;
        this.setup();
        this.load.image("cursor", "/public/res/cursor.png");
        this.load.image("grid_tile", "/public/res/grid_tile.png");
        this.load.image("ui_button_grid", "/public/res/ui/button_grid.png");
        this.load.spritesheet("ui_button_side_menu", "/public/res/ui/button_side_menu.png", { frameWidth: 21, frameHeight: 18 });
        this.load.spritesheet("ui_history_manipulation", "/public/res/ui/history_manipulation.png", { frameWidth: 39, frameHeight: 18 });
        this.load.spritesheet("ui_mode_switch", "/public/res/ui/mode_switch.png", { frameWidth: 39, frameHeight: 18 });
        this.load.image("ui_quick_selector", "/public/res/ui/quick_selector.png");
        this.load.spritesheet("ui_sidebar_bg", "/public/res/ui/sidebar_bg.png", { frameWidth: 68, frameHeight: 21 });
        this.load.image("ui_sidebar_cursor", "/public/res/ui/sidebar_cursor.png");
        this.load.image("ui_sidebar_overlay", "/public/res/ui/sidebar_overlay.png");
        this.load.spritesheet("ui_button_select_cursor", "/public/res/ui/button_select_cursor.png", { frameWidth: 21, frameHeight: 18 });
        this.load.spritesheet("ui_background_9x", "/public/res/ui/background_9x.png", { frameWidth: 8, frameHeight: 8 });
        this.load.image("ui_sidebar_browse", "/public/res/ui/sidebar_browse.png");
        this.load.spritesheet("ui_button_sidebar_toggle", "/public/res/ui/button_sidebar_toggle.png", { frameWidth: 30, frameHeight: 18 });
        this.load.image("shader_light_mask", "/public/res/shader/light_mask.png");
        this.assets = JSON.parse(this.cache.text.get("assets"));
        try {
            for (var _b = __values(this.assets), _c = _b.next(); !_c.done; _c = _b.next()) {
                var asset = _c.value;
                var key = (asset.type == AssetType.WALL ? "wall_" :
                    asset.type == AssetType.GROUND ? "ground_" :
                        asset.type == AssetType.OVERLAY ? "overlay_" :
                            asset.type == AssetType.TOKEN ? "token_" : "ERR_")
                    + asset.identifier;
                asset.key = key;
                if (asset.tileSize)
                    this.load.spritesheet(key, asset.path, { frameWidth: asset.tileSize.x, frameHeight: asset.tileSize.y });
                else
                    this.load.image(key, asset.path);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    LoadScene.prototype.create = function () {
        this.game.scene.start('MapScene', this.assets);
        this.cache.text.remove("assets");
        this.game.scene.stop('LoadScene');
        this.game.scene.swapPosition('MapScene', 'LoadScene');
    };
    return LoadScene;
}(Phaser.Scene));
/// <reference path="./@types/phaser.d.ts"/>
// Prevent scrolling hotkeys as the app implements its own scrolling.
document.addEventListener('keydown', function (e) {
    if (e.ctrlKey
        && (e.which == 61 // +/= key
            || e.which == 107 // Numpad +
            || e.which == 173 // -/_ key
            || e.which == 109 // Numpad -
            || e.which == 187 // Numpad =
            || e.which == 189 // Numpad -
        ))
        e.preventDefault();
});
window.addEventListener('wheel', function (e) {
    if (e.ctrlKey)
        e.preventDefault();
}, { passive: false });
var game;
window.onload = function () {
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
};
var DNDMapper = /** @class */ (function (_super) {
    __extends(DNDMapper, _super);
    function DNDMapper(config) {
        var _this = this;
        var frame = document.getElementById("root");
        config.width = frame.offsetWidth;
        config.height = frame.offsetHeight;
        _this = _super.call(this, config) || this;
        frame.oncontextmenu = function (e) { e.preventDefault(); };
        return _this;
    }
    return DNDMapper;
}(Phaser.Game));
var AssetType;
(function (AssetType) {
    AssetType[AssetType["GROUND"] = 0] = "GROUND";
    AssetType[AssetType["WALL"] = 1] = "WALL";
    AssetType[AssetType["OVERLAY"] = 2] = "OVERLAY";
    AssetType[AssetType["TOKEN"] = 3] = "TOKEN";
})(AssetType || (AssetType = {}));
// class FogOfWar {
// 	scene: MapScene;
// 	tex: Phaser.GameObjects.RenderTexture;
// 	map: Phaser.Tilemaps.Tilemap;
// 	historyLayer: Phaser.Tilemaps.DynamicTilemapLayer;
// 	dims: Vec2;
// 	constructor(scene: MapScene, dims: Vec2) {
// 		this.scene = scene;
// 		this.dims = dims;
// 		this.tex = new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, this.dims.x*16, this.dims.y*16);
// 		this.tex.setScale(4, 4);
// 		this.tex.setAlpha(0.7);
// 		this.scene.add.existing(this.tex);
// 		// this.map = this.scene.add.tilemap(null, 16, 16, 0, 0);
// 		// this.map.addTilesetImage("history", "wall_shadow", 16, 16, 0, 0);
// 		// this.map.setLayer("history");
// 		// this.historyLayer = this.map.createBlankDynamicLayer("history", "wall_shadow", 0, 0, this.dims.x, this.dims.y, 16, 16);
// 		// this.historyLayer.setScale(4, 4);
// 		// for (let i = 0; i < this.dims.x; i++) {
// 		// 	for (let j = 0; j < this.dims.y; j++) {
// 		// 		if ((j % 2 == 0 && i % 2 == 0) || (j % 2 != 0 && i % 2 != 0)) this.historyLayer.putTileAt(0, i, j);
// 		// 	}
// 		// }
// 	}
// 	update() {
// 		let resetSquare = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, this.dims.x*16, this.dims.y*16, 0x000000);
// 		this.tex.draw(resetSquare);
// 		for (let token of this.scene.tokens) {
// 			let startTile = new Vec2(Math.floor(token.x / 64), Math.floor(token.y / 64))
// 			let points: Vec2[] = [];
// 			for (let i = 0; i < 288; i++) {
// 				let ray = new Vec2(0.5, 0.5);
// 				let dir = new Vec2(Math.cos(i * 1.25 * (Math.PI / 180)) / 32, Math.sin(i * 1.25 * (Math.PI / 180)) / 32);
// 				let dist = 0;
// 				let maxDist = 12;
// 				while (this.scene.map.getWall(Math.floor(startTile.x + ray.x), Math.floor(startTile.y + ray.y)) == -1 && 
// 					(dist = Math.sqrt(Math.pow(ray.x, 2) + Math.pow(ray.y, 2))) < maxDist) {
// 					ray.x += dir.x;
// 					ray.y += dir.y;
// 				}
// 				ray.x -= dir.x * maxDist * 2.4;
// 				ray.y -= dir.y * maxDist * 2.4;
// 				ray.x += dir.x * ((maxDist - dist) * 2.8);
// 				ray.y += dir.y * ((maxDist - dist) * 2.8);
// 				points.push(new Vec2(ray.x * 4, ray.y * 4));
// 			}
// 			let poly = new Phaser.GameObjects.Polygon(this.scene, token.x / 4, token.y / 4, points, 0xffffff, 0.4);
// 			poly.setScale(4, 4);
// 			poly.setBlendMode('ERASE');
// 			poly.setDisplayOrigin(0, 0);
// 			poly.setOrigin(0, 0);
// 			for (let i = 0; i < 10; i++) {
// 				poly.scaleX += 0.04;
// 				poly.scaleY += 0.04;
// 				// poly.x = token.x / 4 + 50 * poly.scaleX;
// 				// poly.y = token.y / 4 + 50 * poly.scaleY;
// 				this.tex.draw(poly);
// 			}
// 		}
// 	}
// }
var MapScene = /** @class */ (function (_super) {
    __extends(MapScene, _super);
    function MapScene() {
        var _this = _super.call(this, { key: "MapScene" }) || this;
        _this.assets = null;
        _this.i = new InputManager(_this);
        _this.history = new HistoryManager(_this);
        _this.view = new WorldView(_this);
        _this.ui = new UIView(_this);
        _this.architect = new ArchitectMode(_this);
        _this.token = new TokenMode(_this);
        _this.size = new Vec2();
        _this.map = new MapData(_this);
        _this.lighting = new Lighting(_this);
        _this.mode = 0;
        _this.tokens = [];
        return _this;
    }
    MapScene.prototype.init = function (assets) {
        this.assets = assets;
    };
    MapScene.prototype.preload = function () {
        var _this = this;
        window.addEventListener('resize', function () {
            var frame = document.getElementById("root");
            _this.game.scale.resize(frame.offsetWidth, frame.offsetHeight);
        });
    };
    MapScene.prototype.create = function () {
        this.game.renderer.addPipeline('outline', new OutlinePipeline(this.game));
        this.game.renderer.addPipeline('brighten', new BrightenPipeline(this.game));
        this.i.init();
        this.view.init();
        this.size = new Vec2(64, 64);
        this.map.init(this.size, this.assets);
        this.ui.init(this.assets);
        this.architect.init();
        this.token.init();
        this.lighting.init(this.size);
    };
    MapScene.prototype.update = function (time, delta) {
        this.i.update();
        this.history.update();
        this.view.update();
        this.ui.update();
        this.map.update();
        this.lighting.update();
        if (this.i.keyPressed("U")) {
            new AssetUploader(this);
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
        _this.width = 0;
        _this.height = 0;
        _this.hovered = false;
        _this.selected = false;
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
        if (!this.sprite || !this.shadow) {
            console.log("Tried to get the frame count of a Token without a sprite!");
            return;
        }
        this.sprite.setFrame(frame);
        this.shadow.setFrame(frame);
    };
    Token.prototype.getFrame = function () {
        return this.currentFrame;
    };
    Token.prototype.frameCount = function () {
        if (!this.sprite || !this.shadow) {
            console.log("Tried to get the frame count of a Token without a sprite!");
            return 0;
        }
        return Object.keys(this.sprite.texture.frames).length - 1;
    };
    Token.prototype.setHovered = function (hovered) {
        if (!this.sprite)
            return;
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
        if (!this.sprite)
            return;
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
        Phaser.GameObjects.Container.prototype.setPosition.call(this, (x || 0) * 4, (y || 0) * 4, z, w);
        return this;
    };
    Token.prototype.getPosition = function () {
        return new Vec2(this.x / 4, this.y / 4);
    };
    // Serialization Methods
    Token.prototype.serialize = function () {
        return JSON.stringify({
            uuid: this.uuid,
            sprite: this.sprite ? this.sprite.texture.key : "",
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
    }
    WorldView.prototype.init = function () {
        var _this = this;
        this.camera = this.scene.cameras.main;
        this.camera.setBackgroundColor("#090d24");
        this.scene.i.bindScrollEvent(function (delta) {
            if (!_this.scene.token.movingTokens && !_this.scene.ui.uiActive) {
                _this.zoomLevel = clamp(_this.zoomLevel + delta, 0, _this.zoomLevels.length - 1);
                _this.camera.setZoom(_this.zoomLevels[_this.zoomLevel] / 100);
            }
        });
    };
    WorldView.prototype.pan = function () {
        if (this.scene.input.activePointer.middleButtonDown()) {
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
        var e_2, _a, e_3, _b;
        var _this = this;
        console.log("Undo", this.type);
        if (this.type == "tile") {
            try {
                for (var _c = __values(this.data), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var tile = _d.value;
                    this.scene.map.setTile(tile.layer, tile.lastTile, tile.pos.x, tile.pos.y);
                    this.scene.lighting.tileUpdatedAt(tile.pos.x, tile.pos.y);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        else if (this.type == "token_modify") {
            var data = this.data;
            for (var i = 0; i < data.old.length; i++) {
                var uuid = JSON.parse(this.data.old[i]).uuid;
                var found = false;
                try {
                    for (var _e = (e_3 = void 0, __values(this.scene.tokens)), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var token_1 = _f.value;
                        if (token_1.uuid == uuid) {
                            token_1.loadSerializedData(this.data.old[i]);
                            found = true;
                            break;
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_3) throw e_3.error; }
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
        var e_4, _a, e_5, _b;
        var _this = this;
        console.log("Redo", this.type);
        if (this.type == "tile") {
            try {
                for (var _c = __values(this.data), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var tile = _d.value;
                    this.scene.map.setTile(tile.layer, tile.tile, tile.pos.x, tile.pos.y);
                    this.scene.lighting.tileUpdatedAt(tile.pos.x, tile.pos.y);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
        else if (this.type == "token_modify") {
            var data = this.data;
            for (var i = 0; i < data.new.length; i++) {
                var uuid = JSON.parse(this.data.new[i]).uuid;
                var found = false;
                try {
                    for (var _e = (e_5 = void 0, __values(this.scene.tokens)), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var token_2 = _f.value;
                        if (token_2.uuid == uuid) {
                            token_2.loadSerializedData(this.data.new[i]);
                            found = true;
                            break;
                        }
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_5) throw e_5.error; }
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
        this.timeHoldingHistoryKey = 0;
        this.scene = scene;
    }
    HistoryManager.prototype.update = function () {
        if (this.scene.i.keyPressed('Z')) {
            this.timeHoldingHistoryKey = 0;
            if (!this.scene.i.keyDown('SHIFT'))
                this.undo();
            else
                this.redo();
        }
        if (this.scene.i.keyPressed('Y')) {
            this.timeHoldingHistoryKey = 0;
            this.redo();
        }
        if (this.scene.i.keyDown('Z') || this.scene.i.keyDown('Y')) {
            if (this.timeHoldingHistoryKey > 12 && this.timeHoldingHistoryKey % 3 == 0) {
                if (this.scene.i.keyDown('Y') || (this.scene.i.keyDown('Z') && this.scene.i.keyDown('SHIFT')))
                    this.redo();
                else
                    this.undo();
            }
            this.timeHoldingHistoryKey++;
        }
        else
            this.timeHoldingHistoryKey = 0;
    };
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
var FileStatus;
(function (FileStatus) {
    FileStatus[FileStatus["ACCEPTED"] = 0] = "ACCEPTED";
    FileStatus[FileStatus["FAILED"] = 1] = "FAILED";
    FileStatus[FileStatus["TYPE_INVALID"] = 2] = "TYPE_INVALID";
    FileStatus[FileStatus["FILE_LIMIT"] = 3] = "FILE_LIMIT";
    FileStatus[FileStatus["ACCT_LIMIT"] = 4] = "ACCT_LIMIT";
})(FileStatus || (FileStatus = {}));
var uploadLimit = 2 * 1024 * 1024;
var AssetUploader = /** @class */ (function () {
    function AssetUploader(scene) {
        var _this = this;
        this.filesList = [];
        this.uploading = false;
        this.done = false;
        this.scene = scene;
        this.scene.i.setFocus(false);
        this.root = document.createElement("div");
        this.root.classList.add("modal_wrap");
        this.root.innerHTML = "\n\t\t\t<div class=\"upload_modal\">\n\t\t\t\t<h1>Upload Custom Tokens</h1>\n\t\t\t\t<form class=\"upload_form\">\n\t\t\t\t\t<input type=\"file\" name=\"upload_input\" multiple />\n\t\t\t\t\t<label>Click here or drag to upload assets.</label>\n\t\t\t\t</form>\n\t\t\t\t<div class=\"files\"></div>\n\t\t\t\t<button class=\"upload\" disabled>\n\t\t\t\t\t<p>Upload</p>\n\t\t\t\t</button>\n\t\t\t</div>";
        document.documentElement.append(this.root);
        this.fileSelector = document.querySelector("input[name=upload_input]");
        this.filesWrapper = document.querySelector(".upload_modal .files");
        this.uploadButton = document.querySelector(".upload_modal .upload");
        this.fileSelector.addEventListener("change", function (e) {
            Promise.all(Array.from(_this.fileSelector.files || []).map(function (file) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.addFileToList(file)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            }); }); }))
                .then(function () { return _this.renderFileList(); });
            _this.fileSelector.value = "";
        });
        this.uploadButton.addEventListener("click", function (e) {
            if (!_this.done) {
                _this.uploadButton.disabled = true;
                _this.uploadButton.innerHTML = "<p>Uploading</p>";
                _this.root.querySelector(".upload_form").remove();
                _this.uploading = true;
                _this.renderFileList();
                _this.initiateUpload();
            }
            else {
                _this.root.remove();
                _this.scene.i.setFocus(true);
            }
        });
    }
    AssetUploader.prototype.addFileToList = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var status = -1;
                        if (file.size > uploadLimit)
                            status = FileStatus.FILE_LIMIT;
                        else if (file.type != "image/png" && file.type != "image/jpeg")
                            status = FileStatus.TYPE_INVALID;
                        var chosenName = file.name;
                        var addFile = function (res) {
                            _this.filesList.push({
                                file: file,
                                image: res,
                                name: chosenName,
                                identifier: "",
                                status: status
                            });
                            resolve();
                        };
                        if (status == -1) {
                            chosenName = file.name.substr(0, file.name.lastIndexOf(".")).replace(/_+/g, " ")
                                .split(" ").map(function (_a) {
                                var _b = __read(_a), firstChar = _b[0], rest = _b.slice(1);
                                return firstChar.toUpperCase() + rest.join("").toLowerCase();
                            }).join(" ");
                            var reader_1 = new FileReader();
                            reader_1.readAsDataURL(file);
                            reader_1.onload = function () { return addFile(reader_1.result); };
                        }
                        else
                            addFile("");
                    })];
            });
        });
    };
    AssetUploader.prototype.initiateUpload = function () {
        var _this = this;
        setTimeout(function () {
            Promise.all(_this.filesList.map(function (file) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.uploadFile(file)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            }); }); })).then(function () {
                _this.done = true;
                _this.uploadButton.disabled = false;
                _this.uploadButton.innerHTML = "<p>Done</p>";
            });
        }, 300);
    };
    AssetUploader.prototype.uploadFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var form = new FormData();
                        var xhr = new XMLHttpRequest();
                        form.set('file', file.file);
                        form.set('name', file.name);
                        form.set('identifier', file.identifier || file.name.toLowerCase().replace(/[ -]/g, '_').replace(/[^a-zA-Z0-9_]/g, ''));
                        xhr.addEventListener("load", function (e) {
                            file.status = Number.parseInt(xhr.responseText);
                            _this.renderFileList();
                            resolve();
                        });
                        xhr.open("POST", "/assets/upload/token");
                        xhr.send(form);
                    })];
            });
        });
    };
    AssetUploader.prototype.renderFileList = function () {
        var _this = this;
        this.filesWrapper.innerHTML = "";
        var allValid = (this.filesList.length == 0 ? false : true);
        var _loop_1 = function (i) {
            var file = this_1.filesList[i];
            var errorString = file.status == FileStatus.FAILED ? "An unknown error occured." :
                file.status == FileStatus.TYPE_INVALID ? "Assets must be a JPEG or PNG." :
                    file.status == FileStatus.FILE_LIMIT ? "Assets must be less than 2 MB." :
                        file.status == FileStatus.ACCT_LIMIT ? "You've exceeded your storage limit." : "";
            var fileDiv = document.createElement("div");
            fileDiv.classList.add("upload_file");
            fileDiv.innerHTML = "\n\t\t\t\t<div class=\"upload_preview_wrap\">\n\t\t\t\t\t<div class=\"upload_preview\" style=\"background-image: url(" + file.image + ");\"></div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"input_wrap\"><input placeholder=\"Name\" name=\"name\" maxlength=32 spellcheck=\"false\"/></div>\n\t\t\t\t" + ((file.status == -1 || file.status == 0) ?
                '<div class="input_wrap"><input name="identifier" maxlength=32 spellcheck="false"/></div>' : '<p class="error">' + errorString + '</p>') + "\n\t\t\t\t<button class=\"status\" title=\"Cancel\"></button>\n\t\t\t";
            var name_1 = fileDiv.querySelector("input[name=name]");
            var identifier = fileDiv.querySelector("input[name=identifier]");
            var status_1 = fileDiv.querySelector(".status");
            name_1.value = file.name;
            if (!identifier) {
                name_1.disabled = true;
            }
            else {
                name_1.disabled = this_1.uploading;
                identifier.disabled = this_1.uploading;
                identifier.value = file.identifier;
                identifier.placeholder = file.name.toLowerCase().replace(/[ -]/g, '_').replace(/[^a-zA-Z0-9_]/g, '') || "Identifier";
                name_1.addEventListener("input", function () {
                    file.name = name_1.value;
                    if (!identifier.value)
                        identifier.placeholder = name_1.value.toLowerCase().replace(/[ -]/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
                });
                identifier.addEventListener("input", function () {
                    var start = identifier.selectionStart;
                    var end = identifier.selectionEnd;
                    var oldVal = identifier.value;
                    identifier.value = identifier.value.toLowerCase().replace(/[ -]/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
                    if (oldVal.length > identifier.value.length) {
                        start -= oldVal.length - identifier.value.length;
                        end -= oldVal.length - identifier.value.length;
                    }
                    identifier.setSelectionRange(start, end);
                    file.identifier = identifier.value;
                });
            }
            fileDiv.querySelector("button").addEventListener("click", function () {
                if (!_this.uploading && file.status != 0) {
                    _this.filesList.splice(i, 1);
                    _this.renderFileList();
                }
            });
            if (this_1.uploading && file.status == -1)
                status_1.classList.add("loading");
            else if (file.status == 0)
                status_1.classList.add("success");
            else if (file.status != -1)
                status_1.classList.add("failed");
            this_1.filesWrapper.append(fileDiv);
            if (file.status != -1)
                allValid = false;
        };
        var this_1 = this;
        for (var i = 0; i < this.filesList.length; i++) {
            _loop_1(i);
        }
        this.uploadButton.disabled = this.uploading || !allValid;
    };
    return AssetUploader;
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
        var e_6, _a;
        var y = 0;
        try {
            for (var _b = __values(this.messages), _c = _b.next(); !_c.done; _c = _b.next()) {
                var message = _c.value;
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
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
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
        var e_7, _a;
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
        try {
            for (var lines_1 = __values(lines), lines_1_1 = lines_1.next(); !lines_1_1.done; lines_1_1 = lines_1.next()) {
                var line = lines_1_1.value;
                var elem = new Phaser.GameObjects.BitmapText(this.scene, 12, 7 + i * 18, "font2x", line, this.FONT_SIZE, 0);
                elem.setScale(3, 3);
                elem.setOrigin(0, 0);
                this.list.push(elem);
                i++;
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (lines_1_1 && !lines_1_1.done && (_a = lines_1.return)) _a.call(lines_1);
            }
            finally { if (e_7) throw e_7.error; }
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
        this.camera = null;
        this.visibleMenu = 0;
        this.uiActive = false;
        this.sidebarOpen = true;
        this.scene = scene;
    }
    UIView.prototype.init = function (assets) {
        var e_8, _a;
        this.camera = this.scene.cameras.add(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height, false, "ui_camera");
        this.camera.scrollX = -10000;
        this.o = this.scene.add.container(-10000, 0);
        this.o.add(new UISidebarToggle(this.scene, 16, 1));
        this.o.add(new UIModeSwitchButton(this.scene, 28, 1));
        this.o.add(new UIHistoryManipulation(this.scene, 43, 1));
        this.tokenSidebar = new UITokenSidebar(this.scene, -205, 0);
        this.o.add(this.tokenSidebar);
        try {
            for (var _b = __values(assets.filter(function (a) { return a.type == AssetType.TOKEN; })), _c = _b.next(); !_c.done; _c = _b.next()) {
                var token = _c.value;
                this.tokenSidebar.addToken(token.key);
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_8) throw e_8.error; }
        }
        this.tileSidebar = new UITileSidebar(this.scene, 0, 0, assets);
        this.o.add(this.tileSidebar);
        this.tokenProps = new UITokenProps(this.scene, 24, 0);
        this.tokenProps.y = this.camera.height;
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
        var e_9, _a;
        if (!this.o)
            return;
        this.uiActive = false;
        try {
            for (var _b = __values(this.o.list), _c = _b.next(); !_c.done; _c = _b.next()) {
                var o = _c.value;
                o.update();
                if (!this.uiActive && o.mouseIntersects())
                    this.uiActive = true;
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_9) throw e_9.error; }
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
        if (this.scene.i.keyPressed('TAB'))
            this.scene.mode = (this.scene.mode == 0 ? 1 : 0);
        if (this.scene.mode == 0) {
            if (this.uiActive)
                this.scene.architect.cleanup();
            else {
                this.scene.architect.update();
                this.scene.token.cleanup();
            }
        }
        else {
            if (this.uiActive)
                this.scene.token.cleanup();
            else {
                this.scene.token.update();
                this.scene.architect.cleanup();
            }
        }
    };
    UIView.prototype.displayArchitect = function () {
        if (!this.o || !this.tileSidebar || !this.tokenSidebar || !this.camera)
            return;
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
        if (!this.o || !this.tileSidebar || !this.tokenSidebar || !this.camera)
            return;
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
        if (!this.o || !this.tileSidebar || !this.tokenSidebar || !this.tokenProps || !this.camera)
            return;
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
        var e_10, _a, e_11, _b;
        try {
            for (var _c = __values(this.list), _d = _c.next(); !_d.done; _d = _c.next()) {
                var i = _d.value;
                if (i.mouseIntersects != null)
                    if (i.mouseIntersects())
                        return true;
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_10) throw e_10.error; }
        }
        try {
            for (var _e = __values(this.intersects), _f = _e.next(); !_f.done; _f = _e.next()) {
                var i = _f.value;
                var pointer = this.scene.input.mousePointer;
                var xO = (this.scene.ui.sidebarOpen) ? 0 : 204;
                if (pointer.x + xO >= this.x + i.x && pointer.y >= this.y + i.y
                    && pointer.x + xO <= this.x + i.x + i.width * i.scaleX && pointer.y <= this.y + i.y + i.height * i.scaleY)
                    return true;
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_11) throw e_11.error; }
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
        _this.scrollY = 0;
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
        // Bind the scroll wheel event
        _this.onWheel = _this.onWheel.bind(_this);
        _this.scene.i.bindScrollEvent(_this.onWheel);
        return _this;
    }
    UISidebar.prototype.onWheel = function (delta) {
        if (this.scene.ui.uiActive) {
            this.scrollY = clamp(this.scrollY + delta * 63, 0, -1000);
            this.scene.tweens.add({
                targets: this,
                y: this.scrollY,
                ease: 'Cubic',
                duration: 160,
                repeat: 0
            });
        }
    };
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
// class UITileSelector extends UIContainer {
// 	scene: MapScene;
// 	background: Phaser.GameObjects.Sprite;
// 	tileSprites: Phaser.GameObjects.Sprite[];
// 	tiles: number[] = [];
// 	selectSprite: Phaser.GameObjects.Sprite;
// 	constructor(scene: MapScene, x: number, y: number) {
// 		super(scene, x, y);
// 		this.scene = scene;
// 		this.background = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "ui_quick_selector");
// 		this.background.setScale(3, 3);
// 		this.background.setOrigin(0, 0);
// 		this.intersects.push(this.background);
// 		this.add(this.background);
// 		this.selectSprite = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "cursor");
// 		this.selectSprite.setScale(3, 3);
// 		this.selectSprite.setOrigin(0, 0);
// 		this.add(this.selectSprite);
// 		this.positionSelect(0);
// 	}
// 	positionSelect(slot: number) {
// 		this.selectSprite.setPosition(12, 18 + slot*60);	
// 	}
// 	update() {
// 		if (this.mouseIntersects() && this.scene.i.mouseLeftPressed()) {
// 			let mousePos = this.mousePos();
// 			if (mousePos.x < 4 || mousePos.x > 4 + 16) return;
// 			mousePos.y -= 6;
// 			if (mousePos.y % 20 > 16) return;
// 			let slot = Math.floor(mousePos.y / 20);
// 			if (slot < 0 || slot >= this.tiles.length) return;
// 			this.scene.architect.activeTileset = this.tiles[slot];
// 			this.positionSelect(slot);
// 		}
// 	}
// 	addTile(tile: number) {
// 		let pos = this.tiles.length;
// 		this.tiles.push(tile);
// 		let spr = new Phaser.GameObjects.Sprite(this.scene, 12 - 22*2, 18 - 22*2 + pos*60, "tileset_" + tile);
// 		spr.setOrigin(0, 0);
// 		spr.setCrop(22, 22, 24, 24);
// 		spr.setScale(2);
// 		this.add(spr);
// 		this.sendToBack(spr);
// 		this.sendToBack(this.background);
// 	}
// }
var UITileSidebar = /** @class */ (function (_super) {
    __extends(UITileSidebar, _super);
    function UITileSidebar(scene, x, y, assets) {
        var e_12, _a, e_13, _b, e_14, _c;
        var _this = _super.call(this, scene, x, y) || this;
        _this.walls = [];
        _this.grounds = [];
        _this.overlays = [];
        var add_wall = new Phaser.GameObjects.Sprite(_this.scene, 9 + x * 21 * 3, 9 + y * 21 * 3, "ui_sidebar_browse");
        add_wall.setName("add_wall");
        add_wall.setScale(3);
        add_wall.setOrigin(0, 0);
        _this.list.push(add_wall);
        _this.sprites.push(add_wall);
        try {
            for (var _d = __values(assets.filter(function (a) { return a.type == AssetType.WALL; })), _e = _d.next(); !_e.done; _e = _d.next()) {
                var tileset = _e.value;
                _this.addWall(tileset.key);
            }
        }
        catch (e_12_1) { e_12 = { error: e_12_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_12) throw e_12.error; }
        }
        var add_ground = new Phaser.GameObjects.Sprite(_this.scene, 9 + x * 21 * 3, 9 + y * 21 * 3, "ui_sidebar_browse");
        add_ground.setName("add_ground");
        add_ground.setScale(3);
        add_ground.setOrigin(0, 0);
        _this.list.push(add_ground);
        _this.sprites.push(add_ground);
        try {
            for (var _f = __values(assets.filter(function (a) { return a.type == AssetType.GROUND; })), _g = _f.next(); !_g.done; _g = _f.next()) {
                var tileset = _g.value;
                _this.addGround(tileset.key);
            }
        }
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
            }
            finally { if (e_13) throw e_13.error; }
        }
        var add_overlay = new Phaser.GameObjects.Sprite(_this.scene, 9 + x * 21 * 3, 9 + 9 * 21 * 3, "ui_sidebar_browse");
        add_overlay.setName("add_overlay");
        add_overlay.setScale(3);
        add_overlay.setOrigin(0, 0);
        _this.list.push(add_overlay);
        _this.sprites.push(add_overlay);
        try {
            for (var _h = __values(assets.filter(function (a) { return a.type == AssetType.OVERLAY; })), _j = _h.next(); !_j.done; _j = _h.next()) {
                var tileset = _j.value;
                _this.addOverlay(tileset.key);
            }
        }
        catch (e_14_1) { e_14 = { error: e_14_1 }; }
        finally {
            try {
                if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
            }
            finally { if (e_14) throw e_14.error; }
        }
        for (var i = 0; i < 12; i++) {
            if (i % 4 != 0)
                _this.backgrounds[i].setFrame(0);
        }
        return _this;
    }
    UITileSidebar.prototype.elemClick = function (x, y) {
        if (y < 4) {
            this.scene.architect.activeTileset = this.scene.map.manager.indexes[this.walls[x + y * 3]];
            this.scene.architect.activeLayer = 1 /* wall */;
        }
        else if (y < 8) {
            this.scene.architect.activeTileset = this.scene.map.manager.indexes[this.grounds[x + (y - 4) * 3]];
            this.scene.architect.activeLayer = 0 /* floor */;
        }
        else {
            this.scene.architect.activeTileset = this.scene.map.manager.indexes[this.overlays[x + (y - 8) * 3]];
            this.scene.architect.activeLayer = 2 /* overlay */;
        }
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
    UITileSidebar.prototype.addOverlay = function (tileset) {
        this.addTilesetSprite(tileset, this.overlays.length % 3, Math.floor(this.overlays.length / 3) + 9, 33);
        this.getByName("add_overlay").x = 9 + ((this.overlays.length + 1) % 3 * 21 * 3);
        this.getByName("add_overlay").y = 9 + (Math.floor((this.overlays.length + 1) / 3 + 9) * 21 * 3);
        this.overlays.push(tileset);
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
// class UITokenSelector extends UIContainer {
// 	scene: MapScene;
// 	background: Phaser.GameObjects.Sprite;
// 	tokenSprites: Phaser.GameObjects.Sprite[];
// 	tokens: string[] = [];
// 	selectSprite: Phaser.GameObjects.Sprite;
// 	constructor(scene: MapScene, x: number, y: number) {
// 		super(scene, x, y);
// 		this.scene = scene;
// 		this.background = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "ui_quick_selector");
// 		this.background.setScale(3, 3);
// 		this.background.setOrigin(0, 0);
// 		this.intersects.push(this.background);
// 		this.add(this.background);
// 		this.selectSprite = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "cursor");
// 		this.selectSprite.setScale(3, 3);
// 		this.selectSprite.setOrigin(0, 0);
// 		this.add(this.selectSprite);
// 		this.positionSelect(0);
// 	}
// 	positionSelect(slot: number) {
// 		this.selectSprite.setPosition(12, 18 + slot*60);	
// 	}
// 	update() {
// 		if (this.mouseIntersects() && this.scene.i.mouseLeftPressed()) {
// 			let mousePos = this.mousePos();
// 			if (mousePos.x < 4 || mousePos.x > 4 + 16) return;
// 			mousePos.y -= 6;
// 			if (mousePos.y % 20 > 16) return;
// 			let slot = Math.floor(mousePos.y / 20);
// 			if (slot < 0 || slot >= this.tokens.length) return;
// 			this.scene.token.selectedTokenType = this.tokens[slot];
// 			this.positionSelect(slot);
// 		}
// 	}
// 	addToken(sprite: string) {
// 		let pos = this.tokens.length;
// 		this.tokens.push(sprite);
// 		let spr = new Phaser.GameObjects.Sprite(this.scene, 12 - 3, 18 - 3 + pos*60, sprite);
// 		spr.setOrigin(0, 0);
// 		spr.setScale(3);
// 		this.add(spr);
// 		this.sendToBack(spr);
// 		this.sendToBack(this.background);
// 	}
// }
var UITokenSidebar = /** @class */ (function (_super) {
    __extends(UITokenSidebar, _super);
    function UITokenSidebar(scene, x, y) {
        var _this = _super.call(this, scene, x, y) || this;
        _this.spinTimer = 0;
        _this.lastSelectedToken = 0;
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
        this.activeTileset = 0;
        this.activeLayer = 1 /* wall */;
        this.manipulated = [];
        this.scene = scene;
    }
    ArchitectMode.prototype.init = function () {
        // Create cursor hover sprite
        this.cursor = this.scene.add.sprite(0, 0, "cursor");
        this.cursor.setScale(4, 4);
        this.cursor.setDepth(1000);
        this.cursor.setOrigin(0, 0);
    };
    ArchitectMode.prototype.update = function () {
        var e_15, _a;
        this.active = true;
        this.cursor.setVisible(true);
        var selectedTilePos = new Vec2(Math.floor(this.scene.view.cursorWorld.x / 64), Math.floor(this.scene.view.cursorWorld.y / 64));
        this.cursor.setPosition(selectedTilePos.x * 64, selectedTilePos.y * 64);
        this.cursor.setVisible((selectedTilePos.x >= 0 && selectedTilePos.y >= 0 &&
            selectedTilePos.x < this.scene.map.size.x && selectedTilePos.y < this.scene.map.size.y));
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
        if (this.scene.i.mouseDown() && !this.pointerDown) {
            this.pointerDown = true;
            this.pointerPrimaryDown = this.scene.i.mouseLeftDown();
        }
        else if (!this.scene.i.mouseDown() && this.pointerDown) {
            if (this.manipulated.length != 0) {
                try {
                    for (var _b = __values(this.manipulated), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var tile = _c.value;
                        this.scene.lighting.tileUpdatedAt(tile.pos.x, tile.pos.y);
                    }
                }
                catch (e_15_1) { e_15 = { error: e_15_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_15) throw e_15.error; }
                }
                this.scene.history.push("tile", this.manipulated);
                this.manipulated = [];
            }
            this.pointerDown = false;
            this.pointerPrimaryDown = false;
        }
    };
    ArchitectMode.prototype.drawLine = function (selectedTilePos) {
        if (this.scene.i.mouseLeftDown() || this.scene.i.mouseRightDown()) {
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
        else if (!this.scene.i.mouseLeftDown() && !this.scene.i.mouseRightDown() && this.pointerDown) {
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
        if (this.scene.i.mouseLeftDown() || this.scene.i.mouseRightDown()) {
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
        else if (!this.scene.i.mouseLeftDown() && !this.scene.i.mouseRightDown() && this.pointerDown) {
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
        if (this.scene.i.mouseLeftDown() || this.scene.i.mouseRightDown()) {
            var change = new Vec2(this.scene.view.cursorWorld.x - this.scene.view.lastCursorWorld.x, this.scene.view.cursorWorld.y - this.scene.view.lastCursorWorld.y);
            var normalizeFactor = Math.sqrt(change.x * change.x + change.y * change.y);
            change.x /= normalizeFactor;
            change.y /= normalizeFactor;
            var place = new Vec2(this.scene.view.lastCursorWorld.x, this.scene.view.lastCursorWorld.y);
            while (Math.abs(this.scene.view.cursorWorld.x - place.x) >= 1 || Math.abs(this.scene.view.cursorWorld.y - place.y) >= 1) {
                this.placeTileAndPushManip(new Vec2(Math.floor(place.x / 64), Math.floor(place.y / 64)), this.scene.i.mouseLeftDown());
                place.x += change.x;
                place.y += change.y;
            }
            this.placeTileAndPushManip(new Vec2(selectedTilePos.x, selectedTilePos.y), this.scene.i.mouseLeftDown());
        }
    };
    ArchitectMode.prototype.placeTileAndPushManip = function (manipPos, solid) {
        var tile = solid ? this.activeTileset : -1;
        var layer = (tile == -1 && this.activeLayer == 0 /* floor */) ? 1 /* wall */ : this.activeLayer;
        var lastTile = this.scene.map.getTileset(layer, manipPos.x, manipPos.y);
        if (tile == lastTile)
            return;
        this.scene.map.setTile(layer, tile, manipPos.x, manipPos.y);
        this.manipulated.push({
            pos: manipPos,
            layer: layer,
            lastTile: lastTile,
            tile: tile
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
        this.active = false;
        this.primitives = [];
        this.selectedTokenType = "";
        this.hoveredToken = null;
        this.selectedTokens = [];
        this.clickedLastFrame = false;
        this.tileGrabPos = new Vec2();
        this.startTilePos = null;
        this.prevSerialized = [];
        this.movingTokens = false;
        this.movedTokens = false;
        this.scene = scene;
    }
    TokenMode.prototype.init = function () {
        var _this = this;
        // Create cursor hover sprite
        this.cursor = this.scene.add.sprite(0, 0, "cursor");
        this.cursor.setScale(4, 4);
        this.cursor.setDepth(1000);
        this.cursor.setOrigin(0, 0);
        this.cursor.setVisible(false);
        // Create token preview sprite
        this.tokenPreview = new Token(this.scene, 0, 0, "");
        this.scene.add.existing(this.tokenPreview);
        this.tokenPreview.setVisible(false);
        this.tokenPreview.setAlpha(0.2);
        // Add scroll event
        this.scene.i.bindScrollEvent(function (delta) {
            if (_this.movingTokens) {
                _this.selectedTokens.forEach(function (token) {
                    var frame = token.getFrame() + delta;
                    if (frame < 0)
                        frame += token.frameCount();
                    frame %= token.frameCount();
                    token.setFrame(frame);
                });
            }
        });
    };
    TokenMode.prototype.update = function () {
        this.active = true;
        var selectedTilePos = new Vec2(Math.floor(this.scene.view.cursorWorld.x / 64), Math.floor(this.scene.view.cursorWorld.y / 64));
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
        if (this.tokenPreview.sprite && this.tokenPreview.sprite.texture.key != this.selectedTokenType)
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
        var e_16, _a;
        if (!t)
            return false;
        try {
            for (var _b = __values(this.selectedTokens), _c = _b.next(); !_c.done; _c = _b.next()) {
                var token = _c.value;
                if (token == t)
                    return true;
            }
        }
        catch (e_16_1) { e_16 = { error: e_16_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_16) throw e_16.error; }
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
        if (!identical) {
            this.scene.history.push("token_modify", { old: prevSerialized, new: currSerialized });
        }
    };
    TokenMode.prototype.selecting = function () {
        var e_17, _a, e_18, _b, e_19, _c;
        var _this = this;
        var cursor = this.scene.view.cursorWorld;
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
        try {
            // Apply outline to hovered token, remove it from non-hovered tokens
            for (var _d = __values(this.scene.tokens), _e = _d.next(); !_e.done; _e = _d.next()) {
                var token = _e.value;
                if (token != this.hoveredToken)
                    token.setHovered(false);
            }
        }
        catch (e_17_1) { e_17 = { error: e_17_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_17) throw e_17.error; }
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
                    try {
                        for (var _f = __values(this.selectedTokens), _g = _f.next(); !_g.done; _g = _f.next()) {
                            var s = _g.value;
                            s.setSelected(false);
                        }
                    }
                    catch (e_18_1) { e_18 = { error: e_18_1 }; }
                    finally {
                        try {
                            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                        }
                        finally { if (e_18) throw e_18.error; }
                    }
                    this.selectedTokens = [];
                }
                try {
                    for (var _h = __values(this.scene.tokens), _j = _h.next(); !_j.done; _j = _h.next()) {
                        var token = _j.value;
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
                }
                catch (e_19_1) { e_19 = { error: e_19_1 }; }
                finally {
                    try {
                        if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
                    }
                    finally { if (e_19) throw e_19.error; }
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
            this.clickedLastFrame = false;
        if (this.scene.i.mouseLeftDown())
            this.updateRectangleSelect();
    };
    TokenMode.prototype.updateRectangleSelect = function () {
        var cursor = this.scene.view.cursorWorld;
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
        var cursor = this.scene.view.cursorWorld;
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
                if (!identical) {
                    this.scene.history.push("token_modify", { old: this.prevSerialized, new: currSerialized });
                }
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
        var cursor = this.scene.view.cursorWorld;
        this.tileGrabPos = new Vec2(Math.floor(cursor.x / 64), Math.floor(cursor.y / 64));
        this.prevSerialized = [];
        this.selectedTokens.forEach(function (t) { return _this.prevSerialized.push(t.serialize()); });
    };
    TokenMode.prototype.createToken = function () {
        var token = new Token(this.scene, Math.floor(this.scene.view.cursorWorld.x / 4 / 16) * 16, Math.floor(this.scene.view.cursorWorld.y / 4 / 16) * 16, this.selectedTokenType);
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
var LightChunk = /** @class */ (function () {
    function LightChunk(light, x, y) {
        this.pos = new Vec2(x, y);
        this.canvas = light.scene.add.renderTexture(x * LightChunk.CHUNK_SIZE * 4, y * LightChunk.CHUNK_SIZE * 4, LightChunk.CHUNK_SIZE, LightChunk.CHUNK_SIZE);
        this.light = light;
        this.canvas.setScale(4);
        this.canvas.setOrigin(0, 0);
        this.canvas.setAlpha(0.4);
        this.build([]);
    }
    LightChunk.prototype.build = function (sourceGfx) {
        var e_20, _a;
        // Reset
        var reset = new Phaser.GameObjects.Rectangle(this.light.scene, 0, 0, LightChunk.CHUNK_SIZE, LightChunk.CHUNK_SIZE, 0x000000);
        reset.setDisplayOrigin(0, 0);
        reset.setOrigin(0, 0);
        this.canvas.draw(reset);
        reset.destroy();
        try {
            // Draw Sources
            for (var sourceGfx_1 = __values(sourceGfx), sourceGfx_1_1 = sourceGfx_1.next(); !sourceGfx_1_1.done; sourceGfx_1_1 = sourceGfx_1.next()) {
                var source = sourceGfx_1_1.value;
                var lp = new Vec2(source.src.x - this.pos.x * LightChunk.CHUNK_SIZE, source.src.y - this.pos.y * LightChunk.CHUNK_SIZE);
                if ((lp.x + source.src.radius > 0 || lp.x - source.src.radius < LightChunk.CHUNK_SIZE) &&
                    (lp.y + source.src.radius > 0 || lp.y - source.src.radius < LightChunk.CHUNK_SIZE)) {
                    source.gfx.setPosition(lp.x - source.src.radius, lp.y - source.src.radius);
                    this.canvas.draw(source.gfx);
                }
            }
        }
        catch (e_20_1) { e_20 = { error: e_20_1 }; }
        finally {
            try {
                if (sourceGfx_1_1 && !sourceGfx_1_1.done && (_a = sourceGfx_1.return)) _a.call(sourceGfx_1);
            }
            finally { if (e_20) throw e_20.error; }
        }
    };
    LightChunk.CHUNK_SIZE = 512;
    return LightChunk;
}());
var LightSource = /** @class */ (function () {
    function LightSource(light, x, y) {
        this.radius = 32;
        this.intensity = 1.0;
        this.light = light;
        this.x = x;
        this.y = y;
    }
    LightSource.prototype.setRadius = function (radius) {
        this.radius = radius;
    };
    LightSource.prototype.setIntensity = function (intensity) {
        this.intensity = intensity;
    };
    LightSource.prototype.createGfx = function () {
        console.log('rendering gfx');
        var start = new Vec2(Math.floor(this.x / 16), Math.floor(this.y / 16));
        var points = [];
        for (var i = 0; i < 288; i++) {
            var ray = new Vec2(0.5, 0.5);
            var dir = new Vec2(Math.cos(i * 1.25 * (Math.PI / 180)) / 32, Math.sin(i * 1.25 * (Math.PI / 180)) / 32);
            var dist = 0;
            while (this.light.scene.map.getTileset(1 /* wall */, Math.floor(start.x + ray.x), Math.floor(start.y + ray.y)) == -1 &&
                (dist = Math.sqrt(Math.pow(ray.x, 2) + Math.pow(ray.y, 2))) < this.radius / 16) {
                ray.x += dir.x;
                ray.y += dir.y;
            }
            ray.x += dir.x * 0.3;
            ray.y += dir.y * 0.3;
            ray.x += dir.x * ((this.radius / 16) - dist) * 0.5;
            ray.y += dir.y * ((this.radius / 16) - dist) * 0.5;
            points.push(new Vec2(ray.x * 4, ray.y * 4));
        }
        var render = new Phaser.GameObjects.RenderTexture(this.light.scene, 0, 0, this.radius * 2, this.radius * 2);
        var gfx = new Phaser.GameObjects.Graphics(this.light.scene, { x: this.radius, y: this.radius });
        gfx.setScale(4, 4);
        gfx.fillStyle(0xffffff, this.intensity / 3);
        gfx.fillPoints(points, true);
        gfx.setAlpha(0.5);
        for (var i = 0; i < 6; i++) {
            gfx.scaleX += 0.02;
            gfx.scaleY += 0.02;
            render.draw(gfx);
        }
        var spr = new Phaser.GameObjects.Sprite(this.light.scene, 0, 0, "shader_light_mask");
        spr.setScale(this.radius / 128, this.radius / 128);
        spr.setOrigin(0, 0);
        spr.setBlendMode(Phaser.BlendModes.ERASE);
        render.draw(spr);
        spr.destroy();
        gfx.destroy();
        render.setBlendMode(Phaser.BlendModes.ERASE);
        return render;
    };
    return LightSource;
}());
var Lighting = /** @class */ (function () {
    function Lighting(scene) {
        this.size = new Vec2();
        this.chunks = [];
        this.sources = [];
        this.dirtyChunks = new Set();
        this.scene = scene;
    }
    Lighting.prototype.init = function (size) {
        this.size = size;
        for (var i = 0; i < Math.ceil(size.y / (MapChunk.CHUNK_SIZE * 2)); i++) {
            this.chunks[i] = [];
            for (var j = 0; j < Math.ceil(size.x / (MapChunk.CHUNK_SIZE * 2)); j++) {
                this.chunks[i][j] = new LightChunk(this, j, i);
            }
        }
        for (var i = 0; i < 5; i++) {
            var x = Math.floor(Math.random() * 300) * 16;
            var y = Math.floor(Math.random() * 300) * 16;
            this.addLightSource(x, y, 12 * 16, 1);
        }
    };
    Lighting.prototype.update = function () {
        var e_21, _a, e_22, _b, e_23, _c;
        if (this.dirtyChunks.size > 0) {
            var sources = new Set();
            try {
                for (var _d = __values(this.dirtyChunks), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var chunk = _e.value;
                    var chunkBounds = new Vec4(chunk.pos.x * LightChunk.CHUNK_SIZE, chunk.pos.y * LightChunk.CHUNK_SIZE, (chunk.pos.x + 1) * LightChunk.CHUNK_SIZE, (chunk.pos.y + 1) * LightChunk.CHUNK_SIZE);
                    try {
                        for (var _f = (e_22 = void 0, __values(this.sources)), _g = _f.next(); !_g.done; _g = _f.next()) {
                            var source = _g.value;
                            var sourceBounds = new Vec4(source.x - source.radius, source.y - source.radius, source.x + source.radius, source.y + source.radius);
                            if (chunkBounds.z >= sourceBounds.x && chunkBounds.x <= sourceBounds.z &&
                                chunkBounds.y <= sourceBounds.w && chunkBounds.w >= sourceBounds.y)
                                sources.add(source);
                        }
                    }
                    catch (e_22_1) { e_22 = { error: e_22_1 }; }
                    finally {
                        try {
                            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                        }
                        finally { if (e_22) throw e_22.error; }
                    }
                }
            }
            catch (e_21_1) { e_21 = { error: e_21_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_21) throw e_21.error; }
            }
            var sourceGfx = Array.from(sources).map(function (src) { return { src: src, gfx: src.createGfx() }; });
            try {
                for (var _h = __values(this.dirtyChunks), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var chunk = _j.value;
                    chunk.build(sourceGfx);
                }
            }
            catch (e_23_1) { e_23 = { error: e_23_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
                }
                finally { if (e_23) throw e_23.error; }
            }
            sourceGfx.forEach(function (s) { return s.gfx.destroy(); });
            this.dirtyChunks.clear();
        }
    };
    Lighting.prototype.tileUpdatedAt = function (x, y) {
        var e_24, _a;
        try {
            for (var _b = __values(this.sources), _c = _b.next(); !_c.done; _c = _b.next()) {
                var source = _c.value;
                if ((x * 16 >= source.x - source.radius && x * 16 <= source.x + source.radius) &&
                    (y * 16 >= source.y - source.radius && y * 16 <= source.y + source.radius)) {
                    var minChunkPos = new Vec2(clamp(Math.floor((source.x - source.radius) / LightChunk.CHUNK_SIZE), 0, this.chunks[0].length - 1), clamp(Math.floor((source.y - source.radius) / LightChunk.CHUNK_SIZE), 0, this.chunks.length - 1));
                    var maxChunkPos = new Vec2(clamp(Math.ceil((source.x + source.radius) / LightChunk.CHUNK_SIZE), 0, this.chunks[0].length - 1), clamp(Math.ceil((source.y + source.radius) / LightChunk.CHUNK_SIZE), 0, this.chunks.length - 1));
                    for (var i = minChunkPos.x; i <= maxChunkPos.x; i++) {
                        for (var j = minChunkPos.y; j <= maxChunkPos.y; j++) {
                            this.dirtyChunks.add(this.chunks[j][i]);
                        }
                    }
                }
            }
        }
        catch (e_24_1) { e_24 = { error: e_24_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_24) throw e_24.error; }
        }
    };
    Lighting.prototype.addLightSource = function (x, y, radius, intensity) {
        var s = new LightSource(this, x, y);
        if (radius !== undefined)
            s.setRadius(radius);
        if (intensity !== undefined)
            s.setIntensity(intensity);
        this.sources.push(s);
        var minChunkPos = new Vec2(clamp(Math.floor((s.x - s.radius) / LightChunk.CHUNK_SIZE), 0, this.chunks[0].length - 1), clamp(Math.floor((s.y - s.radius) / LightChunk.CHUNK_SIZE), 0, this.chunks.length - 1));
        var maxChunkPos = new Vec2(clamp(Math.ceil((s.x + s.radius) / LightChunk.CHUNK_SIZE), 0, this.chunks[0].length - 1), clamp(Math.ceil((s.y + s.radius) / LightChunk.CHUNK_SIZE), 0, this.chunks.length - 1));
        for (var i = minChunkPos.x; i <= maxChunkPos.x; i++) {
            for (var j = minChunkPos.y; j <= maxChunkPos.y; j++) {
                this.dirtyChunks.add(this.chunks[j][i]);
            }
        }
    };
    return Lighting;
}());
var MapChunk = /** @class */ (function () {
    function MapChunk(map, x, y) {
        this.dirtyList = [];
        this.fullyDirty = false;
        this.pos = new Vec2(x, y);
        this.canvas = map.scene.add.renderTexture(x * MapChunk.CHUNK_SIZE * MapChunk.TILE_SIZE * 4, y * MapChunk.CHUNK_SIZE * MapChunk.TILE_SIZE * 4, MapChunk.CHUNK_SIZE * MapChunk.TILE_SIZE, MapChunk.CHUNK_SIZE * MapChunk.TILE_SIZE);
        this.map = map;
        this.canvas.setScale(4);
        this.canvas.setOrigin(0, 0);
        for (var i = 0; i < MapChunk.CHUNK_SIZE * MapChunk.CHUNK_SIZE; i++) {
            var x_1 = i % MapChunk.CHUNK_SIZE;
            var y_1 = Math.floor(i / MapChunk.CHUNK_SIZE);
            var mX = x_1 + this.pos.x * MapChunk.CHUNK_SIZE;
            var mY = y_1 + this.pos.y * MapChunk.CHUNK_SIZE;
            if (mX >= this.map.size.x || mY >= this.map.size.y)
                continue;
            this.drawTile(x_1, y_1);
        }
    }
    MapChunk.prototype.dirty = function (pos) {
        var e_25, _a;
        if (!this.fullyDirty) {
            try {
                for (var _b = __values(this.dirtyList), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var v = _c.value;
                    if (v.equals(pos))
                        return;
                }
            }
            catch (e_25_1) { e_25 = { error: e_25_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_25) throw e_25.error; }
            }
            this.dirtyList.push(pos);
            if (this.dirtyList.length > MapChunk.DIRTY_LIMIT) {
                this.fullyDirty = true;
                this.dirtyList = [];
            }
        }
    };
    MapChunk.prototype.rebuild = function () {
        var e_26, _a;
        if (this.fullyDirty) {
            for (var i = 0; i < MapChunk.CHUNK_SIZE * MapChunk.CHUNK_SIZE; i++) {
                var x = i % MapChunk.CHUNK_SIZE;
                var y = Math.floor(i / MapChunk.CHUNK_SIZE);
                var mX = x + this.pos.x * MapChunk.CHUNK_SIZE;
                var mY = y + this.pos.y * MapChunk.CHUNK_SIZE;
                if (mX >= this.map.size.x || mY >= this.map.size.y)
                    continue;
                this.drawTile(x, y);
            }
            this.fullyDirty = false;
            return true;
        }
        if (this.dirtyList.length == 0)
            return false;
        try {
            for (var _b = __values(this.dirtyList), _c = _b.next(); !_c.done; _c = _b.next()) {
                var elem = _c.value;
                this.drawTile(elem.x, elem.y);
            }
        }
        catch (e_26_1) { e_26 = { error: e_26_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_26) throw e_26.error; }
        }
        this.dirtyList = [];
        return true;
    };
    MapChunk.prototype.drawTile = function (x, y) {
        var mX = x + this.pos.x * MapChunk.CHUNK_SIZE;
        var mY = y + this.pos.y * MapChunk.CHUNK_SIZE;
        var wallTile = this.map.getTile(1 /* wall */, mX, mY);
        if (this.map.getTileset(1 /* wall */, mX, mY) == -1 || (wallTile < 54 || wallTile > 60)) {
            this.canvas.drawFrame(this.map.manager.groundLocations[this.map.getTileset(0 /* floor */, mX, mY)].key, this.map.getTile(0 /* floor */, mX, mY), x * MapChunk.TILE_SIZE, y * MapChunk.TILE_SIZE);
            if (this.map.getTileset(2 /* overlay */, mX, mY) != -1)
                this.canvas.drawFrame(this.map.manager.overlayLocations[this.map.getTileset(2 /* overlay */, mX, mY)].key, this.map.getTile(2 /* overlay */, mX, mY), x * MapChunk.TILE_SIZE, y * MapChunk.TILE_SIZE);
        }
        if (this.map.getTileset(1 /* wall */, mX, mY) != -1)
            this.canvas.drawFrame(this.map.manager.wallLocations[this.map.getTileset(1 /* wall */, mX, mY)].key, this.map.getTile(1 /* wall */, mX, mY), x * MapChunk.TILE_SIZE, y * MapChunk.TILE_SIZE);
        if ((x % 2 == 0 && y % 2 == 0) || (x % 2 != 0 && y % 2 != 0))
            this.canvas.drawFrame('grid_tile', 0, x * MapChunk.TILE_SIZE, y * MapChunk.TILE_SIZE);
    };
    MapChunk.CHUNK_SIZE = 16;
    MapChunk.TILE_SIZE = 16;
    MapChunk.DIRTY_LIMIT = 32;
    return MapChunk;
}());
var MapData = /** @class */ (function () {
    function MapData(scene) {
        this.size = new Vec2(0, 0);
        this.savedMapData = [];
        this.layers = {};
        this.chunks = [];
        this.scene = scene;
        this.manager = new TilesetManager(scene);
    }
    MapData.prototype.init = function (size, assets) {
        this.size = size;
        this.manager.init(assets);
        this.registerLayer(0 /* floor */, function () { return Math.floor(Math.random() * 6) + 54; }, 0);
        this.registerLayer(1 /* wall */, 0, -1);
        this.registerLayer(2 /* overlay */, 0, -1);
        for (var i = 0; i < Math.ceil(size.y / MapChunk.CHUNK_SIZE); i++) {
            this.chunks[i] = [];
            for (var j = 0; j < Math.ceil(size.x / MapChunk.CHUNK_SIZE); j++) {
                this.chunks[i][j] = new MapChunk(this, j, i);
            }
        }
    };
    MapData.prototype.update = function () {
        var e_27, _a, e_28, _b;
        var start = Date.now();
        try {
            for (var _c = __values(this.chunks), _d = _c.next(); !_d.done; _d = _c.next()) {
                var arr = _d.value;
                try {
                    for (var arr_1 = (e_28 = void 0, __values(arr)), arr_1_1 = arr_1.next(); !arr_1_1.done; arr_1_1 = arr_1.next()) {
                        var chunk = arr_1_1.value;
                        chunk.rebuild();
                        if (Date.now() - start > 10)
                            break;
                    }
                }
                catch (e_28_1) { e_28 = { error: e_28_1 }; }
                finally {
                    try {
                        if (arr_1_1 && !arr_1_1.done && (_b = arr_1.return)) _b.call(arr_1);
                    }
                    finally { if (e_28) throw e_28.error; }
                }
            }
        }
        catch (e_27_1) { e_27 = { error: e_27_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_27) throw e_27.error; }
        }
        if (this.scene.i.keyPressed('S'))
            this.saveMap();
        if (this.scene.i.keyPressed('L'))
            this.loadMap(this.savedMapData);
    };
    MapData.prototype.setTile = function (layer, tileset, xx, yy) {
        var x, y;
        if (xx instanceof Vec2) {
            x = xx.x;
            y = xx.y;
        }
        else {
            x = xx;
            y = yy;
        }
        if (x < 0 || y < 0 || x >= this.size.x || y >= this.size.y)
            return false;
        var oldTileset = this.getTileset(layer, x, y);
        if (oldTileset == tileset)
            return false;
        this.setTileset(layer, x, y, tileset);
        this.smartTile(x, y);
        return true;
    };
    MapData.prototype.setTileset = function (key, x, a, b) {
        if (x instanceof Vec2)
            this.layers[key].tilesets[x.y][x.x] = a;
        else
            this.layers[key].tilesets[a][x] = b;
    };
    MapData.prototype.getTile = function (key, xx, yy) {
        var x, y;
        if (xx instanceof Vec2) {
            x = xx.x;
            y = xx.y;
        }
        else {
            x = xx;
            y = yy;
        }
        return this.layers[key].tiles[clamp(y, 0, this.size.y - 1)][clamp(x, 0, this.size.x - 1)];
    };
    MapData.prototype.getTileset = function (key, xx, yy) {
        var x, y;
        if (xx instanceof Vec2) {
            x = xx.x;
            y = xx.y;
        }
        else {
            x = xx;
            y = yy;
        }
        return this.layers[key].tilesets[clamp(y, 0, this.size.y - 1)][clamp(x, 0, this.size.x - 1)];
    };
    MapData.prototype.smartTile = function (x, y) {
        var _this = this;
        var _loop_2 = function (i) {
            var _loop_3 = function (j) {
                var solids = this_2.getTilesetsAt(1 /* wall */, i, j).map(function (i) { return i != -1; });
                var wall = SmartTiler.wall(solids, this_2.getTile(1 /* wall */, i, j));
                if (wall != -1)
                    this_2.setTileRaw(1 /* wall */, i, j, wall);
                var floor = SmartTiler.floor(solids, this_2.getTile(0 /* floor */, i, j));
                if (floor != -1)
                    this_2.setTileRaw(0 /* floor */, i, j, floor);
                var overlay = SmartTiler.overlay(this_2.getTilesetsAt(2 /* overlay */, i, j)
                    .map(function (t) { return t == _this.getTileset(2 /* overlay */, i, j); }), this_2.getTileset(2 /* overlay */, i, j));
                if (overlay != -1)
                    this_2.setTileRaw(2 /* overlay */, i, j, overlay);
            };
            for (var j = clamp(y - 1, this_2.size.y - 1, 0); j <= clamp(y + 1, this_2.size.y - 1, 0); j++) {
                _loop_3(j);
            }
        };
        var this_2 = this;
        for (var i = clamp(x - 1, this.size.x - 1, 0); i <= clamp(x + 1, this.size.x - 1, 0); i++) {
            _loop_2(i);
        }
        // this.scene.lighting.tileUpdatedAt(x, y);
    };
    MapData.prototype.setTileRaw = function (key, x, a, b, c) {
        if (x instanceof Vec2) {
            this.layers[key].tiles[x.y][x.x] = a;
            if (b !== undefined)
                this.setTileset(key, x, b);
            this.chunks[Math.floor(x.y / MapChunk.CHUNK_SIZE)][Math.floor(x.x / MapChunk.CHUNK_SIZE)]
                .dirty(new Vec2(x.x % MapChunk.CHUNK_SIZE, x.y % MapChunk.CHUNK_SIZE));
        }
        else {
            this.layers[key].tiles[a][x] = b;
            if (c !== undefined)
                this.setTileset(key, x, a, c);
            this.chunks[Math.floor(a / MapChunk.CHUNK_SIZE)][Math.floor(x / MapChunk.CHUNK_SIZE)]
                .dirty(new Vec2(x % MapChunk.CHUNK_SIZE, a % MapChunk.CHUNK_SIZE));
        }
    };
    MapData.prototype.getTilesetsAt = function (layer, x, y) {
        var tilesets = [];
        for (var i = -1; i <= 1; i++)
            for (var j = -1; j <= 1; j++)
                tilesets.push(this.getTileset(layer, clamp(x + j, 0, this.size.x - 1), clamp(y + i, 0, this.size.y - 1)));
        return tilesets;
    };
    MapData.prototype.registerLayer = function (key, startTile, startTileset) {
        if (startTile === void 0) { startTile = 0; }
        if (startTileset === void 0) { startTileset = -1; }
        var layer = {
            tiles: [],
            tilesets: []
        };
        for (var i = 0; i < this.size.y; i++) {
            layer.tiles[i] = [];
            layer.tilesets[i] = [];
            for (var j = 0; j < this.size.x; j++) {
                var tile = typeof (startTile) == "number" ? startTile : startTile();
                layer.tiles[i][j] = tile;
                layer.tilesets[i][j] = startTileset;
            }
        }
        this.layers[key] = layer;
    };
    MapData.prototype.saveMap = function () {
        var mapData = [];
        for (var k = 0; k < 3; k++) {
            var tile = 0;
            var count = 0;
            mapData[k] = [];
            for (var i = 0; i < this.size.x * this.size.y; i++) {
                var x = i % this.size.x;
                var y = Math.floor(i / this.size.x);
                if (this.getTileset(k, x, y) == tile)
                    count++;
                else {
                    if (i != 0) {
                        mapData[k].push(tile);
                        mapData[k].push(count);
                    }
                    tile = this.getTileset(k, x, y);
                    count = 1;
                }
            }
        }
        this.savedMapData = mapData;
    };
    MapData.prototype.loadMap = function (dat) {
        for (var k = 0; k < 3; k++) {
            var offset = 0;
            for (var i = 0; i < dat[k].length / 2; i++) {
                var tile = dat[k][i * 2];
                var count = dat[k][i * 2 + 1];
                for (var t = 0; t < count; t++) {
                    var x = (offset + t) % this.size.x;
                    var y = Math.floor((offset + t) / this.size.x);
                    this.setTile(k, tile, x, y);
                }
                offset += count;
            }
        }
    };
    return MapData;
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
                tile = 28;
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
    function overlay(overlays, current) {
        var TL = 0, T = 1, TR = 2, L = 3, C = 4, R = 5, BL = 6, B = 7, BR = 8;
        if (current == -1)
            return -1;
        var empty = overlays.map(function (b) { return !b; });
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
                tile = 28;
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
    SmartTiler.overlay = overlay;
    function floor(walls, current) {
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
    SmartTiler.floor = floor;
})(SmartTiler || (SmartTiler = {}));
var TilesetManager = /** @class */ (function () {
    function TilesetManager(scene) {
        this.currentWallInd = 0;
        this.currentGroundInd = 0;
        this.currentOverlayInd = 0;
        this.wallLocations = {};
        this.groundLocations = {};
        this.overlayLocations = {};
        this.indexes = {};
        this.scene = scene;
    }
    TilesetManager.prototype.init = function (assets) {
        var e_29, _a, e_30, _b, e_31, _c;
        try {
            for (var _d = __values(assets.filter(function (a) { return a.type == AssetType.WALL; })), _e = _d.next(); !_e.done; _e = _d.next()) {
                var tileset = _e.value;
                this.addTileset(tileset.key, 1 /* wall */);
            }
        }
        catch (e_29_1) { e_29 = { error: e_29_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_29) throw e_29.error; }
        }
        try {
            for (var _f = __values(assets.filter(function (a) { return a.type == AssetType.GROUND; })), _g = _f.next(); !_g.done; _g = _f.next()) {
                var tileset = _g.value;
                this.addTileset(tileset.key, 0 /* floor */);
            }
        }
        catch (e_30_1) { e_30 = { error: e_30_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
            }
            finally { if (e_30) throw e_30.error; }
        }
        try {
            for (var _h = __values(assets.filter(function (a) { return a.type == AssetType.OVERLAY; })), _j = _h.next(); !_j.done; _j = _h.next()) {
                var tileset = _j.value;
                this.addTileset(tileset.key, 2 /* overlay */);
            }
        }
        catch (e_31_1) { e_31 = { error: e_31_1 }; }
        finally {
            try {
                if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
            }
            finally { if (e_31) throw e_31.error; }
        }
    };
    TilesetManager.prototype.addTileset = function (key, layer) {
        var res = this.scene.textures.get(key).getSourceImage(0).width / 9;
        var ind = (layer == 1 /* wall */ ? this.currentWallInd : layer == 0 /* floor */ ? this.currentGroundInd : this.currentOverlayInd);
        this[layer == 1 /* wall */ ? "wallLocations" : layer == 0 /* floor */ ? "groundLocations" : "overlayLocations"][ind] = { res: res, ind: ind, key: key };
        this.indexes[key] = ind;
        layer == 1 /* wall */ ? this.currentWallInd++ :
            layer == 0 /* floor */ ? this.currentGroundInd++ :
                this.currentOverlayInd++;
    };
    return TilesetManager;
}());
var BrightenPipeline = /** @class */ (function (_super) {
    __extends(BrightenPipeline, _super);
    function BrightenPipeline(game) {
        var _this = this;
        var config = { game: game,
            renderer: game.renderer, fragShader: "\n\t\t\tprecision mediump float;\n\n\t\t\tuniform sampler2D uMainSampler;\n\n\t\t\tvarying vec2 outTexCoord;\n\t\t\t\n\t\t\tvoid main(void) {\n\t\t\t\tvec4 color  = texture2D(uMainSampler, outTexCoord);\n\t\t\t\tif (color.a == 0.0) discard;\n\t\t\t\tcolor += vec4(0.2, 0.2, 0.2, 0);\n\t\t\t\tgl_FragColor = color;\n\t\t\t}"
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
            renderer: game.renderer, fragShader: "\n\t\t\tprecision mediump float;\n\n\t\t\tuniform sampler2D uMainSampler;\n\t\t\tuniform float tex_size;\n\n\t\t\tvarying vec2 outTexCoord;\n\t\t\t\n\t\t\tvoid main(void) {\n\t\t\t\tfloat factor = 1.0 / tex_size;\n\n\t\t\t\tvec4 color  = texture2D(uMainSampler, outTexCoord);\n\t\t\t\tvec4 colorU = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y + factor));\n\t\t\t\tvec4 colorD = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y - factor));\n\t\t\t\tvec4 colorL = texture2D(uMainSampler, vec2(outTexCoord.x + factor, outTexCoord.y));\n\t\t\t\tvec4 colorR = texture2D(uMainSampler, vec2(outTexCoord.x - factor, outTexCoord.y));\n\t\t\t\t\n\t\t\t\tif (color.a == 0.0 && (colorU.a != 0.0 || colorD.a != 0.0 || colorL.a != 0.0 || colorR.a != 0.0)) {\n\t\t\t\t\tgl_FragColor = vec4(1.0, 1.0, 1.0, 1);\n\t\t\t\t}\n\t\t\t\telse {\n\t\t\t\t\tif (color.a == 0.0) discard;\n\t\t\t\t\tcolor += vec4(0.1, 0.1, 0.1, 0);\n\t\t\t\t\tgl_FragColor = color;\n\t\t\t\t}\n\t\t\t\t\n\t\t\t}"
        };
        _this = _super.call(this, config) || this;
        return _this;
    }
    return OutlinePipeline;
}(Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline));
var InputManager = /** @class */ (function () {
    function InputManager(scene) {
        this.hasFocus = true;
        this.leftMouseState = false;
        this.rightMouseState = false;
        this.middleMouseState = false;
        this.leftMouseStateLast = false;
        this.rightMouseStateLast = false;
        this.middleMouseStateLast = false;
        this.keys = {};
        this.keysDown = {};
        this.keysDownLast = {};
        this.scrollEvents = [];
        this.scene = scene;
    }
    InputManager.prototype.init = function () {
        var _this = this;
        this.keys.TAB = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
        this.keys.SHIFT = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.keys.CTRL = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
        this.keys.UP = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keys.DOWN = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.keys.LEFT = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keys.RIGHT = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.keys.DELETE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DELETE);
        for (var i = 0; i < 26; i++) {
            var letter = (i + 10).toString(36).toUpperCase();
            this.keys[letter] = this.scene.input.keyboard.addKey(letter);
        }
        for (var i = 0; i <= 9; i++) {
            this.keys[i + ""] = this.scene.input.keyboard.addKey(i + "");
        }
        for (var key in this.keys) {
            this.keysDown[key] = false;
            this.keysDownLast[key] = false;
        }
        this.onScroll = this.onScroll.bind(this);
        document.documentElement.addEventListener("wheel", this.onScroll);
        this.scene.events.on('destroy', function () { return document.documentElement.removeEventListener("wheel", _this.onScroll); });
    };
    InputManager.prototype.update = function () {
        this.leftMouseStateLast = this.leftMouseState;
        this.leftMouseState = this.scene.input.activePointer.leftButtonDown();
        this.rightMouseStateLast = this.rightMouseState;
        this.rightMouseState = this.scene.input.activePointer.rightButtonDown();
        this.middleMouseStateLast = this.middleMouseState;
        this.middleMouseState = this.scene.input.activePointer.middleButtonDown();
        for (var key in this.keys)
            this.keysDownLast[key] = this.keysDown[key];
        for (var key in this.keys)
            this.keysDown[key] = this.keys[key].isDown;
    };
    InputManager.prototype.setFocus = function (focus) {
        if (this.hasFocus != focus) {
            if (focus)
                this.scene.input.keyboard.enableGlobalCapture();
            else
                this.scene.input.keyboard.disableGlobalCapture();
        }
        this.hasFocus = focus;
    };
    InputManager.prototype.mouseDown = function () {
        if (!this.hasFocus)
            return false;
        return this.leftMouseState || this.rightMouseState;
    };
    InputManager.prototype.mousePressed = function () {
        if (!this.hasFocus)
            return false;
        return (this.leftMouseState && !this.leftMouseStateLast) || (this.rightMouseState && !this.rightMouseStateLast);
    };
    InputManager.prototype.mouseReleased = function () {
        if (!this.hasFocus)
            return false;
        return (!this.leftMouseState && this.leftMouseStateLast) || (!this.rightMouseState && this.rightMouseStateLast);
    };
    InputManager.prototype.mouseLeftDown = function () {
        if (!this.hasFocus)
            return false;
        return this.leftMouseState;
    };
    InputManager.prototype.mouseLeftPressed = function () {
        if (!this.hasFocus)
            return false;
        return this.leftMouseState && !this.leftMouseStateLast;
    };
    InputManager.prototype.mouseLeftReleased = function () {
        if (!this.hasFocus)
            return false;
        return !this.leftMouseState && this.leftMouseStateLast;
    };
    InputManager.prototype.mouseRightDown = function () {
        if (!this.hasFocus)
            return false;
        return this.rightMouseState;
    };
    InputManager.prototype.mouseRightPressed = function () {
        if (!this.hasFocus)
            return false;
        return this.rightMouseState && !this.rightMouseStateLast;
    };
    InputManager.prototype.mouseRightReleased = function () {
        if (!this.hasFocus)
            return false;
        return !this.rightMouseState && this.rightMouseStateLast;
    };
    InputManager.prototype.keyDown = function (key) {
        if (!this.hasFocus)
            return false;
        return this.keysDown[key.toUpperCase()];
    };
    InputManager.prototype.keyPressed = function (key) {
        if (!this.hasFocus)
            return false;
        return this.keysDown[key.toUpperCase()] && !this.keysDownLast[key.toUpperCase()];
    };
    InputManager.prototype.keyReleased = function (key) {
        if (!this.hasFocus)
            return false;
        return !this.keysDown[key.toUpperCase()] && this.keysDownLast[key.toUpperCase()];
    };
    InputManager.prototype.onScroll = function (e) {
        var e_32, _a;
        if (!this.hasFocus)
            return;
        var delta = e.deltaY < 0 ? 1 : -1;
        try {
            for (var _b = __values(this.scrollEvents), _c = _b.next(); !_c.done; _c = _b.next()) {
                var evt = _c.value;
                evt(delta);
            }
        }
        catch (e_32_1) { e_32 = { error: e_32_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_32) throw e_32.error; }
        }
    };
    InputManager.prototype.bindScrollEvent = function (evt) {
        this.scrollEvents.push(evt);
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
    Vec2.prototype.equals = function (o) {
        return this.x == o.x && this.y == o.y;
    };
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
    Vec3.prototype.equals = function (o) {
        return this.x == o.x && this.y == o.y && this.z == o.z;
    };
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
    Vec4.prototype.equals = function (o) {
        return this.x == o.x && this.y == o.y && this.z == o.z && this.w == o.w;
    };
    return Vec4;
}());
