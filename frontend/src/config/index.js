import Config from './config.json';
export default {
    region: Config.region,
    cognito: {
        IdentityPoolId: Config.IdentityPoolId,
        UserPoolId: Config.UserPoolId,
        userPoolWebClientId: Config.userPoolWebClientId
    },
    dynamodb: {
        SpotFleetRequestsTable: Config.SpotFleetRequestsTable,
        SpotInterruptionsTable: Config.SpotInterruptionsTable
    },
    ec2: {
        SpotFleetRequestConfig: Config.SpotFleetRequestConfig
    }
};