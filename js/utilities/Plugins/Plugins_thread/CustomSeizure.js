const {getheaders, validateToken, sleep} = require("../../Settings/common")
const request = require("request")

let keyPressed = false;

function handleKeyPress() {
  keyPressed = true;
}

document.addEventListener("keypress", handleKeyPress);

function runCode() {
    const token = validateToken(process.argv[2])
    if(!(token)) {return}
    while (!keyPressed) {
        var locale = ['ja', 'zh-TW', 'ko', 'zh-CN']

        request.patch({uri:"https://discord.com/api/v7/users/@me/settings", headers: getheaders(token), json: {'theme': "light", 'locale': locale[Math.floor(Math.random()*locale.length)]}}, function(error,responce,body) {
            if(error) {console.log(error)}
            if(responce.statusCode === 200) {console.log("Swiched theme.")}
        })

        sleep(5000)

        request.patch({uri:"https://discord.com/api/v7/users/@me/settings", headers: getheaders(token), json: {'theme': "dark", 'locale': locale[Math.floor(Math.random()*locale.length)]}}, function(error,responce,body) {
            if(error) {console.log(error)}
            if(responce.statusCode === 200) {console.log("Swiched theme.")}
        })
    }
    console.log("Key pressed! Will quit now.");
    return
}   

runCode();
