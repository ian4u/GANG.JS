// Love from for4.
const request = require("request")
const { getheaders, colors, validateToken } = require("../Settings/common")

function DmDeleter(token, channels) {
    if(validateToken(token) === undefined) {return}
    for(channel in channels) {
        try {
            request.delete({uri: `https://discord.com/api/v7/channels/${channel.id}`, headers: getheaders(token)}, function(error,responce,body) {
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
}

module.exports = {
    DmDeleter: DmDeleter
}