'use strict';

import {Vector3, Vector2, Scene, CubeGeometry, Mesh,MeshBasicMaterial, PerspectiveCamera, WebGLRenderer, Raycaster } from 'three';
import { SpecialPoint } from './SpecialPoint';
import { Stick } from './Stick';

const CUBE_SIZE = 100;
const BUMP_ENERGY_LOSS = 0.7;
const N = 11;
const OFFSET = 10;

let scene, camera, raycaster, renderer, time;
let specialPoints, pointMeshes, sticks;

function setupScene() {
	time = 0.0;
	scene = new Scene();
	camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.z = 140;
	raycaster = new Raycaster();
	renderer = new WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	setupBoundingCube();
	setupSpecialPoints();
	setupSticks();
}

function setupBoundingCube(){
	var cube = new Mesh( 
    new CubeGeometry( CUBE_SIZE, CUBE_SIZE, CUBE_SIZE ), 
    new MeshBasicMaterial( {
        color: 0xff8010,
        wireframe: true
    })
	);
	cube.name = "Cube";
	cube.pickable = false;
	scene.add(cube);
}

function setupSpecialPoints() {
	specialPoints = new Array(N * N);
	pointMeshes = new Array(N * N);
	

	for (let i = 0; i < N; i++){
		for (let j = 0; j < N; j++){
			let specialPoint = new SpecialPoint(new Vector3((i - N / 2) * OFFSET, (j - N / 2) * OFFSET, 0.0), i * N + j);
			if (j == N-1)
				specialPoint.setPinned(true);
			if (j != N-1)
				specialPoint.setRandomVelocity();
			specialPoints[i * N + j] = specialPoint;
			pointMeshes[i * N + j] = specialPoint.mesh;
			scene.add(specialPoint.mesh);
		}
	}
}

function setupSticks(){
	sticks = new Array();
	for (let i = 0; i < N; i++){
		for (let j = 0; j < N; j++){

			if (i < N - 1) {
				let stickDown = new Stick(specialPoints[i * N + j], specialPoints[(i+1) * N + j]);
				scene.add(stickDown.mesh);
				sticks.push(stickDown);
			}
	 
			if (j < N - 1){
				let stickRight =  new Stick(specialPoints[i * N + j + 1], specialPoints[i * N + j]);
				scene.add(stickRight.mesh);
				sticks.push(stickRight);	
			}
		}
	}
}

function updateSpecialPoints() {

	for (var i = 0 ; i < specialPoints.length; i++){
		let point = specialPoints[i];

		if (point.isPinned())
			continue;

		let gravityVec = new Vector3(0, -0.0981, 0.0);
		let velocity = point.position.clone().sub(point.prevPosition);
		let windVelocity = new Vector3(0, 0, Math.sin(time) / 5);
		velocity.add(gravityVec);
		velocity.add(windVelocity);

		point.prevPosition = point.position;
		point.position.add(velocity);
	}
}

function updateSticks(){
	for (var i = 0; i < sticks.length; i++){
		sticks[i].update();
	}
}

function constraintSpecialPoints(){

	for (let i = 0; i < specialPoints.length; i++){

		let point = specialPoints[i];
		
		if (point.isPinned())
			continue;

		let velocity = point.position.clone().sub(point.prevPosition);

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

function setupMouseListeners() {

	let mouseDownSpecialPoint = null;
	let mouseDownPosition = null;
	let mouseDown2D = null;

	renderer.domElement.addEventListener('mousedown', (event) => {

		mouseDown2D = new Vector2();
		mouseDown2D.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouseDown2D.y =  -(event.clientY / window.innerHeight) * 2 + 1;
		raycaster.setFromCamera( mouseDown2D, camera );
		let pickedObjects = raycaster.intersectObjects(pointMeshes, true);
		let foundObject = pickedObjects.find(pickedObject => {
			return pickedObject.object.name.startsWith("SpecialPoint");
		});

		if (foundObject){

			mouseDownSpecialPoint = specialPoints.find(point => {
				return point.mesh.name == foundObject.object.name;
			});

			mouseDownPosition = mouseDownSpecialPoint.position;

		}
	});

	renderer.domElement.addEventListener('mousemove', (event) => {

		if (!mouseDownPosition)
			return;

		let mouseMove2D = new Vector2();
		mouseMove2D.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouseMove2D.y = -(event.clientY / window.innerHeight) * 2 + 1;
		let delta = mouseMove2D.clone().sub(mouseDown2D);

		mouseDownSpecialPoint.prevPosition = mouseDownSpecialPoint.position;
		mouseDownSpecialPoint.position.add(new Vector3(delta.x, delta.y, 0.0));
	});

	renderer.domElement.addEventListener('mouseup', (event) => {
		mouseDownPosition = null;
	});
}

function render() { 

	requestAnimationFrame(render);
	for (var i = 0; i < 3; i++){
		updateSpecialPoints();
		updateSticks();
	}
	
	constraintSpecialPoints();
	renderer.render(scene, camera);
	time += 0.01;
}



setupScene();
setupMouseListeners();
render();
