const { Storage } = require('@google-cloud/storage');
require('dotenv').config();
const path = require('path');

const bucketName = process.env.GCS_BUCKET_NAME;
const keyPath = path.join(__dirname, '..', process.env.GOOGLE_APPLICATION_CREDENTIALS);

const storage = new Storage({
    keyFilename: keyPath,
});


const bucket = storage.bucket(bucketName);

module.exports = {
    bucket,
    bucketName,
};
