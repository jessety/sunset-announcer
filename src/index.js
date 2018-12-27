'use strict';

const SunsetAnnouncer = require('./SunsetAnnouncer');
const settings = require('./settings');

const announcer = new SunsetAnnouncer(settings);

announcer.start();
