import  { Vector3 ,SphereGeometry, MeshBasicMaterial, Mesh} from 'three';

export class SpecialPoint {

	constructor(startingPosition) {
		var geometry = new SphereGeometry( 1, 32, 32 );
		var material = new MeshBasicMaterial( {color: 0xff8010} );
		this._mesh = new Mesh( geometry, material );
		this._mesh.position.set(startingPosition.x, startingPosition.y, startingPosition.z);
		this._prevPosition = startingPosition.clone();
	}

	setVelocity(vel){
		this.position = vel;
		this.prevPosition = this.position.clone().sub(vel);
	}

	setRandomVelocity(){
		this.setVelocity(new Vector3(Math.random(), Math.random(), Math.random()));
	}

	get position(){
		return this._mesh.position;
	}

	get prevPosition(){
		return this._prevPosition;
	}

	get mesh(){
		return this._mesh;
	}

	set position(value){
		this.mesh.position.set(value.x, value.y, value.z);
	}

	set prevPosition(value){
		this._prevPosition.set(value.x, value.y, value.z);
	}

}