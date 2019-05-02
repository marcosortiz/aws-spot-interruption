
const net = require('net');
const PORT = 8124


const COUNTER = 1000000; // 1 Mi
var i = 0;
function doWork() {
    i ++
}
var workInterval = setInterval(doWork, 1);
var logInterval = setInterval(function () {
    console.log(`i = ${i}`);
}, 1000);

const server = net.createServer((c) => {
    console.log('client connected');

    c.on('end', () => {
        console.log('client disconnected');
    });

    // The server can also receive data from the client by reading from its socket.
    c.on('data', (chunk) => {
        data = chunk.toString();
        if(data.trim() == 'stop') {
            console.log('Stopping the app ...');
            clearInterval(workInterval);
            clearInterval(logInterval);
            console.log(`Saving state: i = ${i}`)
            console.log('Successfully stopped the app and saved state.');
            c.write('ok');

        } else {
            c.write(`Unknown command: ${chunk}`);
        }
        
    });

    c.on('error', (err) => {
        console.log(`Error: ${err}`);
    });

});

server.on('error', (err) => {
    throw err;
});

server.listen(PORT, () => {
    console.log('TCP listener listening on port 8124');
});