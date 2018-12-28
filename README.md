# sunset-announcer

 A small program for macOS that verbally announces the sunset and sunrise using the default system voice.

 ### Setup

To run the service, simply execute `npm install`, then `npm start`.

An ecosystem file for pm2 is included as well. To start sunset-announcer as a pm2 service, execute `pm2 start ecosystem.config.js`.

### Configuration

By default, `sunset-announcer` will verbally notify the user `5` minutes before a sunrise or sunset. To change this, add a `.env` file with any of the following options

`SUNRISES`

Boolean. Whether to notify for sunrises. Default: `true`

`SUNSETS`

Boolean. Whether to notify for sunrises. Default: `true`

`SPEECH`

Boolean. Whether to notify the user using voice synthesis. Default: `true`

`NOTIFICATIONS`

Boolean. Whether to notify the user using system notifications. Default: `true`

`ADVANCE`

Number. How many minutes before sundown/up to notify the user. Default: `5`
