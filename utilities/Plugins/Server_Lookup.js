// Love from for4.
const request = require("request");
const { input, getheaders, colors, clear, setTitle, validateToken } = require("../Settings/common");
const fs = require("fs");

async function menu() {
  await setTitle("SERVER LOOKUP");
  await clear();
  console.log(colors.purple + "> [1] Server lookup\n> [2] Exit" + colors.reset);
  var x = await input("\n> Choice: ");
  return x;
}

async function Lookup(token,serverid) {
    const file = await input(colors.lightYellow + "Do you want a server lookup data file Y\\N: " + colors.reset);
    console.log(colors.red + "Please note that the token must be in the server, to get the server information." + colors.reset);
    var x = await validateToken(token);
    if (await x === undefined) {return;}
    getheaders(token)
      .then((headers_) => {
        const headers = headers_;
        (async () => {
          const guildid = serverid;
          request.get(
            {
              uri: `https://discord.com/api/guilds/${guildid}`,
              headers: headers,
              qs: { with_counts: true },
            },
            function (error, response, body) {
              if (error) {
                console.log(error);
              } else {
                const server = JSON.parse(body);
                getheaders(token)
                .then((headers2) => {
                  const header2 = headers2;
                    request.get(
                      {
                        uri: `https://discord.com/api/guilds/${guildid}/members/${server.owner_id}`,
                        headers: header2,
                        qs: { with_counts: true },
                      },
                      function (error2, response2, body2) {
                        if (error2) {
                          console.log(error2);
                        } else {
                          const owner = JSON.parse(body2);
                          clear()
                          const Server_roles = []
                          const Owner_roles = []
                          let emoji_count = 0
                          for (const role in server.roles) {
                            Server_roles.push(server.roles[role].name + "\t | " + server.roles[role].id + "\t | Pingable: " + server.roles[role].mentionable);
                            if (owner.roles.includes(server.roles[role].id)) {
                              Owner_roles.push(server.roles[role].name + " | " + server.roles[role].id);
                            }
                          }
                          for(emoji of server.emojis) {
                            if(emoji) {
                              emoji_count++
                            }
                          }                 
                          const info =
colors.purple +
`
####### OWNER INFO #######
[Owner Name]        : (${owner.user.username})
[In Server Name]    : (${owner.user.global_name})
[Owner ID]          : (${owner.user.id})
[Is Muted]          : (${owner.mute})
[Is Deafened]       : (${owner.deaf})
[Joined/Created At] : (${owner.joined_at})
[Has Roles]         : (${Boolean(owner.roles.length > 0)})
[Role Id's]         : (${Owner_roles.join(", ")})
[Has Costume PFP]   : (${Boolean(owner.avatar !== null)})
[Boster since]      : (${Boolean(owner.premium_since)})

####### SERVER LOOKUP INFO #######
[Server Name]    : (${server.name})
[Server ID]      : (${server.id})
[Members]        : (${server.approximate_member_count})
[Online Members] : (~${server.approximate_presence_count})
[Region]         : (${server.region})
[Server Emoji's] : (${emoji_count})
[Icon URL]       : (https://cdn.discordapp.com/icons/${guildid}/${server.icon}.webp?size=256)
[Server Roles]   : \n${Server_roles.join("\n")}
` +
colors.reset;
                          console.log(info);
                          if (file.toLowerCase() === "y") {
                            const filePath = `data/${server.name}_data.json`;
                            const data = JSON.stringify({ server, owner }, null, 2);
                          
                            fs.writeFile(filePath, data, "UTF-8", (err) => {
                              if (err) {
                                console.log(err);
                              } else {
                                console.log(colors.lightGreen + "Server lookup data file saved!\nPRESS ENETER TO CONTINUE." + colors.reset);
                              }
                            });
                          } else {
                            return;
                          }                          
                        }
                      }
                    );
                }) .catch(err => console.log(err));
              }
            }
          );
        })();
      })
      .catch((error) => {
        console.log(error);
      });
};

module.exports = { Lookup: Lookup };