import React, { useState } from "react";
import { Vector3 } from "three";
import { Controller } from "../Controller";
import { CameraModel } from "../Models/CameraModel";
import { SolarSystemModel } from "../Models/SolarSystemModel";

// Following pattern at https://devtrium.com/posts/how-use-react-context-pro

export type GlobalState = {
    controller: Controller,
    solarSystemModel: SolarSystemModel,
    cameraModel: CameraModel
};

const controller = new Controller();
const solarSystemModel = new SolarSystemModel(5);
const cameraModel = new CameraModel(solarSystemModel.Sun, new Vector3(0,0,20), Math.PI/4, 70, 0, -0.017);

const initialState = {
    controller: controller,
    solarSystemModel: solarSystemModel,
    cameraModel: cameraModel
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
