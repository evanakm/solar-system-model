import React, { useState } from "react";
import { Vector3 } from "three";
import { Controller } from "../Controller";
import { CameraModel } from "../Models/CameraModel";
import { SolarSystemModel } from "../Models/SolarSystemModel";
import { SidePanelView } from "../Views/SidePanelView";

// Following pattern at https://devtrium.com/posts/how-use-react-context-pro

export type GlobalState = {
    controller: Controller,
    solarSystemModel: SolarSystemModel,
    cameraModel: CameraModel,
    sidePanelView: SidePanelView
};

const solarSystemModel = new SolarSystemModel(5);
const controller = new Controller(solarSystemModel);
const cameraModel = new CameraModel(solarSystemModel.Sun, new Vector3(0,0,60), Math.PI/6, 70, 0, -0.017);
const sidePanelView = new SidePanelView(solarSystemModel, controller);

const initialState = {
    controller: controller,
    solarSystemModel: solarSystemModel,
    cameraModel: cameraModel,
    sidePanelView: sidePanelView
};

const MVCContext = React.createContext<GlobalState>(initialState);

const MVCContextProvider = ({children}) => {
    const [state, setState] = useState(initialState);

    return (
        <MVCContext.Provider value={state}>
            {children}
        </MVCContext.Provider>
    )

}

export { MVCContext, MVCContextProvider };
