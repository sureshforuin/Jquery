import * as React from 'react';
import { generateKey, getCurrentComponentActionObj, widthBasedBootstrapClass, hashCode } from '../../../utills/common';
import Paragraph from '../share_containers/Paragraph';
import TimeFrame from '../share_containers/TimeFrame';
import DataTables from '../share_containers/DataTables';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setCurrentStore } from '../../actions/setstore.actions'
import { selectTimeFrameAction } from '../../actions/timeframe.action';
import { fetchFundDetailsData } from '../../actions/fundDetails.action';
import RatingsTable from "../share_containers/RatingsTable";
import HighChart from '../share_containers/HighChart';
import CumulativeChart from '../share_containers/CumulativeChart';
import FilterChart from '../share_containers/FilterChart';
import RAPChart from '../share_containers/RAPChart';
import HistoricalReturns from '../share_containers/HistoricalReturns';
import AnnualizedStats from "../share_containers/AnnualizedStat";

/*

Fund Details component is design for all the fund details pages which 
have almost simillar child containers / components

in future if Page wise component / containers needs to customization then prefer new container
rather then using simillar containers with if / switch conditions OR controlled it 
with minor json modification with extra params

 */
class FundDetails extends React.Component<any, any>{

    componentWillMount() {
        /* Befor rendering get URL params and set the store */
    }

    componentDidMount() {

        let actionObj = getCurrentComponentActionObj();
        this.props.actions.setCurrentStore(actionObj);
        this.props.actions.fetchFundDetailsData(actionObj, this.props.selectedTimeFrame);

    }

    componentDidUpdate() {
        let _self: any = this;
        const $datePicker = $(".timeframe-component .datepicker") as any;
        $datePicker.datepicker({
            onSelect: function (date) {
                _self.timeFrameChangeHandler(date);
            }
        });
    }

    componentWillReceiveProps(nextProps) {

        if (this.props.match.path !== nextProps.match.path) {
            let actionObj = getCurrentComponentActionObj(nextProps.match.path);
            this.props.actions.setCurrentStore(actionObj);
            this.props.actions.fetchFundDetailsData(actionObj);
        }
    }
    // componentDidCatch(error, info) {
    //     /* error handling */
    //     console.log("%s%c", "background-color:red;color:white", error);
    // }

    timeFrameChangeHandler(date) {
        let actionObj = this.props.CurrentStore.currentStore;
        this.props.actions.fetchFundDetailsData(actionObj, date);
    }

    renderParagraphComponent(key, childContentData, width?, parentComponent?, id?: string) {
        return <Paragraph id={id ? hashCode(id) : Math.random()} key={generateKey("paragraphComponent")} data={childContentData} width={width} parentComponent={parentComponent} />
    }

    renderTimeFrameComponent(data, store = "", calendarControl, timeframes) {
        return <TimeFrame calendarControl={calendarControl} timeframes={timeframes} />
    }

    renderDataTable(childContentData, id, width?) {
        return <DataTables key={generateKey("DataTableComponent")} data={childContentData} width={width} id={id} />
    }

