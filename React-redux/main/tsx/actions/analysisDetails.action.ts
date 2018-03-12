import { fetchWrapper } from "../../utills/api_wrapper";
import { isObjEmpty } from "../../utills/common";
import * as moment from 'moment';
import { getChartApiPath, FETCH_ANALYIS_START, FETCH_ANALYIS_SUCCESS, FETCH_ANALYIS_FAIL, CHART_ROOT } from "../constants/constant";

const fetchDataSuccess = (data) => {
  return {
      type: FETCH_ANALYIS_SUCCESS,
      payload: data
  }
}

const fetchDataFail = (error) => {
  return {
      type: FETCH_ANALYIS_FAIL,
      payload: error
  }
}

const fetchStart = () => {
  return {
      type: FETCH_ANALYIS_START,
      payload: null
  }
}


export const fetchAnalysisDetailsData = (actions: Object, selectedTimeFrame?: String) => {

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
              // dispatch(selectTimeFrameAction((selectedTimeFrame ? selectedTimeFrame : (resultParseData["timeFrames"]) ? resultParseData["timeFrames"][0] : "")));
          }).catch(error => dispatch(fetchDataFail(error)));
  }
}

function findReplaceLinkComponentData(AnalysisDetails) {
  const linkComponentsList: String[] = ['groupChart','groupBarchart','regModelChart','columnChart','scatterChart'];
  let childContentData = []; /* to get the child data */
  const blockCompponents = (AnalysisDetails.blocks || []).map((block, index) => block.data);
  let childComponents: any[] = [];
  for (let blockComponent of blockCompponents) {
      childComponents = [...childComponents, ...blockComponent];
  }


  childComponents.map((child, innerIndex) =>{
    if(child.component == "tabs"){
      const tabData = AnalysisDetails[child.id] || [];
      if(tabData.length > 0 ){
        if(AnalysisDetails[child.id][0].data != undefined){
          let tabData = AnalysisDetails[child.id][0].data;
          tabData.map((key,index) => {
            if(key.component == "tab"){
              let insideTabdata =  AnalysisDetails[key.id] || [];
              if(insideTabdata.length > 0){
                childComponents.push(AnalysisDetails[key.id][0].data[0]);
              }
            }
          })
        }
      }
    }
    if(child.component == "regGroupChart"){
      const GroupComp = AnalysisDetails[child.id] || [];
      if(GroupComp.length > 0 ){
         let inComp =  GroupComp[0].data;
         inComp.map((key,index) => {
            childComponents.push(key);
         });
      }
    }
  });

    childComponents = childComponents.filter(childComponent => {
      return linkComponentsList.indexOf(childComponent.component) != -1
  });


  const linkDataPromises = childComponents.map((child, innerIndex) => getLinkPromiseData((AnalysisDetails[child.id] ? AnalysisDetails[child.id][0] || {} : {})).then(linkItemData => {
      return ({
          id: child.id,
          plotData: linkItemData.plotData || [],
          plotTitle: linkItemData.plotTitle || "",
          plotMetaData: linkItemData.plotMetaData || {}
      })
  }));

  return Promise.all(linkDataPromises).then(linkData => {
      for (let linkDataItem of linkData) {
        AnalysisDetails[linkDataItem.id] = { "plotData": (linkDataItem["plotData"] || []), "plotTitle": linkDataItem["plotTitle"], "plotMetaData": linkDataItem["plotMetaData"] };
      }
      return AnalysisDetails;
  });
}

export const getLinkPromiseData: any = (parseData) => {
  let links = parseData.links || [];
    if (links.length > 0) {
      let allFetchData = links.map((val) => {
      let url = "";
        if (typeof val == 'string') {
          url = `${CHART_ROOT}/${val}`;
        }
        else {
          const { entityType, source} = parseData;
          url =  getChartApiPath({
          entityType,
          source,
          entityId: parseData.fundRunnerId,
          fileName: val.link
        });
        }
       let chartRoot = 'http://localhost.ms.com:3000/json';
      //  let chartRoot = 'http://aipadvisoryportal.webfarm-dev.ms.com:2220/msamg/aip-advisory-portal-ui/services/chartService/funds/1522293025/LIMA';
      url = `${chartRoot}/${val.link}`;
      return fetchWrapper(url).then(response => response.json());
      });
    return Promise.all(allFetchData).then(values => { return { "plotData": [...values], "plotMetaData": parseData.metaData, "plotTitle": parseData.title } }).catch(error => error)
    }
  return Promise.resolve({});
}
