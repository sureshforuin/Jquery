import * as React from 'react';

import MainPageBody from './pages/MainPageBody';
import MegaMenu from './pages/MegaMenu';
import { fetchWrapper } from '../utills/api_wrapper';
import { FETCH_FUND_INDEX } from './constants/constant';
import Fund from './models/fund';
import { addFund, clearFunds } from './reducers/funds.reducer';
import { connect } from 'react-redux';

export default class App extends React.Component<{}, {}> {

    render() {
        return (
            <div className="app">
                <MegaMenu />
                <MainPageBody />
                <div className="blank-space-50"></div>
            </div>
        );
    }

}