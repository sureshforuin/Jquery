import * as React from 'react';
import { generateKey, getCurrentComponentActionObj, widthBasedBootstrapClass, hashCode } from '../../../utills/common';
import Paragraph from '../share_containers/Paragraph';
import TimeFrame from '../share_containers/TimeFrame';
import DataTables from '../share_containers/DataTables';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setCurrentStore } from '../../actions/setstore.actions'
// import { selectTimeFrameAction } from '../../actions/timeframe.action';
import { fetchAnalysisDetailsData, getLinkPromiseData } from '../../actions/analysisDetails.action';
import RegModelChart from '../share_containers/RegModelChart';
import CumulativeChart from '../share_containers/CumulativeChart';
import GroupBarChart from '../share_containers/GroupBarChart';
import GroupChart from '../share_containers/GroupChart';
import RegressionGroup from '../share_containers/RegressionGroup';
import { fetchWrapper } from "../../../utills/api_wrapper";
import { FETCH_FUND_DETAIL_FAIL, FETCH_FUND_DETAIL_SUCCESS, FETCH_FUND_DETAIL_START, CHART_ROOT, GRAPH_DATE_FORMAT_ON_HOVER,getChartApiPath } from "../../constants/constant";



class AnalysisDetails extends React.Component<any, any>{

    componentWillMount() {
        console.log("this.props",this.props);
    }

    componentDidMount(){
      let actionObj = getCurrentComponentActionObj();
      this.props.actions.setCurrentStore(actionObj);
      this.props.actions.fetchAnalysisDetailsData(actionObj);
    }

    renderGroupChart(childContentData,id, render){
      return <GroupChart key={generateKey("GroupChartComponent")} childContentData={childContentData} id={id} render={render} />;
    }

    renderGroupBarchart(childContentData, id, render){
        return <GroupBarChart key={generateKey("GroupBarChartComponent")} childContentData={childContentData} id={id} render={render} />;
    }

    renderRegModelChart(childContentData, id, render){
        return <RegModelChart key={generateKey("lineChartComponent")} childContentData={childContentData} id={id} render={render} />;
    }

    renderRegressionGroup(parentData, data, id, render){
        return <RegressionGroup key={generateKey("RegGroupChart")} parentData={parentData} childContentData={data} id={id} render={render} />;
    }
            
    renderBlockWithHeader(key, title, allChildContentData, blockContent, blockWidth?) {
      let render;
      render = allChildContentData.reduce(function (a, b) { return (a == 0 && b == 0) ? false : true; })
      let bootStrapClass = widthBasedBootstrapClass(blockWidth);
      if (!render) return false;
      return (
            <div key={generateKey("blockHeaderComponent")} className={bootStrapClass}>
                <div className="blank-space-54"></div>
                {title ? <h1 id={`${hashCode(title)}`} className="bottom-border-gray no-margin main-title">{title}</h1> : false}
                {blockContent}
            </div>
        );
    }
    defineComponent(){
      let analysisDetailData = this.props.propData.AnalysisDetails;
      let blockData = analysisDetailData.blocks || [];
      let ComponentToRender = blockData.map((block, index) => {
          let childComponents = block.data || [];
          let childContentData = []; /* to get the child data */
          let allChildContentData: number[] = []; /* Created To check if the child contains data */
          let blockContent = childComponents.map((child, innerIndex) => {
            childContentData = analysisDetailData[child.id] || []; /* Expected Array always : issue comes when we get an object*/
            allChildContentData.push(childContentData.length == 0 ? 0 : 1);
            if (child.component == "groupBarchart") {
               return this.renderGroupBarchart(childContentData, child.id, child.component);
            }
             if (child.component == "regModelChart") {
               return this.renderRegModelChart(childContentData, child.id, child.component);
            }
            if(child.component == "regGroupChart"){
                console.log(childContentData);
                let data:any = [];
                childContentData.map((ky,index) => {
                    ky.data.map((k,i) => {
                    data[k.id] = analysisDetailData[k.id];
                    console.log(analysisDetailData[k.id]);
                    })
                })
                return this.renderRegressionGroup(childContentData, data, child.id, child.component);
            }
            if (child.component == "tabs") {
              let tabs: any = [];
              let tabContentData = ((childContentData[0] ? childContentData[0]["data"] : []) || []).map
              ((subValue, subIndex) => {
                  let subChildContentData = analysisDetailData[subValue.id] || [];
                  if (subValue.component == "tab") {
                      let subChildContentData = analysisDetailData[subValue.id] || [];
                      tabs.push(<li className={subIndex == 0 ? "tab-link current active" : "tab-link current"}> <a data-toggle="tab" href={"#" + subValue.id}>{subValue.title}</a></li>);
                      let tabsData = ((subChildContentData[0] ? subChildContentData[0]["data"] : []) || [])
                      .map((insideValue, insideIndex) => {
                          let subChildContentData = analysisDetailData[insideValue.id] || [];
                           if (insideValue.component == "groupChart") {
                               return this.renderGroupChart(subChildContentData, insideValue.id, insideValue.component);
                                }
                      });
                      return <div className={subIndex == 0 ? "row tab-pane fade in active" : "row tab-pane fade "} id={subValue.id}>{[...tabsData]}</div>;
                  }
              });
                return (
                    <div>
                        <ul className="nav nav-tabs tabs">
                            {[...tabs]}
                        </ul>
                        <div className="tab-content current">{tabContentData}</div>
                    </div>
                );
          }
          });
          return this.renderBlockWithHeader(index, block.title, allChildContentData, [...blockContent], block.width)
      });
      return [...ComponentToRender];
    }
    render(){
        if (this.props.propData == undefined) {
            return (
                <div className="container">
                    <p>NO PROP DATA Found...  </p>
                </div>
            );
        }
        if (this.props.propData.loading) {
            return (
                <div className="container">
                    <p>Loading...  </p>
                </div>
            );
        }
        if (this.props.propData.error) {
            return (
                <div className="container">
                    <p>ERROR : {this.props.propData.AnalysisDetails.message} </p>
                </div>
            );
        }
        return (
            <div className="monthly-updates-page-body" id="analysisDetails">
                <div className="container">
                    {this.defineComponent()}
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state, props) => {
    return {
        CurrentStore: state.CurrentStore,
        // selectedTimeFrame: state.changeTimeFrame,
        propData: state.AnalysisDetails
    }
}
const matchStateToDispatch = (dispatch) => {
    return {
        actions: bindActionCreators({
            setCurrentStore: setCurrentStore,
            // selectTimeFrameAction: selectTimeFrameAction,
            fetchAnalysisDetailsData: fetchAnalysisDetailsData,
            getLinkPromiseData:getLinkPromiseData
        }, dispatch)
    }
}
export default connect(mapStateToProps, matchStateToDispatch)(AnalysisDetails);
