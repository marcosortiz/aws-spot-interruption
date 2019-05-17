import React from 'react';

class HistoryForm extends React.Component {

    
    onRefreshInstanceList = (event) => {
        this.props.onRefreshSubmit();
    }

    render() {
        return(
            <div>
                <h1 className="ui header">Event History</h1>
                <button className="ui icon button" type="submit" onClick={this.onRefreshInstanceList}>
                    <i className="sync alternate icon"></i>
                </button>
            </div>
        );
    }
}

export default HistoryForm;