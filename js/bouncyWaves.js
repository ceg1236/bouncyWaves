  var THREE = THREE || undefined;
 	var scene = new THREE.Scene();
  console.log('hello');
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.fromArray([0, 6, 30]);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    
	var leap = new Leap.Controller({ enableGestures: true });
	
	leap.connect();
	leap.use('riggedHand'); 
	leap.on( 'animationFrame', function(frame) {
	
		for (var i = 0; i < frame.hands.length; i++) {
			console.log( frame.hands[i] ); 
			var hand = frame.hands[i]; 
			var handMesh = hand.data('riggedHand.mesh');
			handMesh.scenePosition(hand.fingers[1].tipPosition, cube.position);
		}
	});
	
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	
	var box = new THREE.BoxGeometry( 1, 1, 1 );
	var boxMaterial = new THREE.MeshBasicMaterial( {
		color: 0x00ff00,
		wireframe: true
	} );
	var cube = new THREE.Mesh( box, boxMaterial );
	scene.add( cube );
	var axis = new THREE.AxisHelper(5);
    scene.add(axis);
	var interpolate = function(start,end,alpha){
		return start*(1-alpha) + end * alpha;
	}
	
	var Sphere = function(radius ) {
		var geometry = new THREE.SphereGeometry(radius, 32, 32 );
		var material = new THREE.MeshBasicMaterial( {
			color:Math.floor(0xffffff * Math.random())
		} );
		this.body = new THREE.Mesh( geometry, material );
	}
	var spheres = [];
	var numSpheres = 100;
	for (var i = 0; i < numSpheres; i++) {
		var sphere = new Sphere(Math.floor(interpolate(1,5,Math.random()))); 
		scene.add( sphere.body );
		spheres.push(sphere); 
	}
	
	
	var bounds = {
		minx : -50,
		maxx : 50,
		miny : -50,
		maxy : 50,
		minz : -50,
		maxz : 50
	};
	console.log(sphere); 
	
	//camera.position.z = 100;
	
	var bouncyBallSetup = function(){
		
		this.vx=interpolate(-0.03,0.03,Math.random());
		this.vy=interpolate(-0.03,0.03,Math.random());
		this.vz=interpolate(-0.03,0.03,Math.random());
		
		this.position.x = interpolate(bounds.minx,bounds.maxx,Math.random());
		this.position.y = interpolate(bounds.minx,bounds.maxx,Math.random());
		this.position.z = interpolate(bounds.minx,bounds.maxx,Math.random());
	}
	
	var bouncyBallUpdate = function(){
		this.position.x += this.vx; 
		this.position.y += this.vy; 
		this.position.z += this.vz;
		
		if(this.position.x > bounds.maxx || this.position.x < bounds.minx){
			this.vx = -this.vx;
		}
		if(this.position.y > bounds.maxy || this.position.y < bounds.miny){
			this.vy = -this.vy;
		}
		if(this.position.z > bounds.maxz || this.position.z < bounds.minz){
			this.vz = -this.vz;
		}
		
	}
	for(var i = 0; i< spheres.length; i++){
     bouncyBallSetup.call(spheres[i].body);
	}
	var orbitRadius = 100;
	var counter = 0;
	var precision = 100;
	var pathx = 0;
	var pathy = 0;
	var pathz = 0;
	var pathx2 = 0;
	var pathy2 = 0;
	var pathz2 = 0;
	var petals = 5/4;
	function render() {
		
		requestAnimationFrame( render );
		var effectiveRadius = orbitRadius + Math.sin(counter/10);
		pathx = effectiveRadius * Math.cos(petals*(counter/precision)) * Math.cos((counter/precision));
		pathy = effectiveRadius * Math.sin(petals*(counter/precision))  * Math.cos((counter/precision));
		pathz = effectiveRadius * Math.sin(petals*(counter/precision))  * Math.sin((counter/precision));
		pathx2 = effectiveRadius * Math.cos(petals*((counter+2)/precision)) * Math.cos(((counter+2)/precision));
		pathy2 = effectiveRadius * Math.sin(petals*((counter+2)/precision))  * Math.cos(((counter+2)/precision));
		pathz2 = effectiveRadius * Math.sin(petals*((counter+2)/precision))  * Math.sin(((counter+2)/precision));
		// camera.position.x = pathx;
		// camera.position.y = pathy;
		// camera.position.z = pathz;
		for(var i = 0; i< spheres.length; i++){
		  bouncyBallUpdate.call(spheres[i].body);
		}
		
		renderer.render(scene, camera);
		// counter++;
	}
	render();