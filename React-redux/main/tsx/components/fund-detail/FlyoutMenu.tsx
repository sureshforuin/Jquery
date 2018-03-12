import * as React from 'react';
import * as toastr from 'toastr';
import { scrollIntoView, hashCode } from '../../../utills/common';
import {HashLink} from 'react-router-hash-link';
import { FUND_DETAIL_RESOURCE_GROUP_APIS } from '../../constants/constant';

export class FlyoutMenu extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            isVisibleState: true,
            subMenuItems: []
        };

        this.onMenuItemMouseEnter = this.onMenuItemMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }

    onMenuItemMouseEnter(menuItemIndex) {
        const { menuItems } = this.props;
        const menuItem = menuItems[menuItemIndex];
        const subMenuItems = menuItem.data;
        // console.info(menuItemIndex);
        // console.info(subMenuItems);
        this.setState({
            subMenuItems
        });
    }

    onMouseLeave() {
        this.setState({
            subMenuItems: []
        });
    }

    render() {
        const { description, isVisible, menuItems, onMenuItemClick, title } = this.props;
        const { subMenuItems } = this.state;

        const currentHoverTabIndex = FUND_DETAIL_RESOURCE_GROUP_APIS.findIndex(rg => rg.title === title);
        let currentHoverTab = null;
        if (currentHoverTabIndex != -1) {
            currentHoverTab = FUND_DETAIL_RESOURCE_GROUP_APIS[currentHoverTabIndex];
        }

        return (
            <div className="menu-flyout-panel" onMouseLeave={this.onMouseLeave} style={{ display: isVisible && this.state.isVisibleState ? 'block' : 'none' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <h1 className="no-margin main-title level-two-menu-title" key={title}>{title}</h1>
                            <div className="level-two-menu-supporting-copy paragraph-description" key={description}>{description}</div>
                        </div>
                        <div className="col-md-4">
                            {
                                (menuItems || [])
                                    .filter(menuItem => menuItem.title)
                                    .map((menuItem, index) => (
                                        <div className="level-two-menu" data-menuitemid={index} key={`${index}-${menuItem.title}`} onMouseEnter={e => this.onMenuItemMouseEnter(index)}>
                                            <div className="blank-space-10"></div>
                                            <HashLink
                                                className="level-two-menu-title"
                                                onClick={onMenuItemClick}
                                                replace
                                                to={`${currentHoverTab.link}#${hashCode(menuItem.title)}`}>
                                                {menuItem.title}<span className="caret-right pull-right"></span>
                                            </HashLink>
                                            <div className="blank-space-10"></div>
                                        </div>
                                    ))
                            }
                        </div>
                        <div className="col-md-4">
                            {
                                (subMenuItems || [])
                                    .filter(subMenuItem => subMenuItem.id)
                                    .map((subMenuItem, index) => (
                                        <div className="level-two-menu" data-menuitemid={index} key={`${index}-${subMenuItem.id}`}>
                                            <div className="blank-space-10"></div>
                                            {/* <HashLink className="level-three-menu-title" key={subMenuItem.id} replace to={`${currentHoverTab.link}#${hashCode(subMenuItem.id)}`}>
                                                {subMenuItem.id}
                                            </HashLink> */}
                                            <a className="level-three-menu-title" key={subMenuItem.id} onClick={e => toastr.info("This is work-in-progress", "Coming soon")}>
                                                {subMenuItem.id}
                                            </a>
                                            <div className="blank-space-10"></div>
                                        </div>
                                    ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}