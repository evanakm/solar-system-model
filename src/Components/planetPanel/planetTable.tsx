import React, { useContext, useEffect, useState } from 'react';
import { MVCContext } from '../../Contexts/MVCContext';
import { ConversionUtility, SatellitePanelViewParameters } from '../../Utilities/MVCConversions';
import { SidePanelView } from '../../Views/SidePanelView';
import PlanetPanel, { PanelProps } from './planetPanel';


//const initialState = [<PlanetPanel satelliteName={'Mercury'} primaryName={'the Sun'} initialOrbitalRadius={500} initialRadius={10} />];

/*
export interface SatellitePanelViewParameters {
    name: string;
    uid: string; // only need satellite Uid, not primary because Controller can figure that out.
    nameOfPrimary: string;
	bodyRadius: number;
	rotationalPeriod: number;
	orbitalRadius: number;
    orbitalPeriod: number;
}
*/

const PlanetTable = () => {

    const mvc = useContext(MVCContext);

    const [state, changeState] = useState(mvc.sidePanelView);

    const getComponents: () => JSX.Element[] = () => {
        const data = state.ViewValues;
        const components: JSX.Element[] = data.map((datum: SatellitePanelViewParameters) =>
            <PlanetPanel
                satelliteName={datum.name}
                primaryName={datum.nameOfPrimary}
                orbitalRadius={Math.round(datum.orbitalRadius)}
                bodyRadius={Math.round(datum.bodyRadius)}
                orbitalPeriod={Math.round(datum.orbitalPeriod)}
                rotationalPeriod={Math.round(datum.rotationalPeriod)}
                uuid={datum.uid}
                texturePath={datum.texturePath}
            />
        );

        return components;
    }

    // May need to useEffect and subscribe to Flag, or have an Observable in SidePanelView

    return (
        <React.Fragment>
            <table style={{'width':'100%', 'textAlign':'center'}}>
                <tbody>
                    {getComponents()}
                </tbody>
            </table>
        </React.Fragment>
    );


}

export default PlanetTable;
