const https = require('https');

const API_KEY = 'Zaw5aPGovHwp42bqrn3R2R2d2reMaSKin4QjuqLu';
const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=100&camera=MAST&page=1&api_key=${API_KEY}`;

console.log(`Testing URL: ${url}`);

https.get(url, (res) => {
    console.log(`Status Code: ${res.statusCode}`);

    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Body snippet:', data.substring(0, 200));
        if (res.statusCode === 200) {
            try {
                const json = JSON.parse(data);
                console.log('Photos found:', json.photos.length);
            } catch (e) {
                console.log('JSON Parse Error:', e);
            }
        }
    });

}).on('error', (err) => {
    console.log('Error: ' + err.message);
});
