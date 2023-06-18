
// imports
const figlet = require("figlet")
const request = require("request")
const https = require('https');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync,exec } = require('child_process');
const readline = require('readline');

// --------------

const colors = {
    reset: '\x1b[0m',
    purple: '\x1b[35m',
    white: '\x1b[37m',
    black: '\x1b[30m',
    red: '\x1b[91m',
    lightGreen: '\x1b[92m',
    lightYellow: '\x1b[93m',
    lightMagenta: '\x1b[95m',
    lightCyan: '\x1b[96m',
    lightRed: '\x1b[91m',
    lightBlue: '\x1b[94m'
};

let google_target_ver = 0
let edge_target_ver = 0

var counttokens = fs.readFileSync('js/tokens.txt', 'utf-8').split("\n").length
execSync("title PRESS ENTER")

const yeslist = [
    "yes","y", "yer", "yeah","yessir","ye","okay","yep","yea","ok","k","yh","sure"
]

function sleep(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

class ChromeInstaller {
    constructor(executablePath = null, targetVersion = null) {
      this.installed = false;
      this.targetVersion = targetVersion;
      this.DL_BASE = 'https://chromedriver.storage.googleapis.com/';
  
      this.platform = os.platform();
  
      if (targetVersion) {
        this.targetVersion = targetVersion;
      }
  
      if (!this.targetVersion) {
        this.targetVersion = this.getReleaseVersionNumber().version[0];
      }
  
      this._base = 'chromedriver{}';
  
      let exeName = this._base;
      if (this.platform === 'win32') {
        exeName = this._base.format('.exe');
      }
      if (this.platform === 'linux') {
        this.platform += '64';
        exeName = this._base.format('');
      }
      if (this.platform === 'darwin') {
        this.platform = 'mac64';
        exeName = this._base.format('');
      }
      this.executablePath = executablePath || exeName;
      this._exeName = exeName;
  
      if (!fs.existsSync(this.executablePath)) {
        this.fetchChromeDriver();
        if (!this.constructor.installed) {
          if (this.patchBinary()) {
            this.constructor.installed = true;
          }
        }
      }
    }
  
    static randomCDC() {
      const cdc = Array.from({ length: 26 }, () =>
        Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 1)
      );
      cdc.splice(-6, 2, cdc[0].toUpperCase(), cdc[1].toUpperCase());
      cdc[2] = cdc[0];
      cdc[3] = '_';
      return cdc.join('').encode();
    }
  
    patchBinary() {
      let lineCount = 0;
      const replacement = this.constructor.randomCDC();
      const fh = fs.openSync(this.executablePath, 'r+');
      let line;
      while ((line = fs.readlineSync(fh)) !== null) {
        if (line.includes('cdc_')) {
          fs.seekSync(fh, -line.length, 1);
          const newLine = line.toString().replace(/cdc_.{22}/, replacement);
          fs.writeSync(fh, newLine);
          lineCount += 1;
        }
      }
      fs.closeSync(fh);
      return lineCount;
    }
  
    getReleaseVersionNumber() {
      const url = `https://chromedriver.storage.googleapis.com/${
        !this.targetVersion ? 'LATEST_RELEASE' : `LATEST_RELEASE_${this.targetVersion}`
      }`;
      const response = http.getSync(url);
      const versionNumber = response.body.toString();
      return new LooseVersion(versionNumber);
    }
  
    fetchChromeDriver() {
      const base = this._base;
      const zipName = base.format('.zip');
      const ver = this.getReleaseVersionNumber().vstring;
      if (fs.existsSync(this.executablePath)) {
        return this.executablePath;
      }
      const downloadUrl = `${this.DL_BASE}${ver}/${base.format(`_${this.platform}`)}.zip`;
      const zipPath = path.join(os.tmpdir(), zipName);
      const file = fs.createWriteStream(zipPath);
      const protocol = downloadUrl.startsWith('https') ? https : http;
      protocol.get(downloadUrl, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          const unzipPath = path.join(os.tmpdir(), this._exeName);
          const unzipCommand = `unzip -o ${zipPath} -d ${unzipPath}`;
          execSync(unzipCommand);
          fs.unlinkSync(zipPath);
          if (this.platform !== 'win32') {
            fs.chmodSync(unzipPath, 0o755);
          }
          fs.renameSync(unzipPath, this._exeName);
        });
      });
      return this._exeName;
    }
}

