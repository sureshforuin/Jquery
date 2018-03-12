import * as React from 'react';
import 'datatables.net';
import { FUND_DETAIL_RESOURCE_GROUP_APIS, FETCH_FUND_BENCHMARK_API } from '../../constants/constant';
import { fetchWrapper } from '../../../utills/api_wrapper';
import { connect } from "react-redux";
import { getFunds } from "../../selectors/funds.selector";
import { fetchHistoricData } from '../../actions/historicReturn.action';
import { bindActionCreators } from 'redux';
import { fetchAddAnnualizedData } from '../../actions/annualized.action';
import { fetchCumulativeData } from '../../actions/cumulativeChart.action';
import { fetchOverviewPerformanceData, fetchOverviewBenchmark } from '../../actions/highchart.action';
import { fetchRAPSeriesData, Entity, addRAPSeries } from '../../actions/rapChart.action';
import { selectedFundRunnerIds } from '../../actions/addfundbenchmark.action';

class AddBenchMarkFund extends React.Component<any, any> {

  // close() {
  //   this.setState({ addClass: false });
  // }

  renderTable() {
    let $dataTables = $('#fundsTable') as any;
    $dataTables.DataTable();
  }
  renderModal() {
    let id = this.props.chartId;
    return (
      <div>
        <div className="buttonHolder">
          <span
            className="addButton" data-toggle="modal" data-target={'#' + id + "_modal"}>
            Add Benchmark/Fund
          </span>
        </div>
        <div className="modal fade" role="dialog" aria-labelledby="myLargeModalLabel" id={id + "_modal"}>
          <div className="modal-dialog modal-lg">
            <div className="modal-body">
              <div className="modal-content">
                <header>
                  <h3 className="title">Select benchmarks & funds</h3>
                  {/* <h3 className="rowSelected" />
                <button type="button" className="btn btn-link seeall">
                  See all
                </button> */}

                  <span className="modal-buttonUnit">
                    {/* <button
                    type="button"
                    className="btn btn-light applyButton"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    Apply
                  </button> */}
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">X </span>
                    </button>
                  </span>
                </header>
                {/* <div className="sandbox">
                <div className="content-area1">
                  <div className="d-flex p-2 flex-row-reverse border-bottom-1">
                    <a href="" className="">
                      Clear all
                    </a>
                  </div>
                  <div className="d-flex sandbox-list cloneUnit">
                    <div className="p-1 ">
                      <img src="images/favorite.svg" />
                    </div>
                    <div className="p-2 seriesName" />
                    <div className="ml-auto p-1 ">
                      <img
                        src="images/clear-dark.svg"
                        className="remove-icon"
                      />
                    </div>
                  </div>
                </div>
              </div> */}
                <div className="secondarynav">
                  <ul className="d-flex flex-row align-items-center">
                    <li className="wp ">
                      <a href={"#benchmark-tab_" + id} data-toggle="tab">Benchmarks</a>
                    </li>
                    <li className="wp active">
                      <a href={"#funds-tab_" + id} data-toggle="tab">Funds</a>
                    </li>
                    {/* <li className="wp">
                    <a href={"#portfolio-tab_" + id} data-toggle="tab">Portfolio</a>
                  </li> */}
                  </ul>
                </div>
                <div />
                <div className="row1">
                  <div className="col1">
                  </div>
                </div>
                <div className="content-area1 tab-content">
                  <div id={"benchmark-tab_" + id} className="tab-pane fade ">
                    <div className="row">
                      <div className="col">
                        <table id="benchmarkTable" className="table table-hover data-table-common">
                          <thead>
                            <tr>
                              <th scope="col">Benchmark</th>
                              <th scope="col">
                                <span className="addButton" />
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.generateBenchmarkTableRows(this.props.benchmarkData)}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div id={"funds-tab_" + id} className="tab-pane fade fade in active">
                    <div className="row">
                      <div className="col-xs-12">
                        <table id="fundsTable" className="table table-striped table-bordered popuptable">
                          <thead>
                            <tr>
                              <th scope="col">Funds</th>
                              <th scope="col">Strategy</th>
                              <th scope="col">Fund AUM</th>
                              <th scope="col">Inception date</th>
                              <th scope="col">Geographic focus</th>
                              <th scope="col">Performance</th>
                              <th scope="col">Volatility</th>
                              <th scope="col">
                                <span className="addButton" />
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.generateFundsTableRows(this.props.fundData)}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  {/* <div id={"portfolio-tab_" + id} className="tab-pane ">
                  <div className="row">
                    <div className="col">
                      <table
                        id="favouriteBenchmarks"
                        className="table table-striped table-bordered popuptable"
                      >
                        <thead>
                          <tr>
                            <th scope="col"> Benchmarks</th>
                            <th scope="col" style={{ width: "140px" }}>
                              Inception date
                            </th>
                            <th scope="col">Geographic focus</th>
                            <th scope="col" className="text-center">
                              Performance
                            </th>
                            <th scope="col" className="text-center">
                              Volatility
                            </th>
                            <th scope="col">
                              <span className="addButton" />
                            </th>
                          </tr>
                        </thead>
                      </table>
                    </div>
                  </div>
                </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  add(event, fundRunnerId, chartId, type?, rollingPeriod?: number, callback?) {
    event.preventDefault();

    // this.props.action.selectedFundRunnerIds(fundRunnerId, chartId);

    if (chartId == "HistoricalReturn") {
      this.props.actions.fetchHistoricData("add", fundRunnerId, this.props.selectedChartFrequency, this.props.selectedTimeFrame);
    } else if (chartId == "AnnualizedStatistics") {
      this.props.actions.fetchAddAnnualizedData(fundRunnerId);
    } else if (chartId == "CumulativePerformance") {
      this.props.actions.fetchCumulativeData(fundRunnerId);
    } else if (chartId == "Performance") {
      if (type == "benchmark") {
        this.props.actions.fetchOverviewBenchmark(fundRunnerId, chartId, type);
      } else {
        this.props.actions.fetchOverviewPerformanceData(fundRunnerId, chartId);
      }
    } else if (chartId === 'RollingAnnualizedPerformance') {
      if (type && fundRunnerId && rollingPeriod) {
        const entities: Entity[] = [{
          entityType: type,
          fundRunnerId
        }];

        const fetchData: typeof fetchRAPSeriesData = this.props.fetchRAPSeriesData;
        fetchData({
          entities,
          rollingPeriod

        }).then(chartSeriesData => {
          // debugger;
          for (let i = 0; i < chartSeriesData.length; i++) {
            (chartSeriesData[i] as any).entityType = type;
            (chartSeriesData[i] as any).fundRunnerId = fundRunnerId;
          }

          this.props.actions.addRAPSeries(chartSeriesData);
          callback();
        });
      }
    }else if(chartId == "regressionModelling"){
      console.log(chartId);
    }
  }

  generateFundsTableRows(funds) {

    return funds.map((fund, index) => {
      return (
        <tr key={`fundGridRow-${fund.fundId}`}>
          <td>
            {/* <i aria-hidden={true} className={`favorite-fund-select-button fa fa-star`}></i> */}
            {fund.fundName}
          </td>
          <td>{fund.style}</td>
          <td>{fund.fundAUM}</td>
          <td>{fund.inceptionDate}</td>
          <td>{fund.geographicFocus}</td>
          <td>{fund.performance}</td>
          <td>{fund.volatility}</td>
          <td>
            <a onClick={(e) => { this.add(e, fund.fundRunnerId, this.props.chartId, 'fund', this.props.rollingPeriod, this.props.callback) }}>
              <i className="fa fa-plus-circle" style={{ color: '#000' }}></i>
            </a>
          </td>
        </tr>
      )
    });
  }

  generateBenchmarkTableRows(benchmarks) {
    return benchmarks.map((benchmark, index) => {
      return (
        <tr key={`fundGridRow-${benchmark.benchmarkId}`}>
          <td>
            {/* <i aria-hidden={true} className={`favorite-fund-select-button fa fa-star`}></i> */}
            {benchmark.benchmarkName}
          </td>
          <td>
            <a onClick={(e) => { this.add(e, benchmark.fundRunnerId, this.props.chartId, "benchmark", this.props.rollingPeriod, this.props.callback) }}>
              <i className="fa fa-plus-circle" style={{ color: '#000' }}></i>
            </a>
          </td>
        </tr>
      )
    });
  }
  render() {
    return <div>{this.renderModal()}</div>;
  }
}

const mapstateToProps = (state, props) => {
  return {
    fundData: state.funds || [],
    benchmarkData: state.benchmarks || []
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      addRAPSeries: addRAPSeries,
      fetchHistoricData: fetchHistoricData,
      fetchAddAnnualizedData: fetchAddAnnualizedData,
      fetchCumulativeData: fetchCumulativeData,
      fetchOverviewPerformanceData: fetchOverviewPerformanceData,
      fetchOverviewBenchmark: fetchOverviewBenchmark,
      selectedFundRunnerIds:selectedFundRunnerIds
    }, dispatch),
    fetchRAPSeriesData: fetchRAPSeriesData
  }
}

export default connect(mapstateToProps, mapDispatchToProps)(AddBenchMarkFund);
