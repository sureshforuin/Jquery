import { fetchWrapper } from "../../utills/api_wrapper";
import { selectTimeFrameAction } from "./timeframe.action";
import { isObjEmpty } from "../../utills/common";
import * as moment from 'moment';
import { FETCH_FUND_DETAIL_FAIL, FETCH_FUND_DETAIL_SUCCESS, FETCH_FUND_DETAIL_START, CHART_ROOT, GRAPH_DATE_FORMAT_ON_HOVER, getChartApiPath } from "../constants/constant";

const fetchDataSuccess = (data) => {
    return {
        type: FETCH_FUND_DETAIL_SUCCESS,
        payload: data
    }
}

const fetchDataFail = (error) => {
    return {
        type: FETCH_FUND_DETAIL_FAIL,
        payload: error
    }
}

const fetchStart = () => {
    return {
        type: FETCH_FUND_DETAIL_START,
        payload: null
    }
}

export const fetchFundDetailsData = (actions: Object, selectedTimeFrame?: String) => {

    console.log("selectedTimeFrame in action in FD component " + selectedTimeFrame);
    let url = actions["fetch"];
    if (selectedTimeFrame) {
        url += `?effectiveDate=${selectedTimeFrame}`;
    }
    return (dispatch) => {
        dispatch(fetchStart()); /* required if slow network connectivity*/
        return fetchWrapper(url, 'GET')
            .then(response => response.json())
            .then(parseData => findReplaceLinkComponentData(parseData))
            .then(resultParseData => {
                dispatch(fetchDataSuccess(resultParseData))
                dispatch(selectTimeFrameAction((selectedTimeFrame ? selectedTimeFrame : (resultParseData["timeFrames"]) ? resultParseData["timeFrames"][0] : "")));
            }).catch(error => dispatch(fetchDataFail(error)));
    }
}

function findReplaceLinkComponentData(FundDetails) {
    const linkComponentsList: String[] = ['lineChart', 'areaChart', 'columnChart', 'scatterChart', 'cumChart', 'rapChartWithBand', 'reduxTimeFrameBasedTable', 'HistoricalReturns'];
    let childContentData = []; /* to get the child data */
    const blockCompponents = (FundDetails.blocks || []).map((block, index) => block.data);
    let childComponents: any[] = [];
    for (let blockComponent of blockCompponents) {
        childComponents = [...childComponents, ...blockComponent];
    }
    childComponents = childComponents.filter(childComponent => {
        return linkComponentsList.indexOf(childComponent.component) != -1
    });
    const linkDataPromises = childComponents.map((child, innerIndex) => getLinkPromiseData((FundDetails[child.id] ? FundDetails[child.id][0] || {} : {})).then(linkItemData => {
        // debugger;
        let plotMetaData = linkItemData.plotMetaData;
        // if (plotMetaData && plotMetaData.timeFrame && plotMetaData.timeFrame.active) {
        //     plotMetaData = Object.assign(plotMetaData, { timeFrame: { active: 0 } });
        // }
        return ({
            id: child.id,
            plotData: linkItemData.plotData || [],
            plotTitle: linkItemData.plotTitle || "",
            plotMetaData
        })
    }));

    return Promise.all(linkDataPromises).then(linkData => {
        for (let linkDataItem of linkData) {
            FundDetails[linkDataItem.id] = {
                plotData: linkDataItem.plotData || [],
                plotTitle: linkDataItem.plotTitle,
                plotMetaData: linkDataItem.plotMetaData
            };
        }
        return FundDetails;
    });
}

export const getLinkPromiseData: any = (parseData) => {
    let links = parseData.links || [];
    if (links.length > 0) {
        let allFetchData = links.map((val) => {
            let url = '';
            if (typeof val == "string") {
                url = `${CHART_ROOT}/${val}`;
            } else {
                url = getChartApiPath({ entityType: val.entityType, entityId: val.fundRunnerId, source: val.source, fileName: val.link })
            }
            return fetchWrapper(url).then(response => {
                let json = response.json();
                json.entityType = val.entityType;
                json.fundRunnerId = val.fundRunnerId;
                return json
            });
        });
        return Promise.all(allFetchData).then(values => {
            // values["json"]["fundRunnerId"] = values["fundRunnerId"];
            return { "plotData": [...values], "plotMetaData": parseData.metaData, "plotTitle": parseData.title }
        }).catch(error => error)
    }
    return Promise.resolve({});
}