    renderBlockWithHeader(key, title, allChildContentData, blockContent, blockWidth?) {
        let render = allChildContentData.reduce(function (a, b) { return (a == 0 && b == 0) ? false : true; })
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

    renderRatingTableComponent(childContentData) {
        return <RatingsTable data={childContentData} />;
    }

    renderHighChartComponent(childContentData, id, render) {
        return <HighChart key={generateKey("LinechartComponent")} childContentData={childContentData} id={id} render={render} />;
    }

    renderRAPChartComponent(childContentData, id, render) {
        return <CumulativeChart key={generateKey("RapchartComponent")} childContentData={childContentData} id={id} render={render} />;
    }

    renderRAPChartWithBandComponent(childContentData, id, render) {
        return <RAPChart key={generateKey("RapchartWithBandComponent")} childContentData={childContentData} id={id} />;
    }

    renderFilterComponent(childContentData, id, render) {
        return <FilterChart key={generateKey("FilterchartComponent")} childContentData={childContentData} id={id} rangeId={"range" + id} />;
    }
    renderHistoricalReturns(childContentData, id, render) {
        return <HistoricalReturns key={generateKey("LinechartComponent")} childContentData={childContentData} id={id} render={render} />;
    }
    renderTimeFrameBasedTable(childContentData, id) {
        return <AnnualizedStats data={childContentData} id={id} />
    }
    defineComponent() {
        let fundDetailsData = this.props.propData.FundDetails;
        // logging("fundDetailsData-----------", "green");
        // console.log(fundDetailsData);
        let blockData = fundDetailsData.blocks || [];
        let timeframes = fundDetailsData.timeFrames || [];
        let selectedTimeFrame = this.props.selectedTimeFrame;
        let calendarControl = fundDetailsData.calendarControl || null;

        let TimeFrameComponent = (timeframes.length != 0) ? this.renderTimeFrameComponent("timeFrames", fundDetailsData, calendarControl, timeframes) : null;

        let ComponentToRender = blockData.map((block, index) => {
            let childComponents = block.data || [];
            let childContentData = []; /* to get the child data */
            let allChildContentData: number[] = []; /* Created To check if the child contains data */
            let blockContent = childComponents.map((child, innerIndex) => {

                childContentData = fundDetailsData[child.id] || []; /* Expected Array always : issue comes when we get an object*/
                allChildContentData.push(childContentData.length == 0 ? 0 : 1);
                // console.log(childContentData);
                // console.log(childContentData.length);
                if (child.component == "paragraph") {
                    return this.renderParagraphComponent(innerIndex, childContentData, null, null, child.id);
                }
                if (child.component == "ratingsTableIDD" || child.component == "ratingsTableOverview" || child.component == "ratingsTableODD" || child.component == "ratingsTable" ) {
                    return this.renderRatingTableComponent(childContentData);
                }
                if (child.component == "dataTables" || child.component == "rowTables" || child.component == "columnTables") {
                    return this.renderDataTable(childContentData, child.id);
                }
                if (child.component == "lineChart" || child.component == "areaChart" || child.component == "columnChart" || child.component == "scatterChart") {
                    return this.renderHighChartComponent(childContentData, child.id, child.component);
                    /*for new graph type similar to above chart we need to entry to fund details action and in side high chart component*/
                }
                if (child.component == "cumChart") {
                    return this.renderRAPChartComponent(childContentData, child.id, child.component);
                }
                if (child.component == "rapChartWithBand") {
                    return this.renderRAPChartWithBandComponent(childContentData, child.id, child.component);
                }
                if (child.component == "filterChart") {
                    return this.renderFilterComponent(childContentData, child.id, child.component);
                }
                if (child.component == "reduxTimeFrameBasedTable") {
                    return this.renderTimeFrameBasedTable(childContentData, child.id);
                }
                if (child.component == "HistoricalReturns") {
                    return this.renderHistoricalReturns(childContentData, child.id, child.component);
                }
                if (child.component == "column") {
                    return ((childContentData[0] ? childContentData[0]["data"] : []) || []).map((subValue, subIndex) => {
                        let subChildContentData = fundDetailsData[subValue.id] || [];
                        if (subValue.component == "paragraph") {
                            return this.renderParagraphComponent(subIndex, subChildContentData, subValue["width"], "column");
                        }
                    });
                }
                if (child.component == "tabs") {
                    let tabs: any = [];
                    let tabContentData = ((childContentData[0] ? childContentData[0]["data"] : []) || []).map((subValue, subIndex) => {
                        let subChildContentData = fundDetailsData[subValue.id] || [];
                        if (subValue.component == "tab") {
                            let subChildContentData = fundDetailsData[subValue.id] || [];
                            tabs.push(
                                <li key={subIndex} className={subIndex == 0 ? "tab-link current active" : "tab-link current"}>
                                    <a data-toggle="tab" href={"#" + subValue.id}>{subValue.title}</a>
                                </li>
                            );
                            let tabsData = ((subChildContentData[0] ? subChildContentData[0]["data"] : []) || []).map((insideValue, insideIndex) => {
                                let subChildContentData = fundDetailsData[insideValue.id] || [];
                                if (insideValue.component == "dataTables" || insideValue.component == "rowTables" || insideValue.component == "columnTables") {
                                    return this.renderDataTable(subChildContentData, insideValue.id, insideValue["width"])
                                }
                            });
                            return <div key={subIndex} className={subIndex == 0 ? "row tab-pane fade in active" : "row tab-pane fade "} id={subValue.id}>{[...tabsData]}</div>;
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
            return this.renderBlockWithHeader(index, block.title, allChildContentData, [...blockContent], block.width);
        });
        return [TimeFrameComponent, ...ComponentToRender]
    }
    render() {

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
                    <p>ERROR : {this.props.propData.FundDetails.message} </p>
                </div>
            );
        }
        return (
            <div className="monthly-updates-page-body">
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
        selectedTimeFrame: state.changeTimeFrame,
        propData: state.FundDetails
    }
}

const matchStateToDispatch = (dispatch) => {
    return {
        actions: bindActionCreators({
            setCurrentStore: setCurrentStore,
            selectTimeFrameAction: selectTimeFrameAction,
            fetchFundDetailsData: fetchFundDetailsData
        }, dispatch)
    }
}

export default connect(mapStateToProps, matchStateToDispatch)(FundDetails);
