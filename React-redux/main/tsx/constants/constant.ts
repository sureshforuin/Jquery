const META = 'msamg';
const PROJECT = 'aip-advisory-portal-ui';

/* monthly update actions */
const FETCH_FUND_MONTHLY_UPDATE = "SELECT_MONTHLY_UPDATE";
const FETCH_FUND_MONTHLY_UPDATE_SUCCESS = "FETCH_MONTHLY_UPDATE_SUCCESS";
const FETCH_FUND_MONTHLY_UPDATE_FAIL = "FETCH_MONTHLY_UPDATE_FAIL";

/* Containers naming in api */
const PARAGRAPH_COMPONENT = "paragraph";
const TIMEFRAME_COMPONENT = "TimeFrame";

/*API ENDPOINT*/
const FETCH_MONTHLY_UPDATE_API = "http://localhost.ms.com:3000/json/monthlyupdate.json";
export const FETCH_MONTHLY_UPDATE_METADATA_API = "http://localhost.ms.com:3000/json/approch1/metaData.json";
export const FETCH_TABLE_MOCK_API = "http://localhost.ms.com:3000/json/table/TableJSONStructure.json";
export const FETCH_MOCK_TABLE_SUCCESS = "fetch_table_mock_data_success";
export const FETCH_AREA_CHART_SUCCESS = "fetch_area_chart_success";
export const MONTHLY_UPDATE_NEW_SUCCESS = "mu_new_success";
export const MONTHLY_UPDATE_NEW_FAIL = "mu_new_fail";

export const FETCH_APPROACH_2_SUCCESS = "approch_2_success";
export const FETCH_ODD_2_SUCCESS = "odd_success";
export const FETCH_ODD_2_FAIL = "odd_req_fail";
export const FETCH_IDD_2_SUCCESS = "idd_success";
export const FETCH_IDD_2_FAIL = "idd_req_fail";

export const FETCH_FUND_DETAIL_SUCCESS = "fetch_fund_detail_success";
export const FETCH_FUND_DETAIL_FAIL = "fetch_fund_detail_fail";
export const FETCH_FUND_DETAIL_START = "fetch_fund_detail_start";

export const ANNUALIZED_TIMEFRAME_CHANGES = "set_annualized_timeframe";
export const GET_ANNUALIZED_DATA = "set_annualized_data";
export const ADD_ANNUALIZED_DATA = "add_annualized_data";
export const FETCH_ANNUALIZED_STATS_FAIL = "fetch_annulaized_data_fail";

export const SET_HIGHCHART_DATA = "set_highchart_data";
export const FETCH_SET_HIGHCHART_DATA = "set_add_highchart_data";
export const FETCH_SET_HIGHCHART_FAIL = "set_add_highchart_data";
export const REMOVE_HIGHCHART_SERIES = "removing_highchart_series";

export const SET_HISTORIC_DATA = "set_historic_data";
export const HISTORIC_TIME_FRAME_CHANGES = "change_historic_timeframe";
export const FETCH_HISTORIC_SUCCESS = "fetch_extra_historic_series_success";
export const FETCH_ADD_HISTORIC_SUCCESS = 'add_historic_fund_benchmark_success';
export const FETCH_HISTORIC_FAIL = "fetch_extra_historic_data_fail";
export const REMOVE_HISTORIC_SERIES = "remove_historic_chart_series";
export const HISTORIC_TOGGLE = "toggle_histori_band";

export const FETCH_CUMULATIVE_SUCCESS = "fetch_cumulative_success";
export const SET_CUMULATIVE_DATA = "set_cumulative_data";
export const FETCH_CUMULATIVE_FAIL = "fetch_cumulative_fail";
export const REMOVE_SERIES_FROM_CUMULATIVE_CHART = "remove_series_from_cumulative_chart";

export const FETCH_FUNDINDEX_SUCCESS = "fetch_fund_index_data_success";
export const FETCH_FUNDINDEX_FAIL = "fetch_fund_index_data_fail";
export const CLEAR_CHART_REDUCER = "clear_chart_reducer";

