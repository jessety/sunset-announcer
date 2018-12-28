'use strict';

const dotenv = require('dotenv');

/**
 * Load settings from a .env file, process env, or use specified defaults.
 * Infer intended type (string, boolean, number) from default value and parse env to that type
 * @param   {object} defaults - Dictionary of default values for all expected values
 * @returns {object} env - All env values including the specified defaults.
 */
function load(defaults) {

  const env = dotenv.config();

  if (env.error) {
    //console.warn(`Could not load .env file: ${env.error.message}`);
  }

  const parsed = env.parsed || process.env;
  const settings = {};

  for (const [key, value] of Object.entries(parsed)) {
    settings[key] = value;
  }

  if (defaults !== undefined) {

    for (const [key, value] of Object.entries(defaults)) {

      const type = typeof value;

      if (!settings.hasOwnProperty(key)) {

        settings[key] = value;
        continue;
      }

      switch(type) {

      case 'boolean':
        settings[key] = (settings[key].toLowerCase() === 'true');
        break;

      case 'number':
        settings[key] = Number(settings[key]);
        break;

      default:
        // All existing values are strings, so no need to tamper with it
      }
    }
  }

  return settings;
}

module.exports = load;
