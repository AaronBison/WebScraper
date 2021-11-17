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
    fs.open('IPhoneXR_log.txt', 'a', 666, function (e, id) {

        fs.write(id, new Date() + price + "\r\n", null, 'utf8', function () {
            fs.close(id, function () {
                console.log('File was updated with: ' + price);
            });
        })
    });
}

setInterval(() => {
    scraping()
}, interval)

app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));