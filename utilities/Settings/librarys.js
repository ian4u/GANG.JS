//########## NEEDED ###########//
const { exec } = require('child_process');

//######## PREINSTALLED ########//
const https = require('https');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require("readline")

//######### INSTALL FUNCTION #######//

function downloadPackages() {
    const package = packages.shift();
    if (package) {
        console.log(`Downloading ${package}...`);
        exec(`npm install ${package}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Failed to download / It's already installed ${package}: ${error.message}`);
            } else {
                console.log(`${package} downloaded successfully.`);
            }
            downloadPackages();
        });
    } else {
        console.log('All packages downloaded.');
    }
}

module.exports = {
    downloadPackages: downloadPackages
}