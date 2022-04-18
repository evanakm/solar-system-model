import React from 'react';
import EditingPanelViewport, { PlanetWindowViewportProps } from './editingPanelViewport';
import './planetPanelStyle.scss';

const EditingPanel = (props: PlanetWindowViewportProps) => {
    return (<React.Fragment>
        <table style={{width:'96%', marginLeft:'auto', marginRight:'auto'}}>
            <tbody>
                <tr>
                    <td className="ivoryborder planet-canvas">
                        <EditingPanelViewport texturePath={props.texturePath}/>
                    </td>
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
    </React.Fragment>)
}

export default EditingPanel;