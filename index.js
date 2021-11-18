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
        const t = new Date();

        const date = ('0' + t.getDate()).slice(-2);
        const month = ('0' + (t.getMonth() + 1)).slice(-2);
        const year = t.getFullYear();
        const hours = ('0' + t.getHours()).slice(-2);
        const minutes = ('0' + t.getMinutes()).slice(-2);
        const time = `${date}/${month}/${year} - ${hours}:${minutes}`;

        fs.write(id, time + price + "\r\n", null, 'utf8', function () {
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