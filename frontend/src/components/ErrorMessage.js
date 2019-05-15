import React from 'react';

class ErrorMessage extends React.Component {

    renderComponent() {
        if(this.props.message) {
            return (
                <div className="ui negative message">
                    <i className="close icon"></i>
                    <div className="header">
                        {this.props.message}
                    </div>
                    <p>
                        {this.props.stack}
                    </p>
                </div>
            );
        } else {
            return <div></div>
        }
    }
    render() {
        return(
            this.renderComponent()
        );
    }
}

export default ErrorMessage;