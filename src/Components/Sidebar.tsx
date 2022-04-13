import React, { useEffect } from 'react';
import './scss/style.scss';

declare var jQuery: any;

// Based on https://colorlib.com/wp/template/bootstrap-sidebar-03/

function Sidebar() {

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
                    <h1><a href="index.html" className="logo">Test</a></h1>
                    <ul className="list-unstyled components mb-5">
                        <li className="active">
                            <a href="#"><span className="fa fa-home mr-3"></span> Home</a>
                        </li>
                        <li>
                            <a href="#"><span className="fa fa-user mr-3"></span> About</a>
                        </li>
                        <li>
                            <a href="#"><span className="fa fa-briefcase mr-3"></span> Portfolio</a>
                        </li>
                        <li>
                            <a href="#"><span className="fa fa-sticky-note mr-3"></span> Blog</a>
                        </li>
                        <li>
                            <a href="#"><span className="fa fa-paper-plane mr-3"></span> Contact</a>
                        </li>
                    </ul>

                    <div className="mb-5">
                        <h3 className="h6 mb-3">Subscribe for newsletter</h3>
                        <form action="#" className="subscribe-form">
                            <div className="form-group d-flex">
                                <div className="icon"><span className="icon-paper-plane"></span></div>
                                <input type="text" className="form-control" placeholder="Enter Email Address" />
                            </div>
                        </form>
                    </div>

                    <div className="footer">
                        <p>
                            Copyright &copy;<script>document.write(new Date().getFullYear());</script> All rights reserved | This template is made with <i className="icon-heart" aria-hidden="true"></i> by <a href="https://colorlib.com" target="_blank">Colorlib.com</a>
                        </p>
                    </div>

                </div>
            </nav>

        </React.Fragment>
    );
}

export default Sidebar;
