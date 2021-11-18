const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const fs = require('fs');

// Control constants
const url = 'https://www.emag.ro/telefon-mobil-apple-iphone-xr-64gb-red-mry62rm-a/pd/DKSY9VBBM/';

const PORT = 8000;

// 1800000 = half an hour interval
const interval = 1800000;

const observableElement = '.pricing-block'

const path = 'C:/Users/Lenovo/OneDrive - Bayer Construct zRt/Documents/IPhoneXR_log.txt'

const app = express()
let price = 0;

function scraping() {
    axios(url)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            $(observableElement, html).each(function () {
                price = $(this).text()
            })
            updateFile()
        }).catch(err => console.log(err))
}

function updateFile() {
    fs.open(path, 'a', 666, function (e, id) {

        fs.write(id, new Date() + price + "\r\n", null, 'utf8', function () {
            fs.close(id, function () {
                console.log("\x1b[0m", 'File was updated with: ');
                console.log("\x1b[32m", price);
            });
        })
    });
}

setInterval(() => {
    scraping()
}, interval)

app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));