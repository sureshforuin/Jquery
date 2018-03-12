import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { URL_CONFIG } from "../../constants/constant";

export default class FundDetailNavigationLinks extends React.Component<any, any> {

    render() {
        return (
            <div className="fund-navigation">
                <div className="container">
                    <ul className="nav nav-tabs text-center sub-menu">
                        <li><NavLink exact activeClassName="active" to={"/funds/fundId/" + URL_CONFIG.FUND_DETAILS.OVERVIEW}>Overview</NavLink></li>
                        {/* <li><NavLink activeClassName="active" to="/funds/fundId/chart2.html">Performance</NavLink></li>
                        <li><NavLink activeClassName="active" to="/funds/fundId/chart1.html">Analysis</NavLink></li>  */}
                        {/* <li><NavLink activeClassName="active" to="/funds/fundId/line-chart.html">Line Chart</NavLink></li> 
                        <li><NavLink activeClassName="active" to="/funds/fundId/area-chart.html">Area Chart</NavLink></li> */}
                        {/* <li><NavLink activeClassName="active" to="/funds/fundId/m1.html">Approch 1</NavLink></li>
                        <li><NavLink activeClassName="active" to="/funds/fundId/m2.html">Approch 2</NavLink></li>
                        <li><NavLink activeClassName="active" to="/funds/fundId/table.html">Table</NavLink></li>  */}
                        <li><NavLink activeClassName="active" to={"/funds/fundId/" + URL_CONFIG.FUND_DETAILS.LDD}>Terms and Structure</NavLink></li>
                        <li><NavLink activeClassName="active" to={"/funds/fundId/" + URL_CONFIG.FUND_DETAILS.PERFORMANCE}>Performance</NavLink></li>
                        <li><NavLink activeClassName="active" to={"/funds/fundId/" + URL_CONFIG.FUND_DETAILS.ANALYSIS}>Analysis</NavLink></li>
                        <li><NavLink activeClassName="active" to={"/funds/fundId/" + URL_CONFIG.FUND_DETAILS.MONTHLY_UPDATE}>Monthly Updates</NavLink></li>
                        <li><NavLink activeClassName="active" to={"/funds/fundId/" + URL_CONFIG.FUND_DETAILS.IDD}>Investment Due Diligence</NavLink></li>
                        <li><NavLink activeClassName="active" to={"/funds/fundId/" + URL_CONFIG.FUND_DETAILS.ODD}>Operational Due Diligence</NavLink></li>
                        {/* <li><NavLink activeClassName="active" to="/funds/fundId/monthly_update.html">Fund Details Monthly Update</NavLink></li>  
                         <li><NavLink activeClassName="active" to="/funds/fundId/odd.html">Fund Details ODD</NavLink></li>    */}
                    </ul>
                </div>
            </div>
        );
    }

}