export const SET_FUND_BENCHMARK_ID ="";


export const REMOVE_REGMODEL_HIGHCHART_SERIES = "REMOVE_REGMODEL_HIGHCHART_SERIES";
export const SET_REGMODEL_HIGHCHART_DATA = "SET_REGMODEL_HIGHCHART_DATA";
export const FETCH_SET_REGMODEL_HIGHCHART_DATA ="FETCH_SET_REGMODEL_HIGHCHART_DATA";
export const FETCH_SET_REGMODEL_HIGHCHART_FAIL = "FETCH_SET_REGMODEL_HIGHCHART_FAIL";


const RESOURCE_GROUP_MU = 'MonthlyUpdates'; // Will be derived from username
const RESOURCE_GROUP_ODD = 'ODD-RG1'; // Will be derived from username
const RESOURCE_GROUP_IDD = 'IDD-RG1'; // Will be derived from username
const RESOURCE_GROUP_LDD = 'LDD-RG1';
const RESOURCE_GROUP_OVERVIEW_PAGE = 'Overview-RG1';
const RESOURCE_GROUP_PERF = 'PERF-RG1';
const RESOURCE_GROUP_ANALYSIS = 'Analysis-RG1';
const SERVICE_ROOT = getServiceRoot();
export const CHART_ROOT = 'http://localhost.ms.com:3000/json';
export const FUND_RUNNER_ID = 1522293025;
// export const CHART_ROOT = `${SERVICE_ROOT}/chartService/${FUND_RUNNER_ID}/approachTwo/Fund1`;
const BM_RUNNER_ID = 1522296815; // S&P 500 Total return
export const BM_CHART_ROOT = `${SERVICE_ROOT}/chartService/benchmarks/${BM_RUNNER_ID}/FundRunner`;

const SERVICE_SUB_ROOT = 'resourceGroupService';
// const SERVICE_SUB_ROOT = 'monthlyUpdatesService';

// export const FETCH_ODD_2_API = `${SERVICE_ROOT}/${SERVICE_SUB_ROOT}/${FUND_RUNNER_ID}/approachTwo/${RESOURCE_GROUP_ODD}`;
// export const FETCH_IDD_2_API = `${SERVICE_ROOT}/${SERVICE_SUB_ROOT}/${FUND_RUNNER_ID}/approachTwo/${RESOURCE_GROUP_IDD}`;
// export const FETCH_LDD_2_API = `${SERVICE_ROOT}/${SERVICE_SUB_ROOT}/${FUND_RUNNER_ID}/approachTwo/${RESOURCE_GROUP_LDD}`;
// export const FETCH_OVERVIEW_PAGE_API = `${SERVICE_ROOT}/${SERVICE_SUB_ROOT}/${FUND_RUNNER_ID}/approachTwo/${RESOURCE_GROUP_OVERVIEW_PAGE}`;
export const FETCH_OVERVIEW_PAGE_API = 'http://localhost.ms.com:3000/json/overview.json';
export const FETCH_LDD_2_API = 'http://localhost.ms.com:3000/json/idd.json';
export const FETCH_IDD_2_API = 'http://localhost.ms.com:3000/json/idd.json';
export const FETCH_ODD_2_API = 'http://localhost.ms.com:3000/json/MonthlyUpdates.json';
export const FETCH_PERFORMANCE_2_API = 'http://localhost.ms.com:3000/json/performance.json';
// export const FETCH_PERFORMANCE_2_API = `${SERVICE_ROOT}/${SERVICE_SUB_ROOT}/${FUND_RUNNER_ID}/approachTwo/${RESOURCE_GROUP_PERF}`;
//export const FETCH_PERFORMANCE_2_API = `http://localhost.ms.com:3000/json/performance.j`son`;
export const FETCH_APPROACH_2_API = `${SERVICE_ROOT}/${SERVICE_SUB_ROOT}/${FUND_RUNNER_ID}/approachTwo/${RESOURCE_GROUP_MU}`;
export const FETCH_APPROACH_1_API = `${SERVICE_ROOT}/${SERVICE_SUB_ROOT}/1522293025/approachOne/${RESOURCE_GROUP_MU}`;

