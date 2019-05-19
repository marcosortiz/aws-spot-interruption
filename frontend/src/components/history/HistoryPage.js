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
        this.setState( {loading: true} );
        var _this = this;
        EC2.describeSpotFleetRequestHistory(id, function(err, data) {
            if(err) _this.setState( {error: err, loading: false} )
            else {
                _this.setState( {loading: false} );
                _this.setState( {events: data.HistoryRecords, loading: false} )
            }
        });
    }

    onRefreshSubmit = ()  => {
        this.search(this.props.sfrId);
    }


    componentDidMount() {
        this.search(this.props.sfrId);
    }

    renderContent() {
        return(
            // <div className="ui segment" style={{overflow: 'auto', maxHeight: 400 }}>
            <div className="ui segment" style={{overflow: 'auto' }} >
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