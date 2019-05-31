import React from 'react';
import ErrorMessage from '../ErrorMessage';
import HistoryForm from './HistoryForm';
import HistoryList from './HistoryList';
import EC2 from '../../aws/EC2';

class HistoryPage extends React.Component {
    state = { 
        events: [],
        error: {
            message: '',
            stack: ''
        }, 
        loading: false
    };

    search(id) {
        var _this = this;
        var params = {
            SpotFleetRequestId: id,
            StartTime: new Date(0),
            NextToken: ''
        }
        this.setState( {events: [], loading: true} );
        EC2.describeSpotFleetRequestHistory(params, function(err, data) {
            if(err){
                _this.setState( {error: err, loading: false} );
            } else {
                // still paginating
                if (data) {
                    var joined = _this.state.events.concat(data.HistoryRecords);
                    _this.setState( {events: joined} )
                } else { //done
                    var reverse = _this.state.events.reverse();
                    _this.setState( {events: reverse, loading: false} )
                }
            }
        });
    }

    onRefreshSubmit = ()  => {
       this.search(this.props.sfrId);
    }

    componentDidMount() {
        this.search(this.props.sfrId);
        this.interval = setInterval(() => this.search(this.props.sfrId), 15000);
    }
    
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    renderContent() {
        return(
            // <div className="ui segment" style={{overflow: 'auto', maxHeight: 400 }}>
            <div className="ui segment basic" style={{overflow: 'auto' }} >
                <ErrorMessage className="ui"
                    message={this.state.error.message}
                    stack={this.state.error.stack}
                />
                <HistoryForm onRefreshSubmit={this.onRefreshSubmit}/>
                <HistoryList events={this.state.events}/>

                <div className={`ui ${this.state.loading ? 'active' : ''} dimmer`}>
                    <div className="ui text loader">Loading Event History ...</div>
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

export default HistoryPage;