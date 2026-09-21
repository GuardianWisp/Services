#!/usr/bin/env bash
# Run this ON THE BEGET SERVER, from the project root, to build and
# (re)start the site after pulling new commits.
#
#   ssh you@your-server
#   cd /path/to/tetsub
#   git pull
#   ./scripts/deploy.sh
set -euo pipefail

npm ci
npm run build

# `output: "standalone"` only emits the server + the node_modules it
# actually needs — static assets and /public are not copied in
# automatically, so that's done here on every build.
cp -r .next/static .next/standalone/.next/static
if [ -d public ]; then
  cp -r public .next/standalone/public
fi

pm2 startOrRestart ecosystem.config.js
pm2 save
