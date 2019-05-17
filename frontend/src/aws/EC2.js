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
                Type: 'maintain',
                TargetCapacity: 0,
                AllocationStrategy: 'lowestPrice',
                LaunchTemplateConfigs: [
                    {
                        LaunchTemplateSpecification: {
                            LaunchTemplateId: 'lt-03e79255f095518c5',
                            Version: '1'
                        },
                        Overrides: [
                            {
                                InstanceType: "t3a.medium",
                                SubnetId: "subnet-09d915d812902a157"
                              },
                              {
                                InstanceType: "t3a.medium",
                                SubnetId: "subnet-0e43d571f61cc07db"
                              },
                              {
                                InstanceType: "t3a.medium",
                                SubnetId: "subnet-04af6d86406cd4323"
                              },
                              {
                                InstanceType: "t3.medium",
                                SubnetId: "subnet-09d915d812902a157"
                              },
                              {
                                InstanceType: "t3.medium",
                                SubnetId: "subnet-0e43d571f61cc07db"
                              },
                              {
                                InstanceType: "t3.medium",
                                SubnetId: "subnet-04af6d86406cd4323"
                              },
                              {
                                InstanceType: "t2.medium",
                                SubnetId: "subnet-09d915d812902a157"
                              },
                              {
                                InstanceType: "t2.medium",
                                SubnetId: "subnet-0e43d571f61cc07db"
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

export default {
    cancelSpotFleetRequests: cancelSpotFleetRequests,
    describeSpotFleetRequests: describeSpotFleetRequests,
    requestSpotFleet: requestSpotFleet
}