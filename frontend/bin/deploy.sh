# #!/bin/bash

mydir="${0%/*}"
node "$mydir"/setup.js

S3_BUCKET=$(cat "$mydir"/../../config/config.json | jq -r '.s3BucketName')
aws s3 sync "$mydir"/../build/ s3://"$S3_BUCKET"