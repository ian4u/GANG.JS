const {ChromeInstaller,EdgeInstaller,OperaInstaller,getDriver,filegrabbertitle,Spinner,clear,trasition,SlowPrint,getTempDir,getheaders,validateToken,validateWebhook,installPack,loadbar,setTitle,proxy,proxy_scrape,LOGO,input,sleep, colors} = require("./utilities/Settings/common")
const {GANGDOTJS_START} = require("./utilities/Plugins/Account_Nuker")
const {DmDeleter} = require("./utilities/Plugins/DM_Deleter")
const {Lookup} = require("./utilities/Plugins/Server_Lookup")
const {TokenChanger2} = require("./utilities/Plugins/Token_Changer")
const {Info} = require("./utilities/Plugins/Token_info")
const fs = require("fs")
const request = require("request")
const {execSync} = require("child_process")

function getUserAgent() {
    const userAgents = fs.readFileSync('data/useragent.txt', 'utf-8').split('\n');
    const randomIndex = Math.floor(Math.random() * userAgents.length);
    const userAgent = userAgents[randomIndex].trim();
    return userAgent;
}
async function MAIN() {
    await LOGO()
    const interface = 
    colors.purple+`
    ◢================================================================================◣
    ⫴  [1] Account Nuker || [2] DM Deleter || [3] Server Lookup || [4] Token Changer  ⫴
    ⫴  [5] Token Checker || [6] Token Info || [7] EXIT          || [8] Discord        ⫴
    ◥================================================================================◤
    `+colors.reset
    console.log(interface)
    var user_in = await input("Choice >")
    switch (user_in) {
        case "1":
            const servername = await input("Server Spam Name > ")
            const token = await input("Token > ")
            const spammessage = await input("Spam Message > ")
            await GANGDOTJS_START(token,servername,spammessage)
            MAIN()
        case "2":
            const token2 = await input("Token > ")
            getheaders(token2).then((headers) => {
                const channelids = request.get({uri:"https://discord.com/api/v9/users/@me/channels", headers:headers, json:true})
                for (const channel of channelids) {
                    (async () => {
                        await DmDeleter(token2, channel)
                    })();
                }
            })
            await clear()
            await MAIN()
        case "3":
            const token3 = await input("Token > ")
            await Lookup(token3)
            await clear()
            await MAIN()
        case "4":
            const token4 = await input("Token > ")
            await TokenChanger2(token4)
            await clear()
            await MAIN()
        case "5":
            const file = fs.readFileSync("token.txt", "utf-8").split("\n");
            for(const token of file) {
                console.log(await validateToken(token));
            }
            await clear()
            await MAIN()
        case "6":
            const token5 = await input("Token > ")
            await Info(token5)
            await clear()
            await MAIN()
        case "7":
            process.exit()
        case "8":
            request.get("https://raw.githubusercontent.com/ian4u/GANG.JS/main/discord.txt", function(error,responce,body) {
                if(error) {console.log(error)}
                const link = body.split("\n")[0]
                execSync(`start ${link}`)
            })
            await clear()
            await MAIN()
        default:
            await clear()
            break;
    }
}

MAIN()