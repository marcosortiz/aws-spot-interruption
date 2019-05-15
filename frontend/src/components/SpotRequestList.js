import React from 'react';
import moment from 'moment';

class SpotRequestList extends React.Component {

    renderContent() {
        return (
            <div>
                <table className="ui celled table">
                <thead>
                    <tr>
                        <th>Request Id</th>
                        <th>Created at</th>
                        <th>State</th>
                        <th>Target Capacity</th>
                        <th>Fulfilled Capacity</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.requests.map(req => {
                        return (
                            <tr key={req.SpotFleetRequestId}>
                                <td data-label="Request Id">{req.SpotFleetRequestId}</td>
                                <td data-label="Created at">{moment(req.CreateTime).format('YYYY-MM-DDTHH:mm:ssZ')}</td>
                                <td data-label="State">{req.SpotFleetRequestState}</td>
                                <td data-label="Target Capacity">{req.SpotFleetRequestConfig.TargetCapacity}</td>
                                <td data-label="Fulfilled Capacity">{req.SpotFleetRequestConfig.FulfilledCapacity}</td>
                            </tr>
                        )
                    })}
                </tbody>
                </table>
            </div>
        );

    }

    render() {
        return (
            this.renderContent()
        );
    }
}




export default SpotRequestList;