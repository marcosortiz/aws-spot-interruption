import { Auth } from 'aws-amplify';
import DynamoDB from 'aws-sdk/clients/dynamodb';

function saveToDdb(id, cb) {
    Auth.currentCredentials()
        .then(credentials => {
            const ddb = new DynamoDB({
                region: 'us-east-1',
                credentials: Auth.essentialCredentials(credentials),
            });
            var params = {
                TableName: 'spot-demo-app-SpotFleetRequestsTable-V8XFJ9O8BMWB',
                Item: {
                    'id': {S: id}
                }
            }
            ddb.putItem(params, function(err, data) {
                cb(err, data);
            })
        });

}

function scanSfrFromDdb(cb) {
    Auth.currentCredentials()
        .then(credentials => {
            const ddb = new DynamoDB({
                region: 'us-east-1',
                credentials: Auth.essentialCredentials(credentials),
            });
            var params = {
                TableName: 'spot-demo-app-SpotFleetRequestsTable-V8XFJ9O8BMWB',
            }
            ddb.scan(params, function(err, data) {
                cb(err, data);
            })
        });        
}

function deleteSfrFromDdb(id, cb) {
    Auth.currentCredentials()
        .then(credentials => {
            const ddb = new DynamoDB({
                region: 'us-east-1',
                credentials: Auth.essentialCredentials(credentials),
            });
            var params = {
                TableName: 'spot-demo-app-SpotFleetRequestsTable-V8XFJ9O8BMWB',
                Key: {
                    'id': {S: id}
                }
            }
            ddb.deleteItem(params, function(err, data) {
                cb(err, data);
            })
        });        
}

export default {
    deleteSfrFromDdb: deleteSfrFromDdb,
    scanSfrFromDdb: scanSfrFromDdb,
    saveToDdb: saveToDdb
}