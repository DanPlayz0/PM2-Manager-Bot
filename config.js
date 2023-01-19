const private = require('./config-private.js');
module.exports = {
  // Bot Token
  token: private.token,

  // Bot Administators (Access to Admin Dash & System Commands)
  admins: ['209796601357533184', '229285505693515776'],
  
  // Database Crap (MongoDB & Redis)
  mongo_uri: private.mongo_uri,
  
  // Restful API
  restapi: {
    port: private.restapi?.port ?? 3000, 
  },
  
  // Bot Logging (Webhooks)
  webhooks: [
    { name: "shard", id: private.webhooks?.shard?.id, token: private.webhooks?.shard?.token },
    { name: "error", id: private.webhooks?.error?.id, token: private.webhooks?.error?.token },
    { name: "command", id: private.webhooks?.command?.id, token: private.webhooks?.command?.token },
    { name: "guilds", id: private.webhooks?.guilds?.id, token: private.webhooks?.guilds?.token },
  ],

  access: [
    {
      name: "admin",
      prefix: "*",
      users: ["209796601357533184", "813875382972973088"],
    },
    {
      name: "poke",
      prefix: "[Poke]",
      users: ["237159644013789185", "974311756463738960"],
    },
    {
      name: "Casey",
      prefix: "[Casey]",
      users: ["813875382972973088"],
    },
    {
      name: "Pancake",
      prefix: "[Pancake]",
      users: ["606279329844035594"],
    },
  ]

}