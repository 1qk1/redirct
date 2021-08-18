#! /bin/bash
#
# This file should populate the ceryx server with our front-end

set -e

echo "Register the API to Ceryx"
curl -H "Content-Type: application/json" \
     -X POST \
     -d '{"source":"localhost:3000","target":"http://web:3000"}' \
     http://api:5555/api/routes/

exec "$@"
