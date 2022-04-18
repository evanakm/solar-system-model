import { Controller } from "../Controller";
import { SolarSystemModel } from "../Models/SolarSystemModel";
import { BackendSatelliteData, ConversionUtility, SatellitePanelViewParameters } from "../Utilities/MVCConversions";

export class SidePanelView {

    private flag: number = 0;

    constructor(private ssModel: SolarSystemModel, private controller: Controller) {
    }

    // Not sure if necessary. React will watch this.
    public get Flag(): number {
        return this.flag;
    }

    public get ViewValues(): SatellitePanelViewParameters[] {
        const valuesForView: SatellitePanelViewParameters[] = ConversionUtility.getAllViewData(this.ssModel);
        return valuesForView;
    }

    public sendValuesToController(values: BackendSatelliteData): void {
        this.controller.setParameters(values);
    }

}