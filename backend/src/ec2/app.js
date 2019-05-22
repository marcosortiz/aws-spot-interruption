const net = require('net');
const request = require('sync-request');

var instanceId = request('GET', 'http://169.254.169.254/latest/meta-data/instance-id').body.toString('utf-8');

const PORT = 8124
const COUNTER = 1000000; // 1 Mi
const WORK_FREQUENCY = 1000;  // ms
const LOG_FREQUENCY = 15000;  // ms
const PERIOD = 300;     // seconds
const INC = Number((100/300).toFixed(2));

var progress = 0;
function doWork() {
    if (progress < 100) {
        progress = Number((progress + INC).toFixed(2));
        progress = progress > 100 ? 100 : progress;
    }
}
var workInterval = setInterval(doWork, WORK_FREQUENCY);

var logInterval = setInterval(function () {
    console.log('%o %s %s %d', new Date(), 'PROGRESS', instanceId, progress);
}, LOG_FREQUENCY);

const server = net.createServer((c) => {
    console.log('%o %s %s client connected', new Date(), 'INFO', instanceId);

    c.on('end', () => {
        console.log('%o %s %s client disconnected', new Date(), 'INFO', instanceId);
    });

    c.on('data', (chunk) => {
        data = chunk.toString();
        if(data.trim() == 'stop') {
            console.log('%o %s %s Stopping the app ...', new Date(), 'INFO', instanceId);
            clearInterval(workInterval);
            clearInterval(logInterval);
            console.log('%o %s %s %d', new Date(), 'SAVING_PROGRESS', instanceId, progress)
            console.log('%o %s %s Successfully stopped the app and saved state.', new Date(), 'INFO', instanceId);
            c.write('ok');

        } else {
            c.write(`Unknown command: ${chunk}`)
        }
        
    });

    c.on('error', (err) => {
        console.log('%o %s %s Error: %s', new Date(), 'INFO', instanceId, err);
    });

});

server.on('error', (err) => {
    throw err;
});

server.listen(PORT, () => {
    console.log('%o %s %s TCP listener listening on port 8124', new Date(), 'INFO', instanceId);
});