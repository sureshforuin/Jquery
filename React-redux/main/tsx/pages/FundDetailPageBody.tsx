import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import FundBanner from '../components/fund-detail/FundBanner';
import FundDetailInPageNavigation from '../components/fund-detail/FundDetailInPageNavigation';
import FundDetailNavigationLinks from '../components/fund-detail/FundDetailNavigationLinks';
import Overview from '../containers/Overview';
import Analysis from '../containers/Analysis';

import LegalDueDiligence from '../containers/LegalDueDiligence';
// import MonthlyUpdate1 from '../containers/MonthlyUpdate1';
import FundDetails from '../containers/fund_details/FundDetails';
import AnalysisDetails from '../containers/analysis_details/AnalysisDetails';
import { URL_CONFIG } from "../constants/constant";

export default class FundDetailPageBody extends React.Component<any, any> {

    render() {
        return (
            <div className="fund-detail-page-body">
                <FundBanner />
                {/* <FundDetailNavigationLinks /> */}
                <FundDetailInPageNavigation />
                <Switch>
                    {/* <Route path="/funds/fundId/m1.html" component={MonthlyUpdate1} /> */}
                    <Route path={"/funds/:fundId/" + URL_CONFIG.FUND_DETAILS.OVERVIEW} component={FundDetails} />
                    <Route path={"/funds/:fundId/" + URL_CONFIG.FUND_DETAILS.PERFORMANCE} component={FundDetails} />
                    <Route path={"/funds/:fundId/" + URL_CONFIG.FUND_DETAILS.ANALYSIS} component={AnalysisDetails} />
                    <Route path={"/funds/:fundId/" + URL_CONFIG.FUND_DETAILS.MONTHLY_UPDATE} component={FundDetails} />
                    <Route path={"/funds/:fundId/" + URL_CONFIG.FUND_DETAILS.IDD} component={FundDetails} />
                    <Route path={"/funds/:fundId/" + URL_CONFIG.FUND_DETAILS.LDD} component={FundDetails} />
                    <Route path={"/funds/:fundId/" + URL_CONFIG.FUND_DETAILS.ODD} component={FundDetails} />
                </Switch>
            </div>
        );
    }

}
