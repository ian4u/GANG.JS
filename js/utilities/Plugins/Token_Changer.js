const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const {validateToken, colors} = require("../Settings/common")

async function TokenChanger(token) {
    // Feature by for4. <3
    if(!(validateToken(token))) {return}
    const options = new chrome.Options();
    options.excludeSwitches(['enable-logging']);
    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
    try {
        await driver.get('https://discord.com/login');
        const script = `document.body.appendChild(document.createElement('iframe')).contentWindow.localStorage.token = "${token}";location.reload()`;
        await driver.executeScript(script);
        await driver.quit();

    } catch(err) {
        await driver.quit();
    }
    if(!(validateToken(token))) {
        process.stdout.write(`${colors.lightGreen} Replaced / Changed Token : [${token}] <- this token is now invalid.`)
    }
}
