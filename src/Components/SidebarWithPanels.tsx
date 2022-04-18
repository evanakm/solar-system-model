import React, { useEffect } from 'react';
import PlanetTable from './planetPanel/planetTable';
import './scss/style.scss';

declare var jQuery: any;

// Based on https://colorlib.com/wp/template/bootstrap-sidebar-03/

function SidebarWithPanels() {

    useEffect(() => {
        (function($) {

            "use strict";
        
            var fullHeight = function() {
        
                $('.js-fullheight').css('height', $(window).height());
                $(window).resize(function(){
                    $('.js-fullheight').css('height', $(window).height());
                });

            };
            fullHeight();
        
            $('#sidebarCollapse').on('click', function () {
              $('#sidebar').toggleClass('active');
          });
        
        })(jQuery);
        
    }, []);

    return (
        <React.Fragment>
            <nav id="sidebar" className="active">
                <div className="custom-menu">
                    <button type="button" id="sidebarCollapse" className="btn btn-primary">
                    <i className="fa fa-bars"></i>
                    <span className="sr-only">Toggle Menu</span>
                    </button>
                </div>
                <div className="p-4">
                    <PlanetTable />
                </div>
            </nav>

        </React.Fragment>
    );
}

export default SidebarWithPanels;
