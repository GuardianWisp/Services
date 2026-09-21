// PM2 process config for running the site on the Beget VPS.
// Usage on the server: pm2 start ecosystem.config.js
//
// Requires the standalone build to exist first — see scripts/deploy.sh,
// which builds and assembles .next/standalone before this ever runs.
module.exports = {
  apps: [
    {
      name: "tetsub",
      script: ".next/standalone/server.js",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
      instances: 1,
      autorestart: true,
      max_restarts: 10,
    },
  ],
};
