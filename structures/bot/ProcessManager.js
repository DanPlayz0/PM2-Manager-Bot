const pm2 = require('pm2');
const { execSync } = require('child_process');
const { readFileSync } = require('fs');

module.exports = class ProcessManager {
  constructor(client) {
    this.client = client;
    this.connected = false;
  }

  init() {
    pm2.connect((err) => {
      if (err) {
        console.error(err);
        this.connected = false;
        return;
      }
      this.connected = true;
    });
  }

  list() {
    if(!this.connected) throw Error("PM2 Daemon not connected!");
    return new Promise((resolve,reject) => {
      pm2.list((err,list) => {
        if(err) {
          reject(err);
          return;
        }
        resolve(list);
      })
    }) 
  }
  
  restart(pm_id) {
    if(!this.connected) throw Error("PM2 Daemon not connected!");
    return new Promise((resolve,reject) => {
      pm2.restart(pm_id, (err,proc) => {
        if(err) {
          reject(err);
          return;
        }
        resolve(proc);
      })
    }) 
  }

  async logs(pm_id) {
    const logs = await execSync(`pm2 logs ${pm_id} --lines 1 --nostream`).toString();
    const logPaths = logs.split('\n').filter(x=>x.includes('.log last 1 lines:')).map((x)=>x.replace(' last 1 lines:', ''));

    let error = await readFileSync(logPaths.find(x=>x.includes('-error.log')), { encoding: 'utf-8' });
    error = error.split('\n');

    let out = await readFileSync(logPaths.find(x=>x.includes('-out.log')), { encoding: 'utf-8' });
    out = out.split('\n');

    return { error, out };
  }
}