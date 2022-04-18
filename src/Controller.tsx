import { SatelliteParameters } from "./Models/SatelliteModel";
import { SolarSystemModel } from "./Models/SolarSystemModel";
import { BackendSatelliteData, SatelliteDataWrapper } from "./Utilities/MVCConversions";

export class Controller {
    //private solarSystemModel: SolarSystemModel = new SolarSystemModel();

    constructor(private solarSystemModel: SolarSystemModel) {
    }

    // public set SolarSystemModel(value: SolarSystemModel) {
    //     this.solarSystemModel = value;
    // }

    public setParameters(data: BackendSatelliteData): void {
        this.solarSystemModel.setSatelliteParams(data);
    }

    // TODO
    public createNewSatellite(satelliteId: string, primaryId: string, satelliteName: string, satelliteParameters: SatelliteParameters): void {
    }

    // TODO
    public renameSatellite(satelliteId: string, newName: string): void {
    }
}