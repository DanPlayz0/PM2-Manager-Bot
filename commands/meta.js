const Command = require('@structures/framework/Command');

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      enabled: true,
      description: 'Metadata of a specific process.',
      options: [
        {
          type: 3,
          name: 'process',
          description: 'The pm2 process id to get metadata. (Must use autocomplete)',
          autocomplete: true,
          required: true,
        }
      ],
      category: "General",
    })
  }

  async run(ctx) {
    const process = ctx.args.getString('process');
    if (!process || !/^\d+$/.test(process)) return ctx.sendMsg("Please select a process to restart.");

    // Permission Check
    let processes = await ctx.client.pm2.list(), processData = processes.find(x=>x.pm_id == process);
    if (!processData) return ctx.sendMsg("Invalid process id.");

    const access = ctx.client.config.access.filter((ac)=> ac.users.some(x=>x == ctx.author.id));
    if(!access.find(x=>x.name == 'admin')) {
      processes = processes.filter(proc=>access.some(({prefix}) => proc.name.startsWith(prefix)))
      if(processes.every(x=>x.pm_id != process)) return ctx.sendMsg("You have no permission to interact with that process.");
    }

    ctx.sendMsg("```asciidoc\n" + [
      `=== ${processData.name} ===`,
      `ID:: ${processData.pm_id}`,
      `Name:: ${processData.name}`,
      `Status:: ${processData.pm2_env.status}`,
      `Restart Count:: ${processData.pm2_env.restart_time}`,
      `Uptime:: ${processData.pm2_env.status != 'online' ? '0' : ctx.client.duration(Date.now() - processData.pm2_env.pm_uptime, { rounded: true })}`,
      `Memory:: ${processData.monit.memory / 1024 / 1000} MB`
    ].join('\n') + "```");
  }

  // The function below handles autocomplete options
  async runAutocomplete(ctx) {
    const focused = ctx.args.getFocused(true);

    // Permission Check
    let processes = await ctx.client.pm2.list();
    const access = ctx.client.config.access.filter((ac)=> ac.users.some(x=>x == ctx.author.id));
    if(!access.find(x=>x.name == 'admin')) {
      processes = processes.filter(proc=>access.some(({prefix}) => proc.name.startsWith(prefix)))
    }
    if(focused.value) processes = processes.filter(x=>x.name.toLowerCase().includes(focused.value.toLowerCase()))

    return processes.map((x) => ({name: `${x.pm_id} - ${x.name}`, value: String(x.pm_id) }))
  }
}