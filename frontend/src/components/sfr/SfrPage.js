import React from 'react';
import SfrForm from './SfrForm';
import SfrList from './SfrList';
import HistoryPage from '../history/HistoryPage';
import ErrorMessage from '../ErrorMessage';
import Ddb from '../../aws/DynamoDB';
import Ec2 from '../../aws/EC2';

class SfrPage extends React.Component {
    state = { 
        sfrId: '',
        requests: [],
        error: {
            message: '',
            stack: ''
        }, 
        loading: false
    };

    create() {
        var _this = this;
        this.setState( {loading: true} );
        Ec2.requestSpotFleet(function(err, data) {
            if(err) {
                _this.setState( {error: err, loading: false} );
            }
            else {
                Ddb.saveToDdb(data.SpotFleetRequestId, function(err2, data2) {
                    if(err2) _this.setState( {error: err2, loading: false} )
                    else {
                        Ddb.scanSfrFromDdb(function(err3, data3) {
                            if(err3) _this.setState( {error: err3, loading: false} )
                            else {
                                _this.setState( {loading: false} )
                                if (data3.Count > 0) {
                                    _this.setState( {loading: true} )
                                    Ec2.describeSpotFleetRequests(data3.Items[0].id.S, function(err4, data4) {
                                        if(err4) _this.setState( {error: err4, loading: false} )
                                        else {
                                            _this.setState({
                                                requests: data4.SpotFleetRequestConfigs,
                                                loading: false,
                                                sfrId: data4.SpotFleetRequestConfigs[0].SpotFleetRequestId || ''
                                            });
                                        }                    
                                    })
                                }
                            }        
                        });
                    }
                });
            } 
        })
    }

    search() {
        this.setState( {loading: true} );
        var _this = this;
        Ddb.scanSfrFromDdb(function(err, data) {
            if(err) _this.setState( {error: err, loading: false} )
            else {
                _this.setState( {loading: false} )
                if (data.Count > 0) {
                    Ec2.describeSpotFleetRequests(data.Items[0].id.S, function(err2, data2){
                        _this.setState( {loading: true} );
                        if(err2) _this.setState( {error: err2, loading: false} )
                        else {
                            _this.setState({
                                requests: data2.SpotFleetRequestConfigs, 
                                loading: false,
                                sfrId: data2.SpotFleetRequestConfigs[0].SpotFleetRequestId || ''
                            });
                        }
                    });
                }
            }
        });
    }

    delete(id) {
        var _this = this;
        this.setState( {loading: true} );
        Ddb.deleteSfrFromDdb(id, function(err, data) {
            if(err) _this.setState( {error: err, loading: false} )
            else {
                Ec2.cancelSpotFleetRequests(id, function(err, data) {
                    if(err) _this.setState( {error: err, loading: false} )
                    else {
                        _this.setState( {requests: [], loading: false} )
                    }
                });
            }
        })
    }

    componentDidMount() {
        this.search();
    }

    onRefreshSubmit = ()  => {
        this.search()
    }

    oncreateFleetRequest = () => {
        this.create();
    }

    onDeleteFleetRequest = () => {
        this.delete(this.state.requests[0].SpotFleetRequestId);
    }

    renderContent() {
        if(this.state.requests.length > 0) {
            return(
                <div>
                    <div className="ui segment">
                        <ErrorMessage className="ui"
                            message={this.state.error.message}
                            stack={this.state.error.stack}
                        />
                        <SfrForm className="ui"
                            onRefreshSubmit={this.onRefreshSubmit}
                            onDeleteFleetRequest={this.onDeleteFleetRequest}
                        />
                        <p></p>
                        <SfrList className="ui" requests={this.state.requests}/>
        
                        <div className={`ui ${this.state.loading ? 'active' : ''} dimmer`}>
                            <div className="ui text loader">Loading Spot Fleet Requests ...</div>
                        </div>
                    </div>
                    <HistoryPage sfrId={this.state.sfrId}/>
                </div>

            );
        } else {
            return(
                <div>
                    <div className="ui placeholder segment">
                        <div className="ui icon header">
                            <i className="aws outline icon"></i>
                            You have no spot fleet requests created yet.
                        </div>
                        <div className="ui primary button" onClick={this.oncreateFleetRequest}>Create Spot Fleet Request</div>
                        
                        <div className={`ui ${this.state.loading ? 'active' : ''} dimmer`}>
                            <div className="ui text loader">Loading Spot Fleet Requests ...</div>
                        </div>
                    </div>

                    <ErrorMessage className="ui"
                        message={this.state.error.message}
                        stack={this.state.error.stack}
                    />
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

export default SfrPage;