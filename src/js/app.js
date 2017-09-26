'use strict';

import {Vector3, Scene, CubeGeometry, Mesh,MeshBasicMaterial, PerspectiveCamera, WebGLRenderer, BoxHelper} from 'three';
import { SpecialPoint } from './SpecialPoint';

const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const CUBE_SIZE = 70;
const BUMP_ENERGY_LOSS = 0.7;

var cube = new Mesh( 
    new CubeGeometry( CUBE_SIZE, CUBE_SIZE, CUBE_SIZE ), 
    new MeshBasicMaterial( {
        color: 0xff8010,
        wireframe: true
    } )
);

scene.add(cube);


const N = 11;
const OFFSET = 5;

let points = new Array(N * N);

for (let i = 0; i < N; i++){
	for (let j = 0; j < N; j++){
		let specialPoint = new SpecialPoint(new Vector3((i - N / 2) * OFFSET, (j - N / 2) * OFFSET, 0.0));
		specialPoint.setRandomVelocity();
		points[i * N + j] = specialPoint;
		scene.add(specialPoint.mesh);
	}
}

function updatePoints() {

	for (var i = 0 ; i < points.length; i++){
		let point = points[i];
		let gravityVec = new Vector3(0, -0.0981, 0.0);
		let velocity = point.position.clone().sub(point.prevPosition);
		velocity.add(gravityVec);

		point.prevPosition = point.position;
		point.position.add(velocity);

		if (point.position.x > CUBE_SIZE / 2){
			point.position.x = CUBE_SIZE / 2;
			point.prevPosition.x = point.position.x + velocity.x * BUMP_ENERGY_LOSS;
		}
		else if (point.position.x < - CUBE_SIZE / 2){
			point.position.x = - CUBE_SIZE / 2;
			point.prevPosition.x = point.position.x + velocity.x * BUMP_ENERGY_LOSS;
		}

		if (point.position.y > CUBE_SIZE / 2){
			point.position.y = CUBE_SIZE / 2;
			point.prevPosition.y = point.position.y + velocity.y * BUMP_ENERGY_LOSS;
		}
		else if (point.position.y < - CUBE_SIZE / 2){
			point.position.y = - CUBE_SIZE / 2;
			point.prevPosition.y = point.position.y + velocity.y * BUMP_ENERGY_LOSS;
		}

		if (point.position.z > CUBE_SIZE / 2){
			point.position.z = CUBE_SIZE / 2;
			point.prevPosition.z = point.position.z + velocity.z * BUMP_ENERGY_LOSS;
		}
		else if (point.position.z < - CUBE_SIZE / 2){
			point.position.z = - CUBE_SIZE / 2;
			point.prevPosition.z = point.position.z + velocity.z * BUMP_ENERGY_LOSS;
		}
	}
}


function render() {
	requestAnimationFrame(render);
	updatePoints();
	renderer.render(scene, camera);
}


camera.position.z = 100;
render();
