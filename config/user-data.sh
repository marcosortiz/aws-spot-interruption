#!/bin/bash

# update packages
yum update -y

# Install git
yum install -y git

# installing ruby 2.4
amazon-linux-extras install -y ruby2.4

cd /home/ssm-user
runuser -l  ssm-user -c 'curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash'
runuser -l  ssm-user -c 'export NVM_DIR="/home/ssm-user/.nvm"'
runuser -l  ssm-user -c '. /home/ssm-user/.nvm/nvm.sh'
runuser -l  ssm-user -c 'source /home/ssm-user/.bashrc'
runuser -l  ssm-user -c 'nvm install v8.10.0'

# Installing awslogs agent
yum install -y awslogs
cat << EOL | sudo tee /etc/awslogs/awslogs.conf
[general]
# Path to the CloudWatch Logs agent's state file. The agent uses this file to maintain
# client side state across its executions.
state_file = /var/lib/awslogs/agent-state

[/home/ssm-user/watchdog.log]
datetime_format = %Y-%m-%dT%H:%M:%S.%f
file = /home/ssm-user/watchdog.log
buffer_duration = 5000
log_stream_name = {instance_id}
initial_position = start_of_file
log_group_name = spot-demo-watchdog

[/home/ssm-user/app.log]
datetime_format = %Y-%m-%dT%H:%M:%S.%f
file = /home/ssm-user/app.log
buffer_duration = 5000
log_stream_name = {instance_id}
initial_position = start_of_file
log_group_name = spot-demo-app
EOL
sudo systemctl start awslogsd

cd /home/ssm-user
cat << EOL | tee /home/ssm-user/watchdog.rb
# /usr/bin/ruby

require 'logger'
require 'net/http'
require 'socket'
require 'time'

LOG_FILE = '/home/ssm-user/watchdog.log'
STOP_MSG = 'stop'
PORT = 8124
@logger = Logger.new(LOG_FILE)
@logger.formatter = proc do |severity, datetime, progname, msg|
    "#{datetime.strftime('%Y-%m-%dT%H:%M:%S.%6N')} #{severity} #{msg}\n"
end

def send_stop_msg(ip, port)
    TCPSocket.open(ip, port) {|s|
        s.send "stop", 0
        resp = s.recv(2)
    }
end


while true do
    @logger.info('No termination notice detected.')
    now = Time.now
    resp =  Net::HTTP.get(URI('http://169.254.169.254/latest/meta-data/spot/termination-time'))
    t = Time.parse(resp) rescue nil

    if t.nil?
        sleep(5)
    else
        @logger.info "This instance will be terminated at #{t}."
        @logger.info "I have #{t-now} seconds to save my state and stop any activity."
        break
    end
end

send_stop_msg('localhost', PORT)
@logger.info "Done saving state. Stopping now. Bye."
EOL
chown ssm-user watchdog.rb 
chgrp ssm-user watchdog.rb 

runuser -l  ssm-user -c 'cd /home/ssm-user'
runuser -l  ssm-user -c 'nohup ruby ./watchdog.rb > /dev/null 2>&1 &'

cat << EOL | tee /home/ssm-user/app.js
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
EOL
chown ssm-user app.js
chgrp ssm-user app.js
runuser -l  ssm-user -c 'cd /home/ssm-user'
runuser -l  ssm-user -c 'nohup node ./app.js > ./app.log 2>&1 &'