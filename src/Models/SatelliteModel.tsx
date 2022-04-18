import { Matrix4, Mesh, MeshBasicMaterial, SphereGeometry, TextureLoader, Vector3, Vector4 } from 'three';
import { CoordinateFrame } from '../Utilities/CoordinateFrame'
import { v4 as generateV4 } from 'uuid';

export type SatelliteIdentifier = string;

// Radii are relative to the radius of the primary. For the sun, bodyRadius is the absolute distance. 
export interface SatelliteParameters {
	bodyRadius: number,
	rotationalAngularVelocity: number,
	orbitalRadius: number, // relativeQuantity?
	orbitalAngularVelocity: number
}

// TODO: Add a function to change parameters.
export class SatelliteModel {

	public static createSatelliteParameters(bodyRadius: number, rotationalAngularVelocity: number, orbitalRadius: number, orbitalAngularVelocity: number): SatelliteParameters {

        const params: SatelliteParameters = {
            bodyRadius: bodyRadius,
            rotationalAngularVelocity: rotationalAngularVelocity,
            orbitalRadius: orbitalRadius,
            //orbitalPhase: orbitalPhase,
            orbitalAngularVelocity: orbitalAngularVelocity,
            //texturePath: texturePath
        };

        return params;
    }

	private parent: SatelliteModel;
	private children: SatelliteModel[] = [];
	private parameters: SatelliteParameters;

	private frame: CoordinateFrame;
	private mesh: THREE.Mesh<THREE.BufferGeometry, THREE.Material>;

	private isDeleted: boolean = false; // Cleans up logic in SolarSystemModel

	private uuid: SatelliteIdentifier;

	// Angle in radians
	private currentPhase = 0;
	private phaseAtLastCapture = 0;
	private currentTime = 0;
	private timeAtLastCapture = 0;

    constructor(parent: SatelliteModel, parameters: SatelliteParameters, private texturePath: string, initialPhase: number = 0) {
		this.uuid = generateV4();

		this.parent = parent;
		this.children = [];

		this.parameters = parameters;

		this.frame = new CoordinateFrame(new Vector3(1,0,0), new Vector3(0,1,0), new Vector3(0,0,1), new Vector3(0,0,0));

		// THREE.SphereGeometry constructor requires absolute size, not relative
		const scalingFactor = this.parent ? parent.frame.E1.length() : 1;
		const absoluteRadius = scalingFactor * this.parameters.bodyRadius;

		//var geometry = new SphereGeometry(this.parameters.bodyRadius, 16, 16);
		var geometry = new SphereGeometry(absoluteRadius, 16, 16);
		var texture = new TextureLoader().load(texturePath);
		var material = new MeshBasicMaterial({ map: texture });
		//var material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
		this.mesh = new Mesh(geometry, material);
		this.mesh.rotation.x += Math.PI / 2;

		this.phaseAtLastCapture = initialPhase;
		this.setCoordinateFrame(this.phaseAtLastCapture);

		if (parent) {
			this.parent.addChild(this);
		}

	}

	public get UUID(): SatelliteIdentifier {
		return this.uuid;
	}

	// TODO: Make fail gracefully
	public get ParentUUID(): string {
		return this.parent.UUID;
	}

	public get IsDeleted(): boolean {
		return this.isDeleted;
	}

	public get Origin(): Vector3 {
		return this.frame.Origin.clone();
	}

	public get Parameters(): SatelliteParameters {
		return this.parameters;
	}

	public get TexturePath(): string {
		return this.texturePath;
	}

	public set Parameters(value: SatelliteParameters) {
		this.capturePhaseAndTime();
		const scalingFactor = Math.max(value.bodyRadius / this.parameters.bodyRadius, 0.01);
		//this.mesh.geometry.scale(scalingFactor, scalingFactor, scalingFactor);
		this.scaleThisAndAllChildren(scalingFactor);
		this.parameters = value;
	}

