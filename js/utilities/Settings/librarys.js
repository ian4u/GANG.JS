//########## NEEDED ###########//
const { execSync,exec } = require('child_process');

//######## PREINSTALLED ########//
const https = require('https');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require("readline")

//######### INSTALL FUNCTION #######//
function install(_str) {
    execSync(`npm install ${_str}`)
}

// MUST-INSTALL
try { const request = require("request")} catch(err) {install("request")}
try { const figlet = require("figlet")} catch(err) {install("figlet")}

