import React from 'react';
import moment from 'moment';

class SfrList extends React.Component {

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
                            <tr key={req.SpotFleetRequestId} className={`${req.SpotFleetRequestState === 'active' ? '': 'error'}`}>
                                <td data-label="Request Id">
                                    <div className="ui horizontal label blue">{req.SpotFleetRequestId}</div>
                                </td>
                                <td data-label="Created at">
                                    <div className="ui horizontal label"> {moment(req.CreateTime).format('YYYY-MM-DDTHH:mm:ssZ')}</div>
                                </td>
                                <td data-label="State">
                                    <div className={`ui ${req.SpotFleetRequestState === 'active' ? 'green' : 'yellow'} horizontal label`}>{req.SpotFleetRequestState}</div>
                                </td>
                                <td data-label="Target Capacity">
                                    <div className={`ui ${req.SpotFleetRequestConfig.TargetCapacity > 0 ? 'green' : ''} circular label`}>
                                        {req.SpotFleetRequestConfig.TargetCapacity}
                                    </div>
                                </td>
                                <td data-label="Fulfilled Capacity">
                                    <div className={`ui ${req.SpotFleetRequestConfig.FulfilledCapacity > 0 ? 'green' : ''} circular label`}>
                                        {req.SpotFleetRequestConfig.FulfilledCapacity}
                                    </div>
                                </td>
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




export default SfrList;