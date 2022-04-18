import React, { useContext, useRef, useState } from 'react';
import './planetPanelStyle.scss';
import './planetSliderStyle.scss'

interface SliderProps {
    value: number;
    minValue: number;
    maxValue: number;
    uid: string;
    notation: string;
    callback: (value: number) => void;
}

const PlanetSlider = (props: SliderProps) => {
    const ref = useRef(null);

    const [state, updateState] = useState(props.value);

    const rangeSlide = (value: string, targetRef: React.MutableRefObject<any>) => {
        updateState(() => parseInt(value));
        targetRef.current.innerHTML = state;
        props.callback(parseInt(value));
    }

    return(
        <React.Fragment>
            <tr>
                <td className="slidercontainercell">
                    <input
                        className="range"
                        type="range"
                        name=""
                        value={state}
                        min={props.minValue}
                        max={props.maxValue}
                        onChange={(e) => rangeSlide(e.currentTarget.value, ref)}
                        onMouseMove={(e) => rangeSlide(e.currentTarget.value, ref)}>
                    </input>
                </td>
                <td rowSpan={2} className="rangevalue" ref={ref}>
                    {state}
                </td>
            </tr>
            <tr>
                <td className="bodynote">
                    {props.notation}
                </td>
                
            </tr>
        </React.Fragment>

    );

}

export default PlanetSlider;