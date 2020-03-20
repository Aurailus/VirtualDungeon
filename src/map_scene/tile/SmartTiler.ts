namespace SmartTiler {
	export function wall(walls: boolean[], current: number): number {
		const TL = 0, T = 1, TR = 2, L = 3, C = 4, R = 5, BL = 6, B = 7, BR = 8;

		if (current == -1) return -1;

		let empty = walls.map(b => !b);
		let tile = 54;

		if (empty[T]) {
			if (empty[B]) {
				if (empty[L]) {
					if (empty[R]) tile = 33;
					else tile = 15; 
				}
				else if (empty[R]) tile = 5;
				else tile = 2;
			}
			else if (empty[L]) {
				if (empty[R]) tile = 14;
				else if (empty[BR]) tile = 0;
				else tile = 7;
			}
			else if (empty[R]) {
				if (empty[BL]) tile = 1;
				else tile = 8;
			}
			else {
				if (empty[BL]) {
					if (empty[BR]) tile = 3;
					else tile = 40;
				}
				else if (empty[BR]) tile = 41;
				else tile = 31;
			}
		}
		else if (empty[B]) {
			if (empty[L]) {
				if (empty[R]) tile = 6;
				else if (empty[TR]) tile = 9;
				else tile = 16;
			}
			else if (empty[R]) {
				if (empty[TL]) tile = 10;
				else tile = 17;
			}
			else {
				if (empty[TL]) {
					if (empty[TR]) tile = 4;
					else tile = 49;
				}
				else if (empty[TR]) tile = 50;
				else tile = 32;
			}
		}
		else if (empty[L]) {
			if (empty[R]) tile = 11;
			else {
				if (empty[TR]) {
					if (empty[BR]) tile = 12;
					else tile = 38;
				}
				else if (empty[BR]) tile = 47;
				else tile = 22;
			}
		}
		else if (empty[R]) {
			if (empty[TL]) {
				if (empty[BL]) tile = 13;
				else tile = 39;
			}
			else if (empty[BL]) tile = 48;
			else tile = 23;
		}
		else if (empty[TL]) {
			if (empty[TR]) {
				if (empty[BL]) {
					if (empty[BR]) tile = 25;
					else tile = 36;
				}
				else if (empty[BR]) tile = 37; 
				else tile = 21;
			}
			else if (empty[BL]) {
				if (empty[BR]) tile = 45;
				else tile = 30;
			}
			else if (empty[BR]) tile = 51;
			else tile = 28;
		}
		else if (empty[TR]) {
			if (empty[BL]) {
				if (empty[BR]) tile = 46;
				else tile = 42;
			}
			else if (empty[BR]) tile = 29;
			else tile = 27;
		}
		else if (empty[BL]) {
			if (empty[BR]) tile = 20;
			else tile = 19;
		}
		else if (empty[BR]) tile = 18;
		else {
			if (current >= 54 && current <= 60) return -1;
			tile = 54 + Math.floor(Math.random() * 6);
		}

		return tile;
	}

	export function overlay(overlays: boolean[], current: number): number {
		const TL = 0, T = 1, TR = 2, L = 3, C = 4, R = 5, BL = 6, B = 7, BR = 8;

		if (current == -1) return -1;

		let empty = overlays.map(b => !b);
		let tile = 54;

		if (empty[T]) {
			if (empty[B]) {
				if (empty[L]) {
					if (empty[R]) tile = 33;
					else tile = 15; 
				}
				else if (empty[R]) tile = 5;
				else tile = 2;
			}
			else if (empty[L]) {
				if (empty[R]) tile = 14;
				else if (empty[BR]) tile = 0;
				else tile = 7;
			}
			else if (empty[R]) {
				if (empty[BL]) tile = 1;
				else tile = 8;
			}
			else {
				if (empty[BL]) {
					if (empty[BR]) tile = 3;
					else tile = 40;
				}
				else if (empty[BR]) tile = 41;
				else tile = 31;
			}
		}
		else if (empty[B]) {
			if (empty[L]) {
				if (empty[R]) tile = 6;
				else if (empty[TR]) tile = 9;
				else tile = 16;
			}
			else if (empty[R]) {
				if (empty[TL]) tile = 10;
				else tile = 17;
			}
			else {
				if (empty[TL]) {
					if (empty[TR]) tile = 4;
					else tile = 49;
				}
				else if (empty[TR]) tile = 50;
				else tile = 32;
			}
		}
		else if (empty[L]) {
			if (empty[R]) tile = 11;
			else {
				if (empty[TR]) {
					if (empty[BR]) tile = 12;
					else tile = 38;
				}
				else if (empty[BR]) tile = 47;
				else tile = 22;
			}
		}
		else if (empty[R]) {
			if (empty[TL]) {
				if (empty[BL]) tile = 13;
				else tile = 39;
			}
			else if (empty[BL]) tile = 48;
			else tile = 23;
		}
		else if (empty[TL]) {
			if (empty[TR]) {
				if (empty[BL]) {
					if (empty[BR]) tile = 25;
					else tile = 36;
				}
				else if (empty[BR]) tile = 37; 
				else tile = 21;
			}
			else if (empty[BL]) {
				if (empty[BR]) tile = 45;
				else tile = 30;
			}
			else if (empty[BR]) tile = 51;
			else tile = 28;
		}
		else if (empty[TR]) {
			if (empty[BL]) {
				if (empty[BR]) tile = 46;
				else tile = 42;
			}
			else if (empty[BR]) tile = 29;
			else tile = 27;
		}
		else if (empty[BL]) {
			if (empty[BR]) tile = 20;
			else tile = 19;
		}
		else if (empty[BR]) tile = 18;
		else {
			if (current >= 54 && current <= 60) return -1;
			tile = 54 + Math.floor(Math.random() * 6);
		}

		return tile;
	}

	export function ground(walls: boolean[], current: number): number {
		const TL = 0, T = 1, TR = 2, L = 3, C = 4, R = 5, BL = 6, B = 7, BR = 8;

		if (current == -1) return -1;

		let tile = 10;

		if (walls[C]) tile = 10;
		else if (walls[B]) { 
		 	if (walls[T]) {
		 		if (walls[R]) { 
		 			if (walls[L]) tile = 49;
		 			else tile = 26;
		 		}
		 		else if (walls[L]) tile = 8;
		 		else tile = 17;
		 	}
			else if (walls[L]) {
				if (walls[R]) tile = 48;
				else if (walls[TR]) tile = 45;
				else tile = 21;
			}
			else if (walls[R]) {
				if (walls[TL]) tile = 47;
				else tile = 23;
			}
			else if (walls[TL]) {
				if (walls[TR]) tile = 46;
				else tile = 41;
			}
			else if (walls[TR]) tile = 40;
		 	else tile = 1;
		}
		else if (walls[T]) {
			if (walls[L]) {
				if (walls[R]) tile = 30;
				else if (walls[BR]) tile = 27;
				else tile = 3;
			}
			else if (walls[R]) {
				if (walls[BL]) tile = 29; 
				else tile = 5;
			}
			else if (walls[BL]) {
				if (walls[BR]) tile = 28;
				else tile = 32;
			}
			else if (walls[BR]) tile = 31;
			else tile = 19;
		}
		else if (walls[L]) {
			if (walls[R]) tile = 39;
			else if (walls[TR]) {
				if (walls[BR]) tile = 36;
				else tile = 51;
			}
			else if (walls[BR]) tile = 42;
			else tile = 11;
		}
		else if (walls[R]) {
			if (walls[TL]) {
				if (walls[BL]) tile = 38;
				else tile = 52;
			}
			else if (walls[BL]) tile = 43;
			else tile = 9;
		}
		else if (walls[TL]) {
			if (walls[TR]) {
				if (walls[BL]) {
					if (walls[BR]) tile = 37;
					else tile = 6;
				}
				else if (walls[BR]) tile = 7;
				else tile = 4;
			}
			else if (walls[BL]) {
				if (walls[BR]) tile = 15;
				else tile = 12;
			}
			else if (walls[BR]) tile = 33;
			else tile = 20;
		}
		else if (walls[TR]) {
			if (walls[BL]) {
				if (walls[BR]) tile = 16;
				else tile = 34;
			}
			else if (walls[BR]) tile = 14;
			else tile = 18; 
		}
		else if (walls[BL]) {
			if (walls[BR]) tile = 22;
			else tile = 2;
		}
		else if (walls[BR]) tile = 0;
		else {
			if (current >= 54 && current <= 60) return -1;
			tile = 54 + Math.floor(Math.random() * 6);
		}

		return tile;
	}

	export function fogOfWar(walls: boolean[]): number {
		const TL = 0, T = 1, TR = 2, L = 3, C = 4, R = 5, BL = 6, B = 7, BR = 8;

		if (walls[C] == false) return -1;

		let empty = walls.map(b => !b);
		let tile = 54;

		if (empty[T]) {
			if (empty[B]) {
				if (empty[L]) {
					if (empty[R]) tile = 33;
					else tile = 15; 
				}
				else if (empty[R]) tile = 5;
				else tile = 2;
			}
			else if (empty[L]) {
				if (empty[R]) tile = 14;
				else if (empty[BR]) tile = 0;
				else tile = 7;
			}
			else if (empty[R]) {
				if (empty[BL]) tile = 1;
				else tile = 8;
			}
			else {
				if (empty[BL]) {
					if (empty[BR]) tile = 3;
					else tile = 40;
				}
				else if (empty[BR]) tile = 41;
				else tile = 31;
			}
		}
		else if (empty[B]) {
			if (empty[L]) {
				if (empty[R]) tile = 6;
				else if (empty[TR]) tile = 9;
				else tile = 16;
			}
			else if (empty[R]) {
				if (empty[TL]) tile = 10;
				else tile = 17;
			}
			else {
				if (empty[TL]) {
					if (empty[TR]) tile = 4;
					else tile = 49;
				}
				else if (empty[TR]) tile = 50;
				else tile = 32;
			}
		}
		else if (empty[L]) {
			if (empty[R]) tile = 11;
			else {
				if (empty[TR]) {
					if (empty[BR]) tile = 12;
					else tile = 38;
				}
				else if (empty[BR]) tile = 47;
				else tile = 22;
			}
		}
		else if (empty[R]) {
			if (empty[TL]) {
				if (empty[BL]) tile = 13;
				else tile = 39;
			}
			else if (empty[BL]) tile = 48;
			else tile = 23;
		}
		else if (empty[TL]) {
			if (empty[TR]) {
				if (empty[BL]) {
					if (empty[BR]) tile = 25;
					else tile = 36;
				}
				else if (empty[BR]) tile = 37; 
				else tile = 21;
			}
			else if (empty[BL]) {
				if (empty[BR]) tile = 45;
				else tile = 30;
			}
			else if (empty[BR]) tile = 51;
			else tile = 28;
		}
		else if (empty[TR]) {
			if (empty[BL]) {
				if (empty[BR]) tile = 46;
				else tile = 42;
			}
			else if (empty[BR]) tile = 29;
			else tile = 27;
		}
		else if (empty[BL]) {
			if (empty[BR]) tile = 20;
			else tile = 19;
		}
		else if (empty[BR]) tile = 18;
		else {
			if (!empty[C]) return -1;
			tile = 54;
		}

		return tile;
	}
}
