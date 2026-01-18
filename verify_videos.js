const https = require('https');

const API_KEY = 'Zaw5aPGovHwp42bqrn3R2R2d2reMaSKin4QjuqLu';
const dates = [
    '2023-10-17',
    '2024-06-30',
    '2023-08-13',
    '2012-06-05'
];

dates.forEach(date => {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`;
    https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            const json = JSON.parse(data);
            console.log(`Date: ${date}, Type: ${json.media_type}, Title: ${json.title}`);
        });
    }).on('error', err => {
        console.error(`Error for ${date}:`, err.message);
    });
});
