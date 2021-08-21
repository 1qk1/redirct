#! /bin/bash
#
# This file should populate the ceryx server with our front-end

set -e

echo "Register the API to Ceryx"
curl -H "Content-Type: application/json" \
     -X POST \
     -d '{"source":"${CERYX_API_HOSTNAME}","target":"${REDIRCT_HOST}:3000"}' \
     http://${CERYX_API_HOSTNAME}:5555/api/routes/

exec "$@"