class EdgeInstaller {
  constructor(executablePath = null, targetVersion = null) {
    this.installed = false;
    this.targetVersion = targetVersion;
    this.DL_BASE = 'https://msedgedriver.azureedge.net/';

    this.platform = os.platform();

    if (targetVersion) {
      this.targetVersion = targetVersion;
    }

    if (!this.targetVersion) {
      this.targetVersion = this.getReleaseVersionNumber().version[0];
    }

    this._base = 'edgedriver{}';

    let exeName = this._base;
    if (this.platform === 'win32') {
      exeName = this._base.format('.exe');
    }
    if (this.platform === 'linux') {
      this.platform += '64';
      exeName = this._base.format('');
    }
    if (this.platform === 'darwin') {
      this.platform = 'mac64';
      exeName = this._base.format('');
    }
    this.executablePath = executablePath || exeName;
    this._exeName = exeName;

    if (!fs.existsSync(this.executablePath)) {
      this.fetchEdgeDriver();
      if (!this.constructor.installed) {
        if (this.patchBinary()) {
          this.constructor.installed = true;
        }
      }
    }
  }

  static randomCDC() {
    const cdc = Array.from({ length: 26 }, () =>
      Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 1)
    );
    cdc.splice(-6, 2, cdc[0].toUpperCase(), cdc[1].toUpperCase());
    cdc[2] = cdc[0];
    cdc[3] = '_';
    return cdc.join('').encode();
  }

  patchBinary() {
    let lineCount = 0;
    const replacement = this.constructor.randomCDC();
    const fh = fs.openSync(`ms${this.executablePath}`, 'r+');
    let line;
    while ((line = fs.readlineSync(fh)) !== null) {
      if (line.includes('cdc_')) {
        fs.seekSync(fh, -line.length, 1);
        const newLine = line.toString().replace(/cdc_.{22}/, replacement);
        fs.writeSync(fh, newLine);
        lineCount += 1;
      }
    }
    fs.closeSync(fh);
    return lineCount;
  }

  getReleaseVersionNumber() {
    const url = `${
      !this.targetVersion ? 'LATEST_STABLE' : `LATEST_RELEASE_${this.targetVersion.split('.', 1)[0]}`
    }`;
    const downloadUrl = `${this.DL_BASE}${url}`;
    const zipPath = path.join(os.tmpdir(), url);
    const protocol = downloadUrl.startsWith('https') ? https : http;

    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(zipPath);
      const request = protocol.get(downloadUrl, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            const fileContent = fs.readFileSync(zipPath, 'utf-8');
            const versionNumber = fileContent.trim().match(/[\d.]+/)[0];
            fs.unlinkSync(zipPath);
            resolve(versionNumber);
          });
        } else {
          reject(new Error(`Failed to retrieve release version number. Status code: ${response.statusCode}`));
        }
      });
      request.on('error', (error) => {
        reject(error);
      });
    });
  }

  fetchEdgeDriver() {
    const base = this._base;
    const zipName = base.format('.zip');
    const version = this.getReleaseVersionNumber();
    const downloadUrl = `${this.DL_BASE}${version}/${base.format(`_${this.platform}`)}.zip`;
    const zipPath = path.join(os.tmpdir(), zipName);
    const protocol = downloadUrl.startsWith('https') ? https : http;

    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(zipPath);
      const request = protocol.get(downloadUrl, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            const unzipPath = path.join(os.tmpdir(), this._exeName);
            const unzipCommand = `unzip -o ${zipPath} -d ${unzipPath}`;
            execSync(unzipCommand);
            fs.unlinkSync(zipPath);
            if (this.platform !== 'win32') {
              fs.chmodSync(unzipPath, 0o755);
            }
            fs.renameSync(unzipPath, this._exeName);
            resolve(this._exeName);
          });
        } else {
          reject(new Error(`Failed to fetch EdgeDriver. Status code: ${response.statusCode}`));
        }
      });
      request.on('error', (error) => {
        reject(error);
      });
    });
  }
}

