![Logo of OSM](./logo.png)

# Old School Maple's Market Discord Bot &middot; [![npm](https://img.shields.io/npm/v/npm.svg?style=flat-square)](https://www.npmjs.com/package/npm) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE)
> This project was originally created as part of Old School Maple (OSM), an Old School MapleStory private server which aimed to provide the most authentic and nostalgic GMS circa 2005-2007 MapleStory experience.

A discord bot which attempted to keep OSM's free market listed items in sync with its Discord's `#listings` channel. This bot will also clear out and limit players to only post once every 48 hours to OSM's Discord's `#buying` channel.

## How It Works

This Discord bot originally worked by having OSM's server directly post listed items to a `#listings` channel on Discord. Whenever an item sold, it would set a Redis key to notify the bot to delete the post.

## Features

* Delete posts from a Discord channel based on a Redis key being set.
* Limit posts to a channel to one per user and delete any posts older than a certain time limit.
* Fetch all messages from a channel.

## Notes

This project contains a lot of extra and unnecessary code as it was cloned from the [Old School Maple's (OSM) Discord Bot](https://github.com/nikitabuyevich/osm-discord-bot) repository.

This solution is suboptimal as setting a Redis key based on the message ID of a Discord post is a lot easier than trying to parse message headers.

## Known Issues

This bot does not do a great job at syncing up properly with the Free Market's listed items. There are random times when all new posts start getting deleted.

## Getting Started

To launch the Discord bot:

```bash
git clone https://github.com/nikitabuyevich/osm-market-discord-bot
cd osm-market-discord-bot/
npm install
npm start
```

### Prerequisites

* [Node - at least v11.x](https://nodejs.org/en/) - A JavaScript runtime environment that executes JavaScript code outside of a browser.
* [Redis - at least v3.x](https://redis.io/) - A distributed, in-memory key-value database.

### Configuration

Make sure to update all the variables inside the `settings/config.js` file which start with `CHANGE_THIS_TO_*` to their appropriate values.

### Coding Style

This project utilizes [ESLint](https://eslint.org/) to uphold coding standards. You can view the configured ESLint settings inside the [.eslintrc.json](.eslintrc.json) file.

## Deployment

The easiest way to deploy and host this bot would be to:

* Install [Node](https://nodejs.org/en/) on a server.
* Run `npm install pm2 -g` to install [pm2](https://pm2.keymetrics.io/).
* Clone this repo and `cd` into its directory.
* Run `pm2 start bot.js --watch` - This will launch the bot and have it run in the background. Any new code changes will restart the instance.
* Run `pm2 save` - Will save the current settings of `pm2`.
* Run `pm2 startup` - Will run `pm2` on system startup.

## Built With

* [Babel](https://babeljs.io/) - Convert ECMAScript 2015+ code into a backwards compatible version of JavaScript that can be run by older JavaScript engines.

## Authors

* **Nikita Buyevich** _(Roar / asdf)_ - [nikitabuyevich](https://github.com/nikitabuyevich)

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
