import React from 'react';
import ErrorMessage from '../ErrorMessage';
import WorkloadsHeader from './WorkloadsHeader';
import WorkloadList from './WorkloadList';
import Lambda from '../../aws/Lambda';

class WorkloadsPage extends React.Component {

    state = { 
        workloads: [],
        error: {
            message: '',
            stack: ''
        }, 
        loading: false
    };

    searchWorkloads() {
        this.setState( {loading: true} );
        var _this = this;
        Lambda.queryWorkloads(this.props.sfrId, function(err, data) {
            if(err){
                _this.setState( {error: err, loading: false} );
            } else {
                var workloads = JSON.parse(data.Payload);
                console.log(workloads);
                _this.setState({
                    loading: false,
                    workloads: workloads
                });
            }
        });
    }

    componentDidMount() {
        this.searchWorkloads();
    }

    onRefreshSubmit = ()  => {
        this.searchWorkloads(this.props.sfrId);
    }

    renderContent() {
        return(
            <div className="ui segment basic" style={{overflow: 'auto' }} >
                <ErrorMessage className="ui"
                    message={this.state.error.message}
                    stack={this.state.error.stack}
                />
                <WorkloadsHeader onRefreshSubmit={this.onRefreshSubmit} />
                <WorkloadList workloads={this.state.workloads}/>
                <div className={`ui ${this.state.loading ? 'active' : ''} dimmer`}>
                    <div className="ui text loader">Loading Instances ...</div>
                </div>
            </div>
        );
    }

    render() {
        return(
            this.renderContent()
        );
    }

}
export default WorkloadsPage;