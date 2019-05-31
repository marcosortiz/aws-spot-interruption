import React from 'react';
import { Modal } from 'semantic-ui-react'

class SfrForm extends React.Component {
    state = { 
        newTargetCapacity: 0
    }
    onDeleteFleetRequest = (event) => {
        this.props.onDeleteFleetRequest();
    }

    onModifyTargetCapacity = (event) => {
        this.props.onModifyTargetCapacity();
    }
    
    onRefreshSpotRequestList = (event) => {
        this.props.onRefreshSubmit();
    }

    onNewTargetCapacityChange = (event) => {
        this.props.onNewTargetCapacityChange(event);
    }

    onCancelModifyCapacity = () => {
        this.props.onCancelModifyCapacity();
    }

    onSubmitModifyCapacity = () => {
        this.props.onSubmitModifyCapacity();
    }

    onCancelSpotFleetRequestCancelation = () => {
        this.props.onCancelSpotFleetRequestCancelation();
    }

    onSubmitSfrCancelation = () => {
        this.props.onSubmitSfrCancelation();
    }

    render() {        
        return(
            <div>
                <h1 className="ui header">Spot Fleet Requests</h1>
                <button className="ui button red" type="submit" onClick={this.onDeleteFleetRequest}>
                    Cancel Fleet Request
                </button>

                <button className="ui button" type="submit" onClick={this.onModifyTargetCapacity}>
                    Modify Target Capacity
                </button>

                <Modal size='small' open={this.props.showCancelFleetRequestPopup} onClose={this.close}>
                    <Modal.Header>Cancel Spot Fleet Request</Modal.Header>
                    <Modal.Content>
                        <p>Confirm cancelation of spot request {this.props.sfrId}</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <button
                            className="ui button"
                            type="submit"
                            onClick={this.onCancelSpotFleetRequestCancelation}>
                            Cancel
                        </button>
                        <button
                            className="ui button primary"
                            type="submit"
                            onClick={this.onSubmitSfrCancelation}
                        >
                            Confirm
                        </button>
                    </Modal.Actions>
                </Modal>

                <Modal size='small' open={this.props.showCapacityPopup} onClose={this.close}>
                    <Modal.Header>Modify Capacity</Modal.Header>
                    <Modal.Content>
                        <form className="ui form">
                            <div className="fields">
                                <div className="inline field">
                                    <label>Request Id:</label>
                                    <div className="ui label blue">{this.props.sfrId}</div>
                                </div>
                            </div>
                            <div className="fields">
                                <div className="inline field">
                                    <label>Old Target Capacity:</label>
                                    <div className="ui circular label">{this.props.oldTargetCapacity}</div>
                                </div>
                            </div>
                            <div className="fields">
                                <div className="inline field">
                                    <label>New Target Capacity:</label>
                                    <div className="ui input">
                                        <input type="number" name="new-target-capacity" 
                                            min="0" max="1" placeholder="0" 
                                            defaultValue={this.props.newTargetCapacity}
                                            onChange={this.onNewTargetCapacityChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="fields">
                                <div className="inline field">
                                    <div className="ui disabled checkbox">
                                        <input type="checkbox" name="terminate-instances" defaultChecked />
                                        <label>Terminate instances</label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Modal.Content>
                    <Modal.Actions>
    
                        <button className="ui button" type="submit" 
                            onClick={this.onCancelModifyCapacity}>
                            Cancel
                        </button>
                        <button 
                            className={`ui button ${parseInt(this.props.oldTargetCapacity) === parseInt(this.props.newTargetCapacity) ? 'disabled' : ''} primary`} 
                            type="submit"
                            onClick={this.onSubmitModifyCapacity}>
                            Submit
                        </button>
                    </Modal.Actions>
                </Modal>


                <button className="ui icon button" type="submit" onClick={this.onRefreshSpotRequestList}>
                    <i className="sync alternate icon"></i>
                </button>
            </div>
        );
    }
}

export default SfrForm;