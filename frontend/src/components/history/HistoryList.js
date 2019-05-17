import React from 'react';
import moment from 'moment';

class SfrList extends React.Component {

    renderContent() {
        return (
            <div>
                <table className="ui celled table">
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>Event Type</th>
                        <th>Status</th>
                        <th>Description</th>
                        <th>Instance Id</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.events.map((e, i) => {
                        return (
                            <tr key={i}>
                                <td data-label="Timestamp">
                                    <div className="ui horizontal label small">{moment(e.Timestamp).format('HH:mm:ss')}</div>
                                </td>
                                <td>
                                    <div className="ui horizontal label small blue">
                                        {e.EventType}
                                    </div>
                                </td>
                                <td>
                                    <div className="ui horizontal label small blue">
                                        {e.EventInformation.EventSubType}
                                    </div>
                                </td>
                                <td>
                                    {e.EventInformation.EventDescription}
                                </td>
                                <td>
                                    {e.EventInformation.InstanceId}
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