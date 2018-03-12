import * as React from 'react';

export default class User extends React.Component<any, any> {

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    render() {
        if (this.props.user) {
            const { name, picture } = this.props.user;
            return (
                <div className='fund-banner'>
                    <div>
                        User: {this.capitalize(name.title)} {this.capitalize(name.first)} {this.capitalize(name.last)}
                    </div>
                    <img src={picture.medium} />
                </div>
            );
        }

        return null;
    }

}
