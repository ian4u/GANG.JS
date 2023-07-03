
// imports
const request = require("request")
const fs = require('fs');
const os = require('os');
const { execSync,exec } = require('child_process');
const readline = require('readline');

// --------------

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
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

var counttokens = fs.readFileSync('tokens.txt', 'utf-8').split("\n").length
execSync("title PRESS ENTER")

const yeslist = [
    "yes","y", "yer", "yeah","yessir","ye","okay","yep","yea","ok","k","yh","sure"
]

function goofy_censor(string, remove, replacement) {
  return string.slice(0, -remove)+ replacement.repeat(remove);
}

async function chose_Token() {
  return new Promise(async (resolve) => {
    console.log(colors.red + "All tokens are read from tokens.txt and censored for security\n" + colors.reset);
    const tokens = fs.readFileSync('tokens.txt', 'utf-8').split("\n").filter(token => token.trim() !== "");
    tokens.forEach((token, index) => {
      console.log(colors.green + (index + 1) + " | " + goofy_censor(token, 45, '#') + colors.reset);
    });

    let token_at;
    do {
      token_at = await input("Token number: ");
    } while (token_at < 1 || token_at > tokens.length);

    const token_ = tokens[token_at - 1];
    await clear();
    resolve(token_);
  });
}

async function chose_Server(token) {
  return new Promise(async (resolve) => {
    const headers = {
      'Authorization': token
    };

    request.get({ uri: "https://discord.com/api/v9/users/@me/guilds", headers, json: true }, function(error, response, body) {
      if (error) {console.log(error);}
      const servers = body;
      console.log(colors.red + "\nAll servers the user is in:\n" + colors.reset);
      servers.forEach(function(server) {
        console.log(colors.green + server.name + " | " + server.id + colors.reset);
      });
    });
    const id = input("Server ID [Paste it below] > ")
    resolve(id)
  })
}

function sleep(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
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
    rl.question(colors.purple+message+colors.reset, (answer) => {
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

async function nicer_str(string, space) {
  const spacesToAdd = space - string.length;
  if (spacesToAdd <= 0) {
    return string;
  }
  const spaces = ' '.repeat(spacesToAdd);
  return string + spaces
};

function validateToken(token) {
  return new Promise((resolve, reject) => {
    const baseurl = "https://discord.com/api/v9/users/@me";
    const message = "You need to verify your account in order to perform this action.";

    getheaders(token)
      .then((headers_) => {
        request.get({ url: baseurl, headers: headers_ }, function (err, response, body) {
          if (err) {
            console.log(err);
            reject(err);
            return;
          }
          if (response.statusCode !== 200) {
            resolve(undefined);
          } else {
            resolve(token);
          }
        });

        request.get({ url: `${baseurl}/billing/subscriptions`, headers: headers_ }, function (err, response, body) {
          if (err) {
            console.log(err);
            reject(err);
            return;
          }
          try {
            const j = JSON.parse(body);
            if (j["message"] === message) {
              console.log(`\n${colors.red}Phone Locked Token!${colors.reset}`);
              resolve(undefined);
            } else {
              resolve(token);
            }
          } catch (err) {
            resolve(undefined);
          }
        });
      })
      .catch((err) => {
        console.log("Something went wrong...");
        reject(err);
      });
  });
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
    const result = 
`
                 _______  _______  __    _  _______            ___  _______ 
                |       ||   _   ||  |  | ||       |          |   ||       |
                |    ___||  |_|  ||   |_| ||    ___|          |   ||  _____|
                |   | __ |       ||       ||   | __           |   || |_____ 
                |   ||  ||       ||  _    ||   ||  | ___   ___|   ||_____  |
                |   |_| ||   _   || | |   ||   |_| ||   | |       | _____| |
                |_______||__| |__||_|  |__||_______||___| |_______||_______|
          
                              JS: For4#3043 - PY: ††#3249
 `
      console.log("\n"+ colors.purple+ result+ colors.reset);
      resolve();
  });
}

module.exports = {
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
    nicer_str: nicer_str,
    chose_Token: chose_Token,
    chose_Server: chose_Server,
    goofy_censor: goofy_censor,
    colors: colors
}
