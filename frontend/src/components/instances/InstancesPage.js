import React from 'react';
import ErrorMessage from '../ErrorMessage';
import InstancesHeader from './InstancesHeader';
import InstanceList from './InstanceList';
import Ec2 from '../../aws/EC2';


class InstancesPage extends React.Component {
    state = { 
        instances: [],
        error: {
            message: '',
            stack: ''
        }, 
        loading: false
    };

    searchInstances(id) {
        var _this = this;
        this.setState( {loading: true} );
        Ec2.describeSpotFleetInstances(id, function(err, data) {
            if(err) _this.setState({
                error: err,
                loading: false
            })
            else { 
                _this.setState({
                    loading: false,
                    instances: data.ActiveInstances
                });
            }
        });
    }

    componentDidMount() {
        this.searchInstances(this.props.sfrId);
    }

    onRefreshSubmit = ()  => {
        this.searchInstances(this.props.sfrId);
    }

    renderContent() {
        return(
            <div className="ui segment" style={{overflow: 'auto' }} >
                <ErrorMessage className="ui"
                    message={this.state.error.message}
                    stack={this.state.error.stack}
                />
                <InstancesHeader onRefreshSubmit={this.onRefreshSubmit}/>
                <InstanceList instances={this.state.instances}/>

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

export default InstancesPage;