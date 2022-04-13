import { SatelliteParameters } from "./Models/SatelliteModel";
import { SolarSystemModel } from "./Models/SolarSystemModel";

export class Controller {
    private solarSystemModel: SolarSystemModel = new SolarSystemModel();

    constructor() {
    }

    public set SolarSystemModel(value: SolarSystemModel) {
        this.solarSystemModel = value;
    }

    public setSatelliteParameters(satelliteId: string, satelliteParameters: SatelliteParameters): void {
    }

    public createNewSatellite(satelliteId: string, primaryId: string, satelliteName: string, satelliteParameters: SatelliteParameters): void {
    }

    public renameSatellite(satelliteId: string, newName: string): void {
    }
}