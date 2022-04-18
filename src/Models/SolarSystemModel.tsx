import { SatelliteIdentifier, SatelliteModel, SatelliteParameters } from './SatelliteModel';
import { BackendSatelliteData, ConversionUtility } from '../Utilities/MVCConversions';
import _ from 'lodash';

//interface SatelliteDataAndModel extends BackendSatelliteData {
//    model: SatelliteModel;
//}

export class SolarSystemModel {

    // The sun is not included in this because it does not go into the side panel.
    private satelliteModelsMap: Map<SatelliteIdentifier, { name: string, model: SatelliteModel }> = new Map<SatelliteIdentifier, { name: string, model: SatelliteModel }>();

    // The sun is the centre of the solar system, and its logic is slightly different.
    private sunParams: SatelliteParameters;
    private sun: SatelliteModel;
 
    constructor(solarRadius: number = 5) {

        this.sunParams = {
            bodyRadius: solarRadius,
            rotationalAngularVelocity: 0.2,
            orbitalRadius: 0,
            orbitalAngularVelocity: 0
        };
        this.sun = new SatelliteModel(null, this.sunParams, 'Assets/Textures/sun.jpg');
    
        const TAU = Math.PI * 2;

        // Start with some default planets and moons
        const mercuryParams = SatelliteModel.createSatelliteParameters(0.2, TAU / 10, 8, TAU / 20);
        const mercuryId = this.addNewSatellite('Mercury', this.sun.UUID, mercuryParams, 'Assets/Textures/mercury.jpg');

        const venusParams = SatelliteModel.createSatelliteParameters(0.35, TAU / 8, 15, TAU / 30);
        const venusId = this.addNewSatellite('Venus', this.sun.UUID, venusParams, 'Assets/Textures/venus.jpg');
    
        const earthParams = SatelliteModel.createSatelliteParameters(0.4, TAU / 12, 25, TAU / 40);
        const earthId = this.addNewSatellite('Earth', this.sun.UUID, earthParams, 'Assets/Textures/earth.jpg');

        const moonParams = SatelliteModel.createSatelliteParameters(0.2, TAU / 4, 8, TAU / 10);
        const moonId = this.addNewSatellite('Earth\'s Moon', earthId, moonParams, 'Assets/Textures/moon.jpg');

        const marsParams = SatelliteModel.createSatelliteParameters(0.6, TAU / 13, 38, TAU / 55);
        const marsId = this.addNewSatellite('Mars', this.sun.UUID, marsParams, 'Assets/Textures/mars.jpg');

        const phobosParams = SatelliteModel.createSatelliteParameters(0.2, TAU / 5, 3, TAU / 5);
        const phobosId = this.addNewSatellite('Phobos', marsId, phobosParams, 'Assets/Textures/phobos.jpg');

        const deimosParams = SatelliteModel.createSatelliteParameters(0.3, TAU / 7, 4.5, TAU / 8);
        const deimosId = this.addNewSatellite('Deimos', marsId, deimosParams, 'Assets/Textures/deimos.jpg', Math.PI * 0.5);

    }

    // To be read by the side panel
    public get SatelliteData(): BackendSatelliteData[] {
        const satelliteData = Array.from(this.satelliteModelsMap, ([key, value]) => {
            return {
                name: value.name,
                params: value.model.Parameters,
                uid: key,
                texturePath: value.model.TexturePath
            };
        });
        return satelliteData;
    }

    // To be the point of focus of the Camera
    public get Sun(): SatelliteModel {
        return this.sun;
    }

    // During initialization, it is convenient to have this return the SatelliteIdentifier of the newly created SatelliteModel 
    public addNewSatellite(newSatelliteName: string, primaryId: SatelliteIdentifier, params: SatelliteParameters, texture: string, initialPhase: number = 0): SatelliteIdentifier {
        const primaryModel: SatelliteModel = primaryId === this.Sun.UUID ? this.Sun : this.satelliteModelsMap.get(primaryId)!.model;

        const satelliteModel = new SatelliteModel(primaryModel, params, texture, initialPhase);

        const data = {
            name: newSatelliteName,
            model: satelliteModel
        }

        this.satelliteModelsMap.set(satelliteModel.UUID, data);

        return satelliteModel.UUID;
    }

    public renameSatellite(id: SatelliteIdentifier, newName: string): void {
        this.satelliteModelsMap.get(id)!.name = newName;
    }

    // Should handle going down chain from SatelliteModel
    // public removeSatellite(id: SatelliteIdentifier): void {
    //     this.satelliteDataAndModels.get(id)!.childSatellites.forEach(childId => this.removeSatellite(childId));
    //     this.satelliteDataAndModels.get(id)!.model.disposeOfSatellite();
    // }

    public removeSatelliteAndChildren(id: SatelliteIdentifier, scene: THREE.Scene): void {
        this.satelliteModelsMap.get(id)?.model.disposeOfSatellite(scene);
        this.removeDeletedModelsFromMap();
    }

    public getNameOfPrimary(id: SatelliteIdentifier): string {
        if (id === this.sun.UUID) {
            return 'nothing else';
        }

        const primaryID = this.satelliteModelsMap.get(id).model.ParentUUID;

        if (primaryID === this.Sun.UUID) {
            return 'the Sun';
        }

        if (!this.satelliteModelsMap.has(primaryID)) {
            return 'unknown Primary body';
        }

        return this.satelliteModelsMap.get(primaryID).name;

    }

    public setSatelliteParams(data: BackendSatelliteData): void {
        this.satelliteModelsMap.get(data.uid)!.name = data.name;
        this.satelliteModelsMap.get(data.uid)!.model.Parameters = data.params;
    }

    // There is no functional way of filtering a Map in ES6. Casting to an Array still involves iterating through all values
    private removeDeletedModelsFromMap() {
        for (let [k, v] of this.satelliteModelsMap.entries()) {
            if (v.model.IsDeleted) {
                this.satelliteModelsMap.delete(k);
            }
        }
    }

}