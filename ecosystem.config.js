'use strict';

// http://pm2.keymetrics.io/docs/usage/application-declaration/

module.exports = {
  apps: [{
    name: 'sunset-announcer',
    cwd: './',
    script: 'src/index.js'
  }]
};
