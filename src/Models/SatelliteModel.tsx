import { Mesh, MeshBasicMaterial, SphereGeometry, TextureLoader, Vector3, Vector4 } from 'three';
import { CoordinateFrame } from './Utilities/CoordinateFrame'
import { v4 as generateV4 } from 'uuid';

export type SatelliteIdentifier = string;

export interface SatelliteParameters {
	bodyRadius: number,
	rotationalAngularVelocity: number,
	orbitalRadius: number,
	//orbitalPhase: number,
	orbitalAngularVelocity: number,
	texturePath: string
}

// TODO: Add a function to change parameters.
export class SatelliteModel {

	public static createSatelliteParameters(bodyRadius: number, rotationalAngularVelocity: number, orbitalRadius: number, orbitalAngularVelocity: number, texturePath: string): SatelliteParameters {

        const params: SatelliteParameters = {
            bodyRadius: bodyRadius,
            rotationalAngularVelocity: rotationalAngularVelocity,
            orbitalRadius: orbitalRadius,
            //orbitalPhase: orbitalPhase,
            orbitalAngularVelocity: orbitalAngularVelocity,
            texturePath: texturePath
        };

        return params;
    }

	private parent: SatelliteModel;
	private children: SatelliteModel[] = [];
	private parameters: SatelliteParameters;

	private frame: CoordinateFrame;
	private mesh: THREE.Mesh<THREE.BufferGeometry, THREE.Material>;

	private isDeleted: boolean = false; // Cleans up logic in SolarSystemModel

	private uuid: SatelliteIdentifier = generateV4();

	// Angle in radians
	private currentPhase = 0;
	private phaseAtLastUpdate = 0;

    constructor(parent: SatelliteModel, parameters: SatelliteParameters, initialPhase = 0) {
		this.parent = parent;
		this.children = [];

		this.parameters = parameters;

		this.frame = new CoordinateFrame(new Vector3(1,0,0), new Vector3(0,1,0), new Vector3(0,0,1), new Vector3(0,0,0));

		var geometry = new SphereGeometry(this.parameters.bodyRadius, 16, 16);
		var texture = new TextureLoader().load(this.parameters.texturePath);
		var material = new MeshBasicMaterial({ map: texture });
		//var material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
		this.mesh = new Mesh(geometry, material);

		this.phaseAtLastUpdate = initialPhase;
		this.setCoordinateFrame(this.phaseAtLastUpdate);

		if (parent) {
			this.parent.addChild(this);
		}

	}

	public get UUID(): SatelliteIdentifier {
		return this.uuid;
	}

	public get IsDeleted(): boolean {
		return this.isDeleted;
	}

	public get Origin(): Vector3 {
		return this.frame.Origin.clone();
	}

	public set Parameters(value: SatelliteParameters) {
		this.capturePhase();
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
		this.mesh.rotation.z += this.parameters.rotationalAngularVelocity;

		this.currentPhase = this.parameters.orbitalAngularVelocity * time + this.phaseAtLastUpdate;
		this.setCoordinateFrame(this.currentPhase);
		this.setBody()

		for (const satellite of this.children) {
			satellite.update(time);
		}
	}

	// Set the origin and vectors in 3D space
	private setCoordinateFrame(phase: number): void {
		const parentOrigin = new Vector3(0, 0, 0);

		const radius = this.parameters.orbitalRadius;
		const localOrigin = new Vector4(radius * Math.cos(phase), radius * Math.sin(phase), 0.0, 0.0);

		const radial = localOrigin.clone();

		if (this.parent) {
			parentOrigin.setFromMatrixPosition(this.parent.frame.Matrix);
			radial.applyMatrix4(this.parent.frame.Matrix);
		}

		var globalOrigin = parentOrigin.add(new Vector3(radial.x, radial.y, radial.z));

		if (radius !== 0) {
			radial.normalize();
			var azimuthal = new Vector4(radial.y * -1, radial.x, 0, 0);
			var normal = new Vector4(0,0,1,0);
	
			this.frame.set(radial, azimuthal, normal, globalOrigin);	
		} else {
			if(this.parent) {
				this.frame.set(this.parent.frame.E1, this.parent.frame.E2, this.parent.frame.E3, this.parent.frame.Origin);
			}
		}

		this.setBody();
	}

	private setBody(): void {
		this.mesh.position.set(this.frame.Origin.x, this.frame.Origin.y, this.frame.Origin.z);
	}

	// This needs to be called when the speed is changed, otherwise the object can "jump"
	private capturePhase(): void {
		this.phaseAtLastUpdate = this.currentPhase;
	}

}
