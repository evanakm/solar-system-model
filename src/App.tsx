import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.scss';
import Sidebar from './Components/Sidebar';
import { MVCContextProvider } from './Contexts/MVCContext';
import SolarSystemViewport from './Components/SolarSystemViewport';

function App() {

    return (
        <React.Fragment>

            <div className="wrapper d-flex align-items-stretch">
                <MVCContextProvider>
                    <Sidebar/>
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
