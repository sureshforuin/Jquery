import * as React from "react";
import { NavLink } from "react-router-dom";
import * as toastr from "toastr";
import { fetchWrapper } from "../../utills/api_wrapper";
import { URL_CONFIG, FETCH_FUND_BENCHMARK_API } from "../constants/constant";
import FilterChart from "../containers/share_containers/FilterChart";

export default class FundDetailPageBody extends React.Component<any, any> {
  dataTables: any;
  constructor(props){
    super(props);
    this.state = {filter: null};
  }

  componentDidMount() {
    this.fetchFundBenchmarkData();
  }

  fetchFundBenchmarkData() {
    let url = `${FETCH_FUND_BENCHMARK_API}`;
    let _self = this;
    fetchWrapper(url, "GET")
    .then(response => response.json())
    .then(resData => {
      _self.setState({
        isLoading: true,
        posts: resData
      });
      this.createFilterData()
      this.renderTable();
    });
  }
  createFilterData(){
    let filterList = ["fundAUM","fundId","1522296601"];
    let tableData = this.state.posts.FundList[0].Rows;
    let filterSet = [];
    filterSet.push([]);
    for(let i=0;i<filterList.length;i++){
      let activeFilter = filterList[i];
      filterSet[i] = new Array();
      var innerData = [];
      for(let j=0;j<tableData.length;j++){
        let data = tableData[j][activeFilter];
        innerData.push(data);
      }
      filterSet[i]["title"] = activeFilter;
      filterSet[i]["data"] = innerData;
    }
    this.setState({
        filter: filterSet
    });
    console.log(this.state)
  }

  renderTable() {
    this.dataTables = $("#benchmarkTable") as any;
    let dataSet: any = this.renderDataSet();
    this.dataTables.DataTable({
      data: dataSet,
      fnCreatedRow: function(nRow, aData, iDataIndex) {
        $(nRow).attr("fundID", aData[5]);
      },
      columns: [
        { title: "BENCHMARK" },
        { title: "INCEPTION DATE" },
        { title: "GEOGRAPHIC FOCUS" },
        { title: "PERFORMANCE" },
        { title: "VOLATILITY" },
        { title: `<span className="addButton" ></span>` }
      ],
      columnDefs: [
        {
          targets: -1,
          data: null,
          defaultContent: `<span className="addButton" id=${this} ></span>`
        }
      ],
      searching: false,
      responsive: true,
      paging: false,
      sorting: false,
      ordering: false,
      info: false
    });
  }

  renderDataSet() {

    let dataSet: any = [];
    dataSet.push([]);
    let tableData = this.state.posts.FundList[0].Rows;
    for (let i = 0; i < tableData.length; i++) {
      dataSet[i] = [];
      dataSet[i][0] = tableData[i].fundName;
      dataSet[i][1] = tableData[i].inceptionDate;
      dataSet[i][2] = tableData[i].geographicFocus;
      dataSet[i][3] = tableData[i].performance;
      dataSet[i][4] = tableData[i].volatility;
      dataSet[i][5] = tableData[i].fundrunnerId;
    }
    return dataSet;
  }

  renderFilter(){
    if(this.state.filter){
        return  (
          <div className="col-lg-12">
          {
              this.state.filter.map((key,index) => {
                return(
                  <div className="col-lg-4">
                  <FilterChart id={"chart"+index} rangeId={"range"+index} data={key}  />
                  </div>
                )
            })
          }
          </div>

        )
    }
  }

  render() {
    // toastr.info("Karthik to integrate the fund grid here - <em>gainkap</em>", "TODO");
    return (
      <div>
        <div className="well">
          <div className="container">
            <div className="row">
              <NavLink
                className="col-xs-12"
                exact
                to={"/funds/fundId/" + URL_CONFIG.FUND_DETAILS.OVERVIEW}
              >
                Citadel Kensington Global Strategies Fund LTD.
              </NavLink>
            </div>
          </div>
        </div>
        <div className="container">

          <div className="filter-unit">
            <div className="container">
              <button type="button" className="filter-close">
                {/* <img src="images/close-button.svg" /> */}
              </button>
              <div className="d-flex justify-content-between">
              {
                this.renderFilter()
              }
              </div>
            </div>
            {/* <div className="container-fluid">
              <div className="showmore">
                <div className="col-lg-12">
                  <button type="button" className="more-filters">
                    Show More Filters
                  </button>
                </div>
              </div>
            </div> */}
          </div>
          {/* <div className="col">
                <div className="w-90 filter-container">
                    <div className="float-left">
                        <div className="dropdown trans-dropdown">
                            <button className="btn  dropdown-toggle " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Choose a filter set
                            </button>
                             <div className="dropdown-menu " aria-labelledby="dropdownMenuButton">
                                <a className="dropdown-item" href="#">Action</a>
                                <a className="dropdown-item" href="#">Another action</a>
                                <a className="dropdown-item" href="#">Something else here</a>
                            </div> 
                        </div>
                    </div>
                    <div className="float-right ">
                        <button type="button" className="btn btn-outline-primary blue filterButton filter-benchmark float-right mr-2">Filter</button>
                    </div>
                </div>
                <div className="clearfix"></div>
            </div> */}
          <table
            id="benchmarkTable"
            className="table table-hover data-table-common"
          />
        </div>
      </div>
    );
  }
}