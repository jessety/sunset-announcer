'use strict';

const fs = require('fs');

const path = '/etc/sunsetannouncer.json';
let settings = {};

try {
  const data = fs.readFileSync(path);
  settings = JSON.parse(data);
} catch (e) {
  console.warn(`Could not read settings file at path "${path}". This is probably fine, so long as you don't mind using the default settings.`);
}

module.exports = settings;
