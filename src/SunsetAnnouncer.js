'use strict';

const suncalc = require('suncalc2');
const locationMacOS = require('macos-location');
const say = require('say');
const notifier = require('node-notifier');

class SunsetAnnouncer {

  constructor(settings) {

    if (settings === undefined) {
      settings = {};
    }

    // How far in advance to mention the sunrise / sunset?
    if (settings.advance === undefined) {
      settings.advance = 5; // 5 minutes
    }

    // How often should we attempt to update location (and recalculate sunset time)
    if (settings.interval === undefined) {
      settings.interval = 60; // every hour
    }

    // Do we want notifications for sunsets?
    if (settings.sunsets === undefined) {
      settings.sunsets = true;
    }

    // Do we want notifications for sunrises?
    if (settings.sunrises === undefined) {
      settings.sunrises = true;
    }

    // Do we want OS notifications?
    if (settings.notifications === undefined) {
      settings.notifications = true;
    }

    // Do we want spoken notifications?
    if (settings.speech === undefined) {
      settings.speech = true;
    }

    // Whether or not to use the console
    if (settings.verbose === undefined) {
      settings.verbose = true;
    }

    this.settings = settings;

    this.timers = [];
  }

  /**
   * Log messages to the console, if the `verbose` setting is enabled
   * @param {string} ...messages 
   */
  log(...messages) {

    if (this.settings.verbose) {

      console.log(...messages);
    }
  }

  /**
   * Start announcing sunsets
   */
  async start() {

    this.log(`Starting..`);

    this.updateInterval = setInterval(() => {

      this.log(`Update interval triggered`);

      this.load();

    }, this.settings.interval * 60 * 1000);

    this.load();
  }

  /**
   * Stop announcing sunsets
   */
  stop() {

    this.log(`Stopping..`);

    clearInterval(this.updateInterval);

    for (const timer of this.timers) {

      clearTimeout(timer);
    }
  }

  /**
   * Pull the user's current location, calculate the sunrise / sunset times, and set timers
   */
  async load() {

    try {

      this.log(`Loading..`);

      const { latitude, longitude } = await this.locate();

      const { sunrise, sunset } = this.calculate(latitude, longitude);

      this.setTimers(sunrise, sunset);

      this.log(`Done! Notifications for ${latitude},${longitude}: \n  Sunrise: ${sunrise} \n  Sunset: ${sunset}`);

    } catch (e) {

      console.error(`Could not load:`, e);
    }
  }

  /**
   * Find the current user's location
   * @returns {Promise<object>} - Resolves with an object containing latitude and longitude properties
   */
  locate() {

    return new Promise((resolve, reject) => {

      // To do: other platforms?
      locationMacOS.getCurrentPosition(position => {

        resolve(position.coords);

      }, reject);
    });
  }

  /**
   * Calculates the sunrise and sunset times for the current location
   * @param   {number} latitude  
   * @param   {number} longitude 
   * @returns {{latitude:Number, longitude:Number}}
   */
  calculate(latitude, longitude) {

    const now = new Date();

    const { sunrise, sunset } = suncalc.getTimes(now, latitude, longitude);

    return { sunrise, sunset };
  }

  /**
   * Set timers that will notify the user when the sun is rising / setting
   * @param {Date} sunrise
   * @param {Date} sunset
   */
  setTimers(sunrise, sunset) {

    for (const timer of this.timers) {

      clearTimeout(timer);
    }

    this.timers = [];

    const sunriseTimer = this.createTimer(sunrise, `sunrise`);

    if (sunriseTimer) {
      this.timers.push(sunriseTimer);
    }

    const sunsetTimer = this.createTimer(sunset, `sunset`);

    if (sunsetTimer) {
      this.timers.push(sunsetTimer);
    }
  }

  /**
   * Create a timer for an event in the future 
   * @param   {Date}     time - When the event occurs
   * @param   {string}   type - Either `sunrise` or `sunset`
   */
  createTimer(time, type) {

    const now = new Date();

    let msUntil = time.getTime() - now.getTime();

    if (this.settings.advance > 0) {
      msUntil -= this.settings.advance * 60 * 1000; // This setting is specified in minutes
    }

    if (msUntil < 0) {
      return; 
    }

    if (this.settings[type] === false) {
      return;
    }

    return setTimeout(() => {

      this.notify(type);

    }, msUntil);
  }

  /**
   * Notify the user about an event that is currently occurring
   * @param {string} type - Either `sunrise` or `sunset`
   */
  notify(type) {

    this.log(`Sending a notification for the ${type} that's going on right now`);

    const notification = {
      title: `Look`,
      message: `It's time`,
      icon: ``
    };

    if (type === 'sunset') {

      notification.message = `The sun is setting`;

    } else if (type === 'sunset') {

      notification.message = `The sun is rising`;
    }

    if (this.settings.notifications !== false) {
      notifier.notify(notification);
    }

    if (this.settings.speech !== false) {
      say.speak(notification.message);
    }
  }
}

module.exports = SunsetAnnouncer;
