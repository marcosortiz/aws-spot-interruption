import React from 'react';

class SpotRequestForm extends React.Component {

    createSpotRequest = (event) => {
        console.log('createSpotRequest!');
    }

    refreshSpotRequestList = (event) => {
        console.log('refreshSpotRequestList!');
    }

    render() {
        return(
            <div>
                <h1 className="ui header">Spot Instance Requests</h1>
                <button className="ui button primary" type="submit" onClick={this.createSpotRequest}>Request Spot Instances</button>
                <button className="ui icon button" type="submit" onClick={this.refreshSpotRequestList}>
                    <i className="sync alternate icon"></i>
                </button>
            </div>
        );
    }
}

export default SpotRequestForm;