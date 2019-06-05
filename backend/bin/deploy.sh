# #!/bin/bash

# Load config
mydir="${0%/*}"
REGION=$(cat "$mydir"/../../config/config.json | jq -r '.region')
S3_BUCKET=$(cat "$mydir"/../../config/config.json | jq -r '.samS3BucketName')
CFN_STACK_NAME_PREFIX=$(cat "$mydir"/../../config/config.json | jq -r '.cloudformationStackNamePrefix')

# # Execute sam commands to deploy the package
aws s3 mb s3://$S3_BUCKET
sam build
sam package --template-file template.yaml --output-template-file packaged.yaml --s3-bucket $S3_BUCKET --region $REGION
sam deploy --template-file packaged.yaml --stack-name $CFN_STACK_NAME_PREFIX --capabilities CAPABILITY_NAMED_IAM --region $REGION