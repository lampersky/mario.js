(function () {
	document.addEventListener('mario_rgb', (e) => {
		//document.getElementById('color').textContent = `R: ${e.detail.r} G:${e.detail.g} B:${e.detail.b}`;
		document.body.style.background = `rgb(${e.detail.r}, ${e.detail.g}, ${e.detail.b})`;
	});
	document.addEventListener('mario_motion', (e) => {
		//document.getElementById('position').textContent = `X: ${e.detail.x} Y:${e.detail.y} Z:${e.detail.z}`;
		window.rotateMario(e.detail.x, e.detail.y, e.detail.z);
	});
	document.addEventListener('mario_unknown', (e) => {
		console.log([...e.detail.urd].map(x => `0x${x.toString(16).padStart(2, '0')}`).join(', '));
	});
	
	//todo
	const tiles = {2: 'goomba', 4: 'timer', 13: 'thwimp', 16: 'cyclical', 20: 'cyclical', 21: 'timer', 29: 'bowser senior', 32: 'heart', 33: 'one', 35: 'mushroom', 41: 'surprise', 44: 'platform', 46: 'cloud', 60: 'stop', 93: 'talk', 99: 'tree', 123: 'star', 125: '???', 128: 'surprise', 136: '??', 137: 'fish', 139: 'bowser junior', 140: 'peach', 144: 'timer', 150: 'bowser senior', 153: 'bowser junior', 181: 'stop', 183: 'goal', 184: 'start', 190: 'spider'};
	const clothes = {0 : 'naked', 1: 'classic', 6: 'pinguin'};
	const points = { 180 : "belly", 128 : "?", 9 : "walk", 94 : "thwimp" };
	
	document.addEventListener('mario_event', (e) => {
		var [rd, urd] = [e.detail.rd, e.detail.urd];
		urd.splice(0, 4);
		const [a,b,c,d] = urd;
		
		if (a == 21) {
			console.log(`new clothes: ${clothes[c]}`);
		} 
		else if (b == 32) {
			console.log(`points: ${c} for [${points[a] ? points[a] : a}]`);
		}
		else if (tiles[a] && b == 56) {
			console.log(`mario: [tiles[a], ${c}]`);
		}
		else if (a == 97 && b == 56) {
			console.log(`mario is lying [${c}, ${d}]`);
		}
		else if (a == 102 && b == 56) {
			console.log(`Mario ${ c == 0 ? 'fell asleep' : 'woke up'} [${c}, ${d}]`);
		}
		else if (a == 2 && b == 24) {
			console.log(`Mario ${ c == 2 ? 'fell asleep' : 'woke up'} [${c}, ${d}]`);
		}
		else if (a == 87 && b == 56) {
			console.log(`jump ${c}, ${d}`);
		}
		else if (a == 98 && b == 56) {
			if (c == 2) {
				console.log(`yawn [${d}]`);
			} else {
				console.log(`standing ${c}, ${d}`);
			}
		}
		else if (a == 19) {
			console.log(`stood on: ${tiles[c]}`);
		}
		else if (a == 18 && b == 55) {
			console.log(`gumba ${c},${d}`);
		}
		else if (b == 56) {
			if (a == 3) {
				console.log(`Mario ${c == 0 ? 'entry' : c},${d}`);
			} else if (a == 82 || a == 110) {
				console.log(`unknown3 ${a},${b},${c},${d}`);
			} else {
				console.log(`unknown2 ${a},${b},${c},${d}`);
			}
		}
		else if (b == 24) {
			if (a == c) {
				if (a == 1) {
					console.log(`start`);
				} else if (a == 3) {
					console.log(`end`);
				}
			} else {
				console.log(`unknown1: ${a},${b},${c},${d}`);
			}
		}
		else if (a == 4) {
			if (b == 48) {
				console.log(`end of time : ${c},${d}`);
			} else if (b == 64) {
				console.log(`question mark counter : ${c},${d}`);
			}
		}
		else {
			console.log(`unknown: ${a},${b},${c},${d}`);
		}
	});
})();