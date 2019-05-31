import React from 'react';
import { Icon, Popup, Progress } from 'semantic-ui-react'

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

    getResumedFrom(w) {
        if (w.resumedFrom !== '0') {
            return (
                <td data-label="Resumed From">
                    <div className="ui horizontal blue label">
                        {w.resumedFrom}
                    </div>
                </td>
            );
        } else {
            return(
                <td data-label="Resumed From">
                    <div className="ui horizontal label">
                        N/A
                    </div>
                </td>
            );
        }
    }

    getFinishedAt(w) {
        if(w.notifiedAt) {
            return(
                <td data-label="Finished At">
                    <Popup content='Notified At' trigger={<Icon name='warning circle' />} />
                    
                    
                    <div className="ui horizontal red label">
                        {w.notifiedAt}
                    </div>
                </td>
            );
        } else {
            return(
                <td data-label="Finished At">
                    <div className="ui horizontal label">
                        {w.finishedAt || 'N/A'}
                    </div>
                </td>
            );
        }
    }

    renderContent() {
        return (
            <div>
                <table className="ui celled table">
                    <thead>
                        <tr>
                            <th>Started At</th>
                            <th>Instance Id</th>
                            <th>Resumed From</th>
                            <th>Progress</th>
                            <th>Finished At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.workloads.map(w => {
                            return (
                                <tr key={`${w.id}`} className={(w.notifiedAt && w.progress !== '100') ? 'error' : ''}>
                                    <td data-label="Started At">
                                        <div className="ui horizontal blue label">
                                            {w.startedAt}
                                        </div>
                                    </td>
                                    <td data-label="Instance Id">
                                        <div className="ui horizontal label">
                                            {w.instanceId}
                                        </div>
                                    </td>
                                    {this.getResumedFrom(w)}
                                    <td data-label="Progress">
                                        {this.getProgress(w)}
                                    </td>
                                    {this.getFinishedAt(w)}
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