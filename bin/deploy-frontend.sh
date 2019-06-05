# #!/bin/bash

mydir="${0%/*}"

echo ----- Deploying Frontend ---
cd "$mydir"/../frontend && ./bin/deploy.sh
cd ..