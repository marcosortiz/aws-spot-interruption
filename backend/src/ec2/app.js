const net = require('net');
const request = require('sync-request');
const uuidv4 = require('uuid/v4');
const Lambda = require('aws-sdk/clients/lambda');
const Config = require('./config.json');

const PORT = 8124
const COUNTER = 1000000; // 1 Mi
const WORK_FREQUENCY = 1000;  // ms
const LOG_FREQUENCY = 15000;  // ms
const PERIOD = 900;     // seconds
const INC = Number((100/300).toFixed(2));

try {
    var instanceId = request('GET', 'http://169.254.169.254/latest/meta-data/instance-id', {timeout: 3000}).body.toString('utf-8');
} catch (error) {
    var instanceId = 'i-123456789' // so we can run it locally
}

var progress = null;
var uuid = null;
const setInitialState = function() {
    progress = null;
    uuid = null;
    const lambda = new Lambda({
        apiVersion: '2015-03-31',
        region: Config.region,
    });
    var params = {
        FunctionName: Config.functionName,
        InvocationType: "RequestResponse",
        Payload: JSON.stringify({sfrId: 'sfr-f4eca55c-67f3-41ca-a092-f530498c6b77'})
    };
    lambda.invoke(params, function(err, data) {
        if(err) {
            console.log(err);
        } else {
            var resp = JSON.parse(data.Payload);
            uuid = resp.id ? resp.id : uuidv4()
            progress = resp.progress ? resp.progress : 0
            console.log('%o %s %s %s %o', new Date(), 'STARTED_AT', uuid, instanceId, new Date());
            console.log('%o %s %s %s %d', new Date(), 'RESUMED_FROM', uuid, instanceId, progress);
        }
    });
}
setInitialState();

function doWork() {
    if (progress !== null) {
        progress = Number(progress);
        if (progress < 100) {
            progress = (progress + INC).toFixed(2);
            progress = progress > 100 ? 100 : progress;
        } else if (progress >= 100) {
            var now = new Date();
            console.log('%o %s %s %s %d', now, 'PROGRESS', uuid, instanceId, progress);
            console.log('%o %s %s %s %o', now, 'FINISHED_AT', uuid, instanceId, now);
            process.exit(0);
            // setInitialState();
        }    
    }
}

var workInterval = setInterval(doWork, WORK_FREQUENCY);
var logInterval = setInterval(function () {
    if(progress !== null) {
        console.log('%o %s %s %s %d', new Date(), 'PROGRESS', uuid, instanceId, progress);
    }
}, LOG_FREQUENCY);

const server = net.createServer((c) => {
    console.log('%o %s %s %s client connected', new Date(), 'INFO', uuid, instanceId);

    c.on('end', () => {
        console.log('%o %s %s %s client disconnected', new Date(), 'INFO', uuid, instanceId);
    });

    c.on('data', (chunk) => {
        data = chunk.toString();
        if(data.startsWith('{"notifiedAt":')) {
            var notifiedAt = JSON.parse(data.trim()).notifiedAt
            var now = new Date();
            console.log('%o %s %s %s %d', new Date(), 'SAVING_PROGRESS', uuid, instanceId, progress)
            console.log('%o %s %s %s %s', now, 'NOTIFIED_AT', uuid, instanceId, notifiedAt);
            c.write('ok');
            clearInterval(workInterval);
            clearInterval(logInterval);
            process.exit(0);
        } else {
            c.write(`Unknown command: ${chunk}`)
        }
        
    });

    c.on('error', (err) => {
        console.log('%o %s %s %s Error: %s', new Date(), 'INFO', uuid, instanceId, err);
    });

});

server.on('error', (err) => {
    throw err;
});

server.listen(PORT, () => {
    console.log('%o %s TCP server listening on port 8124', new Date(), 'INFO');
});