	public addChild(satellite: SatelliteModel): void {
		this.children.push(satellite);
	}

	// Ideally this would go into SolarSystemView, but I don't want to expose this.children
	public addToScene(scene: THREE.Scene) {
		scene.add(this.mesh);
		for (const satellite of this.children) {
			satellite.addToScene(scene);
		}
	}

	// TODO: Test this function
	public disposeOfSatellite(scene: THREE.Scene): void {
		// TODO: deleting function

		this.mesh.geometry.dispose();
		this.mesh.material.dispose();
		scene.remove(this.mesh);

		this.isDeleted = true;

		for (const satellite of this.children) {
			satellite.disposeOfSatellite(scene);
		}

		// Possibly necessary... https://discourse.threejs.org/t/correctly-remove-mesh-from-scene-and-dispose-material-and-geometry/5448/2
		// renderer.renderLists.dispose();
	}

	public update(time: number): void {
		this.currentTime = time;
		this.mesh.rotation.y += this.parameters.rotationalAngularVelocity * 0.01;

		this.currentPhase = this.parameters.orbitalAngularVelocity * (this.currentTime - this.timeAtLastCapture) + this.phaseAtLastCapture;
		this.setCoordinateFrame(this.currentPhase);
		this.setBody()

		for (const satellite of this.children) {
			satellite.update(time);
		}
	}

	// Set the origin and vectors in 3D space
	private setCoordinateFrame(phase: number): void {
		const parentOrigin = new Vector3(0, 0, 0);

		const orbitRadius = this.parameters.orbitalRadius;
		const localOriginPositionVector = new Vector4(orbitRadius * Math.cos(phase), orbitRadius * Math.sin(phase), 0.0, 0.0);

		const absRadial = localOriginPositionVector.clone();
		const parentMatrix = this.parent ? this.parent.frame.Matrix.clone() : new Matrix4(); // Defaults to identity matrix

		//if (this.parent) {
			parentOrigin.setFromMatrixPosition(parentMatrix); // Position of parent (absolute coods)
			absRadial.applyMatrix4(parentMatrix); // Outward facing vector (absolute coords)
		//}

		var globalOrigin = parentOrigin.add(new Vector3(absRadial.x, absRadial.y, absRadial.z)); // Position in absolute space

		//if (orbitRadius !== 0) {
			// If radial position vector is a null vector, use the parent's x-vector
			const radial = orbitRadius !== 0 ? localOriginPositionVector.clone() : new Vector4(parentMatrix.elements[0],parentMatrix.elements[1],parentMatrix.elements[2],parentMatrix.elements[3]);
			//radial.normalize();
			radial.setLength(this.parameters.bodyRadius);
			var azimuthal = new Vector4(radial.y * -1, radial.x, 0, 0);
			var normal = new Vector4(0, 0, this.parameters.bodyRadius, 0);

			radial.applyMatrix4(parentMatrix);
			azimuthal.applyMatrix4(parentMatrix);
			normal.applyMatrix4(parentMatrix);
	
			this.frame.set(radial, azimuthal, normal, globalOrigin);	
		//} else {
		//	this.frame.set(this.parent.frame.E1.clone().multiplyScalar());
		//}

		this.setBody();
	}

	private setBody(): void {
		this.mesh.position.set(this.frame.Origin.x, this.frame.Origin.y, this.frame.Origin.z);
	}

	// This needs to be called when the speed is changed, otherwise the object can "jump"
	private capturePhaseAndTime(): void {
		this.timeAtLastCapture = this.currentTime;
		this.phaseAtLastCapture = this.currentPhase;
	}

	private scaleThisAndAllChildren(scalingFactor: number): void {
		this.mesh.geometry.scale(scalingFactor, scalingFactor, scalingFactor);
		for (const satellite of this.children) {
			satellite.scaleThisAndAllChildren(scalingFactor);
		}
	}

}
