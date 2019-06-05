var fs   = require('fs');
var path = require('path');

var AWS            = require('aws-sdk/global');
var Cloudformation = require('aws-sdk/clients/cloudformation');

const BACKEND_CONFIG_FILE_PATH = path.normalize(`${path.resolve(__dirname)}/../../backend/config/config.json`);
const FRONTEND_CONFIG_FILE_PATH = path.normalize(`${path.resolve(__dirname)}/../src/config/config.json`);
const KEYS = [
    'IdentityPoolId',
    'UserPoolId',
    'userPoolWebClientId',
    'SpotFleetRequestsTable',
    'SpotInterruptionsTable',
    'SpotDemoLaunchTemplate',
    'SpotDemoLaunchTemplateVersion',
    'PrivateSubnet1',
    'PrivateSubnet2',
    'PrivateSubnet3',
    'QueryWorkloadsFunctionArn'
];
const INSTANCE_TYPES = ['t3a.medium', 't3.medium', 't2.medium'];

var region = null;
var stackName = null;

function getRegion() {
    if (region === null) {
        var data =  fs.readFileSync(BACKEND_CONFIG_FILE_PATH, 'UTF8');
        region = JSON.parse(data).region;
    }
    return region;
}

function getBackendStackName() {
    if (stackName === null) {
        var data =  fs.readFileSync(BACKEND_CONFIG_FILE_PATH, 'UTF8');
        stackName = JSON.parse(data).cloudformationStackNamePrefix;
    }
    return stackName;
}

function find(arr, key) {
    var found = arr.find(function(element) {
        return element['OutputKey'] === key;
    });
    return found['OutputValue'];
}

function getLtConfigsOverrides(params={}) {
    var a = []
    params.instanceTypes.forEach(function(type) {
        params.subnets.forEach( function (subnet) {
            a.push(
                {
                    InstanceType: type,
                    SubnetId: subnet
                }
            );
        });
    });
    return a;
}
function getSpotFleetRequestConfig(params={}) {
    var config = {
        IamFleetRole: 'arn:aws:iam::369233778488:role/aws-ec2-spot-fleet-tagging-role',
        AllocationStrategy: 'lowestPrice',
        TargetCapacity: 0,
        TerminateInstancesWithExpiration: true,
        Type: 'maintain',
        InstancePoolsToUseCount: 7,
        LaunchTemplateConfigs: [
            {
                LaunchTemplateSpecification: {
                    LaunchTemplateId: params.launchTemplateId,
                    Version: params.launchTemplateVersion
                },
                Overrides: getLtConfigsOverrides(params)
            }
        ],
    };
    return config;

}

function fetchConfig(keys, outputs) {
    console.log('Reading backend configuration file ...');
    AWS.config.region = getRegion();
    const cfn = new Cloudformation();
    var stackName = getBackendStackName()
    var params = {
        StackName: stackName
    };

    console.log(`Parsing configuration params from CloudFormation stack ${stackName} ...`);
    cfn.describeStacks(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else {
            var config = { region: region };
            var outputs = data.Stacks[0].Outputs;
            KEYS.forEach(function(key) {
                config[key] = find(outputs, key);
            });
           var  params = {
                launchTemplateId: find(outputs, 'SpotDemoLaunchTemplate'),
                launchTemplateVersion: find(outputs, 'SpotDemoLaunchTemplateVersion'),
                instanceTypes: INSTANCE_TYPES,
                subnets: [
                    find(outputs, 'PrivateSubnet1'),
                    find(outputs, 'PrivateSubnet2'),
                    find(outputs, 'PrivateSubnet3')
                ]
            }
            var sfrConfig = getSpotFleetRequestConfig(params);
            config['SpotFleetRequestConfig'] = sfrConfig;
            var content = JSON.stringify(config, null, 4);
            fs.writeFileSync(FRONTEND_CONFIG_FILE_PATH, content);
            console.log(`Backend configuration saved to ${BACKEND_CONFIG_FILE_PATH}`);
        }     
    });
}

fetchConfig();