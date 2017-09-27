import { LineBasicMaterial, Geometry, Line } from 'three';

export class Stick {


	constructor(specialPoint1, specialPoint2) {
		this._specialPoint1 = specialPoint1;
		this._specialPoint2 = specialPoint2;

		var material = new LineBasicMaterial({
			color: 0xffff00
		});

		var geometry = new Geometry();
		geometry.vertices.push(
			this._specialPoint1.position,
			this._specialPoint2.position
		);
		

		this._mesh = new Line( geometry, material );
		this._initialLength = this._specialPoint1.position.distanceTo(this._specialPoint2.position);
	}

	get mesh(){
		return this._mesh;
	}

	update() {
		let currentLength = this._specialPoint1.position.distanceTo(this._specialPoint2.position);
		let diff = currentLength - this._initialLength;
		let diffHalf = diff / 2.0;
		let pointVel = this._specialPoint2.position.clone().sub(this._specialPoint1.position).normalize().multiplyScalar(diffHalf / currentLength);
		
		if (!this._specialPoint1.isPinned()){
			this._specialPoint1.prevPosition = this._specialPoint1.position;
			this._specialPoint1.position.add(pointVel);
		}

		if (!this._specialPoint2.isPinned()){
			this._specialPoint2.prevPosition = this._specialPoint2.position;
			this._specialPoint2.position.sub(pointVel);	
		}
	
		this._mesh.geometry.verticesNeedUpdate = true;	
	}

}