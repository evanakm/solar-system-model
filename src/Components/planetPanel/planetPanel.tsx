import _ from 'lodash';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { MVCContext } from '../../Contexts/MVCContext';
import { BackendSatelliteData, ConversionUtility, SatellitePanelViewParameters } from '../../Utilities/MVCConversions';
import EditingPanel from './editingPanel';
import './planetPanelStyle.scss';
import PlanetSlider from './planetSlider';

export interface PanelProps {
    satelliteName: string;
    primaryName: string;
    orbitalRadius: number;
    bodyRadius: number;
    orbitalPeriod: number;
    rotationalPeriod: number;
    uuid: string;
    texturePath: string;
}

const PlanetPanel = (props: PanelProps) => {
    const mvc = useContext(MVCContext);
    const ref = useRef(null);

    const [state, updateState] = useState(props);

    useEffect(() => {
        ref.current.addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
            content.style.display = "none";
            } else {
            content.style.display = "block";
            }
        });
    }, []);

    useEffect(() => {
        const viewData: SatellitePanelViewParameters = {
            name: state.satelliteName,
            uid: state.uuid,
            nameOfPrimary: state.primaryName,
            bodyRadius: state.bodyRadius,
            rotationalPeriod: state.rotationalPeriod,
            orbitalRadius: state.orbitalRadius,
            orbitalPeriod: state.orbitalPeriod,
            texturePath: state.texturePath
        }

        const backendData: BackendSatelliteData = ConversionUtility.wrapDataForController(viewData);
        mvc.sidePanelView.sendValuesToController(backendData);
    },[state])

    return (
        <React.Fragment>
            <tr>
                <td>
                    <button type="button" className="collapsible bodyname namecontainer" ref={ref}>
                        {String.fromCharCode(0x2005) + state.satelliteName} (Orbiting {state.primaryName})
                    </button>
                    <div className="panelcontent" style={{'width':'100%','marginLeft':'auto','marginRight':'auto'}}>
                        <table style={{'width':'100%','paddingTop':'10px','paddingBottom':'5px','marginLeft':'auto','marginRight':'auto','paddingLeft':'0px','paddingRight':'0px'}}>
                            <tbody>
                                <tr>
                                    <td style={{width:'70%', paddingTop:'10px', paddingBottom:'5px'}} className="nopad nomarg">

                                        <table className="slidercontainertable ivoryborder">
                                            <tbody>
                                                <PlanetSlider
                                                    value={state.orbitalRadius}
                                                    minValue={200}
                                                    maxValue={10000}
                                                    uid={state.uuid}
                                                    notation={"Orbit (% of primary's radius)"}
                                                    callback={
                                                        (value: number) => {
                                                            updateState((s) => { const res = _.cloneDeep(s); res.orbitalRadius = value; return res; })
                                                        } 
                                                    }
                                                />
                                                <PlanetSlider
                                                    value={state.bodyRadius}
                                                    minValue={1}
                                                    maxValue={100}
                                                    uid={state.uuid}
                                                    notation={"Radius (% of primary's radius)"}
                                                    callback={
                                                        (value: number) => {
                                                            updateState((s) => { const res = _.cloneDeep(s); res.bodyRadius = value; return res; })
                                                        } 
                                                    }
                                                />
                                                <PlanetSlider
                                                    value={state.orbitalPeriod}
                                                    minValue={5}
                                                    maxValue={90}
                                                    uid={state.uuid}
                                                    notation={"Period of revolution (seconds)"}
                                                    callback={
                                                        (value: number) => {
                                                            updateState((s) => { const res = _.cloneDeep(s); res.orbitalPeriod = value; return res; })
                                                        } 
                                                    }
                                                />
                                                <PlanetSlider
                                                    value={state.rotationalPeriod}
                                                    minValue={5}
                                                    maxValue={90}
                                                    uid={state.uuid}
                                                    notation={"Period of rotation (seconds)"}
                                                    callback={
                                                        (value: number) => {
                                                            updateState((s) => { const res = _.cloneDeep(s); res.rotationalPeriod = value; return res; })
                                                        } 
                                                    }
                                                />

                                            </tbody>
                                        </table>

                                    </td>
                                    <td className="rangeValue nomarg nopad">
                                        <EditingPanel texturePath={state.texturePath}/>

                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </td>
            </tr>

        </React.Fragment>
    );


/*
    return (
        <React.Fragment>
            <tr>
                <td colSpan={2} className="bodyname namecontainer">
                    {String.fromCharCode(0x2005) + state.satelliteName} (Orbiting {state.primaryName})
                </td>
            </tr>

            <tr>
                <td style={{width:'70%', paddingTop:'10px', paddingBottom:'5px'}} className="nopad nomarg">

                    <table className="slidercontainertable ivoryborder">
                        <tbody>
                            <PlanetSlider
                                value={state.orbitalRadius}
                                minValue={200}
                                maxValue={10000}
                                uid={state.uuid}
                                notation={"Orbit (% of primary's radius)"}
                                callback={
                                    (value: number) => {
                                        updateState((s) => { const res = _.cloneDeep(s); res.orbitalRadius = value; return res; })
                                    } 
                                }
                            />
                            <PlanetSlider
                                value={state.bodyRadius}
                                minValue={1}
                                maxValue={100}
                                uid={state.uuid}
                                notation={"Radius (% of primary's radius)"}
                                callback={
                                    (value: number) => {
                                        updateState((s) => { const res = _.cloneDeep(s); res.bodyRadius = value; return res; })
                                    } 
                                }
                            />
                            <PlanetSlider
                                value={state.orbitalPeriod}
                                minValue={5}
                                maxValue={300}
                                uid={state.uuid}
                                notation={"Period of revolution (seconds)"}
                                callback={
                                    (value: number) => {
                                        updateState((s) => { const res = _.cloneDeep(s); res.orbitalPeriod = value; return res; })
                                    } 
                                }
                            />
                            <PlanetSlider
                                value={state.rotationalPeriod}
                                minValue={5}
                                maxValue={300}
                                uid={state.uuid}
                                notation={"Period of rotation (seconds)"}
                                callback={
                                    (value: number) => {
                                        updateState((s) => { const res = _.cloneDeep(s); res.rotationalPeriod = value; return res; })
                                    } 
                                }
                            />

                        </tbody>
                    </table>

                </td>
                <td className="rangeValue nomarg nopad">

                    <table style={{width:'96%', marginLeft:'auto', marginRight:'auto'}}>
                        <tbody>

                            <tr>
                                <td className="ivoryborder planet-canvas" />
                            </tr>
                            <tr>
                                <td className="ivoryborder">
                                    <button>Change Texture</button>
                                </td>
                            </tr>
                            <tr>
                                <td className="ivoryborder">
                                    <button>Add Satellite</button>
                                </td>
                            </tr>

                        </tbody>
                    </table>

                </td>
            </tr>
        </React.Fragment>
    );
*/
}

export default PlanetPanel;
