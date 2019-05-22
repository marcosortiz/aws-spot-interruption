import { Auth } from 'aws-amplify';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import Config from '../config';

function saveToDdb(id, cb) {
    Auth.currentCredentials()
        .then(credentials => {
            const ddb = new DynamoDB({
                region: Config.region,
                credentials: Auth.essentialCredentials(credentials),
            });
            var params = {
                TableName: Config.dynamodb.SpotFleetRequestsTable,
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
                region: Config.region,
                credentials: Auth.essentialCredentials(credentials),
            });
            var params = {
                TableName: Config.dynamodb.SpotFleetRequestsTable,
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
                region: Config.region,
                credentials: Auth.essentialCredentials(credentials),
            });
            var params = {
                TableName: Config.dynamodb.SpotFleetRequestsTable,
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