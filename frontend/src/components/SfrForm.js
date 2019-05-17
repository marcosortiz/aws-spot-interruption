import React from 'react';

class SfrForm extends React.Component {

    onDeleteFleetRequest = (event) => {
        this.props.onDeleteFleetRequest();
    }
    
    onRefreshSpotRequestList = (event) => {
        this.props.onRefreshSubmit();
    }

    render() {
        return(
            <div>
                <h1 className="ui header">Spot Fleet Requests</h1>
                <button className="ui button red" type="submit" onClick={this.onDeleteFleetRequest}>
                    Delete Fleet Request
                </button>
                <button className="ui icon button" type="submit" onClick={this.onRefreshSpotRequestList}>
                    <i className="sync alternate icon"></i>
                </button>
            </div>
        );
    }
}

export default SfrForm;