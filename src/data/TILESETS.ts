interface TilesetFileProps {
	name: string,
	key: string,
	file: string,
	res: number
}

const WALLS: TilesetFileProps[] = [
	{ name: "Dungeon Wall", 										key: "wall_dungeon", 								file: "res/tileset/wall_dungeon", 			res: 16 },
	{ name: "Wood Wall",												key: "wall_wood", 									file: "res/tileset/wall_wood", 					res: 16 },
];

const GROUNDS: TilesetFileProps[] = [
	{ name: "Cave Floor",	 											key: "ground_cave", 								file: "res/tileset/ground_cave",		 		res: 16 },
	{ name: "Lawn",															key: "ground_wood", 								file: "res/tileset/ground_grass", 			res: 16 },
];