class OperaInstaller {
    constructor() {
      this.DL_BASE = 'https://github.com';
      this.platform = os.platform();
      this.links = '';
  
      const response = this.fetchReleasesPage();
      const driverLinks = this.extractDriverLinks(response);
      for (const link of driverLinks.slice(0, 4)) {
        if (link.includes(this.platform)) {
          this.fetchOperaDriver(link);
        }
      }
    }
  
    async fetchReleasesPage() {
      const url = `${this.DL_BASE}/operasoftware/operachromiumdriver/releases`;
      const protocol = url.startsWith('https') ? https : http;
  
      return new Promise((resolve, reject) => {
        protocol.get(url, (response) => {
          let data = '';
          response.on('data', (chunk) => {
            data += chunk;
          });
          response.on('end', () => {
            resolve(data);
          });
          response.on('error', (error) => {
            reject(error);
          });
        });
      });
    }
  
    extractDriverLinks(html) {
      const links = [];
      const regex = /<a[^>]+href=["'](.*?)["']/g;
      let match;
      while ((match = regex.exec(html))) {
        const link = match[1];
        if (link.includes('operadriver')) {
          links.push(link);
        }
      }
      return links;
    }
  
    async fetchOperaDriver(driver) {
      const executable = 'operadriver.exe';
      const driverName = driver.split('/').pop();
      const cwd = path.join(process.cwd(), path.sep);
  
      const downloadUrl = `${this.DL_BASE}${driver}`;
      const zipPath = path.join(os.tmpdir(), driverName);
      const protocol = downloadUrl.startsWith('https') ? https : http;
  
      await new Promise((resolve, reject) => {
        const file = fs.createWriteStream(zipPath);
        const request = protocol.get(downloadUrl, (response) => {
          if (response.statusCode === 200) {
            response.pipe(file);
            file.on('finish', () => {
              file.close();
              const unzipPath = path.join(os.tmpdir(), driverName.replace('.zip', ''));
              execSync(`unzip -o ${zipPath} -d ${unzipPath}`);
              fs.unlinkSync(zipPath);
              const sourcePath = path.join(unzipPath, executable);
              const destinationPath = path.join(cwd, executable);
              fs.renameSync(sourcePath, destinationPath);
              fs.rmdirSync(unzipPath, { recursive: true });
              resolve();
            });
          } else {
            reject(new Error(`Failed to fetch OperaDriver. Status code: ${response.statusCode}`));
          }
        });
        request.on('error', (error) => {
          reject(error);
        });
      });
    }
  }
  
    function getDriver() {
    const drivers = ['chromedriver.exe', 'msedgedriver.exe', 'operadriver.exe'];
    console.log('\nChecking Downloaded Drivers!');
    sleep(500);
    for (const driver of drivers) {
      if (fs.existsSync(path.join(process.cwd(), driver))) {
        console.log('\nChromeDriver is Already Installed...');
        sleep(500);
        return driver;
      }
    }
  
    console.log('\nInstalling Drivers!\n\n');
    if (fs.existsSync(`${process.env.localappdata}\\Google`)) {
      ChromeInstaller();
      console.log('\nChromeDriver.exe Has Been Installed Successfully!');
      return 'chromedriver.exe';
    } else if (fs.existsSync(`${process.env.appdata}\\Opera Software\\Opera Stable`)) {
      OperaInstaller();
      console.log('\nOperaDriver.exe Has Been Installed Successfully!\n\n');
      return 'operadriver.exe';
    } else if (fs.existsSync(`${process.env.localappdata}\\Microsoft\\Edge`)) {
      EdgeInstaller();
      console.log('\nMsedgeDriver.exe Has Been Installed Successfully!\n\n');
      return 'msedgedriver.exe';
    } else {
      console.log('\nERROR | No Compatible Driver Found... Proceeding with ChromeDriver!\n\n');
      ChromeInstaller();
      console.log('\nTrying ChromeDriver.exe\n\n');
      return 'chromedriver.exe';
    }
}

const heads = [
    {
        "Content-Type": "application/json",
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; rv:76.0) Gecko/20100101 Firefox/76.0'
    },

