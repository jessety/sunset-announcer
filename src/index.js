'use strict';

const SunsetAnnouncer = require('./SunsetAnnouncer');

// Load settings from a .env file, process env, or use specified defaults.
// Infer intended type (string, boolean, number) from default value and parse env to that type
const settings = require('./settings')({
  SUNRISES: true,
  SUNSETS: true,
  ADVANCE: 5,
  INTERVAL: 60,
  SPEECH: true,
  NOTIFICATIONS: true,
  VERBOSE: true
});

const announcer = new SunsetAnnouncer(settings);

announcer.start();
