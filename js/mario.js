(function(legoMario, undefined) {
	//private const
	const marioServiceUUID = '00001623-1212-efde-1623-785feabcd123';
	const marioCharacteristicUUID = '00001624-1212-efde-1623-785feabcd123';
	const volumeLevels = [0, 16, 32, 48, 64];
	
    //private property
    var marioDevice = undefined;
	var marioCharacteristic = undefined;

    //public methods
	legoMario.scan = function() {
		navigator.bluetooth
		.requestDevice({ filters: [{ services: [marioServiceUUID] }] })
		.then(device => {
			marioDevice = device;
			marioDevice.addEventListener('gattserverdisconnected', onDisconnected);
			return connect();
		})
		.catch(error => {
			console.log(error);
		});
    };

    legoMario.setVolume = function(level) {
		if (volumeLevels[level] !== undefined) {
			writeValueRaw([6, 0, 1, 0x12, 1, volumeLevels[level]]);
		}
    };
	
	legoMario.send = function (selector) {
		const value = document.querySelector(selector)?.value;
		if (value) {
			writeValueHex(value);
		}
	}
	
    //private methods
	function connect() {
		return marioDevice.gatt.connect()
			.then(server => {
				console.log('connected');
				return server.getPrimaryService(marioServiceUUID);
			})
			.then(service => {
				return service.getCharacteristic(marioCharacteristicUUID);
			})
			.then(characteristic => {
				marioCharacteristic = characteristic;
				marioCharacteristic.addEventListener('characteristicvaluechanged', onMarioEvent);
				marioCharacteristic
					.startNotifications()
					.then(_ => {
						console.log('notifications');
						subscribe().then(_ => {
							console.log('subscribed');
						});
					})
					.catch(error => {
						console.log(error);
					});
			});
	}
	
	function disconnect() {
		if (!marioDevice) { return; }
		if (marioDevice.gatt.connected) {
			marioDevice.gatt.disconnect();
		}
	}
	
	function onReconnectButtonClick() {
		if (!marioDevice) { return; }
		if (marioDevice.gatt.connected) { return; }
		connect().catch(error => {
			console.log(error);
		});
	}
	
	function onDisconnected() {
		const device = event.target;
		console.log(`Device ${device.name} is disconnected.`);
	}
	
	async function sleep(ms) {
		await new Promise(resolve => setTimeout(resolve, ms ?? 150))
	}
	
	async function subscribe() {
		await sleep();
		//rgb
		writeValueRaw([0x0a,0x00,0x41,0x01,0x01,0x05,0x00,0x00,0x00,0x01]);
		await sleep();
		//Events
		writeValueRaw([0x0a,0x00,0x41,0x03,0x02,0x01,0x00,0x00,0x00,0x01]);
		await sleep();
		//Gest
		writeValueRaw([0x0a,0x00,0x41,0x00,0x00,0x05,0x00,0x00,0x00,0x01]);
		await sleep();
		//Pants
		writeValueRaw([0x0a,0x00,0x41,0x02,0x00,0x01,0x00,0x00,0x00,0x01]);
		await sleep();
	}
	
	function onMarioEvent(event) {
		const value = event.target.value;
		var urd = Array.from(new Uint8Array(value.buffer));
		var rd = Array.from(new Int8Array(value.buffer));
		var length = urd[0];

		if (length == 8) {
			var values = Array.from(new Uint16Array(value.buffer));
			values.splice(0, 2);
			var [v1, v2] = values;
			if (urd[1] == 0 && urd[2] == 69 && urd[3] == 3) {
				dispatchEvent('mario_event', { rd: rd, urd: urd, v1: v1, v2: v2 });
			} else {
				dispatchEvent('mario_unknown', { rd: rd, urd: urd, v1: v1, v2: v2 });
			}
		} else if (length == 7) {
			const selector = urd[3] == 1 ? 'color' : (urd[3] == 0 ? 'position' : 'unknown');
			if (urd[3] == 1) {
				dispatchEvent('mario_rgb', { r: urd[4], g: urd[5], b: urd[6] });
			} else if (urd[3] == 0) {
				dispatchEvent('mario_motion', { x: rd[4], y: rd[5], z: rd[6] });			
			} else {
				dispatchEvent('mario_unknown', { rd: rd, urd, urd });
			}
		} else {
			dispatchEvent('mario_unknown', { rd: rd, urd: urd });
		}
	}
	
    function writeValueRaw(arrayValue) {
        if (marioCharacteristic && arrayValue) {
			marioCharacteristic.writeValue(new Uint8Array(arrayValue));
        }
    }
	
	function writeValueHex(stringHexValue) {
        if (marioCharacteristic && stringHexValue) {
			marioCharacteristic.writeValue(hexToMsg(stringHexValue));
        }
    }
	
	function hexToMsg(hexString) {
		return new Uint8Array(hexString.replace(/ /g, '').match(/.{2}/g).map(x => parseInt(x, 16)));
	}
	
	function dispatchEvent(eventName, detail) {
		document.dispatchEvent(new CustomEvent(eventName, { bubbles: true, detail: detail }));
	}
}(window.legoMario = window.legoMario || {}));
