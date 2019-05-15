import React from 'react';
import { Auth } from 'aws-amplify';
import EC2 from 'aws-sdk/clients/ec2';
import SpotRequestForm from './SpotRequestForm';
import SpotRequestList from './SpotRequestList';
import Spinner from './Spinner';
import ErrorMessage from './ErrorMessage';

class SpotRequestPage extends React.Component {
    state = { 
        requests: [], 
        error: {
            message: '',
            stack: ''
        }, 
        loading: false
    };

    describeSpotFleetRequests() {
        var _this = this;
        this.setState( {loading: true} );
        Auth.currentCredentials()
            .then(credentials => {
                const ec2 = new EC2({
                    region: 'us-east-1',
                    credentials: Auth.essentialCredentials(credentials),
                });
                ec2.describeSpotFleetRequests({}, function(err, data) {
                    if(err) _this.setState( {error: err, loading: false} )
                    else _this.setState( {requests: data.SpotFleetRequestConfigs, loading: false} )
                })
            });

    }

    componentDidMount() {
        this.describeSpotFleetRequests();
    }

    renderContent() {
        if(this.state.loading) {
            return <Spinner message="Loading Spot Requests ..."/>;
        } else {
            return(
                <div>
                    <ErrorMessage
                        message={this.state.error.message}
                        stack={this.state.error.stack}
                    />
                    <SpotRequestForm />
                    <SpotRequestList requests={this.state.requests}/>
                </div>
            );
        }
    }

    render() {
        return(
            this.renderContent()
        );
    }
}

export default SpotRequestPage;