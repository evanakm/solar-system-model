import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.scss';
import { MVCContextProvider } from './Contexts/MVCContext';
import SolarSystemViewport from './Components/SolarSystemViewport';
import SidebarWithPanels from './Components/SidebarWithPanels';

function App() {

    return (
        <React.Fragment>

            <div className="wrapper d-flex align-items-stretch">
                <MVCContextProvider>
                    <SidebarWithPanels />
                    <div className="content">
                        <SolarSystemViewport />
                    </div>
                </MVCContextProvider>
            </div>

        </React.Fragment>
    );
}

// <div id="solar-system"></div>

export default App;
