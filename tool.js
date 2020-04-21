class InitScene extends Phaser.Scene {
    constructor() {
        super({ key: "InitScene" });
    }
    preload() {
        this.cameras.main.setBackgroundColor("#090d24");
        this.load.text("assets", "res/_assets.txt");
        this.load.bitmapFont('font1x', '/res/font/font1.png', '/res/font/font1.fnt');
        this.load.bitmapFont('font2x', '/res/font/font2.png', '/res/font/font2.fnt');
        this.load.image("logo", "res/loader/logo.png");
        this.load.spritesheet("loader_filled", "res/loader/loader_filled.png", { frameWidth: 18, frameHeight: 18 });
        this.load.spritesheet("loader_unfilled", "res/loader/loader_unfilled.png", { frameWidth: 18, frameHeight: 18 });
    }
    create() {
        let assets = this.cache.text.get("assets");
        let lines = assets.split("\n");
        let assetsParsed = "";
        let prefixes = {};
        lines.forEach((v) => {
            if (v.substr(0, "FOLDERPREFIX".length) == "FOLDERPREFIX") {
                let tokens = v.split(" ");
                prefixes[tokens[1]] = tokens[2];
                return;
            }
            if (v.length == 0)
                return;
            let slash = v.indexOf('/');
            let prefix = "";
            if (slash != -1 && prefixes[v.substr(0, slash)] != undefined)
                prefix = prefixes[v.substr(0, slash)];
            if (slash == -1)
                assetsParsed += `${v.split(" ")[0]} ${v}\n`;
            else
                assetsParsed += `${prefix}${v.substring(slash + 1, v.length).split(" ")[0]} ${v}\n`;
        });
        this.cache.text.remove("assets");
        this.cache.text.add("assets", assetsParsed);
        this.game.scene.start('LoadScene');
        this.game.scene.stop('InitScene');
        this.game.scene.swapPosition('LoadScene', 'InitScene');
    }
}
class LoadScene extends Phaser.Scene {
    constructor() {
        super({ key: "LoadScene" });
        this.patching = null;
        this.loadedTween = 0;
        this.preloading = true;
        this.spinTimer = 0;
        this.spinFrame = 0;
    }
    preload() {
        this.cameras.main.setBackgroundColor("#090d24");
        this.loaderOutline = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100, "loader_unfilled", 0);
        this.loaderOutline.setScale(6);
        this.loaderFilled = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100, "loader_filled", 0);
        this.loaderFilled.setScale(6);
        this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height - 140, "logo");
        this.text = this.add.bitmapText(this.cameras.main.width / 2 - 130, this.cameras.main.height / 2 - 20, "font2x", "Loading Assets...", 22, 1);
        this.load.on('progress', (val) => {
            this.tweens.add({
                targets: this,
                loadedTween: val,
                ease: 'Cubic',
                duration: 150,
                repeat: 0
            });
        });
        this.pre_update();
        this.loadAssets();
    }
    pre_update() {
        if (!this.preloading)
            return;
        this.loaderFilled.setCrop(0, this.loaderFilled.height - this.loaderFilled.height * this.loadedTween, this.loaderFilled.width, this.loaderFilled.height * this.loadedTween);
        this.spinTimer++;
        if (this.spinTimer > 80 - this.loadedTween * 70) {
            this.spinTimer = 0;
            this.spinFrame = (this.spinFrame + 1) % 4;
            this.loaderOutline.setFrame(this.spinFrame);
            this.loaderFilled.setFrame(this.spinFrame);
        }
        if (this.preloading)
            setTimeout(this.pre_update.bind(this), 1 / 60);
    }
    loadAssets() {
        this.load.image("loader_patching", "/res/loader/loader_patching.png");
        for (let s of this.cache.text.get("assets").split("\n")) {
            let tokens = s.split(" ");
            if (tokens.length == 2)
                this.load.image(tokens[0], "/res/" + tokens[1] + ".png");
            else if (tokens.length == 4)
                this.load.spritesheet(tokens[0], "/res/" + tokens[1] + ".png", { frameWidth: parseInt(tokens[2]), frameHeight: parseInt(tokens[3]) });
        }
        for (let t of TOKENS) {
            if (t.split_by != undefined)
                this.load.spritesheet(t.key, t.file + ".png", { frameWidth: t.split_by, frameHeight: t.split_by });
            else
                this.load.image(t.key, t.file + ".png");
        }
        for (let t of WALLS)
            this.load.spritesheet(t.key, t.file + ".png", { frameWidth: t.res, frameHeight: t.res });
        for (let t of GROUNDS)
            this.load.spritesheet(t.key, t.file + ".png", { frameWidth: t.res, frameHeight: t.res });
        for (let t of OVERLAYS)
            this.load.spritesheet(t.key, t.file + ".png", { frameWidth: t.res, frameHeight: t.res });
    }
    create() {
        this.preloading = false;
        this.loaderOutline.setFrame(0);
        this.loaderFilled.setFrame(0);
        setTimeout(() => {
            this.text.setText("Loading Assets...");
            this.loaderFilled.setCrop(0, 0, 100, 100);
            this.tweens.add({
                targets: [this.loaderOutline, this.loaderFilled],
                y: -400,
                alpha: 0,
                ease: 'Cubic',
                duration: 500,
                repeat: 0
            });
            setTimeout(() => {
                this.patching = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100, "loader_patching");
                this.patching.setScale(6);
                this.text.setText(" Loading Map...");
                setTimeout(() => {
                    this.game.scene.start('MapScene');
                    this.game.scene.stop('LoadScene');
                    this.game.scene.swapPosition('MapScene', 'LoadScene');
                }, 100);
            }, 300);
        }, 50);
        this.cache.text.remove("assets");
    }
}
/// <reference path="../@types/phaser.d.ts"/>
let game;
window.onload = () => {
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
class DNDMapper extends Phaser.Game {
    constructor(config) {
        let frame = document.getElementById("game");
        config.width = frame.offsetWidth;
        config.height = frame.offsetHeight;
        super(config);
        frame.oncontextmenu = function (e) { e.preventDefault(); };
    }
}
const WALLS = [
    { name: "Dungeon Wall", key: "wall_dungeon", file: "res/tileset/wall_dungeon", res: 16 },
    { name: "Wood Wall", key: "wall_wood", file: "res/tileset/wall_wood", res: 16 },
    { name: "Shadow Wall", key: "wall_shadow", file: "res/tileset/wall_shadow", res: 16 },
];
const GROUNDS = [
    { name: "Cave Floor", key: "ground_cave", file: "res/tileset/ground_cave", res: 16 },
    { name: "Lawn", key: "ground_grass", file: "res/tileset/ground_grass", res: 16 },
    { name: "Wood Floor", key: "ground_wood", file: "res/tileset/ground_wood", res: 16 },
];
const OVERLAYS = [
    { name: "Water", key: "overlay_water", file: "res/tileset/overlay_water", res: 16 },
    { name: "Hole", key: "overlay_hole", file: "res/tileset/overlay_hole", res: 16 },
];
const TOKENS = [
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
    { name: "Bones", key: "tkn_bones", file: "res/token/bones" },
    { name: "Skeleton", key: "tkn_skeleton", file: "res/token/skeleton", split_by: 18 },
    { name: "Gnoll", key: "tkn_gnoll", file: "res/token/gnoll", split_by: 18 },
    { name: "Gnoll Leader", key: "tkn_gnoll_leader", file: "res/token/gnoll_leader", split_by: 18 },
    { name: "Orc", key: "tkn_orc", file: "res/token/orc", split_by: 18 },
    { name: "Orc Lord", key: "tkn_orc_lord", file: "res/token/orc_lord", split_by: 18 },
    { name: "Tiefling 1", key: "tkn_tiefling_1", file: "res/token/tiefling_1", split_by: 18 },
    { name: "Dark Wolf", key: "tkn_wolf_dark", file: "res/token/wolf_dark", split_by: 18 },
    { name: "Light Wolf", key: "tkn_wolf_light", file: "res/token/wolf_light", split_by: 18 },
    { name: "Tan Dog", key: "tkn_tan_dog", file: "res/token/tan_dog", split_by: 18 },
    { name: "Chest", key: "tkn_chest", file: "res/token/chest", split_by: 18 },
    { name: "Mimic", key: "tkn_mimic", file: "res/token/mimic", split_by: 18 },
    { name: "Egg", key: "tkn_egg", file: "res/token/egg", split_by: 18 },
    { name: "Baby Tin Dragon", key: "tkn_baby_tin_dragon", file: "res/token/baby_tin_dragon", split_by: 18 },
    { name: "Baby Gold Dragon", key: "tkn_baby_gold_dragon", file: "res/token/baby_gold_dragon", split_by: 18 },
    { name: "Baby Amethyst Dragon", key: "tkn_baby_amethyst_dragon", file: "res/token/baby_amethyst_dragon", split_by: 18 },
    { name: "Baby Black Dragon", key: "tkn_baby_black_dragon", file: "res/token/baby_black_dragon", split_by: 18 },
    { name: "Baby Blue Dragon", key: "tkn_baby_blue_dragon", file: "res/token/baby_blue_dragon", split_by: 18 },
    { name: "Baby Green Dragon", key: "tkn_baby_green_dragon", file: "res/token/baby_green_dragon", split_by: 18 },
    { name: "Baby Red Dragon", key: "tkn_baby_red_dragon", file: "res/token/baby_red_dragon", split_by: 18 },
    { name: "Dino", key: "tkn_dino", file: "res/token/dino", split_by: 18 },
    { name: "Naexi", key: "tkn_naexi", file: "res/token/naexi_human_noweapon", split_by: 18 },
    { name: "Naexi w/ Yklwa", key: "tkn_naexi_yklwa", file: "res/token/naexi_human_yklwa", split_by: 18 },
    { name: "Naexi Anthro Form", key: "tkn_naexi_anthro", file: "res/token/naexi_anthro", split_by: 18 },
    { name: "Crab", key: "tkn_crab", file: "res/token/crab", split_by: 18 },
    { name: "Blue Slime", key: "tkn_blue_slime", file: "res/token/blue_slime", },
    { name: "Green Goo", key: "tkn_green_goo", file: "res/token/green_goo", },
    { name: "White Ooze", key: "tkn_white_ooze", file: "res/token/white_ooze", },
    { name: "Water Slime", key: "tkn_water_slime", file: "res/token/water_slime", },
    { name: "Treasure", key: "tkn_treasure", file: "res/token/treasure" },
];
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
class MapScene extends Phaser.Scene {
    constructor() {
        super({ key: "MapScene" });
        this.mode = 0;
        this.tokens = [];
    }
    preload() {
        window.addEventListener('resize', () => {
            let frame = document.getElementById("game");
            this.game.scale.resize(frame.offsetWidth, frame.offsetHeight);
        });
    }
    create() {
        this.i = new InputManager(this);
        this.game.renderer.addPipeline('outline', new OutlinePipeline(this.game));
        this.game.renderer.addPipeline('brighten', new BrightenPipeline(this.game));
        this.history = new HistoryManager(this);
        this.world = new WorldView(this);
        this.ui = new UIView(this);
        const size = new Vec2(300, 300);
        this.map = new MapData(this, size);
        this.lighting = new Lighting(this, size);
        this.architect = new ArchitectMode(this);
        this.token = new TokenMode(this);
    }
    update(time, delta) {
        this.i.update();
        this.history.update();
        this.world.update();
        this.ui.update();
        this.map.update();
        this.lighting.update();
    }
}
class Token extends Phaser.GameObjects.Container {
    constructor(scene, x, y, tex) {
        super(scene, x, y);
        this.sprite = null;
        this.shadow = null;
        this.currentFrame = 0;
        this.setTexture(tex);
        this.uuid = generateId(32);
    }
    setTexture(tex) {
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
    }
    setFrame(frame) {
        this.currentFrame = frame;
        this.sprite.setFrame(frame);
        this.shadow.setFrame(frame);
    }
    getFrame() {
        return this.currentFrame;
    }
    frameCount() {
        return Object.keys(this.sprite.texture.frames).length - 1;
    }
    setHovered(hovered) {
        if (this.hovered == hovered)
            return;
        this.hovered = hovered;
        if (!hovered && !this.selected) {
            this.sprite.resetPipeline();
            return;
        }
        if (!this.selected)
            this.sprite.setPipeline("brighten");
    }
    setSelected(selected) {
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
    }
    setPosition(x, y, z, w) {
        Phaser.GameObjects.Container.prototype.setPosition.call(this, x * 4, y * 4, z, w);
        return this;
    }
    getPosition() {
        return new Vec2(this.x / 4, this.y / 4);
    }
    // Serialization Methods
    serialize() {
        return JSON.stringify({
            uuid: this.uuid,
            sprite: this.sprite.texture.key,
            frame: this.currentFrame,
            x: this.x / 4,
            y: this.y / 4
        });
    }
    static deserialize(scene, serialized) {
        let tkn = new Token(scene, 0, 0, "");
        tkn.loadSerializedData(serialized);
        return tkn;
    }
    loadSerializedData(serialized) {
        let tbl = JSON.parse(serialized);
        this.uuid = tbl.uuid;
        this.setTexture(tbl.sprite);
        this.setFrame(tbl.frame);
        this.setPosition(tbl.x, tbl.y);
    }
}
class WorldView {
    constructor(scene) {
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
    init() {
        this.camera.setBackgroundColor("#090d24");
        // Bind the scroll wheel event
        this.onWheel = this.onWheel.bind(this);
        document.documentElement.addEventListener("wheel", this.onWheel);
        this.scene.events.on('destroy', () => document.documentElement.removeEventListener("wheel", this.onWheel));
    }
    onWheel(e) {
        if (!this.scene.token.movingTokens && !this.scene.ui.uiActive) {
            let dir = (e.deltaY < 0 ? 1 : -1);
            this.zoomLevel = clamp(this.zoomLevel + dir, 0, this.zoomLevels.length - 1);
            this.camera.setZoom(this.zoomLevels[this.zoomLevel] / 100);
        }
    }
    pan() {
        if (this.scene.input.activePointer.middleButtonDown()) {
            this.camera.scrollX += Math.round((this.lastCursorScreen.x - this.cursorScreen.x) / this.camera.zoom);
            this.camera.scrollY += Math.round((this.lastCursorScreen.y - this.cursorScreen.y) / this.camera.zoom);
        }
    }
    update() {
        this.lastCursorScreen = this.cursorScreen;
        this.lastCursorWorld = this.cursorWorld;
        this.cursorScreen = new Vec2(this.scene.input.mousePointer.x, this.scene.input.mousePointer.y);
        this.cursorWorld = new Vec2(this.cursorScreen.x / this.camera.zoom + this.camera.scrollX - ((this.camera.displayWidth - this.camera.width) / 2), this.cursorScreen.y / this.camera.zoom + this.camera.scrollY - ((this.camera.displayHeight - this.camera.height) / 2));
        this.pan();
    }
}
class HistoryElement {
    constructor(scene, type, data) {
        this.scene = scene;
        this.type = type;
        this.data = data;
    }
    undo() {
        console.log("Undo", this.type);
        if (this.type == "tile") {
            for (let tile of this.data)
                this.scene.map.setTile(tile.layer, tile.lastTile, tile.pos.x, tile.pos.y);
        }
        else if (this.type == "token_modify") {
            let data = this.data;
            for (let i = 0; i < data.old.length; i++) {
                let uuid = JSON.parse(this.data.old[i]).uuid;
                let found = false;
                for (let token of this.scene.tokens) {
                    if (token.uuid == uuid) {
                        token.loadSerializedData(this.data.old[i]);
                        found = true;
                        break;
                    }
                }
                if (found)
                    continue;
                let token = new Token(this.scene, 0, 0, "");
                token.loadSerializedData(this.data.old[i]);
                this.scene.add.existing(token);
                this.scene.tokens.push(token);
            }
        }
        else if (this.type == "token_create") {
            let uuid = JSON.parse(this.data.data).uuid;
            for (let i = 0; i < this.scene.tokens.length; i++) {
                if (this.scene.tokens[i].uuid == uuid) {
                    this.scene.token.removeToken(this.scene.tokens[i]);
                    break;
                }
            }
        }
        else if (this.type == "token_delete") {
            this.data.data.forEach(ser => {
                let token = new Token(this.scene, 0, 0, "");
                token.loadSerializedData(ser);
                this.scene.add.existing(token);
                this.scene.tokens.push(token);
            });
        }
    }
    redo() {
        console.log("Redo", this.type);
        if (this.type == "tile") {
            for (let tile of this.data)
                this.scene.map.setTile(tile.layer, tile.tile, tile.pos.x, tile.pos.y);
        }
        else if (this.type == "token_modify") {
            let data = this.data;
            for (let i = 0; i < data.new.length; i++) {
                let uuid = JSON.parse(this.data.new[i]).uuid;
                let found = false;
                for (let token of this.scene.tokens) {
                    if (token.uuid == uuid) {
                        token.loadSerializedData(this.data.new[i]);
                        found = true;
                        break;
                    }
                }
                if (found)
                    continue;
                let token = new Token(this.scene, 0, 0, "");
                token.loadSerializedData(this.data.new[i]);
                this.scene.add.existing(token);
                this.scene.tokens.push(token);
            }
        }
        else if (this.type == "token_create") {
            let data = JSON.parse(this.data.data);
            let token = new Token(this.scene, 0, 0, "");
            token.loadSerializedData(this.data.data);
            this.scene.add.existing(token);
            this.scene.tokens.push(token);
        }
        else if (this.type == "token_delete") {
            this.data.data.forEach(ser => {
                let t = JSON.parse(ser);
                if (this.scene.token.hoveredToken != null && this.scene.token.hoveredToken.uuid == t.uuid)
                    this.scene.token.hoveredToken = null;
                for (let i = 0; i < this.scene.token.selectedTokens.length; i++) {
                    if (this.scene.token.selectedTokens[i].uuid == t.uuid) {
                        this.scene.token.selectedTokens.splice(i, 1);
                        break;
                    }
                }
                for (let i = 0; i < this.scene.tokens.length; i++) {
                    if (this.scene.tokens[i].uuid == t.uuid) {
                        this.scene.tokens[i].destroy();
                        this.scene.tokens.splice(i, 1);
                        break;
                    }
                }
            });
        }
    }
}
class HistoryManager {
    constructor(scene) {
        this.history = [];
        this.historyHead = -1;
        this.timeHoldingHistoryKey = 0;
        this.scene = scene;
    }
    update() {
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
    }
    push(type, data) {
        this.history.splice(this.historyHead + 1, this.history.length - this.historyHead, new HistoryElement(this.scene, type, data));
        this.historyHead = this.history.length - 1;
    }
    undo() {
        if (this.historyHead >= 0) {
            this.history[this.historyHead].undo();
            this.historyHead--;
        }
    }
    redo() {
        if (this.historyHead < this.history.length - 1) {
            this.historyHead++;
            this.history[this.historyHead].redo();
        }
    }
}
class Chat extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.messages = [];
        this.textInput = new TextInput(scene, 0, 0);
        this.list.push(this.textInput);
        this.messageContainer = new Phaser.GameObjects.Container(scene, 0, 0);
        this.list.push(this.messageContainer);
    }
    update() {
        this.textInput.y = -this.textInput.getHeight();
        this.messageContainer.y = this.textInput.y - 3;
    }
    pushMessage(message) {
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
    }
    reflowMessages() {
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
class ChatBox extends Phaser.GameObjects.Container {
    constructor(scene, x, y, str, tex) {
        super(scene, x, y);
        this.texture = "ui_text_box";
        this.FONT_SIZE = 4.3;
        this.chatboxHeight = 0;
        this.str = str;
        if (tex != undefined)
            this.texture = tex;
        this.setText(str);
    }
    setText(text) {
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
            while (`${newLine} ${split[0]}`.length < maxLetters && split.length)
                newLine += split.shift();
            lines.push(newLine.trim());
            if (split.length)
                nextLine();
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
        let lastElem = this.list[this.list.length - 1];
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
class TextInput extends ChatBox {
    constructor(scene, x, y) {
        super(scene, x, y, " ", "ui_text_input");
        this.text = "";
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
class UIView {
    constructor(scene) {
        this.visibleMenu = 0;
        this.uiActive = false;
        this.sidebarOpen = true;
        this.scene = scene;
        this.camera = this.scene.cameras.add(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height, false, "ui_camera");
        this.camera.scrollX = -10000;
        this.o = this.scene.add.container(-10000, 0);
        this.createElements();
    }
    createElements() {
        this.o.add(new UISidebarToggle(this.scene, 16, 1));
        this.o.add(new UIModeSwitchButton(this.scene, 28, 1));
        this.o.add(new UIHistoryManipulation(this.scene, 43, 1));
        this.tokenSidebar = new UITokenSidebar(this.scene, -205, 0);
        this.o.add(this.tokenSidebar);
        for (let t of TOKENS) {
            this.tokenSidebar.addToken(t.key);
        }
        this.tileSidebar = new UITileSidebar(this.scene, 0, 0);
        this.o.add(this.tileSidebar);
        this.tokenProps = new UITokenProps(this.scene, 24, 0);
        this.tokenProps.y = this.camera.height;
        this.o.add(this.tokenProps);
    }
    toggleSidebarOpen() {
        let sidebarOpen = !this.sidebarOpen;
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
        setTimeout(() => this.sidebarOpen = sidebarOpen, 0); // Hack to prevent multiple UI items from triggering.
    }
    update() {
        this.uiActive = false;
        for (let o of this.o.list) {
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
    }
    displayArchitect() {
        this.o.bringToTop(this.tileSidebar);
        this.tileSidebar.x = -205;
        this.scene.tweens.add({
            targets: this.tileSidebar,
            x: { from: -205, to: 0 },
            ease: 'Cubic',
            duration: 300,
            repeat: 0
        });
    }
    hideToken() {
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
    }
    displayToken() {
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
    }
    hideArchitect() {
        this.scene.tweens.add({
            targets: this.tileSidebar,
            x: { from: 0, to: -60 },
            ease: 'Cubic',
            duration: 300,
            repeat: 0
        });
    }
}
class UIComponent extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, tex) {
        super(scene, x, y, tex);
        this.setOrigin(0, 0);
        this.setScale(3, 3);
        this.setPos(x * 3, y * 3);
        this.setActive(true);
        this.scene.add.existing(this);
    }
    setPos(x, y) {
        this.setPosition(x * 3, y * 3);
    }
    mouseIntersects() {
        let pointer = this.scene.input.mousePointer;
        let xO = (this.scene.ui.sidebarOpen) ? 0 : 204;
        return (pointer.x + xO >= this.x && pointer.y >= this.y && pointer.x + xO <= this.x + this.width * 3 && pointer.y <= this.y + this.height * 3);
    }
    mousePos() {
        let pointer = this.scene.input.mousePointer;
        let xO = (this.scene.ui.sidebarOpen) ? 0 : 204;
        return new Vec2(Math.round((pointer.x + xO - this.x) / 3), Math.round((pointer.y - this.y) / 3));
    }
}
class UIContainer extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.intersects = [];
        this.setPos(x * 3, y * 3);
        this.setActive(true);
        this.scene.add.existing(this);
    }
    setPos(x, y) {
        this.setPosition(x * 3, y * 3);
    }
    mouseIntersects() {
        for (let i of this.list) {
            if (i.mouseIntersects != null)
                if (i.mouseIntersects())
                    return true;
        }
        for (let i of this.intersects) {
            let pointer = this.scene.input.mousePointer;
            let xO = (this.scene.ui.sidebarOpen) ? 0 : 204;
            if (pointer.x + xO >= this.x + i.x && pointer.y >= this.y + i.y
                && pointer.x + xO <= this.x + i.x + i.width * i.scaleX && pointer.y <= this.y + i.y + i.height * i.scaleY)
                return true;
        }
        return false;
    }
    mousePos() {
        let pointer = this.scene.input.mousePointer;
        let xO = (this.scene.ui.sidebarOpen) ? 0 : 204;
        return new Vec2(Math.round((pointer.x + xO - this.x) / 3), Math.round((pointer.y - this.y) / 3));
    }
}
class UIHistoryManipulation extends UIComponent {
    constructor(scene, x, y) {
        super(scene, x, y, "ui_history_manipulation");
        this.scene = scene;
        this.setActive(true);
    }
    update() {
        let hasNext = this.scene.history.historyHead < this.scene.history.history.length - 1;
        let hasPrev = this.scene.history.historyHead >= 0;
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
    }
}
class UIModeSwitchButton extends UIComponent {
    constructor(scene, x, y) {
        super(scene, x, y, "ui_mode_switch");
        this.scene = scene;
        this.setActive(true);
    }
    update() {
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
    }
}
class UISideMenuButton extends UIComponent {
    constructor(scene, x, y) {
        super(scene, x, y, "ui_button_side_menu");
        this.scene = scene;
        this.setActive(true);
    }
    update() {
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
    }
}
class UISidebar extends UIContainer {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.backgrounds = [];
        this.scrollY = 0;
        this.elems = [];
        this.sprites = [];
        this.hoveredElem = null;
        this.scene = scene;
        for (let i = 0; i < 30; i++) {
            let background = new Phaser.GameObjects.Sprite(this.scene, 0, 21 * 3 * i, "ui_sidebar_bg", 1);
            background.setScale(3);
            background.setOrigin(0, 0);
            this.backgrounds.push(background);
            this.list.push(background);
        }
        this.activeSpriteCursor = new Phaser.GameObjects.Sprite(this.scene, 9, 9 + 21 * 3, "ui_sidebar_cursor");
        this.activeSpriteCursor.setScale(3);
        this.activeSpriteCursor.setOrigin(0);
        this.activeSpriteCursor.setVisible(false);
        this.list.push(this.activeSpriteCursor);
        this.hoverSpriteCursor = new Phaser.GameObjects.Sprite(this.scene, 3, 3, "ui_sidebar_cursor");
        this.hoverSpriteCursor.setScale(3);
        this.hoverSpriteCursor.setOrigin(0);
        this.hoverSpriteCursor.setAlpha(0.35);
        this.hoverSpriteCursor.setVisible(false);
        this.list.push(this.hoverSpriteCursor);
        // Bind the scroll wheel event
        this.onWheel = this.onWheel.bind(this);
        document.documentElement.addEventListener("wheel", this.onWheel);
        this.scene.events.on('destroy', () => document.documentElement.removeEventListener("wheel", this.onWheel));
    }
    onWheel(e) {
        if (this.scene.ui.uiActive) {
            let dir = (e.deltaY < 0 ? 1 : -1);
            this.scrollY = clamp(this.scrollY + dir * 63, 0, -1000);
            this.scene.tweens.add({
                targets: this,
                y: this.scrollY,
                ease: 'Cubic',
                duration: 160,
                repeat: 0
            });
        }
    }
    mouseIntersects() {
        return (this.mousePos().x < 69);
    }
    update() {
        let hovered = null;
        if (this.mouseIntersects()) {
            if (this.mousePos().x % 21 >= 4 && this.mousePos().y % 21 >= 4) {
                let mousePos = this.mousePos();
                let x = Math.floor(mousePos.x / 21);
                let y = Math.floor(mousePos.y / 21) - 1;
                for (let i = 0; i < this.sprites.length; i++) {
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
    }
    elemHover(x, y) { }
    elemUnhover(x, y) { }
    elemClick(x, y) { }
}
class UISidebarToggle extends UIComponent {
    constructor(scene, x, y) {
        super(scene, x, y, "ui_button_sidebar_toggle");
        this.scene = scene;
        this.setActive(true);
    }
    update() {
        if (this.mouseIntersects() && this.mousePos().x >= 20) {
            this.setFrame(2 + (this.scene.ui.sidebarOpen ? 0 : 1));
            if (this.scene.i.mouseLeftPressed())
                this.scene.ui.toggleSidebarOpen();
        }
        else
            this.setFrame(0 + (this.scene.ui.sidebarOpen ? 0 : 1));
        if (this.scene.i.keyPressed('F'))
            this.scene.ui.toggleSidebarOpen();
    }
}
class UITileSelector extends UIContainer {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.tiles = [];
        this.scene = scene;
        this.background = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "ui_quick_selector");
        this.background.setScale(3, 3);
        this.background.setOrigin(0, 0);
        this.intersects.push(this.background);
        this.add(this.background);
        this.selectSprite = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "cursor");
        this.selectSprite.setScale(3, 3);
        this.selectSprite.setOrigin(0, 0);
        this.add(this.selectSprite);
        this.positionSelect(0);
    }
    positionSelect(slot) {
        this.selectSprite.setPosition(12, 18 + slot * 60);
    }
    update() {
        if (this.mouseIntersects() && this.scene.i.mouseLeftPressed()) {
            let mousePos = this.mousePos();
            if (mousePos.x < 4 || mousePos.x > 4 + 16)
                return;
            mousePos.y -= 6;
            if (mousePos.y % 20 > 16)
                return;
            let slot = Math.floor(mousePos.y / 20);
            if (slot < 0 || slot >= this.tiles.length)
                return;
            this.scene.architect.activeTileset = this.tiles[slot];
            this.positionSelect(slot);
        }
    }
    addTile(tile) {
        let pos = this.tiles.length;
        this.tiles.push(tile);
        let spr = new Phaser.GameObjects.Sprite(this.scene, 12 - 22 * 2, 18 - 22 * 2 + pos * 60, "tileset_" + tile);
        spr.setOrigin(0, 0);
        spr.setCrop(22, 22, 24, 24);
        spr.setScale(2);
        this.add(spr);
        this.sendToBack(spr);
        this.sendToBack(this.background);
    }
}
class UITileSidebar extends UISidebar {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.walls = [];
        this.grounds = [];
        this.overlays = [];
        let add_wall = new Phaser.GameObjects.Sprite(this.scene, 9 + x * 21 * 3, 9 + y * 21 * 3, "ui_sidebar_browse");
        add_wall.setName("add_wall");
        add_wall.setScale(3);
        add_wall.setOrigin(0, 0);
        this.list.push(add_wall);
        this.sprites.push(add_wall);
        for (let tileset of WALLS) {
            this.addWall(tileset.key);
        }
        let add_ground = new Phaser.GameObjects.Sprite(this.scene, 9 + x * 21 * 3, 9 + y * 21 * 3, "ui_sidebar_browse");
        add_ground.setName("add_ground");
        add_ground.setScale(3);
        add_ground.setOrigin(0, 0);
        this.list.push(add_ground);
        this.sprites.push(add_ground);
        for (let tileset of GROUNDS) {
            this.addGround(tileset.key);
        }
        let add_overlay = new Phaser.GameObjects.Sprite(this.scene, 9 + x * 21 * 3, 9 + 9 * 21 * 3, "ui_sidebar_browse");
        add_overlay.setName("add_overlay");
        add_overlay.setScale(3);
        add_overlay.setOrigin(0, 0);
        this.list.push(add_overlay);
        this.sprites.push(add_overlay);
        for (let tileset of OVERLAYS) {
            this.addOverlay(tileset.key);
        }
        for (let i = 0; i < 12; i++) {
            if (i % 4 != 0)
                this.backgrounds[i].setFrame(0);
        }
    }
    elemClick(x, y) {
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
    }
    addWall(tileset) {
        this.addTilesetSprite(tileset, this.walls.length % 3, Math.floor(this.walls.length / 3) + 1, 17);
        this.getByName("add_wall").x = 9 + ((this.walls.length + 1) % 3 * 21 * 3);
        this.getByName("add_wall").y = 9 + (Math.floor((this.walls.length + 1) / 3 + 1) * 21 * 3);
        this.walls.push(tileset);
    }
    addGround(tileset) {
        this.addTilesetSprite(tileset, this.grounds.length % 3, Math.floor(this.grounds.length / 3) + 5, 13);
        this.getByName("add_ground").x = 9 + ((this.grounds.length + 1) % 3 * 21 * 3);
        this.getByName("add_ground").y = 9 + (Math.floor((this.grounds.length + 1) / 3 + 5) * 21 * 3);
        this.grounds.push(tileset);
    }
    addOverlay(tileset) {
        this.addTilesetSprite(tileset, this.overlays.length % 3, Math.floor(this.overlays.length / 3) + 9, 33);
        this.getByName("add_overlay").x = 9 + ((this.overlays.length + 1) % 3 * 21 * 3);
        this.getByName("add_overlay").y = 9 + (Math.floor((this.overlays.length + 1) / 3 + 9) * 21 * 3);
        this.overlays.push(tileset);
    }
    addTilesetSprite(key, x, y, frame) {
        let spr = new Phaser.GameObjects.Sprite(this.scene, 12 + x * 21 * 3, 12 + y * 21 * 3, key, frame);
        spr.setOrigin(0, 0);
        spr.setScale(3);
        this.sprites.push(spr);
        this.list.push(spr);
        let spr2 = new Phaser.GameObjects.Sprite(this.scene, 9 + x * 21 * 3, 9 + y * 21 * 3, "ui_sidebar_overlay");
        spr2.setScale(3);
        spr2.setOrigin(0, 0);
        this.list.push(spr2);
        this.bringToTop(this.hoverSpriteCursor);
        this.bringToTop(this.activeSpriteCursor);
    }
}
class UITokenProps extends UIContainer {
    constructor(scene, x, y) {
        super(scene, x, y);
        let dims = new Vec2(300, 400);
        let e = new Phaser.GameObjects.Sprite(scene, 0, 0, "ui_background_9x", 0);
        e.setScale(3, 3);
        this.add(e);
        e = new Phaser.GameObjects.Sprite(scene, 8 * 3, 0, "ui_background_9x", 1);
        e.setScale((dims.x - 16 * 3) / 8, 3);
        this.add(e);
        e = new Phaser.GameObjects.Sprite(scene, dims.x - 8 * 3, 0, "ui_background_9x", 2);
        e.setScale(3);
        this.add(e);
        e = new Phaser.GameObjects.Sprite(scene, 0, 8 * 3, "ui_background_9x", 3);
        e.setScale(3, (dims.y - 16 * 3) / 8);
        this.add(e);
        e = new Phaser.GameObjects.Sprite(scene, 8 * 3, 8 * 3, "ui_background_9x", 4);
        e.setScale((dims.x - 16 * 3) / 8, (dims.y - 16 * 3) / 8);
        this.add(e);
        e = new Phaser.GameObjects.Sprite(scene, dims.x - 8 * 3, 8 * 3, "ui_background_9x", 5);
        e.setScale(3, (dims.y - 16 * 3) / 8);
        this.add(e);
        e = new Phaser.GameObjects.Sprite(scene, 0, (dims.y - 8 * 3), "ui_background_9x", 6);
        e.setScale(3);
        this.add(e);
        e = new Phaser.GameObjects.Sprite(scene, 8 * 3, (dims.y - 8 * 3), "ui_background_9x", 7);
        e.setScale((dims.x - 16 * 3) / 8, 3);
        this.add(e);
        e = new Phaser.GameObjects.Sprite(scene, dims.x - 8 * 3, (dims.y - 8 * 3), "ui_background_9x", 8);
        e.setScale(3);
        this.add(e);
        this.list.forEach(e => e.setOrigin(0, 0));
    }
}
class UITokenSelector extends UIContainer {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.tokens = [];
        this.scene = scene;
        this.background = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "ui_quick_selector");
        this.background.setScale(3, 3);
        this.background.setOrigin(0, 0);
        this.intersects.push(this.background);
        this.add(this.background);
        this.selectSprite = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "cursor");
        this.selectSprite.setScale(3, 3);
        this.selectSprite.setOrigin(0, 0);
        this.add(this.selectSprite);
        this.positionSelect(0);
    }
    positionSelect(slot) {
        this.selectSprite.setPosition(12, 18 + slot * 60);
    }
    update() {
        if (this.mouseIntersects() && this.scene.i.mouseLeftPressed()) {
            let mousePos = this.mousePos();
            if (mousePos.x < 4 || mousePos.x > 4 + 16)
                return;
            mousePos.y -= 6;
            if (mousePos.y % 20 > 16)
                return;
            let slot = Math.floor(mousePos.y / 20);
            if (slot < 0 || slot >= this.tokens.length)
                return;
            this.scene.token.selectedTokenType = this.tokens[slot];
            this.positionSelect(slot);
        }
    }
    addToken(sprite) {
        let pos = this.tokens.length;
        this.tokens.push(sprite);
        let spr = new Phaser.GameObjects.Sprite(this.scene, 12 - 3, 18 - 3 + pos * 60, sprite);
        spr.setOrigin(0, 0);
        spr.setScale(3);
        this.add(spr);
        this.sendToBack(spr);
        this.sendToBack(this.background);
    }
}
class UITokenSidebar extends UISidebar {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.spinTimer = 0;
        this.cursorMode = new UIComponent(scene, 15 - 2 / 3, 1, "ui_button_select_cursor");
        this.add(this.cursorMode);
    }
    update() {
        super.update();
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
    }
    toggleSelectMode(select) {
        if (select) {
            this.scene.token.selectedTokenType = "";
            this.activeSpriteCursor.setVisible(false);
        }
        else {
            this.scene.token.selectedTokenType = this.elems[this.lastSelectedToken];
            this.activeSpriteCursor.setVisible(true);
        }
    }
    elemHover(x, y) {
        let hoveredToken = this.sprites[x + y * 3];
        this.spinTimer++;
        if (this.spinTimer > 20) {
            let frame = hoveredToken.getFrame() + 1;
            frame %= hoveredToken.frameCount();
            hoveredToken.setFrame(frame);
            this.spinTimer = 0;
        }
    }
    elemUnhover(x, y) {
        this.sprites.forEach(t => t.setFrame(0));
    }
    elemClick(x, y) {
        this.lastSelectedToken = x + y * 3;
        this.scene.token.selectedTokenType = this.elems[x + y * 3];
    }
    addToken(sprite) {
        let p = this.elems.length;
        let x = p % 3;
        let y = Math.floor(p / 3) + 1;
        this.elems.push(sprite);
        if (x == 0)
            this.backgrounds[y].setFrame(0);
        let token = new Token(this.scene, 0, 0, sprite);
        Phaser.GameObjects.Sprite.prototype.setPosition.call(token, 12 + x * 21 * 3, 12 + y * 21 * 3);
        token.setScale(3 / 4);
        this.sprites.push(token);
        this.list.push(token);
        this.bringToTop(this.activeSpriteCursor);
        this.bringToTop(this.hoverSpriteCursor);
    }
}
class ArchitectMode {
    constructor(scene) {
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
        // Create cursor hover sprite
        this.cursor = this.scene.add.sprite(0, 0, "cursor");
        this.cursor.setScale(4, 4);
        this.cursor.setDepth(1000);
        this.cursor.setOrigin(0, 0);
    }
    update() {
        this.active = true;
        this.cursor.setVisible(true);
        let selectedTilePos = new Vec2(Math.floor(this.scene.world.cursorWorld.x / 64), Math.floor(this.scene.world.cursorWorld.y / 64));
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
    }
    drawLine(selectedTilePos) {
        if (this.scene.input.mousePointer.leftButtonDown() || this.scene.input.mousePointer.rightButtonDown()) {
            if (!this.pointerDown)
                this.startTilePos = selectedTilePos;
            let a = new Vec2(this.startTilePos.x, this.startTilePos.y);
            let b = new Vec2(selectedTilePos.x, selectedTilePos.y);
            if (Math.abs(b.x - a.x) > Math.abs(b.y - a.y))
                b.y = a.y;
            else
                b.x = a.x;
            this.cursor.setPosition(b.x * 64, b.y * 64);
            this.primitives.forEach((v) => v.destroy());
            this.primitives = [];
            this.primitives.push(this.scene.add.line(0, 0, a.x + 0.5, a.y + 0.5, b.x + 0.5, b.y + 0.5, 0xffffff, 1));
            this.primitives.forEach((v) => {
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
            let a = new Vec2(this.startTilePos.x * 64, this.startTilePos.y * 64);
            let b = new Vec2(selectedTilePos.x * 64, selectedTilePos.y * 64);
            if (Math.abs(b.x - a.x) > Math.abs(b.y - a.y))
                b.y = a.y;
            else
                b.x = a.x;
            let change = new Vec2(b.x - a.x, b.y - a.y);
            let normalizeFactor = Math.sqrt(change.x * change.x + change.y * change.y);
            change.x /= normalizeFactor;
            change.y /= normalizeFactor;
            while (Math.abs(b.x - a.x) >= 1 || Math.abs(b.y - a.y) >= 1) {
                this.placeTileAndPushManip(new Vec2(Math.floor(a.x / 64), Math.floor(a.y / 64)), this.pointerPrimaryDown);
                a.x += change.x;
                a.y += change.y;
            }
            this.placeTileAndPushManip(new Vec2(b.x / 64, b.y / 64), this.pointerPrimaryDown);
            this.primitives.forEach((v) => v.destroy());
            this.primitives = [];
        }
    }
    drawRect(selectedTilePos) {
        if (this.scene.input.mousePointer.leftButtonDown() || this.scene.input.mousePointer.rightButtonDown()) {
            if (!this.pointerDown)
                this.startTilePos = selectedTilePos;
            let a = new Vec2(Math.min(this.startTilePos.x, selectedTilePos.x), Math.min(this.startTilePos.y, selectedTilePos.y));
            let b = new Vec2(Math.max(this.startTilePos.x, selectedTilePos.x), Math.max(this.startTilePos.y, selectedTilePos.y));
            this.primitives.forEach((v) => v.destroy());
            this.primitives = [];
            const fac = 0.03;
            this.primitives.push(this.scene.add.line(0, 0, a.x + fac, a.y + fac, b.x + 1 - fac, a.y + fac, 0xffffff, 1));
            this.primitives.push(this.scene.add.line(0, 0, a.x + fac, a.y + fac / 2, a.x + fac, b.y + 1 - fac / 2, 0xffffff, 1));
            this.primitives.push(this.scene.add.line(0, 0, a.x + fac, b.y + 1 - fac, b.x + 1 - fac, b.y + 1 - fac, 0xffffff, 1));
            this.primitives.push(this.scene.add.line(0, 0, b.x + 1 - fac, a.y + fac / 2, b.x + 1 - fac, b.y + 1 - fac / 2, 0xffffff, 1));
            this.primitives.forEach((v) => {
                v.setOrigin(0, 0);
                v.setScale(64, 64);
                v.setLineWidth(0.03);
                v.setDepth(300);
            });
        }
        else if (!this.scene.input.mousePointer.leftButtonDown() && !this.scene.input.mousePointer.rightButtonDown() && this.pointerDown) {
            let a = new Vec2(Math.min(this.startTilePos.x, selectedTilePos.x), Math.min(this.startTilePos.y, selectedTilePos.y));
            let b = new Vec2(Math.max(this.startTilePos.x, selectedTilePos.x), Math.max(this.startTilePos.y, selectedTilePos.y));
            for (let i = a.x; i <= b.x; i++) {
                for (let j = a.y; j <= b.y; j++) {
                    this.placeTileAndPushManip(new Vec2(i, j), this.pointerPrimaryDown);
                }
            }
            this.primitives.forEach((v) => v.destroy());
            this.primitives = [];
        }
    }
    drawBrush(selectedTilePos) {
        if (this.scene.input.mousePointer.leftButtonDown() || this.scene.input.mousePointer.rightButtonDown()) {
            let change = new Vec2(this.scene.world.cursorWorld.x - this.scene.world.lastCursorWorld.x, this.scene.world.cursorWorld.y - this.scene.world.lastCursorWorld.y);
            let normalizeFactor = Math.sqrt(change.x * change.x + change.y * change.y);
            change.x /= normalizeFactor;
            change.y /= normalizeFactor;
            let place = new Vec2(this.scene.world.lastCursorWorld.x, this.scene.world.lastCursorWorld.y);
            while (Math.abs(this.scene.world.cursorWorld.x - place.x) >= 1 || Math.abs(this.scene.world.cursorWorld.y - place.y) >= 1) {
                this.placeTileAndPushManip(new Vec2(Math.floor(place.x / 64), Math.floor(place.y / 64)), this.scene.input.mousePointer.leftButtonDown());
                place.x += change.x;
                place.y += change.y;
            }
            this.placeTileAndPushManip(new Vec2(selectedTilePos.x, selectedTilePos.y), this.scene.input.mousePointer.leftButtonDown());
        }
    }
    placeTileAndPushManip(manipPos, solid) {
        let tile = solid ? this.activeTileset : -1;
        let layer = (tile == -1 && this.activeLayer == 0 /* floor */) ? 1 /* wall */ : this.activeLayer;
        let lastTile = this.scene.map.getTileset(layer, manipPos.x, manipPos.y);
        if (tile == lastTile)
            return;
        this.scene.map.setTile(layer, tile, manipPos.x, manipPos.y);
        this.manipulated.push({
            pos: manipPos,
            layer: layer,
            lastTile: lastTile,
            tile: tile
        });
    }
    cleanup() {
        if (!this.active)
            return;
        this.active = false;
        this.cursor.setVisible(false);
    }
}
class TokenMode {
    constructor(scene) {
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
        this.scene.events.on('destroy', () => document.documentElement.removeEventListener("wheel", this.onWheel));
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
    onWheel(e) {
        if (this.movingTokens) {
            let dir = e.deltaY > 0 ? 1 : -1;
            this.selectedTokens.forEach((token) => {
                let frame = token.getFrame() + dir;
                if (frame < 0)
                    frame += token.frameCount();
                frame %= token.frameCount();
                token.setFrame(frame);
            });
        }
    }
    update() {
        this.active = true;
        let selectedTilePos = new Vec2(Math.floor(this.scene.world.cursorWorld.x / 64), Math.floor(this.scene.world.cursorWorld.y / 64));
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
    }
    tokenMoveControls() {
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
    }
    selectedIncludes(t) {
        for (let token of this.selectedTokens) {
            if (token == t)
                return true;
        }
        return false;
    }
    moveToken(x, y, frame) {
        let prevSerialized = [];
        this.selectedTokens.forEach((token) => {
            prevSerialized.push(token.serialize());
            token.x += x * 4;
            token.y += y * 4;
            token.setFrame(frame);
        });
        let identical = true;
        let currSerialized = [];
        for (let s = 0; s < prevSerialized.length; s++) {
            currSerialized.push(this.selectedTokens[s].serialize());
            if (prevSerialized[s] != currSerialized[s])
                identical = false;
        }
        if (!identical) {
            this.scene.history.push("token_modify", { old: prevSerialized, new: currSerialized });
        }
    }
    selecting() {
        const cursor = this.scene.world.cursorWorld;
        let clickedAddedThisFrame = false;
        // Find the currently hovered token, and remove all outlines. 
        this.hoveredToken = null;
        for (let i = this.scene.tokens.length - 1; i >= 0; i--) {
            let token = this.scene.tokens[i];
            if (cursor.x >= token.x && cursor.y >= token.y && cursor.x <= token.x + token.width - 8 && cursor.y <= token.y + token.height - 8) {
                this.hoveredToken = token;
                break;
            }
        }
        // Apply outline to hovered token, remove it from non-hovered tokens
        for (let token of this.scene.tokens)
            if (token != this.hoveredToken)
                token.setHovered(false);
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
                    let token = this.createToken();
                    if (this.scene.i.keyDown('CTRL')) {
                        if (!this.selectedIncludes(token))
                            this.selectedTokens.push(token);
                    }
                    else {
                        this.selectedTokens.forEach(t => t.setSelected(false));
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
                    this.selectedTokens.forEach(t => t.setSelected(false));
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
                this.primitives.forEach((v) => v.destroy());
                this.primitives = [];
                let selectedTilePos = new Vec2(Math.floor(cursor.x / 64), Math.floor(cursor.y / 64));
                let a = new Vec2(Math.min(this.startTilePos.x, selectedTilePos.x), Math.min(this.startTilePos.y, selectedTilePos.y));
                let b = new Vec2(Math.max(this.startTilePos.x, selectedTilePos.x), Math.max(this.startTilePos.y, selectedTilePos.y));
                if (!this.scene.i.keyDown('CTRL')) {
                    for (let s of this.selectedTokens)
                        s.setSelected(false);
                    this.selectedTokens = [];
                }
                for (let token of this.scene.tokens) {
                    let tokenTilePos = new Vec2(Math.floor(token.x / 64), Math.floor(token.y / 64));
                    if (tokenTilePos.x >= a.x && tokenTilePos.y >= a.y && tokenTilePos.x <= b.x && tokenTilePos.y <= b.y) {
                        let selected = this.scene.i.keyDown('CTRL') ? !this.selectedIncludes(token) : true;
                        token.setSelected(selected);
                        if (selected && !this.selectedIncludes(token))
                            this.selectedTokens.push(token);
                        else if (!selected && this.selectedIncludes(token)) {
                            for (let i = 0; i < this.selectedTokens.length; i++) {
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
                    for (let i = 0; i < this.selectedTokens.length; i++) {
                        if (this.selectedTokens[i] == this.hoveredToken) {
                            this.selectedTokens[i].setSelected(false);
                            this.selectedTokens.splice(i, 1);
                            break;
                        }
                    }
                }
                else {
                    this.selectedTokens.forEach(t => t.setSelected(false));
                    this.selectedTokens = [this.hoveredToken];
                    this.hoveredToken.setSelected(true);
                    this.startMovingTokens();
                }
            }
            this.movedTokens = false;
        }
        if (this.scene.i.keyDown('DELETE') && this.selectedTokens.length > 0) {
            let serializedData = [];
            this.selectedTokens.forEach(t => {
                for (let i = 0; i < this.scene.tokens.length; i++) {
                    if (this.scene.tokens[i] == t) {
                        this.scene.tokens.splice(i, 1);
                        break;
                    }
                }
                serializedData.push(t.serialize());
                if (this.hoveredToken == t)
                    this.hoveredToken = null;
                t.destroy();
            });
            this.selectedTokens = [];
            this.scene.history.push("token_delete", { data: serializedData });
        }
        if (!clickedAddedThisFrame)
            this.clickedLastFrame = null;
        if (this.scene.i.mouseLeftDown())
            this.updateRectangleSelect();
    }
    updateRectangleSelect() {
        const cursor = this.scene.world.cursorWorld;
        let selectedTilePos = new Vec2(Math.floor(cursor.x / 64), Math.floor(cursor.y / 64));
        this.primitives.forEach((v) => v.destroy());
        this.primitives = [];
        if (this.startTilePos != null) {
            let a = new Vec2(Math.min(this.startTilePos.x, selectedTilePos.x), Math.min(this.startTilePos.y, selectedTilePos.y));
            let b = new Vec2(Math.max(this.startTilePos.x, selectedTilePos.x), Math.max(this.startTilePos.y, selectedTilePos.y));
            const fac = 0.03;
            this.primitives.push(this.scene.add.line(0, 0, a.x + fac, a.y + fac, b.x + 1 - fac, a.y + fac, 0xffffff, 1));
            this.primitives.push(this.scene.add.line(0, 0, a.x + fac, a.y + fac / 2, a.x + fac, b.y + 1 - fac / 2, 0xffffff, 1));
            this.primitives.push(this.scene.add.line(0, 0, a.x + fac, b.y + 1 - fac, b.x + 1 - fac, b.y + 1 - fac, 0xffffff, 1));
            this.primitives.push(this.scene.add.line(0, 0, b.x + 1 - fac, a.y + fac / 2, b.x + 1 - fac, b.y + 1 - fac / 2, 0xffffff, 1));
            this.primitives.forEach((v) => {
                v.setOrigin(0, 0);
                v.setScale(64, 64);
                v.setLineWidth(0.03);
                v.setDepth(300);
            });
        }
    }
    moving() {
        this.cursor.setVisible(false);
        const cursor = this.scene.world.cursorWorld;
        if (this.selectedTokens.length > 0) {
            if (!this.scene.i.mouseLeftDown()) {
                this.movingTokens = false;
                let identical = true;
                let currSerialized = [];
                for (let s = 0; s < this.selectedTokens.length; s++) {
                    currSerialized.push(this.selectedTokens[s].serialize());
                    if (this.prevSerialized[s] != currSerialized[s])
                        identical = false;
                }
                if (!identical) {
                    this.scene.history.push("token_modify", { old: this.prevSerialized, new: currSerialized });
                }
                return;
            }
            let newTileGrabPos = new Vec2(Math.floor(cursor.x / 64), Math.floor(cursor.y / 64));
            let offset = new Vec2(newTileGrabPos.x - this.tileGrabPos.x, newTileGrabPos.y - this.tileGrabPos.y);
            if (offset.x == 0 && offset.y == 0)
                return;
            this.movedTokens = true;
            this.tileGrabPos = newTileGrabPos;
            this.selectedTokens.forEach(tkn => tkn.setPosition(tkn.x / 4 + offset.x * 16, tkn.y / 4 + offset.y * 16));
        }
    }
    startMovingTokens() {
        this.movedTokens = false;
        this.movingTokens = true;
        const cursor = this.scene.world.cursorWorld;
        this.tileGrabPos = new Vec2(Math.floor(cursor.x / 64), Math.floor(cursor.y / 64));
        this.prevSerialized = [];
        this.selectedTokens.forEach(t => this.prevSerialized.push(t.serialize()));
    }
    createToken() {
        let token = new Token(this.scene, Math.floor(this.scene.world.cursorWorld.x / 4 / 16) * 16, Math.floor(this.scene.world.cursorWorld.y / 4 / 16) * 16, this.selectedTokenType);
        this.scene.add.existing(token);
        this.scene.tokens.push(token);
        this.scene.history.push("token_create", { data: token.serialize() });
        return token;
    }
    removeToken(t) {
        for (let i = 0; i < this.selectedTokens.length; i++)
            if (this.selectedTokens[i] == t)
                this.selectedTokens.splice(i, 1);
        for (let i = 0; i < this.scene.tokens.length; i++)
            if (this.scene.tokens[i] == t)
                this.scene.tokens.splice(i, 1);
        if (this.scene.token.hoveredToken == t)
            this.scene.token.hoveredToken = null;
        t.destroy();
    }
    cleanup() {
        if (!this.active)
            return;
        this.active = false;
        this.selectedTokens.forEach(t => t.setSelected(false));
        this.selectedTokens = [];
        if (this.hoveredToken != null)
            this.hoveredToken.setHovered(false);
        this.hoveredToken = null;
        this.primitives.forEach(e => e.destroy());
        this.primitives = [];
        this.cursor.setVisible(false);
        this.tokenPreview.setVisible(false);
        this.movingTokens = false;
    }
}
class LightChunk {
    constructor(light, x, y) {
        this.pos = new Vec2(x, y);
        this.canvas = light.scene.add.renderTexture(
        // The magic + 2's are to prevent seeing the seams between chunks.
        x * LightChunk.CHUNK_SIZE * 4, y * LightChunk.CHUNK_SIZE * 4, LightChunk.CHUNK_SIZE, LightChunk.CHUNK_SIZE);
        this.light = light;
        this.canvas.setScale(4);
        this.canvas.setOrigin(0, 0);
        this.build();
    }
    build() {
        // Reset
        const reset = new Phaser.GameObjects.Rectangle(this.light.scene, 0, 0, LightChunk.CHUNK_SIZE, LightChunk.CHUNK_SIZE, 0x000000);
        reset.setDisplayOrigin(0, 0);
        reset.setOrigin(0, 0);
        this.canvas.draw(reset);
        reset.destroy();
        for (let light of this.light.lightSources) {
            let lp = new Vec2(light.x - this.pos.x * LightChunk.CHUNK_SIZE, light.y - this.pos.y * LightChunk.CHUNK_SIZE);
            if ((lp.x + light.radius > 0 || lp.x - light.radius < LightChunk.CHUNK_SIZE) &&
                (lp.y + light.radius > 0 || lp.y - light.radius < LightChunk.CHUNK_SIZE)) {
                this.drawRayTracedCircle(light, lp);
                // let poly = new Phaser.GameObjects.Ellipse(this.light.scene, lp.x, lp.y, light.radius, light.radius, 0xffffff, light.intensity)
                // poly.setScale(4, 4);
                // poly.setBlendMode('ERASE');
                // poly.setDisplayOrigin(0, 0);
                // poly.setOrigin(0.5, 0.5);
                // this.canvas.draw(poly);
            }
        }
    }
    drawRayTracedCircle(light, lp) {
        console.log('light');
        let start = new Vec2(Math.floor(light.x / 16), Math.floor(light.y / 16));
        let points = [];
        for (let i = 0; i < 288; i++) {
            let ray = new Vec2(0.5, 0.5);
            let dir = new Vec2(Math.cos(i * 1.25 * (Math.PI / 180)) / 32, Math.sin(i * 1.25 * (Math.PI / 180)) / 32);
            let dist = 0;
            while (this.light.scene.map.getTileset(1 /* wall */, Math.floor(start.x + ray.x), Math.floor(start.y + ray.y)) == -1 &&
                (dist = Math.sqrt(Math.pow(ray.x, 2) + Math.pow(ray.y, 2))) < light.radius / 16) {
                ray.x += dir.x;
                ray.y += dir.y;
            }
            ray.x += dir.x * 0.3;
            ray.y += dir.y * 0.3;
            ray.x += dir.x * ((light.radius / 16) - dist) * 0.5;
            ray.y += dir.y * ((light.radius / 16) - dist) * 0.5;
            points.push(new Vec2(ray.x * 4, ray.y * 4));
        }
        let render = new Phaser.GameObjects.RenderTexture(this.light.scene, lp.x - light.radius, lp.y - light.radius, light.radius * 2, light.radius * 2);
        let gfx = new Phaser.GameObjects.Graphics(this.light.scene, { x: light.radius, y: light.radius });
        gfx.setScale(4, 4);
        gfx.fillStyle(0xffffff, light.intensity / 3);
        gfx.fillPoints(points, true);
        for (let i = 0; i < 6; i++) {
            gfx.scaleX += 0.02;
            gfx.scaleY += 0.02;
            render.draw(gfx);
        }
        let spr = new Phaser.GameObjects.Sprite(this.light.scene, 0, 0, "shader_light_mask");
        spr.setScale(light.radius / 128, light.radius / 128);
        spr.setOrigin(0, 0);
        spr.setBlendMode(Phaser.BlendModes.ERASE);
        render.draw(spr);
        render.setBlendMode(Phaser.BlendModes.ERASE);
        this.canvas.draw(render);
        render.destroy();
    }
}
LightChunk.CHUNK_SIZE = 512;
class LightSource {
    constructor(light, x, y) {
        this.radius = 32;
        this.intensity = 1.0;
        this.light = light;
        this.x = x;
        this.y = y;
    }
    setRadius(radius) {
        this.radius = radius;
    }
    setIntensity(intensity) {
        this.intensity = intensity;
    }
}
class Lighting {
    constructor(scene, size) {
        this.chunks = [];
        this.lightSources = [];
        this.scene = scene;
        this.size = size;
        for (let i = 0; i < Math.ceil(size.y / (MapChunk.CHUNK_SIZE * 2)); i++) {
            this.chunks[i] = [];
            for (let j = 0; j < Math.ceil(size.x / (MapChunk.CHUNK_SIZE * 2)); j++) {
                this.chunks[i][j] = new LightChunk(this, j, i);
            }
        }
        this.addLightSource(18 * 16, 18 * 16, 12 * 16, 1);
        this.addLightSource(32 * 16, 32 * 16, 12 * 16, 1);
        this.addLightSource(14 * 16, 36 * 16, 12 * 16, 1);
    }
    update() {
        if (this.scene.i.keyPressed('R')) {
            this.updateAround(0, 0, 1000);
        }
    }
    updateAround(x, y, radius) {
        const minChunkPos = new Vec2(clamp(Math.floor((x - radius) / LightChunk.CHUNK_SIZE), 0, this.chunks[0].length - 1), clamp(Math.floor((y - radius) / LightChunk.CHUNK_SIZE), 0, this.chunks.length - 1));
        const maxChunkPos = new Vec2(clamp(Math.ceil((x + radius) / LightChunk.CHUNK_SIZE), 0, this.chunks[0].length - 1), clamp(Math.ceil((y + radius) / LightChunk.CHUNK_SIZE), 0, this.chunks.length - 1));
        for (let i = minChunkPos.x; i < maxChunkPos.x; i++) {
            for (let j = minChunkPos.y; j < maxChunkPos.y; j++) {
                this.chunks[j][i].build();
            }
        }
    }
    addLightSource(x, y, radius, intensity) {
        let s = new LightSource(this, x, y);
        if (radius !== undefined)
            s.setRadius(radius);
        if (intensity !== undefined)
            s.setIntensity(intensity);
        this.lightSources.push(s);
        this.updateAround(x, y, radius);
    }
}
class MapChunk {
    constructor(map, x, y) {
        this.dirtyList = [];
        this.fullyDirty = false;
        this.pos = new Vec2(x, y);
        this.canvas = map.scene.add.renderTexture(x * MapChunk.CHUNK_SIZE * MapChunk.TILE_SIZE * 4, y * MapChunk.CHUNK_SIZE * MapChunk.TILE_SIZE * 4, MapChunk.CHUNK_SIZE * MapChunk.TILE_SIZE, MapChunk.CHUNK_SIZE * MapChunk.TILE_SIZE);
        this.map = map;
        this.canvas.setScale(4);
        this.canvas.setOrigin(0, 0);
        for (let i = 0; i < MapChunk.CHUNK_SIZE * MapChunk.CHUNK_SIZE; i++) {
            let x = i % MapChunk.CHUNK_SIZE;
            let y = Math.floor(i / MapChunk.CHUNK_SIZE);
            let mX = x + this.pos.x * MapChunk.CHUNK_SIZE;
            let mY = y + this.pos.y * MapChunk.CHUNK_SIZE;
            if (mX >= this.map.size.x || mY >= this.map.size.y)
                continue;
            this.drawTile(x, y);
        }
    }
    dirty(pos) {
        if (!this.fullyDirty) {
            for (let v of this.dirtyList)
                if (v.equals(pos))
                    return;
            this.dirtyList.push(pos);
            if (this.dirtyList.length > MapChunk.DIRTY_LIMIT) {
                this.fullyDirty = true;
                this.dirtyList = [];
            }
        }
    }
    rebuild() {
        if (this.fullyDirty) {
            for (let i = 0; i < MapChunk.CHUNK_SIZE * MapChunk.CHUNK_SIZE; i++) {
                let x = i % MapChunk.CHUNK_SIZE;
                let y = Math.floor(i / MapChunk.CHUNK_SIZE);
                let mX = x + this.pos.x * MapChunk.CHUNK_SIZE;
                let mY = y + this.pos.y * MapChunk.CHUNK_SIZE;
                if (mX >= this.map.size.x || mY >= this.map.size.y)
                    continue;
                this.drawTile(x, y);
            }
            this.fullyDirty = false;
            return true;
        }
        if (this.dirtyList.length == 0)
            return false;
        for (let elem of this.dirtyList)
            this.drawTile(elem.x, elem.y);
        this.dirtyList = [];
        return true;
    }
    drawTile(x, y) {
        let mX = x + this.pos.x * MapChunk.CHUNK_SIZE;
        let mY = y + this.pos.y * MapChunk.CHUNK_SIZE;
        let wallTile = this.map.getTile(1 /* wall */, mX, mY);
        if (this.map.getTileset(1 /* wall */, mX, mY) == -1 || (wallTile < 54 || wallTile > 60)) {
            this.canvas.drawFrame(this.map.manager.groundLocations[this.map.getTileset(0 /* floor */, mX, mY)].key, this.map.getTile(0 /* floor */, mX, mY), x * MapChunk.TILE_SIZE, y * MapChunk.TILE_SIZE);
            if (this.map.getTileset(2 /* overlay */, mX, mY) != -1)
                this.canvas.drawFrame(this.map.manager.overlayLocations[this.map.getTileset(2 /* overlay */, mX, mY)].key, this.map.getTile(2 /* overlay */, mX, mY), x * MapChunk.TILE_SIZE, y * MapChunk.TILE_SIZE);
        }
        if (this.map.getTileset(1 /* wall */, mX, mY) != -1)
            this.canvas.drawFrame(this.map.manager.wallLocations[this.map.getTileset(1 /* wall */, mX, mY)].key, this.map.getTile(1 /* wall */, mX, mY), x * MapChunk.TILE_SIZE, y * MapChunk.TILE_SIZE);
        if ((x % 2 == 0 && y % 2 == 0) || (x % 2 != 0 && y % 2 != 0))
            this.canvas.drawFrame('grid_tile', 0, x * MapChunk.TILE_SIZE, y * MapChunk.TILE_SIZE);
    }
}
MapChunk.CHUNK_SIZE = 16;
MapChunk.TILE_SIZE = 16;
MapChunk.DIRTY_LIMIT = 32;
class MapData {
    constructor(scene, size) {
        this.layers = {};
        this.chunks = [];
        this.scene = scene;
        this.size = size;
        this.manager = new TilesetManager(scene);
        this.registerLayer(0 /* floor */, () => Math.floor(Math.random() * 6) + 54, 0);
        this.registerLayer(1 /* wall */, 0, -1);
        this.registerLayer(2 /* overlay */, 0, -1);
        for (let i = 0; i < Math.ceil(size.y / MapChunk.CHUNK_SIZE); i++) {
            this.chunks[i] = [];
            for (let j = 0; j < Math.ceil(size.x / MapChunk.CHUNK_SIZE); j++) {
                this.chunks[i][j] = new MapChunk(this, j, i);
            }
        }
    }
    update() {
        let start = Date.now();
        for (let arr of this.chunks)
            for (let chunk of arr) {
                chunk.rebuild();
                if (Date.now() - start > 10)
                    break;
            }
    }
    setTile(layer, tileset, xx, yy) {
        let x, y;
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
        let oldTileset = this.getTileset(layer, x, y);
        if (oldTileset == tileset)
            return false;
        this.setTileset(layer, x, y, tileset);
        this.smartTile(x, y);
        return true;
    }
    setTileset(key, x, a, b) {
        if (x instanceof Vec2)
            this.layers[key].tilesets[x.y][x.x] = a;
        else
            this.layers[key].tilesets[a][x] = b;
    }
    getTile(key, xx, yy) {
        let x, y;
        if (xx instanceof Vec2) {
            x = xx.x;
            y = xx.y;
        }
        else {
            x = xx;
            y = yy;
        }
        return this.layers[key].tiles[clamp(y, 0, this.size.y - 1)][clamp(x, 0, this.size.x - 1)];
    }
    getTileset(key, xx, yy) {
        let x, y;
        if (xx instanceof Vec2) {
            x = xx.x;
            y = xx.y;
        }
        else {
            x = xx;
            y = yy;
        }
        return this.layers[key].tilesets[clamp(y, 0, this.size.y - 1)][clamp(x, 0, this.size.x - 1)];
    }
    smartTile(x, y) {
        for (let i = clamp(x - 1, this.size.x - 1, 0); i <= clamp(x + 1, this.size.x - 1, 0); i++) {
            for (let j = clamp(y - 1, this.size.y - 1, 0); j <= clamp(y + 1, this.size.y - 1, 0); j++) {
                const solids = this.getTilesetsAt(1 /* wall */, i, j).map(i => i != -1);
                const wall = SmartTiler.wall(solids, this.getTile(1 /* wall */, i, j));
                if (wall != -1)
                    this.setTileRaw(1 /* wall */, i, j, wall);
                const floor = SmartTiler.floor(solids, this.getTile(0 /* floor */, i, j));
                if (floor != -1)
                    this.setTileRaw(0 /* floor */, i, j, floor);
                const overlay = SmartTiler.overlay(this.getTilesetsAt(2 /* overlay */, i, j)
                    .map(t => t == this.getTileset(2 /* overlay */, i, j)), this.getTileset(2 /* overlay */, i, j));
                if (overlay != -1)
                    this.setTileRaw(2 /* overlay */, i, j, overlay);
            }
        }
    }
    setTileRaw(key, x, a, b, c) {
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
    }
    getTilesetsAt(layer, x, y) {
        let tilesets = [];
        for (let i = -1; i <= 1; i++)
            for (let j = -1; j <= 1; j++)
                tilesets.push(this.getTileset(layer, clamp(x + j, 0, this.size.x - 1), clamp(y + i, 0, this.size.y - 1)));
        return tilesets;
    }
    registerLayer(key, startTile = 0, startTileset = -1) {
        let layer = {
            tiles: [],
            tilesets: []
        };
        for (let i = 0; i < this.size.y; i++) {
            layer.tiles[i] = [];
            layer.tilesets[i] = [];
            for (let j = 0; j < this.size.x; j++) {
                let tile = typeof (startTile) == "number" ? startTile : startTile();
                layer.tiles[i][j] = tile;
                layer.tilesets[i][j] = startTileset;
            }
        }
        this.layers[key] = layer;
    }
}
var SmartTiler;
(function (SmartTiler) {
    function wall(walls, current) {
        const TL = 0, T = 1, TR = 2, L = 3, C = 4, R = 5, BL = 6, B = 7, BR = 8;
        if (current == -1)
            return -1;
        let empty = walls.map(b => !b);
        let tile = 54;
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
        const TL = 0, T = 1, TR = 2, L = 3, C = 4, R = 5, BL = 6, B = 7, BR = 8;
        if (current == -1)
            return -1;
        let empty = overlays.map(b => !b);
        let tile = 54;
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
        const TL = 0, T = 1, TR = 2, L = 3, C = 4, R = 5, BL = 6, B = 7, BR = 8;
        if (current == -1)
            return -1;
        let tile = 10;
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
class TilesetManager {
    constructor(scene) {
        this.currentWallInd = 0;
        this.currentGroundInd = 0;
        this.currentOverlayInd = 0;
        this.wallLocations = {};
        this.groundLocations = {};
        this.overlayLocations = {};
        this.indexes = {};
        this.scene = scene;
        for (let tileset of WALLS)
            this.addTileset(tileset.key, 1 /* wall */);
        for (let tileset of GROUNDS)
            this.addTileset(tileset.key, 0 /* floor */);
        for (let tileset of OVERLAYS)
            this.addTileset(tileset.key, 2 /* overlay */);
    }
    addTileset(key, layer) {
        let res = this.scene.textures.get(key).getSourceImage(0).width / 9;
        let ind = (layer == 1 /* wall */ ? this.currentWallInd : layer == 0 /* floor */ ? this.currentGroundInd : this.currentOverlayInd);
        this[layer == 1 /* wall */ ? "wallLocations" : layer == 0 /* floor */ ? "groundLocations" : "overlayLocations"][ind] = { res: res, ind: ind, key: key };
        this.indexes[key] = ind;
        layer == 1 /* wall */ ? this.currentWallInd++ :
            layer == 0 /* floor */ ? this.currentGroundInd++ :
                this.currentOverlayInd++;
    }
}
class BrightenPipeline extends Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline {
    constructor(game) {
        let config = { game: game,
            renderer: game.renderer,
            fragShader: `
			precision mediump float;

			uniform sampler2D uMainSampler;

			varying vec2 outTexCoord;
			
			void main(void) {
				vec4 color  = texture2D(uMainSampler, outTexCoord);
				if (color.a == 0.0) discard;
				color += vec4(0.2, 0.2, 0.2, 0);
				gl_FragColor = color;
			}`
        };
        super(config);
    }
}
class OutlinePipeline extends Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline {
    constructor(game) {
        let config = { game: game,
            renderer: game.renderer,
            fragShader: `
			precision mediump float;

			uniform sampler2D uMainSampler;
			uniform float tex_size;

			varying vec2 outTexCoord;
			
			void main(void) {
				float factor = 1.0 / tex_size;

				vec4 color  = texture2D(uMainSampler, outTexCoord);
				vec4 colorU = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y + factor));
				vec4 colorD = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y - factor));
				vec4 colorL = texture2D(uMainSampler, vec2(outTexCoord.x + factor, outTexCoord.y));
				vec4 colorR = texture2D(uMainSampler, vec2(outTexCoord.x - factor, outTexCoord.y));
				
				if (color.a == 0.0 && (colorU.a != 0.0 || colorD.a != 0.0 || colorL.a != 0.0 || colorR.a != 0.0)) {
					gl_FragColor = vec4(1.0, 1.0, 1.0, 1);
				}
				else {
					if (color.a == 0.0) discard;
					color += vec4(0.1, 0.1, 0.1, 0);
					gl_FragColor = color;
				}
				
			}`
        };
        super(config);
    }
}
class InputManager {
    constructor(scene) {
        this.leftMouseState = false;
        this.rightMouseState = false;
        this.middleMouseState = false;
        this.leftMouseStateLast = false;
        this.rightMouseStateLast = false;
        this.middleMouseStateLast = false;
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
        for (let i = 0; i < 26; i++) {
            let letter = (i + 10).toString(36).toUpperCase();
            this.keys[letter] = scene.input.keyboard.addKey(letter);
        }
        for (let i = 0; i <= 9; i++) {
            this.keys[i + ""] = scene.input.keyboard.addKey(i + "");
        }
        for (let key in this.keys) {
            this.keysDown[key] = false;
            this.keysDownLast[key] = false;
        }
    }
    update() {
        this.leftMouseStateLast = this.leftMouseState;
        this.leftMouseState = this.scene.input.activePointer.leftButtonDown();
        this.rightMouseStateLast = this.rightMouseState;
        this.rightMouseState = this.scene.input.activePointer.rightButtonDown();
        this.middleMouseStateLast = this.middleMouseState;
        this.rightMouseState = this.scene.input.activePointer.middleButtonDown();
        for (let key in this.keys)
            this.keysDownLast[key] = this.keysDown[key];
        for (let key in this.keys)
            this.keysDown[key] = this.keys[key].isDown;
    }
    mouseDown() {
        return this.leftMouseState || this.rightMouseState;
    }
    mousePressed() {
        return (this.leftMouseState && !this.leftMouseStateLast) || (this.rightMouseState && !this.rightMouseStateLast);
    }
    mouseReleased() {
        return (!this.leftMouseState && this.leftMouseStateLast) || (!this.rightMouseState && this.rightMouseStateLast);
    }
    mouseLeftDown() {
        return this.leftMouseState;
    }
    mouseLeftPressed() {
        return this.leftMouseState && !this.leftMouseStateLast;
    }
    mouseLeftReleased() {
        return !this.leftMouseState && this.leftMouseStateLast;
    }
    mouseRightDown() {
        return this.rightMouseState;
    }
    mouseRightPressed() {
        return this.rightMouseState && !this.rightMouseStateLast;
    }
    mouseRightReleased() {
        return !this.rightMouseState && this.rightMouseStateLast;
    }
    keyDown(key) {
        return this.keysDown[key.toUpperCase()];
    }
    keyPressed(key) {
        return this.keysDown[key.toUpperCase()] && !this.keysDownLast[key.toUpperCase()];
    }
    keyReleased(key) {
        return !this.keysDown[key.toUpperCase()] && this.keysDownLast[key.toUpperCase()];
    }
}
function clamp(x, min, max) {
    if (min > max) {
        let t = max;
        max = min;
        min = t;
    }
    return Math.max(Math.min(x, max), min);
}
function dec2hex(dec) {
    return ('0' + dec.toString(16)).substr(-2);
}
function generateId(len) {
    let arr = new Uint8Array((len || 40) / 2);
    window.crypto.getRandomValues(arr);
    let stringArr = [];
    for (let i = 0; i < arr.length; i++)
        stringArr.push(dec2hex(arr[i]));
    return stringArr.join('');
}
class Vec2 {
    constructor(x, y) {
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
    equals(o) {
        return this.x == o.x && this.y == o.y;
    }
}
class Vec3 {
    constructor(x, y, z) {
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
    equals(o) {
        return this.x == o.x && this.y == o.y && this.z == o.z;
    }
}
class Vec4 {
    constructor(x, y, z, w) {
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
    equals(o) {
        return this.x == o.x && this.y == o.y && this.z == o.z && this.w == o.w;
    }
}
