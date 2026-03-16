// Test script to verify the camera path API implementation
// This script can be run to test the DigitalOcean Spaces connection

import { s3, BUCKET_NAME } from './src/config/digitalocean.config.js';

async function testDigitalOceanConnection() {
    try {
        console.log('Testing DigitalOcean Spaces connection...');
        console.log(`Bucket: ${BUCKET_NAME}`);
        
        // Test listing objects in the bucket
        const params = {
            Bucket: BUCKET_NAME,
            MaxKeys: 10
        };
        
        const data = await s3.listObjectsV2(params).promise();
        
        console.log('✅ Successfully connected to DigitalOcean Spaces');
        console.log(`Found ${data.Contents.length} objects in bucket:`);
        
        data.Contents.forEach(obj => {
            console.log(`  - ${obj.Key} (${obj.Size} bytes)`);
        });
        
        // Test if 1.mp4 exists
        const video1Exists = data.Contents.some(obj => obj.Key === '1.mp4');
        if (video1Exists) {
            console.log('✅ Found 1.mp4 in the bucket');
            
            // Test generating signed URL for 1.mp4
            const signedUrlParams = {
                Bucket: BUCKET_NAME,
                Key: '1.mp4',
                Expires: 300 // 5 minutes
            };
            
            const signedUrl = await new Promise((resolve, reject) => {
                s3.getSignedUrl('getObject', signedUrlParams, (error, url) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(url);
                    }
                });
            });
            
            console.log('✅ Successfully generated signed URL:');
            console.log(signedUrl);
        } else {
            console.log('⚠️  1.mp4 not found in bucket. Please upload it first.');
        }
        
    } catch (error) {
        console.error('❌ Error testing DigitalOcean connection:', error);
    }
}

// Run the test
testDigitalOceanConnection();
