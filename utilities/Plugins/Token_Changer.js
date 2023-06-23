// Love from for4. <3
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { execSync } = require("child_process")
const {validateToken, colors, sleep, input} = require("../Settings/common")

async function TokenChanger(token) {
    // Feature by for4. <3
    if(!(validateToken(token))) {return}
    const options = new chrome.Options();
    options.excludeSwitches(['enable-logging']);
    try {options.setChromeBinaryPath('C:/Program Files/Google/Chrome/Application/chrome.exe') } catch(err) {console.log("Please install chrome on https://google.com/chrome");return}
    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
    try {
        await driver.get('https://discord.com/login');
        const script = `document.body.appendChild(document.createElement('iframe')).contentWindow.localStorage.token = "${token}";
        location.reload()`;
        await input("Press ENTER to execute the script.")
        await driver.executeScript(script);
        await sleep(10000)
        await driver.quit();

    } catch(err) {
        await driver.quit();

        console.log("Your command has been copied to your clipboard. Please paste it in your browser.")
    }
    if(!(validateToken(token))) {
        process.stdout.write(`${colors.lightGreen} Replaced / Changed Token : [${token}] <- this token is now invalid.${colors.reset}`)
    }
}

async function TokenChanger2(token) {
    if(await validateToken(token) === undefined) {return}
    const script = `document.body.appendChild(document.createElement('iframe')).contentWindow.localStorage.token = "${token}";location.reload()`;
    execSync(`echo ${script} | clip`)
    process.stdout.write(`${colors.lightGreen}A script has been copied to your clipboard.\nPaste it in the chrome console by bressing [ strg ] + [ i ].\nThan press Enter.${colors.reset}`)
    await input("Press enter after executing the script in chrome.")
    if( await validateToken(token) === undefined) {
        console.log("Token is reseted now!")
    }
}

module.exports = {
    TokenChanger2: TokenChanger2
}