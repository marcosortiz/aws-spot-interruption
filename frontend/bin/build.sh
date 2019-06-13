# #!/bin/bash

# Load config
mydir="${0%/*}"
export BACKEND_REGION=${REGION:-$(cat "$mydir"/../../config/config.json | jq -r '.region')}
export CFN_STACK_NAME=${STACK_NAME:-$(cat "$mydir"/../../config/config.json | jq -r '.cloudformationStackName')}
node "$mydir"/setup.js
npm install
npm install -g aws-sdk
yarn build
