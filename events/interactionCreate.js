const Event = require('@structures/framework/Event');
const Context = require('@structures/framework/ContextInteraction');
module.exports = class extends Event {
  constructor(client) {
    super(client, {
      enabled: true,
    });
  }

  async run(client, interaction) {
    if(interaction.type == 4) this.autoComplete(client, interaction);
    if(interaction.type == 2) this.slashCommand(client, interaction);
  }

  async autoComplete(client, interaction) {
    const cmd = client.commands.get(interaction.commandName);
    if(!cmd) return interaction.respond([]);

    const ctx = new Context({client, interaction, commandType: 'interaction'});
    return cmd._entrypoint(ctx, 'autocomplete');
  }

  async slashCommand(client, interaction) {
    const ctx = new Context({client, interaction, commandType: 'interaction'});

    const command = client.commands.get(interaction.commandName);
    if(!command) return;
    client.webhooks.command.send({content: `${ctx.author.tag} \`${ctx.author.id}\` used **${interaction.commandName}** in ${interaction.guild.name} \`${interaction.guild.id}\` ||/${interaction.commandName}${interaction.options._group?` ${interaction.options._group}`:''}${interaction.options._subcommand?` ${interaction.options._subcommand}`:''} ${interaction.options._hoistedOptions.map(m => `${m.name}:${m.value}`).join(' ')}`.slice(0,1995)+'||', allowedMentions: { parse: [] } })
    return command._entrypoint(ctx, 'slash');
  }
}
