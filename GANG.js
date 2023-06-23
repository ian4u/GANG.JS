const {ChromeInstaller,EdgeInstaller,OperaInstaller,getDriver,filegrabbertitle,Spinner,clear,trasition,SlowPrint,getTempDir,getheaders,validateToken,validateWebhook,installPack,loadbar,setTitle,proxy,proxy_scrape,LOGO,input,sleep} = require("./utilities/Settings/common")
const {GANGDOTJS_START} = require("./utilities/Plugins/Account_Nuker")
const {DmDeleter} = require("./utilities/Plugins/DM_Deleter")
const {Lookup} = require("./utilities/Plugins/Server_Lookup")
const {TokenChanger2} = require("./utilities/Plugins/Token_Changer")
const {Info} = require("./utilities/Plugins/Token_info")
const fs = require("fs")

function getUserAgent() {
    const userAgents = fs.readFileSync('data/useragent.txt', 'utf-8').split('\n');
    const randomIndex = Math.floor(Math.random() * userAgents.length);
    const userAgent = userAgents[randomIndex].trim();
    return userAgent;
}

const interface = 
`
====================================================================================
[1] Server Joiner || [9] Channel Spammer   || 
[2] Server Leaver || [10] Dm Spammer       ||
[3] Token Checker || [11] Friend Spammer   ||
[4] Token Onliner || [12] HypeSquat Joiner ||
[5] Token Grabber || [13] Reaction Spammer ||
[6] Server MassDM || [14] NickName Changer ||
[7] Account Nuker || [15] Webhook Spammer  ||
[8] Server Nuker  || [16] VC Spammer       ||
`
