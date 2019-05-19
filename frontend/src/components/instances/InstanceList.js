import React from 'react';

class InstancesList extends React.Component {

    renderContent() {
        return (
            <div>
                <table className="ui celled table">
                <thead>
                    <tr>
                        <th>Spot Instance Reques Id</th>
                        <th>Instance Id</th>
                        <th>Instance Type</th>
                        <th>Instance Health</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.instances.map(i => {
                        return (
                            <tr key={i.InstanceId}>
                                <td data-label="Spot Instance Reques Id">
                                    <div className="ui horizontal label blue">
                                        {i.SpotInstanceRequestId}
                                    </div>
                                </td>
                                <td data-label="Instance Id">
                                    <div className="ui horizontal label">
                                        {i.InstanceId}
                                    </div>
                                </td>
                                <td data-label="Instance Type">
                                    <div className="ui horizontal label">
                                        {i.InstanceType}
                                    </div>
                                </td>
                                <td data-label="Instance Health">
                                    <div className={`ui ${i.InstanceHealth === 'healthy' ? 'green' : ''} horizontal label`}>
                                        {i.InstanceHealth || 'N/A'}
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

export default InstancesList;