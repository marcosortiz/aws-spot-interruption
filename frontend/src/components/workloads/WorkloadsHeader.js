import React from 'react';

class WorkloadsHeader extends React.Component {

    
    onRefreshSubmit = (event) => {
        this.props.onRefreshSubmit();
    }

    render() {
        return(
            <div>
                <button className="ui icon button right floated" type="submit" onClick={this.onRefreshSubmit}>
                    <i className="sync alternate icon"></i>
                </button>
            </div>
        );
    }
}

export default WorkloadsHeader;