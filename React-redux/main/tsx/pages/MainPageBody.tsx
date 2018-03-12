import * as React from 'react';
import { Route, Switch, RouteProps } from 'react-router-dom';

import FundDetailPageBody from './FundDetailPageBody';
import FundIndexPageBody from './FundIndexPageBody';
import FundGrid from '../containers/FundGrid';

export default class MainPageBody extends React.Component<any, any> {

    render() {
        return (
            <div className="main-page-body">
                <Switch>
                    <Route path="/funds/:fundId" component={FundDetailPageBody} />
                    <Route path="/" component={FundGrid} />
                    <Route path="*" component={FundDetailPageBody} />
                </Switch>
            </div>
        );
    }

}
