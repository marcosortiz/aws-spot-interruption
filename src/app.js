const net = require('net');

const PORT = 8124
const COUNTER = 1000000; // 1 Mi
var i = 0;
function doWork() {
    i ++
}
var workInterval = setInterval(doWork, 1);
var logInterval = setInterval(function () {
    console.log('%o %s i = %d', new Date(), 'INFO', i);
}, 1000);

const server = net.createServer((c) => {
    console.log('%o %s client connected', new Date(), 'INFO');

    c.on('end', () => {
        console.log('%o %s client disconnected', new Date(), 'INFO');
    });

    // The server can also receive data from the client by reading from its socket.
    c.on('data', (chunk) => {
        data = chunk.toString();
        if(data.trim() == 'stop') {
            console.log('%o %s Stopping the app ...', new Date(), 'INFO');
            clearInterval(workInterval);
            clearInterval(logInterval);
            console.log('%o %s Saving state: i = %d', new Date(), 'INFO', i)
            console.log('%o $s Successfully stopped the app and saved state.', new Date(), 'INFO');
            c.write('ok');

        } else {
            c.write(`Unknown command: ${chunk}`);
        }
        
    });

    c.on('error', (err) => {
        console.log('%o %s Error: %s', new Date(), 'INFO', err);
    });

});

server.on('error', (err) => {
    throw err;
});

server.listen(PORT, () => {
    console.log('%o %s TCP listener listening on port 8124', new Date(), 'INFO');
});