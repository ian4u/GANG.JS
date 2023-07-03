const { getheaders, colors, sleep } = require("../../Settings/common");
const request = require("request");

async function spamType(token, channelid) {
  try {
    const headers = await getheaders(token);
    const response = await new Promise((resolve, reject) => {
      request.post(
        {
          uri: `https://discord.com/api/v9/channels/${channelid}/typing`,
          headers: headers,
          json: true,
        },
        (error, res, body) => {
          if (error) {
            reject(error);
          } else {
            resolve({ res, body });
          }
        }
      );
    });

    if (response.res.statusCode === 200) {
      console.log(
        colors.green +
          `Successfully sent typing notification to ${channelid}` +
          colors.reset
      );
    }

    return response;
  } catch (error) {
    console.log(error);
  }
}

const token = process.argv[2];
const channelid = process.argv[3];

(async () => {
  while (true) {
    await spamType(token, channelid);
    await sleep(9000);
  }
})();