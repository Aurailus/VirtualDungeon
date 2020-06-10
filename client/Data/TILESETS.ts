interface TilesetFileProps {
	name: string,
	key: string,
	file: string,
	res: number
}

const WALLS: TilesetFileProps[] = [
	{ name: "Dungeon Wall", 										key: "wall_dungeon", 								file: "/public/res/tileset/wall_dungeon", 			res: 16 },
	{ name: "Wood Wall",												key: "wall_wood", 									file: "/public/res/tileset/wall_wood", 					res: 16 },
	{ name: "Shadow Wall",											key: "wall_shadow", 								file: "/public/res/tileset/wall_shadow", 				res: 16 },
];

const GROUNDS: TilesetFileProps[] = [
	{ name: "Cave Floor",	 											key: "ground_cave", 								file: "/public/res/tileset/ground_cave",		 		res: 16 },
	{ name: "Lawn",															key: "ground_grass", 								file: "/public/res/tileset/ground_grass", 			res: 16 },
	{ name: "Wood Floor",												key: "ground_wood", 								file: "/public/res/tileset/ground_wood",	 			res: 16 },
];

const OVERLAYS: TilesetFileProps[] = [
	{ name: "Water",														key: "overlay_water", 							file: "/public/res/tileset/overlay_water", 			res: 16 },
	{ name: "Hole",	 														key: "overlay_hole", 								file: "/public/res/tileset/overlay_hole",		 		res: 16 },
];
