import { Auth } from 'aws-amplify';
import EC2 from 'aws-sdk/clients/ec2';
import Config from '../config';

function describeSpotFleetRequests(spotFleetRequestId, cb) {
    Auth.currentCredentials()
        .then(credentials => {
            const ec2 = new EC2({
                region: Config.region,
                credentials: Auth.essentialCredentials(credentials),
            });
            var params = {
                SpotFleetRequestIds: [
                    spotFleetRequestId
                 ]
            }
            ec2.describeSpotFleetRequests(params, function(err, data) {
                cb(err, data);
            })
        });
}

function requestSpotFleet(cb) {
    Auth.currentCredentials()
    .then(credentials => {
        const ec2 = new EC2({
            region: Config.region,
            credentials: Auth.essentialCredentials(credentials),
        });
        var params = {
            SpotFleetRequestConfig: Config.ec2.SpotFleetRequestConfig
        }
        console.log(params);

        ec2.requestSpotFleet(params, function(err, data) {
            cb(err, data);
        })
    });
}

function cancelSpotFleetRequests(spotFleetRequestId, cb) {
    Auth.currentCredentials()
        .then(credentials => {
            const ec2 = new EC2({
                region: Config.region,
                credentials: Auth.essentialCredentials(credentials),
            });
            var params = {
                SpotFleetRequestIds: [
                    spotFleetRequestId
                 ],
                 TerminateInstances: true
            }
            ec2.cancelSpotFleetRequests(params, function(err, data) {
                cb(err, data);
            })
        });
}

function describeSpotFleetRequestHistory(params, cb) {
    Auth.currentCredentials()
    .then(credentials => {
        const ec2 = new EC2({
            region: Config.region,
            credentials: Auth.essentialCredentials(credentials),
        });
        ec2.describeSpotFleetRequestHistory(params, function(err, data) {
            if (err) cb(err, data);
            else {
                cb(null, data);
                if (data.NextToken) {
                    params.NextToken = data.NextToken;
                    describeSpotFleetRequestHistory(params, cb)
                } else {
                    // done
                    cb(null, null);
                }
            }
        });
    });
}

function modifySpotFleetRequest(id, targetCapacity, cb) {
    Auth.currentCredentials()
    .then(credentials => {
        const ec2 = new EC2({
            region: Config.region,
            credentials: Auth.essentialCredentials(credentials),
        });
        var params = {
            SpotFleetRequestId: id,
            TargetCapacity: targetCapacity
        }
        ec2.modifySpotFleetRequest(params, function(err, data) {
            cb(err, data);
        })
    });
}

function describeSpotFleetInstances(id, cb) {
    Auth.currentCredentials()
    .then(credentials => {
        const ec2 = new EC2({
            region: Config.region,
            credentials: Auth.essentialCredentials(credentials),
        });
        var params = {
            SpotFleetRequestId: id
        }
        ec2.describeSpotFleetInstances(params, function(err, data) {
            cb(err, data);
        })
    });
}

export default {
    cancelSpotFleetRequests: cancelSpotFleetRequests,
    describeSpotFleetRequests: describeSpotFleetRequests,
    describeSpotFleetRequestHistory: describeSpotFleetRequestHistory,
    requestSpotFleet: requestSpotFleet,
    modifySpotFleetRequest: modifySpotFleetRequest,
    describeSpotFleetInstances: describeSpotFleetInstances
}