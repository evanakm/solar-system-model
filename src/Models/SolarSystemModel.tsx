import { SatelliteIdentifier, SatelliteModel, SatelliteParameters } from './SatelliteModel';

export interface SatelliteData {
    name: string;
    idOfPrimary: SatelliteIdentifier; // To determine label and ordering in UI
    params: SatelliteParameters;
}

interface SatelliteDataAndModel extends SatelliteData {   
    model: SatelliteModel;
}

export class SolarSystemModel {

    // The sun is not included in this because it does not go into the side panel.
    private satelliteDataAndModelsMap: Map<SatelliteIdentifier, SatelliteDataAndModel> = new Map<SatelliteIdentifier, SatelliteDataAndModel>();

    // The sun is the centre of the solar system, and its logic is slightly different.
    private sunParams: SatelliteParameters;
    private sun: SatelliteModel;
 
    constructor(solarRadius: number = 5) {

        this.sunParams = {
            bodyRadius: solarRadius,
            rotationalAngularVelocity: 0.02,
            orbitalRadius: 0,
            orbitalAngularVelocity: 0,
            texturePath: 'http://localhost:3000/Assets/Textures/sun.jpg'  
        };
        this.sun = new SatelliteModel(null, this.sunParams);
    

        // Start with some default planets and moons
        const mercuryParams = SatelliteModel.createSatelliteParameters(0.2, 0.05, 8, 0.01, 'Assets/Textures/mercury.jpg');
        const mercuryId = this.addNewSatellite('Mercury', this.sun.UUID, mercuryParams);

        const venusParams = SatelliteModel.createSatelliteParameters(0.8, 0.08, 15, 0.004, 'Assets/Textures/venus.jpg');
        const venusId = this.addNewSatellite('Venus', this.sun.UUID, venusParams);
    
        const earthParams = SatelliteModel.createSatelliteParameters(1, 0.1, 25, 0.002, 'Assets/Textures/earth.jpg');
        const earthId = this.addNewSatellite('Earth', this.sun.UUID, earthParams);

        const moonParams = SatelliteModel.createSatelliteParameters(0.2, 0.01, 3, 0.05, 'Assets/Textures/moon.jpg');
        const moonId = this.addNewSatellite('Earth\'s Moon', earthId, moonParams);

        const marsParams = SatelliteModel.createSatelliteParameters(0.6, 0.09, 38, 0.0025, 'Assets/Textures/mars.jpg');
        const marsId = this.addNewSatellite('Mars', this.sun.UUID, marsParams);

        const phobosParams = SatelliteModel.createSatelliteParameters(0.2, 0.01, 3, 0.05, 'Assets/Textures/phobos.jpg');
        const phobosId = this.addNewSatellite('Phobos', marsId, phobosParams);

        const deimosParams = SatelliteModel.createSatelliteParameters(0.3, 0.03, 4.5, 0.05, 'Assets/Textures/deimos.jpg');
        const deimosId = this.addNewSatellite('Deimos', marsId, deimosParams, Math.PI * 0.5);

    }

    // To be read by the side panel
    public get SatelliteData(): SatelliteData[] {
        return Array.from(this.satelliteDataAndModelsMap, ([k, v]) => v as SatelliteData);
    }

    // To be the point of focus of the Camera
    public get Sun(): SatelliteModel {
        return this.sun;
    }

    // During initialization, it is convenient to have this return the SatelliteIdentifier of the newly created SatelliteModel 
    public addNewSatellite(newSatelliteName: string, primaryId: SatelliteIdentifier, params: SatelliteParameters, initialPhase: number = 0): SatelliteIdentifier {
        const primaryModel: SatelliteModel = primaryId === this.Sun.UUID ? this.Sun : this.satelliteDataAndModelsMap.get(primaryId)!.model;

        const satelliteModel = new SatelliteModel(primaryModel, params, initialPhase);

        // Need to add childSatellites to primary.
        const data: SatelliteDataAndModel = {
            name: newSatelliteName,
            idOfPrimary: primaryId,
            params: params,
            model: satelliteModel
        }

        this.satelliteDataAndModelsMap.set(satelliteModel.UUID, data);

        return satelliteModel.UUID;
    }

    public editSatelliteParams(id: SatelliteIdentifier, params: SatelliteParameters): void {
        this.satelliteDataAndModelsMap.get(id)!.params = params;
    }

    public renameSatellite(id: SatelliteIdentifier, newName: string): void {
        this.satelliteDataAndModelsMap.get(id)!.name = newName;
    }

    // Should handle going down chain from SatelliteModel
    // public removeSatellite(id: SatelliteIdentifier): void {
    //     this.satelliteDataAndModels.get(id)!.childSatellites.forEach(childId => this.removeSatellite(childId));
    //     this.satelliteDataAndModels.get(id)!.model.disposeOfSatellite();
    // }

    public removeSatelliteAndChildren(id: SatelliteIdentifier, scene: THREE.Scene): void {
        this.satelliteDataAndModelsMap.get(id)?.model.disposeOfSatellite(scene);
        this.removeDeletedModelsFromMap();
    }

    public getNameOfPrimary(id: SatelliteIdentifier): string {
        if (id === this.sun.UUID) {
            return 'the Sun';
        }

        if (!this.satelliteDataAndModelsMap.has(id)) {
            return 'unknown Primary body';
        }

        return this.satelliteDataAndModelsMap.get(id).name;
    }

    // There is no functional way of filtering a Map in ES6. Casting to an Array still involves iterating through all values
    private removeDeletedModelsFromMap() {
        for (let [k, v] of this.satelliteDataAndModelsMap.entries()) {
            if (v.model.IsDeleted) {
                this.satelliteDataAndModelsMap.delete(k);
            }
        }
    }

}