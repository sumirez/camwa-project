// Test script to verify the current expiry configuration
import { URL_EXPIRY_SECONDS } from './src/config/digitalocean.config.js';

console.log('Current URL_EXPIRY_SECONDS setting:', URL_EXPIRY_SECONDS);
console.log('This equals', URL_EXPIRY_SECONDS / 60, 'minutes');

// Check environment variable
if (process.env.CAMERA_URL_EXPIRY_SECONDS) {
    console.log('Environment variable CAMERA_URL_EXPIRY_SECONDS is set to:', process.env.CAMERA_URL_EXPIRY_SECONDS);
} else {
    console.log('Environment variable CAMERA_URL_EXPIRY_SECONDS is not set, using default of 300 seconds');
}
