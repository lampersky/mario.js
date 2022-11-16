(function () {
	let container, camera, scene, renderer, model;

	initScene();
	renderScene();

	function initScene() {
		container = document.createElement('div');
		document.body.appendChild(container);
		camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 200);
		camera.position.z = 10;
		scene = new THREE.Scene();
		var ambientLight = new THREE.AmbientLight(0x404040, 6);
		scene.add(ambientLight);
		var manager = new THREE.LoadingManager();
		var mtlLoader = new THREE.MTLLoader(manager);
		mtlLoader.setTexturePath('resources/');
		mtlLoader.load('resources/mario.mtl', materials => {
			materials.preload();
			var objLoader = new THREE.OBJLoader(manager);
			objLoader.setMaterials(materials);
			objLoader.load('resources/mario.obj', object => {
				model = object;
				model.quaternion.fromArray([0.0, 0.0, 0.0, 0.5]).inverse();
				scene.add(model);
		  });
		});
		renderer = new THREE.WebGLRenderer({ alpha: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		container.appendChild(renderer.domElement);
		window.addEventListener('resize', () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		}, false);
	}
	
	function renderScene() {
		requestAnimationFrame(renderScene);
		camera.lookAt(scene.position);
		renderer.render(scene, camera);
	}
	
	function rotateMario(r, y, p) {
		// sensor returns values between -33..0..33
		var pitch = (90 * p) / 33
		var roll = (90 * -r) / 33;
		var yaw = (90 * (y-32)) / 33;

		var yaw = 0;

		//deg to rad
		var r = roll * Math.PI/180;
		var p = pitch * Math.PI/180;
		var y = yaw * Math.PI/180;
	
		//calculate quaternion from Euler angles
		var cr = Math.cos(r * 0.5);
		var sr = Math.sin(r * 0.5);
		var cp = Math.cos(p * 0.5);
		var sp = Math.sin(p * 0.5);
		var cy = Math.cos(y * 0.5);
		var sy = Math.sin(y * 0.5);

		var w = cr * cp * cy + sr * sp * sy;
		var x = sr * cp * cy - cr * sp * sy;
		var y = cr * sp * cy + sr * cp * sy;
		var z = cr * cp * sy - sr * sp * cy;

		model.quaternion.fromArray([y,z,x,w]).inverse();
	}
	
	window.rotateMario = rotateMario;
})();