import React from 'react';

class HistoryForm extends React.Component {

    
    onRefreshSubmit = (event) => {
        this.props.onRefreshSubmit();
    }

    render() {
        return(
            <div>
                <button className="ui icon button right floated" type="submit" onClick={this.onRefreshSubmit}>
                    <i className="sync alternate icon"></i>
                </button>
                History saved for 48 hours only. Updates may take up to 1 minute to display.
            </div>
        );
    }
}

export default HistoryForm;