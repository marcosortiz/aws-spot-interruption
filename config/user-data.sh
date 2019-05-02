#!/bin/bash

# update packages
sudo yum update -y

# Install git
sudo yum install -y git

# installing ruby 2.4
sudo amazon-linux-extras install -y ruby2.4

# install nodejs 8.10
cd
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install v8.10.0

# Installing awslogs agent
sudo yum install -y awslogs
cat << EOL | sudo tee /etc/awslogs/awslogs.conf
[general]
# Path to the CloudWatch Logs agent's state file. The agent uses this file to maintain
# client side state across its executions.
state_file = /var/lib/awslogs/agent-state

[/home/ssm-user/spot-demo.log]
datetime_format = %Y-%m-%dT%H:%M:%S.%f
file = /home/ssm-user/spot-demo.log
buffer_duration = 5000
log_stream_name = {instance_id}
initial_position = start_of_file
log_group_name = spot-demo
EOL
sudo systemctl start awslogsd


cd
cat << EOL | tee ./test.rb
# /usr/bin/ruby

require 'logger'
require 'net/http'
require 'time'

LOG_FILE = '/home/ssm-user/spot-demo.log'
@logger = Logger.new(LOG_FILE)
@logger.formatter = proc do |severity, datetime, progname, msg|
    "#{datetime.strftime('%Y-%m-%dT%H:%M:%S.%6N')} #{severity} #{msg}\n"
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

@logger.info "Done saving state. Stopping now. Bye."
EOL
nohup ruby ./test.rb &
