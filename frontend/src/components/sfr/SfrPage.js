import React from 'react';
import SfrForm from './SfrForm';
import SfrList from './SfrList';
import HistoryPage from '../history/HistoryPage';
import InstancesPage from '../instances/InstancesPage';
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
        loading: false,
        showCapacityPopup: false,
        showCancelFleetRequestPopup: false,
        newTargetCapacity: 0,
        activeTab: 'history'
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
                        _this.setState({
                            requests: [],
                            sfrId: '',
                            loading: false
                        })
                    }
                });
            }
        })
    }

    modifyCapacity(id, targetCapacity) {
        var _this = this;
        this.setState( {loading: true} );
        Ec2.modifySpotFleetRequest(id, targetCapacity, function(err, data) {
            if(err) _this.setState({
                error: err,
                showCapacityPopup: false,
                loading: false
            })
            else { 
                _this.setState({
                    showCapacityPopup: false,
                    loading: false,
                    newTargetCapacity: targetCapacity
                });
            }
        });
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
        this.setState({showCancelFleetRequestPopup: true});
    }

    onModifyTargetCapacity = (event) => {
        this.setState({showCapacityPopup: true});
    }

    onCancelModifyCapacity = () => {
        this.setState({showCapacityPopup: false});
    }

    onSubmitModifyCapacity = () => {
        this.modifyCapacity(this.state.sfrId, this.state.newTargetCapacity);
    }

    onNewTargetCapacityChange = (event) => {
        this.setState({
            newTargetCapacity: parseInt(event.target.value)
        })
    }

    onCancelSpotFleetRequestCancelation = () => {
        this.setState({showCancelFleetRequestPopup: false});
    }

    onSubmitSfrCancelation = () => {
        this.delete(this.state.sfrId);
        this.setState({showCancelFleetRequestPopup: false});
    }

    onHistoryClick = () => {
        this.setState({activeTab: 'history'});
    }

    onInstancesClick = () => {
        this.setState({activeTab: 'instances'});
    }

    onSavingsClick = () => {
        this.setState({activeTab: 'savings'});
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
                            sfrId={this.state.sfrId}
                            showCapacityPopup={this.state.showCapacityPopup}
                            showCancelFleetRequestPopup={this.state.showCancelFleetRequestPopup}
                            newTargetCapacity={this.state.newTargetCapacity}
                            oldTargetCapacity={this.state.requests[0].SpotFleetRequestConfig.TargetCapacity || 0}
                            onRefreshSubmit={this.onRefreshSubmit}
                            onDeleteFleetRequest={this.onDeleteFleetRequest}
                            onModifyTargetCapacity={this.onModifyTargetCapacity}
                            onCancelModifyCapacity={this.onCancelModifyCapacity}
                            onSubmitModifyCapacity={this.onSubmitModifyCapacity}
                            onNewTargetCapacityChange={this.onNewTargetCapacityChange}
                            onCancelSpotFleetRequestCancelation={this.onCancelSpotFleetRequestCancelation}
                            onSubmitSfrCancelation={this.onSubmitSfrCancelation}
                        />
                        <p></p>
                        <SfrList className="ui" requests={this.state.requests}/>
        
                        <div className={`ui ${this.state.loading ? 'active' : ''} dimmer`}>
                            <div className="ui text loader">Loading Spot Fleet Requests ...</div>
                        </div>
                    </div>
                    <div className="ui top attached tabular menu">
                        <button className={`item ${this.state.activeTab === 'history' ? 'active' : ''}`} data-tab="history" onClick={this.onHistoryClick}>History</button>
                        <button className={`item ${this.state.activeTab === 'instances' ? 'active' : ''}`} data-tab="instances" onClick={this.onInstancesClick}>Instances</button>
                        <button className={`item ${this.state.activeTab === 'savings' ? 'active' : ''}`} data-tab="savings" onClick={this.onSavingsClick}>Savings</button>
                    </div>
                    <div className={`ui bottom attached tab segment ${this.state.activeTab === 'history' ? 'active' : ''}`} data-tab="first">
                        <HistoryPage sfrId={this.state.sfrId} />
                    </div>
                    <div className={`ui bottom attached tab segment ${this.state.activeTab === 'instances' ? 'active' : ''}`} data-tab="second">
                        <InstancesPage sfrId={this.state.sfrId} />
                    </div>
                    <div className={`ui bottom attached tab segment ${this.state.activeTab === 'savings' ? 'active' : ''}`} data-tab="third">
                        TODO
                    </div>
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