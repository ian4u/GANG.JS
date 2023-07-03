// Love from for4.
const request = require("request")
const { getheaders, colors, validateToken } = require("../Settings/common")

async function DmDeleter(token) {
    if(validateToken(token) === undefined) {return}
    getheaders(token).then(function(headers) {
        process.stdout.write(`${colors.lightGreen}Deleting DM${colors.reset}`)
        const channelids = request.get({uri:"https://discord.com/api/v9/users/@me/channels", headers:headers, json:true})
        process.stdout.write(`${colors.lightGreen}Found ${channelids.length} channels${colors.reset}`)
        for(const channel of channelids) {
            try {
                request.delete({uri: `https://discord.com/api/v7/channels/${channel.id}`, headers:headers }, function(error,responce,body) {
                    if(error) {
                        console.log(error)
                    }
                    if(responce.statusCode === 200) {
                        process.stdout.write(`${colors.lightGreen}Deleted DM: ${colors.reset}${channel.id}`)
                    }
                })
            } catch(err) {
                console.log(err)
            }
        }
    })
}


module.exports = {
    DmDeleter: DmDeleter
}