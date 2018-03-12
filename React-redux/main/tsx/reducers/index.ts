import { combineReducers } from 'redux';

import changeTimeFrameReducer from './timeFrame.reducer';
import annualizedStats from './annualized.reducer';
import historicReturns from './historicalReturns.reducer';
import CumulativeChart from './cumulativeChart.reducer';
import RAPChart, { RAPChartInterface } from './rapChart.reducer';
import CurrentStore from './currentStore.reducer';
import FundDetails from './fundDetails.reducer';
import highchartStore from './chart.reducer';
import fundIndexStore from './fundIndex.reducer';
import AnalysisDetails from './analysisDetails.reducers';
import funds from './funds.reducer';
import { Reducer } from 'redux';
import favoriteFunds from './favoriteFunds.reducer';
import benchmarks from './benchmark.reducer';
import Fund from '../models/fund';
import Benchmark from '../models/benchmark';


const allReducers = combineReducers({
    // monthlyUpdate: MontlyUpdateReducer,
    changeTimeFrame: changeTimeFrameReducer,
    CurrentStore: CurrentStore,
    annualizedStats: annualizedStats,
    historicReturns: historicReturns,
    FundDetails: FundDetails,
    AnalysisDetails: AnalysisDetails,
    highChart: highchartStore,
    CumulativeChart,
    RAPChart: RAPChart as Reducer<RAPChartInterface>,
    fundIndex: fundIndexStore,
    funds: funds as Reducer<Fund[]>,
    benchmarks:benchmarks as Reducer<Benchmark[]>,
    favoriteFunds: favoriteFunds as Reducer<Fund[]>
});

export default allReducers;