// export const FETCH_FUND_INDEX = `${SERVICE_ROOT}/fundIndexService`;
// export const FETCH_FUND_BENCHMARK = `${SERVICE_ROOT}/benchmarkIndexService/`;
export const FETCH_FUND_INDEX = `http://localhost.ms.com:3000/json/fundIndex.json`;
export const FETCH_FUND_BENCHMARK = `http://localhost.ms.com:3000/json/benchmarkIndex.json`;
export const FETCH_LINE_CHART_API = `${CHART_ROOT}/lineChart.json`;
export const FETCH_AREA_CHART_API = `${CHART_ROOT}/areaChart.json`;
export const FETCH_HISTORICAL_RETURNS_FREQUENCY_SERIES = `${SERVICE_ROOT}/chartService/historicRequest/`;
export const FETCH_ANNUALIZED_STATS_SERIES = `${SERVICE_ROOT}/chartService/annualizedStat/`;
export const FETCH_ANNUALIZED_STATS_FROM_LIMA = `${SERVICE_ROOT}/chartService/annualizedStatWithDates`;
export const FETCH_CUMULATIVE_SERIES = `${SERVICE_ROOT}/chartService/commulativeRequest/`;
export const FETCH_OVERVIEW_PERFORMANCE_SERIES = `${SERVICE_ROOT}/chartService/performanceChart/`;
export const FETCH_OVERVIEW_API = `${CHART_ROOT}/overview.json`;
// export const FETCH_ANALYSIS_API = `${CHART_ROOT}/analysis.json`;
export const FETCH_ANALYSIS_API = isLocal() ? 'http://localhost.ms.com:3000/json/analysis-RG1.json' : `${SERVICE_ROOT}/${SERVICE_SUB_ROOT}/1522293025/approachTwo/${RESOURCE_GROUP_ANALYSIS}`;
//export const FETCH_ANALYSIS_API = 'http://aipadvisoryportal.webfarm-dev.ms.com:2220/msamg/aip-advisory-portal-ui/services/chartService/funds/1522293025/LIMA/analysis-RG1.json'
export const FETCH_FUND_BENCHMARK_API = `${CHART_ROOT}/fundIndex.json`;
export const APPROACH_1_METADATA = 'timeFramesAndBlocks.json';
// export const FETCH_ANALYSIS_API = `${SERVICE_ROOT}/${SERVICE_SUB_ROOT}/${FUND_RUNNER_ID}/approachTwo/${RESOURCE_GROUP_ANALYSIS}`;
export const FETCH_ANALYIS_START = 'FETCH_ANALYIS_START';
export const FETCH_ANALYIS_SUCCESS = 'FETCH_ANALYIS_SUCCESS';
export const FETCH_ANALYIS_FAIL = 'FETCH_ANALYIS_FAIL';

export const URL_CONFIG = {
    FUND_DETAILS: {
        MONTHLY_UPDATE: 'monthly-updates',
        IDD: 'investment-due-diligence',
        ODD: 'operational-due-diligence',
        LDD: 'terms-and-structure',
        OVERVIEW: 'overview',
        PERFORMANCE: 'performance',
        ANALYSIS: 'analysis'
    }
};

