import React from 'react';
import { Progress } from 'semantic-ui-react'

class WorkloadList extends React.Component {

    getProgress(w) {
        if (w.notifiedAt) {
            return(
                <Progress percent={w.progress} size='tiny' color='blue' disabled>
                    {`${w.progress}%`}
                </Progress>
            );

        } else {
            return (
                <Progress percent={w.progress} size='tiny' color='blue'>
                    {`${w.progress}%`}
                </Progress>
            );
        }
    }

    renderContent() {
        return (
            <div>
                <table className="ui celled table">
                    <thead>
                        <tr>
                            <th>Workload Id</th>
                            <th>Instance Id</th>
                            <th>Resumed From</th>
                            <th>Progress</th>
                            <th>Notified At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.workloads.map(w => {
                            return (
                                <tr key={w.instanceId} className={(w.notifiedAt && w.progress !== '100') ? 'error' : ''}>
                                    <td data-label="Workload Id">
                                        <div className="ui horizontal label blue">
                                            {w.workloadId}
                                        </div>
                                    </td>
                                    <td data-label="Instance Id">
                                        <div className="ui horizontal label">
                                            {w.instanceId}
                                        </div>
                                    </td>
                                    <td data-label="Resumed From">
                                        <div className="ui horizontal label">
                                            {w.resumedFrom ? w.resumedFrom : 'N/A'}
                                        </div>
                                    </td>
                                    <td data-label="Progress">
                                        {this.getProgress(w)}
                                    </td>
                                    <td data-label="Notified At">
                                        <div className={`ui horizontal ${(w.notifiedAt && w.progress !== '100') ? 'red' : ''} label`}>
                                            {w.notifiedAt ? w.notifiedAt : 'N/A'}
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

export default WorkloadList;