const imagekit = require('./utils/imagekit');

async function testUpload() {
    console.log('Starting ImageKit test upload...');
    console.log('Using endpoint:', process.env.IMAGEKIT_URL_ENDPOINT);

    try {
        // Upload a simple base64 string
        // This is a minimal 1x1 pixel red dot
        const base64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

        const response = await imagekit.upload({
            file: base64Image,
            fileName: 'test_pixel.png',
            folder: '/tests'
        });

        console.log('Upload Successful!');
        console.log('File URL:', response.url);
        console.log('File ID:', response.fileId);
    } catch (error) {
        console.error('Upload Failed!');
        console.error('Error Code:', error.code); // Often helpful with ImageKit
        console.error('Error Message:', error.message);
        console.error('Full Error:', error);
    }
}

testUpload();
