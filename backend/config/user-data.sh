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

# cloning the repo
runuser -l  ssm-user -c "git clone https://github.com/marcosortiz/aws-spot-interruption.git"
cd /home/ssm-user
runuser -l  ssm-user -c 'cp /home/ssm-user/aws-spot-interruption/backend/package* /home/ssm-user'
runuser -l  ssm-user -c "npm install"

# Installing awslogs agent
yum install -y awslogs
cd /home/ssm-user
cat /home/ssm-user/aws-spot-interruption/backend/config/awslogs.conf | sudo tee /etc/awslogs/awslogs.conf
sudo systemctl start awslogsd

# install and run the watchdog
cd /home/ssm-user
runuser -l  ssm-user -c 'cp /home/ssm-user/aws-spot-interruption/backend/src/ec2/watchdog.rb /home/ssm-user'
runuser -l  ssm-user -c 'nohup ruby ./watchdog.rb > /dev/null 2>&1 &'

# install and run the app
cd /home/ssm-user
runuser -l  ssm-user -c 'cp /home/ssm-user/aws-spot-interruption/backend/src/ec2/app.js /home/ssm-user'
runuser -l  ssm-user -c 'nohup node ./app.js > ./app.log 2>&1 &'