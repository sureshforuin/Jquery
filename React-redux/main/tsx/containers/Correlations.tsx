import * as Highcharts from 'highcharts/highcharts';
import * as React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Tablechart from '../containers/Tablechart';

class Correlations extends React.Component<any, any> {
    

    render(){
        return (
            <div className="content-area col-lg-12">
                    <ul className="tabs">
                        <li className="tab-link current" data-tab="tab-3">Correlations Fund</li>
                        <li className="tab-link" data-tab="tab-4">Correlations Alpha</li>
                    </ul>

                    <div id="tab-3" className="tab-content current">
                        <div className="timeframe">
                            <h3>timeframe</h3>
                            <div className="d-flex flex-row time-nav">
                                <div>
                                    <a href="#" data-year="1">1 Yr</a>
                                </div>
                                <div className="active">
                                    <a href="#" data-year="3">3 Yr</a>
                                </div>
                                <div>
                                    <a href="#" data-year="5">5 Yr</a>
                                </div>
                                <div>
                                    <a href="#" data-year="10">Other</a>
                                </div>
                                <div className="dateRange">
                                    <h3>COMMON DATE RANGE</h3>
                                    {/* <input type="text" id="fromCF" className="datepicker" name="from" value="12/13/2013" /> -
                                <input type="text" id="toCF" className="datepicker" name="to" value="12/13/2016" /> */}
                                </div>
                            </div>
                        </div>
                        <div className="highchart-section barTable">
                            <div className="row">
                                <div className="col-lg-6">
                                    <h4>Broad Market</h4>
                                    <Tablechart selector="oneChart" index="0" />
                                </div>
                                <div className="col-lg-6">
                                    <h4>Fund Strategies</h4>
                                     <Tablechart selector="twoChart" index="1"/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <h4>Equities by Regions</h4>
                                    <Tablechart selector="threeChart" index="2"/>
                                </div>
                                <div className="col-lg-6">
                                    <h4>Equities by Style</h4>
                                  <Tablechart selector="fourChart" index="3"/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <h4>Fixed Income</h4>
                                   <Tablechart selector="fiveChart" index="4"/>
                                </div>
                                <div className="col-lg-6">
                                    <h4>Other</h4>
                                   <Tablechart selector="sixChart" index="5"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="tab-4" className="tab-content">
                        <div className="timeframe">
                            <h3>timeframe</h3>
                            <div className="d-flex flex-row time-nav">
                                <div>
                                    <a href="#" data-year="1">1 Yr</a>
                                </div>
                                <div className="active">
                                    <a href="#" data-year="3">3 Yr</a>
                                </div>
                                <div>
                                    <a href="#" data-year="5">5 Yr</a>
                                </div>
                                <div>
                                    <a href="#" data-year="10">Other</a>
                                </div>
                                <div className="dateRange">
                                    <h3>COMMON DATE RANGE</h3>
                                    {/* <input type="text" id="fromCF" className="datepicker" name="from" value="12/13/2013" /> -
                                <input type="text" id="toCF" className="datepicker" name="to" value="12/13/2016" /> */}
                                </div>
                            </div>
                        </div>
                        <div className="highchart-section barTable">
                            <div className="row">
                                <div className="col-lg-6">
                                    <h4>Broad Market</h4>
                                    <div id="twoTableBar1" style={{ height: 300 }}></div>
                                </div>
                                <div className="col-lg-6">
                                    <h4>Fund Strategies</h4>
                                    <div id="twoTableBar2" style={{ height: 300 }}></div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <h4>Equities by Regions</h4>
                                    <div id="twoTableBar3" style={{ height: 300 }}></div>
                                </div>
                                <div className="col-lg-6">
                                    <h4>Equities by Style</h4>
                                    <div id="twoTableBar4" style={{ height: 300 }}></div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <h4>Fixed Income</h4>
                                    <div id="twoTableBar5" style={{ height: 300 }}></div>
                                </div>
                                <div className="col-lg-6">
                                    <h4>Other</h4>
                                    <div id="twoTableBar6" style={{ height: 300 }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
        );
    }
}

export default Correlations;