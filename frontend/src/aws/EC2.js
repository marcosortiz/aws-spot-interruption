import { Auth } from 'aws-amplify';
import EC2 from 'aws-sdk/clients/ec2';

function describeSpotFleetRequests(spotFleetRequestId, cb) {
    Auth.currentCredentials()
        .then(credentials => {
            const ec2 = new EC2({
                region: 'us-east-1',
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
            region: 'us-east-1',
            credentials: Auth.essentialCredentials(credentials),
        });
        var params = {
            SpotFleetRequestConfig: {
                IamFleetRole: 'arn:aws:iam::369233778488:role/aws-ec2-spot-fleet-tagging-role',
                AllocationStrategy: 'lowestPrice',
                TargetCapacity: 0,
                TerminateInstancesWithExpiration: true,
                Type: 'maintain',
                InstancePoolsToUseCount: 7,
                LaunchTemplateConfigs: [
                    {
                        LaunchTemplateSpecification: {
                            LaunchTemplateId: 'lt-03e79255f095518c5',
                            Version: '1'
                        },
                        Overrides: [
                            {
                                InstanceType: "t3a.medium",
                                SubnetId: "subnet-011d858e106a2b4e5"
                              },
                              {
                                InstanceType: "t3a.medium",
                                SubnetId: "subnet-0af6f052d506cbd66"
                              },
                              {
                                InstanceType: "t3a.medium",
                                SubnetId: "subnet-04af6d86406cd4323"
                              },
                              {
                                InstanceType: "t3.medium",
                                SubnetId: "subnet-011d858e106a2b4e5"
                              },
                              {
                                InstanceType: "t3.medium",
                                SubnetId: "subnet-0af6f052d506cbd66"
                              },
                              {
                                InstanceType: "t3.medium",
                                SubnetId: "subnet-04af6d86406cd4323"
                              },
                              {
                                InstanceType: "t2.medium",
                                SubnetId: "subnet-011d858e106a2b4e5"
                              },
                              {
                                InstanceType: "t2.medium",
                                SubnetId: "subnet-0af6f052d506cbd66"
                              },
                              {
                                InstanceType: "t2.medium",
                                SubnetId: "subnet-04af6d86406cd4323"
                              }
                        ]
                    }
                ],
            }
        };

        ec2.requestSpotFleet(params, function(err, data) {
            cb(err, data);
        })
    });
}

function cancelSpotFleetRequests(spotFleetRequestId, cb) {
    Auth.currentCredentials()
        .then(credentials => {
            const ec2 = new EC2({
                region: 'us-east-1',
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

function describeSpotFleetRequestHistory(spotFleetRequestId, cb) {
    Auth.currentCredentials()
    .then(credentials => {
        const ec2 = new EC2({
            region: 'us-east-1',
            credentials: Auth.essentialCredentials(credentials),
        });
        var params = {
            SpotFleetRequestId: spotFleetRequestId,
            StartTime: new Date(0)
        }
        ec2.describeSpotFleetRequestHistory(params, function(err, data) {
            cb(err, data);
        })
    });
}

function modifySpotFleetRequest(id, targetCapacity, cb) {
    Auth.currentCredentials()
    .then(credentials => {
        const ec2 = new EC2({
            region: 'us-east-1',
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
            region: 'us-east-1',
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