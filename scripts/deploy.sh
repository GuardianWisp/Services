#!/usr/bin/env bash
# Run this ON THE BEGET SERVER, from /var/www/tetsab, to pull and
# (re)deploy the site. Mirrors the same pattern already used for
# burenie124.ru on this box.
set -e
cd /var/www/tetsab
git pull --ff-only
npm ci --silent
npm run build
pm2 restart tetsab --update-env
echo "Deployed: $(git rev-parse --short HEAD)"