    {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:72.0) Gecko/20100101 Firefox/72.0"
    },

    {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (X11; Debian; Linux x86_64; rv:72.0) Gecko/20100101 Firefox/72.0"
    },

    {
        "Content-Type": "application/json",
        'User-Agent': 'Mozilla/5.0 (Windows NT 3.1; rv:76.0) Gecko/20100101 Firefox/69.0'
    },

    {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (X11; Debian; Linux x86_64; rv:72.0) Gecko/20100101 Firefox/76.0"
    },

    {
       "Content-Type": "application/json",
       "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11"
    }
]



function input(message) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve, reject) => {
    rl.question(message, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function filegrabbertitle() {
    console.log(``)
}

function clear() {
  return new Promise((resolve) => {
    const system = os.platform()
    if(system === "win32") {
      process.stdout.write('\x1Bc');
      resolve()
    }
    else if(system === "linux") {
        execSync("clear .")
        resolve()
    }
    else {
        console.log("\n"*120)
        resolve()
    }
  })
}

async function Spinner() {
  const l = ['|', '/', '-', '\\'];
  for (const i of [...l, ...l, ...l]) {
    process.stdout.write(`\rLoading... ${i}`);
    await sleep(200);
    process.stdout.clearLine();
    process.stdout.cursorTo(0); 
  }
}

function trasition() {
  return new Promise((resolve) => {
    clear()
    Spinner()
    clear()
    resolve()
  })
}

function SlowPrint(_str) {
  return new Promise((resolve) => {
    let index = 0;
    const interval = 60;

    const printNextLetter = () => {
      if (index < _str.length) {
        process.stdout.write(_str[index]);
        index++;
        setTimeout(printNextLetter, interval);
      } else {
        resolve();
      }
    };

    printNextLetter();
  });
}

function getTempDir() {
  return new Promise((resolve) => {
    const system = os.platform()
    if(system == "win32") {
        resolve(process.env.temp)
    } else if(system == "linux") {
        resolve("/tmp/")
    }
  })
}

function getheaders(token=undefined) {
  return new Promise((resolve) => {
    let headers = heads[Math.floor(Math.random()*heads.length)]
    if(token) {
        headers['Authorization'] = token
    }
    resolve(headers)
  })
}

function validateToken(token) {
  return new Promise((resolve) => {

    const baseurl = "https://discord.com/api/v9/users/@me"
    const message = "You need to verify your account in order to perform this action."
    getheaders(token)
    .then((headers_) => {
      request.get({url: baseurl, headers:headers_}, function(err,responce,body){
          if(responce.statusCode !== 200) {
              console.log(`\n${colors.red}Invalid Token.${colors.reset}`)
              resolve()
          } else if (responce.statusCode === 200) {
            console.log(`${colors.lightGreen}Valid Token.${colors.reset}`)
            resolve(token)
          }
      })
      request.get({url:`${baseurl}/billing/subscriptions`, headers:headers_}, function(err,responce,body) {
        const j = responce.data
        try {
          if(j["message"] === message) {
            console.log(`\n${colors.red}Phone Locked Token!${colors.reset}`)
            resolve()
          }
        } catch (err) {
          resolve()
        }
      })
    })
    .catch((err) => {
      console.log("Somting went wrong...")
      resolve()
    })
  })
}

function validateWebhook(hook) {
  return new Promise((resolve) => {
    if (!("api/webhooks" in hook)) {
      console.log(`\n${colors.red}Invalid Webhook!${colors.reset}`);
      sleep(1000).then(() => {
        try {
          request.get(hook, function (err, response, body) {
            if (response.statusCode !== 200) {
              console.log(`\n${colors.red}Invalid Webhook!${colors.reset}`);
              resolve()
            } else if (response.statusCode === 200) {
              try {
                const j = response.data["name"];
                console.log(`\n${colors.lightGreen}Valid Webhook!${colors.reset} (${j})`);
                resolve()
              } catch (error) {
                console.log(`\n${colors.red}Invalid Webhook!${colors.reset}`);
                resolve()
              }
            }
            resolve();
          });
        } catch (err) {
          console.log(`\n${colors.red}Invalid Webhook!${colors.reset}`);
          sleep(1000).then(() => {
            resolve();
          });
        }
      });
    } else {
      resolve();
    }
  });
}

function installPack(dependencies) {
  return new Promise((resolve) => {
    console.log(`${colors.lightMagenta}Checking Libraries...${colors.reset}`);
    if (process.argv[0].endsWith(".exe")) {
      exec("npm list", function (error, stdout, stderr) {
        if (!error) {
          const packageRegex = /(.+?)/g;
          const packages = [];
          let match;
          while ((match = packageRegex.exec(stdout)) !== null) {
            const packageName = match[1];
            packages.push(`${packageName}`);
          }
          for (lib in dependencies) {
            if (!(lib in packages)) {
              console.log(`${lib}${colors.red} Not found! Install it...`);
              exec(`npm install ${lib}`, function (error, stdout, stderr) {
                if (error | stderr) {
                  console.log(`${colors.red}Error: ${error | stderr}${colors.reset}`);
                  sleep(500).then(() =>{
                    resolve()
                  })
                }
              });
            }
          }
        }
        resolve();
      });
    } else {
      resolve();
    }
  });
}

function loadbar(iteration, total, prefix = "", suffix = "", decimals = 1, length = 100, fill = "X") {
  //Need's to be used in loops 
  return new Promise((resolve) => {
    const percent = ((100 * (iteration / total)).toFixed(decimals)).toString();
    const filledlength = Math.floor((length * iteration) / total);
    const bar = fill.repeat(filledlength) + "_".repeat(length - filledlength);
    process.stdout.write('\x1Bc');
    process.stdout.write(`\r${prefix} |${bar}| ${percent}% ${suffix}`);
    if (iteration === total) {
      console.log();
      resolve();
    }
    sleep(250).then(() => {resolve()})
  });
}

function proxy_scrape() {
  return new Promise((resolve) => {
    var now = new Date().getTime();
    const temp = process.env.temp + "\\gang_proxies";
    var after = new Date().getTime();
    var execution_time = now - after; // It's unused in the main script, so I'm not sure what it's for
    resolve();
  });
}

function setTitle(_str) {
  return new Promise((resolve) => {
    const system = os.platform();
    if (system == "win32") {
      process.title = `${_str} GANG.JS | BY For4#3043 | OWNED BY ††#3249 | Token's: [${counttokens}]`;
      // Quick note I messaged you and asked. Please don't sue me. XOXO For4
    }
    resolve();
  });
}

function proxy() {
  return new Promise((resolve, reject) => {
    const temp = process.env.temp + "\\gang_proxies";
    fs.stat(temp, function (err, stats) {
      if (err) {
        reject(err);
      } else if (stats.size == 0) {
        proxy_scrape().then(() => {
          resolve();
        });
      } else {
        const proxies = fs.readFileSync(temp, "utf-8").split("\n");
        var proxy = proxies[0];

        fs.readFile(temp, "utf-8", function (err, data) {
          if (err) {
            reject(err);
          }
          let lines = data.split("\n");
          lines.shift();

          fs.writeFile(temp, lines.join("\n"), "utf-8", function (error) {
            if (error) {
              reject(error);
            }
            resolve({ "http://": `http://${proxy}`, "https://": `https://${proxy}` });
          });
        });
      }
    });
  });
}

function LOGO() {
  return new Promise((resolve) => {
    figlet.text("GANG.JS", function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log("\n" + result + "\n\tJS: For4#3043 - PY: ††#3249");
      resolve();
    });
  });
}

module.exports = {
    ChromeInstaller: ChromeInstaller,
    EdgeInstaller: EdgeInstaller,
    OperaInstaller: OperaInstaller,
    getDriver: getDriver,
    filegrabbertitle: filegrabbertitle,
    Spinner: Spinner,
    clear: clear,
    trasition: trasition,
    SlowPrint: SlowPrint,
    getTempDir: getTempDir,
    getheaders: getheaders,
    validateToken: validateToken,
    validateWebhook: validateWebhook,
    installPack: installPack,
    loadbar: loadbar,
    setTitle: setTitle,
    proxy: proxy,
    proxy_scrape: proxy_scrape,
    LOGO: LOGO,
    input: input,
    sleep: sleep,
    colors: colors
}
