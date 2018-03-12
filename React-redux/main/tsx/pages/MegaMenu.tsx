import * as React from 'react';
import { NavLink } from 'react-router-dom';

export default class MegaMenu extends React.Component<any, any> {

  render() {
    return (
      <nav className="navbar navbar-default mega-menu">
        <div className="container">
          <div className="navbar-header col-md-5">
            <button type="button" className="navbar-toggle collapsed" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <NavLink className="navbar-brand no-left-padding" exact to="/">Morgan Stanley | Investment Management</NavLink>
          </div>

          <div className="col-md-7">
            <div className="collapse navbar-collapse col-md-8">
              <ul className="nav navbar-nav navbar-right">
                <li><a className="text-uppercase"><span className="karlabold">AIP Advisory Tool</span></a></li>
                <li><a >|</a></li>
                <li><a ><span className="karlaregular">Funds</span></a></li>
                <li><a ><span className="karlaregular">Portfolio Modeling</span></a></li>
                <li><a ><span className="karlaregular">Insights</span></a></li>

              </ul>
            </div>
            <div className="col-md-2 fund-count-menu">
              <div className="dropdown">
                <a className="dropdown-toggle text-uppercase text-center no-padding" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                  <span className="fund-count" >0</span>
                  <span className="count-title">Funds</span>
                  <span className="count-title glyphicon glyphicon-chevron-down"></span>
                </a>
                <ul className="dropdown-menu">
                  <li><a >Action</a></li>
                  <li><a >Another action</a></li>
                  <li><a >Something else here</a></li>
                  <li role="separator" className="divider"></li>
                  <li><a >Separated link</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

}

