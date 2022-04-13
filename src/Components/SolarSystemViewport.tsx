import React, { useContext, useEffect, useRef, useState } from 'react';
import { SolarSystemView } from "../Views/SolarSystemView";
import { MVCContext } from '../Contexts/MVCContext';
import './scss/solarSystemStyle.scss';

function SolarSystemViewport() {

    const mvc = useContext(MVCContext);

    const contentRef = useRef(null);

    const [ssViewState, ssViewStateUpdate] = useState(new SolarSystemView(mvc.solarSystemModel, mvc.cameraModel));

    const updateCanvas = () => {
        const contWidth = window.innerWidth;
        const contHeight = window.innerHeight;

        document.querySelector('canvas').style.width=contWidth.toString()+'px';
        document.querySelector('canvas').style.height=contHeight.toString()+'px';

        ssViewState.setAspectRatio(contWidth / contHeight);
        //ssViewState.setAspectRatio(1);
        ssViewState.Renderer.setSize(contWidth, contHeight);
        ssViewState.animate();
    }

    useEffect(() => {
        updateCanvas();
      
        window.addEventListener('resize', () => {
            updateCanvas();
        });
    }, []);

    // On creation
    useEffect(() => {
        updateCanvas();
    }, [contentRef.current]);

    return (
        <React.Fragment>
            <div className="ss-content" id="ss-content" ref={contentRef}>
                <div id="solar-system" ref={ref => ref.appendChild(ssViewState.Renderer.domElement)}>
                </div>
            </div>
        </React.Fragment>
    );
}

export default SolarSystemViewport;
