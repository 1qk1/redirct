#! /bin/bash
#
# This file should populate the ceryx server with our front-end

set -ex

echo "Register the API to Ceryx"
sleep 5
curl -H "Content-Type: application/json" \
     -X POST \
     -d '{"source":"'${REDIRCT_DOMAIN:-test.com}'","target":"'${REDIRCT_INTERNAL_HOST:-web}':3000"}' \
     http://${CERYX_API_HOSTNAME:-api}:5555/api/routes/

exec "$@"
