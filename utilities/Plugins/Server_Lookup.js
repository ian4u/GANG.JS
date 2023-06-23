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

async function Lookup(token) {
  var option = await menu();
  if (option == "1") {
    const file = await input(colors.lightYellow + "Do you want a server lookup data file Y\\N: " + colors.reset);
    console.log(colors.red + "Please note that the token must be in the server, to get the server information." + colors.reset);
    var x = await validateToken(token);
    if (await x === undefined) {return;}
    getheaders(token)
      .then((headers_) => {
        const headers = headers_;
        (async () => {
          const guildid = await input(colors.purple + "Server ID: " + colors.reset);
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
                          clear()
                          const owner = JSON.parse(body2);
                          const info =
colors.purple +
`
[Server Name] : (${server.name})
[Server ID]   : (${server.id})
[Owner Name]  : (${owner.user.username + "#" + owner.user.discriminator})
[Owner ID]    : (${owner.user.id})
[Members]     : (${server.approximate_member_count})
[Region]      : (${server.region})
[Icon URL]    : (https://cdn.discordapp.com/icons/${guildid}/${server.icon}.webp?size=256)
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
                                console.log(colors.lightGreen + "Server lookup data file saved!" + colors.reset);
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
  } else {
    return;
  }
};

module.exports = { Lookup: Lookup };