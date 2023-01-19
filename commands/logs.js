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
        },
        {
          type: 4,
          name: 'lines',
          description: 'The amount of lines to show. (Default: 15)',
          required: false,
          min_value: 5,
          max_value: 200,
        },
        {
          type: 3,
          name: 'type',
          description: 'What logs to show?',
          required: false,
          choices: [
            {name: "Both (Default)", value: "both" },
            {name: "Error", value: "error" },
            {name: "Output", value: "out" },
          ]
        },
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

    const { error, out } = await ctx.client.pm2.logs(process);
    const lines = ctx.args.getInteger('lines') ?? 15;
    const type = ctx.args.getString('type') ?? "both";

    let contentOut =  "```ini\n", messageOut = "";
    if (type == 'out') {
      messageOut += `[ Output ]\n${out.slice(lines*-1).join('\n')}`.slice(0,1500);
    } else if (type == 'error') {
      messageOut += `[ Error ]\n${error.slice(lines*-1).join('\n')}`.slice(0,1500);
    } else {
      messageOut += `[ Error ]\n${error.slice(lines*-1).join('\n')}`.slice(0,490) + `\n[ Output ]\n${out.slice(lines*-1).join('\n')}`.slice(0,490);
    }
    contentOut += messageOut
      .replace(/`/g, `\`${String.fromCharCode(8203)}`)
      .replace(/@/g, `@${String.fromCharCode(8203)}`);
    contentOut += "```";

    ctx.sendMsg(contentOut);
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
