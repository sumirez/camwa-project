import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Configure the DigitalOcean Spaces endpoint
const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT || 'sgp1.digitaloceanspaces.com');

const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY_ID || 'DO801MNJVNHUTRNYKPZV',
    secretAccessKey: process.env.DO_SPACES_SECRET_ACCESS_KEY || 'aqTV3J2dc0AuMn5+I0nG19o517SkjoigzufSlxwipzw',
    s3ForcePathStyle: false,
    signatureVersion: 'v4'
});

const BUCKET_NAME = process.env.DO_SPACES_BUCKET_NAME || 'camwa-project';
const CDN_ENDPOINT = process.env.DO_SPACES_CDN_ENDPOINT || 'https://camwa-project.sgp1.cdn.digitaloceanspaces.com';
const URL_EXPIRY_SECONDS = parseInt(process.env.CAMERA_URL_EXPIRY_SECONDS) || 60;  //Set default expiry to 60 seconds

export { s3, BUCKET_NAME, CDN_ENDPOINT, URL_EXPIRY_SECONDS };
