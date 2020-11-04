import React from 'react'
import { NavLink } from 'react-router-dom'

function LayoutSideNav() {
    return (
        <React.Fragment>
            <div id="layoutSidenav_nav">
                <nav className="pos-sidenav accordion pos-sidenav-dark" id="sidenavAccordion">
                    <div className="pos-sidenav-menu">
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <NavLink exact className="nav-link" to="/" activeClassName="active"><span className="sidenav-icon orders-icon"></span>Dashboard</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink exact className="nav-link" to="/visitlog" activeClassName="active"><span className="sidenav-icon orders-icon"></span>VisitLog</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink exact className="nav-link" to="/hosts" activeClassName="active"><span className="sidenav-icon kitchen-icon"></span>Hosts</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink exact className="nav-link" to="/visitors" activeClassName="active"><span className="sidenav-icon bills-icon"></span>Visitors</NavLink>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </React.Fragment>
    )
}

export default LayoutSideNav
