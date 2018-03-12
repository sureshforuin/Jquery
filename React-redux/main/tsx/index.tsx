import * as Highcharts from 'highcharts/highstock';
import * as moment from 'moment';
import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import App from './App';
import configureStore from './store';
import PotentialError from "./components/PotentialError";
import { applyPolyfills } from '../utills/polyfills';
import { clearFunds, addFund } from './reducers/funds.reducer';
import { clearBenchmark, addBencmark } from './reducers/benchmark.reducer';
import { fetchWrapper } from '../utills/api_wrapper';
import { FETCH_FUND_INDEX, FETCH_FUND_BENCHMARK } from './constants/constant';
import Fund from './models/fund';
import Benchmark from './models/benchmark';

applyPolyfills();
const store = configureStore();

store.dispatch(clearFunds());
fetchWrapper(FETCH_FUND_BENCHMARK)
    .then(response => response.json())
    .then(json => {
        const benchmarks = json.Benchmarks as Benchmark[];
        if (!benchmarks || !benchmarks.length) {
            console.warn('Fund list is empty');
            return [];
        }

        return benchmarks.map(benchmark => store.dispatch(addBencmark(benchmark)));
    });

fetchWrapper(FETCH_FUND_INDEX)
    .then(response => response.json())
    .then(json => {
        const funds = json.Funds as Fund[];
        if (!funds || !funds.length) {
            console.warn('Fund list is empty');
            return [];
        }

        return funds.map(fund => store.dispatch(addFund(fund)));
    })
    .then(() => render(
        <Provider store={store}>
            <PotentialError>
                <HashRouter>
                    <App />
                </HashRouter>
            </PotentialError>
        </Provider>,
        document.getElementById('mount')
    ))
    .catch(error => {
        console.error('Error during fetching/processing fund index json:');
        console.error(error);
    });

// Declare globals (for debugging purposes)
(window as any).$ = jQuery;
(window as any).moment = moment;
(window as any).AIP = { store };
Object.defineProperty((window as any).AIP, 'state', {
    get: () => store.getState(),
    configurable: false,
    enumerable: true
});