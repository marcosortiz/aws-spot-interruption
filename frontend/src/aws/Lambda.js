import { Auth } from 'aws-amplify';
import Lambda from 'aws-sdk/clients/lambda';
import Config from '../config';

function queryWorkloads(sfrId, cb) {
    Auth.currentCredentials()
    .then(credentials => {
        const lambda = new Lambda({
            apiVersion: '2015-03-31',
            credentials: Auth.essentialCredentials(credentials),
            region: Config.region,
        });
        var params = {
            FunctionName: Config.lambda.QueryWorkloadsFunctionArn,
            InvocationType: "RequestResponse",
            Payload: JSON.stringify({sfrId: sfrId})
        };
        lambda.invoke(params, function(err, data) {
            cb(err, data);
        });
    })
}

export default {
    queryWorkloads: queryWorkloads
}