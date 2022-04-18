import { SatelliteIdentifier, SatelliteModel, SatelliteParameters } from "../Models/SatelliteModel";
import { SolarSystemModel } from "../Models/SolarSystemModel";

export interface BackendSatelliteData {
    name: string;
    params: SatelliteParameters;
    uid: string;
    texturePath: string;
}

export interface SatellitePanelViewParameters {
    name: string;
    uid: string; // only need satellite Uid, not primary because Controller can figure that out.
    nameOfPrimary: string;
	bodyRadius: number;
	rotationalPeriod: number;
	orbitalRadius: number;
    orbitalPeriod: number;
    texturePath: string;
}

export interface SatelliteDataWrapper {
    name: string;
    uid: string;
    value: number;
}

// For convenience, we want the backend expressed in angular velocity and the frontend in orbital period.
// For convenience, the frontend uses percentage values
export namespace ConversionUtility {
    export const getAllViewData: (ssModel: SolarSystemModel) => SatellitePanelViewParameters[] = (ssModel) => {
        const allData: BackendSatelliteData[] = ssModel.SatelliteData;
        const output: SatellitePanelViewParameters[] = allData.map((backendData) => ConversionUtility.backendToView(backendData, ssModel));
        return output;
    }

    export const backendToView: (backend: BackendSatelliteData, ssModel: SolarSystemModel) => SatellitePanelViewParameters = (backend, ssModel) => {
        return {
            name: backend.name,
            uid: backend.uid,
            nameOfPrimary: ssModel.getNameOfPrimary(backend.uid),
            bodyRadius: backend.params.bodyRadius * 100.0,
            rotationalPeriod: 2 * Math.PI / backend.params.rotationalAngularVelocity,
            orbitalRadius: backend.params.orbitalRadius * 100.0,
            orbitalPeriod: 2 * Math.PI / backend.params.orbitalAngularVelocity,
            texturePath: backend.texturePath
        }
    }

    export const wrapDataForController: (data: SatellitePanelViewParameters) => BackendSatelliteData = (data) => {
        return {
            name: data.name,
            uid: data.uid,
            params: {
                bodyRadius: data.bodyRadius * 0.01,
                rotationalAngularVelocity: 2 * Math.PI / data.rotationalPeriod,
                orbitalRadius: data.orbitalRadius * 0.01,
                orbitalAngularVelocity: 2 * Math.PI / data.orbitalPeriod
            },
            texturePath: data.texturePath
        };
    }

}