const FUND_DETAIL_LINK_PREFIX = '/funds/fundId/';
export const FUND_DETAIL_RESOURCE_GROUP_APIS = [
    {
        id: URL_CONFIG.FUND_DETAILS.OVERVIEW,
        title: 'Overview',
        api: FETCH_OVERVIEW_PAGE_API,
        link: FUND_DETAIL_LINK_PREFIX + URL_CONFIG.FUND_DETAILS.OVERVIEW
    },
    {
        id: URL_CONFIG.FUND_DETAILS.LDD,
        title: 'Terms & Structure',
        api: FETCH_LDD_2_API,
        link: FUND_DETAIL_LINK_PREFIX + URL_CONFIG.FUND_DETAILS.LDD
    },
    {
        id: URL_CONFIG.FUND_DETAILS.PERFORMANCE,
        title: 'Performance',
        api: FETCH_PERFORMANCE_2_API,
        link: FUND_DETAIL_LINK_PREFIX + URL_CONFIG.FUND_DETAILS.PERFORMANCE
    },
    {
        id: URL_CONFIG.FUND_DETAILS.ANALYSIS,
        title: 'Analysis',
        api: FETCH_ANALYSIS_API,
        link: FUND_DETAIL_LINK_PREFIX + URL_CONFIG.FUND_DETAILS.ANALYSIS
    },
    {
        id: URL_CONFIG.FUND_DETAILS.MONTHLY_UPDATE,
        title: 'Monthly Updates',
        api: FETCH_APPROACH_2_API,
        link: FUND_DETAIL_LINK_PREFIX + URL_CONFIG.FUND_DETAILS.MONTHLY_UPDATE
    },
    {
        id: URL_CONFIG.FUND_DETAILS.IDD,
        title: 'Investment Due Diligence',
        api: FETCH_IDD_2_API,
        link: FUND_DETAIL_LINK_PREFIX + URL_CONFIG.FUND_DETAILS.IDD
    },
    {
        id: URL_CONFIG.FUND_DETAILS.ODD,
        title: 'Operational Due Diligence',
        api: FETCH_ODD_2_API,
        link: FUND_DETAIL_LINK_PREFIX + URL_CONFIG.FUND_DETAILS.ODD
    }
];

export function getChartApiPath({ entityType, entityId, source, fileName }: { entityType: string, entityId: number, source: string, fileName: string }) {
    return `${SERVICE_ROOT}/chartService/${entityType}s/${entityId}/${source}/${fileName}`;
}

function getEnv() {
    if (isLocal()) {
        return 'DEV';
    }

    switch (window.location.hostname) {
        case 'aipadvisoryportal.webfarm-dev.ms.com':
        case 'iapp294.devin1.ms.com':
            return 'DEV';

        default:
            return 'QA';
    }
}

function getServiceRoot() {
    if (isLocal()) {
      return CHART_ROOT;
        // return `http://localhost.ms.com:2220/${META}.${PROJECT}/services`;
        // return `http://aipadvisoryportal.webfarm-dev.ms.com:2220/${META}/${PROJECT}/services`;

    } else if (getEnv() === 'QA') {
        // QA MSSIP WF+
        return `/${META}/${PROJECT}/webapp/services`;

    } else {
        // DEV WF+
        return `/${META}/${PROJECT}/services`;
    }
}

function isLocal() {
    return /localhost/.test(window.location.href);
}

export const MONTHLY_UPDATE_STORE = "MonthlyUpdateReducer2";
export const SELECTED_TIME_FRAME_STORE = "changeTimeFrame";
export const IDD_STORE = "IDD";

export const GET_CURRENT_STORE = "set_store";

// export const GRAPH_COLOR_SERIES = ['#005c8f', '#c9b160', '#e3d7ab']; <-- gainkap: provided by Huge, but we need more colors in the palette since number of series can be more than three

export const GRAPH_COLOR_SERIES = ["#0F8EC7", "#005C8F", "#E3D7AB", // <-- gainkap: Taken from MSIM.com. Using this for now, until we get the color palette from Rod
    "#C9B160", "#39BB9D", "#2C8E77", "#C3842F",
    "#B3415C", "#D4D8EA", "#6769B5", "#BFBFBF",
    "#939597", "#97D4C7", "#929AC9", "#002A51"];

export const GRAPH_DATE_FORMAT_ON_HOVER = "MMM YYYY";

export const URL_API_MAPPING = {

}

export const componentList = []

export function notifyCumulativeChartDateControlChange() {
    $('#CumulativePerformance_container').find('.highchart-timeframe-container > div').removeClass('active');
}

export function notifyRAPChartDateControlChange() {
    $('#RollingAnnualizedPerformance_container').find('.highchart-timeframe-container > div').removeClass('active');
}
