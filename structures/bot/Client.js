const Discord = require('discord.js');
const fs = require('fs');

module.exports = class BotClient extends Discord.Client {
  constructor(options) {
    super(options);

    // Configuration
    this.config = require('@root/config');

    // Collections
    for (const name of ["commands", "events", "cooldowns"]) this[name] = new Discord.Collection();

    // Packages
    this.discord = Discord;
    this.fs = fs;
    this.moment = require('moment'); require("moment-timezone"); require("moment-duration-format");
    this.duration = require("humanize-duration");

    // Miscelaneous
    this.framework = {
      messageContext: require("@structures/framework/ContextMessage"),
      messageArguments: require("@structures/framework/MessageArguments"),
      interactionContext: require("@structures/framework/ContextInteraction"),
    }
    this.database = new (require('./DatabaseManager.js'))(this);
    this.webhooks = new (require('@structures/webhooks/WebhookManager.js'))(this);
    this.loader = new (require('./Loader.js'))(this);
    this.pm2 = new (require('./ProcessManager'))(this);

    this.pm2.init();
    this.database.init();
    this.loader.start();
  }
}