
import * as React from "react";

export default class PotentialError extends React.Component<any, any>{

    constructor(props) {
        super(props);
        this.state = { error: false };
    }

    componentDidCatch(error, info) {
        console.log("Error found in componentDidCatch");
        this.setState({ error, info });
    }

    render() {
        if (this.state.error) {
            return (
                <div>
                    <h1>
                        Error AGAIN: {this.state.error.toString()}
                    </h1>
                    {this.state.info &&
                        this.state.info.componentStack.split("\n").map(i => {
                            return (
                                <div key={i}>
                                    {i}
                                </div>
                            );
                        })}
                </div>
            );
        }
        return this.props.children;
    }

}