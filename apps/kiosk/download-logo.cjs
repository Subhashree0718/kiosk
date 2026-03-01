const https = require('https');
const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/subha/Kiosk/apps/kiosk/public';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const options = {
    hostname: 'upload.wikimedia.org',
    port: 443,
    path: '/wikipedia/commons/thumb/a/a8/Digital_India_Logo.svg/320px-Digital_India_Logo.svg.png',
    method: 'GET',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
    }
};

const file = fs.createWriteStream(path.join(dir, 'digital-india.png'));

https.get(options, (response) => {
    if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log('Download completed');
        });
    } else {
        console.error('Download failed with status code:', response.statusCode);
    }
}).on('error', (err) => {
    console.error('Error downloading:', err.message);
});
