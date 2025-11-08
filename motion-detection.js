// Motion detection constants
const MOTION_THRESHOLD = 15; // Sensitivity threshold for motion detection (balanced to reduce false positives while remaining responsive)
const MOTION_SAMPLES = 50; // Number of consecutive frames with motion required (~0.8 seconds at 60fps - balanced sensitivity)
const BACKGROUND_LEARNING_RATE = 0.003; // How quickly background adapts (very slow - less sensitive)
const MOTION_COOLDOWN = 8000; // Milliseconds to wait after motion before allowing new detection (8 seconds)
const MIN_MOTION_AREA = 0.10; // Minimum percentage of frame that must change (10% - balanced to require substantial motion)
const BACKGROUND_STABILIZATION_TIME = 3000; // Milliseconds to wait after camera init before starting motion detection

// Motion detection state
let video = null;
let canvas = null;
let ctx = null;
let lastFrame = null;
let backgroundFrame = null;
let frameCount = 0;
let motionDetectionActive = false;
let motionSampleCount = 0;
let lastMotionTriggerTime = 0;

// Callbacks
let onMotionDetected = null;
let onMotionWhileVisible = null;
let getDashboardState = null; // Function to get current dashboard state

// Initialize camera and motion detection
async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: 320, 
                height: 240,
                facingMode: 'user' // Use front-facing camera
            } 
        });
        
        video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.playsInline = true;
        video.style.display = 'none';
        document.body.appendChild(video);
        
        canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 240;
        ctx = canvas.getContext('2d');
        
        // Wait for video to be ready and playing
        video.addEventListener('loadedmetadata', () => {
            video.play().then(() => {
                console.log('Video started playing, stabilizing camera...');
                // Wait for camera to stabilize and collect background frames
                setTimeout(() => {
                    initializeBackground();
                }, BACKGROUND_STABILIZATION_TIME);
            }).catch(err => {
                console.error('Error playing video:', err);
            });
        });
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        // If camera fails, still allow manual trigger (for testing)
    }
}

// Initialize background frame by averaging multiple frames
function initializeBackground() {
    if (!video || !ctx) return;
    
    console.log('Collecting background frames for stabilization...');
    const framesToAverage = 30; // Average 30 frames over ~0.5 seconds
    let frameCount = 0;
    const frameData = [];
    
    const collectFrame = () => {
        if (video.readyState < 2) {
            requestAnimationFrame(collectFrame);
            return;
        }
        
        try {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
            frameData.push(frame);
            frameCount++;
            
            if (frameCount < framesToAverage) {
                setTimeout(collectFrame, 16); // ~60fps
            } else {
                // Average all collected frames to create stable background
                backgroundFrame = ctx.createImageData(canvas.width, canvas.height);
                const bgData = backgroundFrame.data;
                
                for (let i = 0; i < bgData.length; i += 4) {
                    let rSum = 0, gSum = 0, bSum = 0;
                    for (let f = 0; f < frameData.length; f++) {
                        rSum += frameData[f].data[i];
                        gSum += frameData[f].data[i + 1];
                        bSum += frameData[f].data[i + 2];
                    }
                    bgData[i] = Math.round(rSum / frameData.length); // R
                    bgData[i + 1] = Math.round(gSum / frameData.length); // G
                    bgData[i + 2] = Math.round(bSum / frameData.length); // B
                    bgData[i + 3] = 255; // Alpha
                }
                
                console.log('Background stabilized, starting motion detection...');
                startMotionDetection();
            }
        } catch (error) {
            console.error('Error collecting background frames:', error);
            // Fallback: use single frame
            if (frameData.length > 0) {
                backgroundFrame = frameData[0];
                startMotionDetection();
            }
        }
    };
    
    collectFrame();
}

// Start motion detection loop
function startMotionDetection() {
    if (motionDetectionActive) return;
    motionDetectionActive = true;
    detectMotion();
}

// Motion detection using frame difference with background subtraction
function detectMotion() {
    if (!video || !ctx || !motionDetectionActive) return;
    
    // Check if video is ready
    if (video.readyState < 2) {
        requestAnimationFrame(detectMotion);
        return;
    }
    
    try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        frameCount++;
        
        // Background should be initialized before we get here
        if (!backgroundFrame) {
            requestAnimationFrame(detectMotion);
            return;
        }
        
        // Update background frame very slowly (running average)
        // This allows the background to adapt to lighting changes while detecting motion
        // Only update background when dashboard is hidden AND no recent motion was detected
        const timeSinceLastMotion = Date.now() - lastMotionTriggerTime;
        const dashboardState = getDashboardState ? getDashboardState() : { isVisible: false };
        // Wait 15 seconds after motion before updating background, and only update every 20th frame (slower adaptation)
        if (!dashboardState.isVisible && timeSinceLastMotion > 15000 && frameCount % 20 === 0) {
            const bgData = backgroundFrame.data;
            const curData = currentFrame.data;
            for (let i = 0; i < curData.length; i += 4) {
                // Very slowly blend current frame into background
                bgData[i] = bgData[i] * (1 - BACKGROUND_LEARNING_RATE) + curData[i] * BACKGROUND_LEARNING_RATE; // R
                bgData[i + 1] = bgData[i + 1] * (1 - BACKGROUND_LEARNING_RATE) + curData[i + 1] * BACKGROUND_LEARNING_RATE; // G
                bgData[i + 2] = bgData[i + 2] * (1 - BACKGROUND_LEARNING_RATE) + curData[i + 2] * BACKGROUND_LEARNING_RATE; // B
                bgData[i + 3] = 255; // Alpha
            }
        }
        
        // Compare current frame against background (not previous frame)
        const motion = calculateMotion(backgroundFrame, currentFrame);
        
        // Debug logging - log motion value every 60 frames (~1 second at 60fps)
        if (!window.motionLogCounter) window.motionLogCounter = 0;
        window.motionLogCounter++;
        if (window.motionLogCounter % 60 === 0) {
            console.log('Current motion:', motion.toFixed(2), 'Threshold:', MOTION_THRESHOLD, 'Samples:', motionSampleCount, 'Dashboard visible:', dashboardState.isVisible, 'Loading:', dashboardState.isLoading);
        }
        
        // Check cooldown period - don't detect motion if we just triggered recently
        const timeSinceLastTrigger = Date.now() - lastMotionTriggerTime;
        const inCooldown = timeSinceLastTrigger < MOTION_COOLDOWN;
        
        if (motion > MOTION_THRESHOLD && !inCooldown) {
            // Motion detected - increment sample count
            motionSampleCount++;
            
            // Require motion in multiple consecutive frames to avoid false positives
            if (motionSampleCount >= MOTION_SAMPLES) {
                console.log('Motion threshold exceeded! Triggering dashboard load. Motion:', motion.toFixed(2));
                const now = Date.now();
                lastMotionTriggerTime = now; // Set cooldown timer
                motionSampleCount = 0; // Reset counter
                
                // Don't immediately reset background - wait a bit to see if motion continues
                // This prevents false positives from single-frame glitches
                setTimeout(() => {
                    // Only reset if dashboard is still visible (motion was real)
                    const state = getDashboardState ? getDashboardState() : { isVisible: false };
                    if (state.isVisible) {
                        const bgData = backgroundFrame.data;
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        const newFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const newData = newFrame.data;
                        for (let i = 0; i < newData.length; i++) {
                            bgData[i] = newData[i];
                        }
                        console.log('Background reset after confirmed motion');
                    }
                }, 2000); // Wait 2 seconds before resetting
                
                // Call appropriate callback based on dashboard state
                if (dashboardState.isVisible) {
                    if (onMotionWhileVisible) {
                        onMotionWhileVisible(now);
                    }
                } else if (!dashboardState.isLoading) {
                    if (onMotionDetected) {
                        onMotionDetected();
                    }
                }
            }
        } else {
            // No motion detected or in cooldown - reset sample count
            if (!inCooldown) {
                motionSampleCount = 0;
            }
        }
        
        lastFrame = currentFrame;
    } catch (error) {
        console.error('Error in motion detection:', error);
    }
    
    // Continue detection loop
    requestAnimationFrame(detectMotion);
}

// Calculate motion difference between two frames using improved algorithm
function calculateMotion(frame1, frame2) {
    const data1 = frame1.data;
    const data2 = frame2.data;
    let totalDiff = 0;
    let significantChanges = 0;
    let pixelCount = 0;
    
    // Check every 4th pixel for better sensitivity (more pixels = better detection)
    for (let i = 0; i < data1.length; i += 16) { // Every 4th pixel (RGBA = 4 bytes, so 16 = 4 pixels)
        const r1 = data1[i];
        const g1 = data1[i + 1];
        const b1 = data1[i + 2];
        const r2 = data2[i];
        const g2 = data2[i + 1];
        const b2 = data2[i + 2];
        
        // Calculate color difference using Euclidean distance
        const rDiff = Math.abs(r1 - r2);
        const gDiff = Math.abs(g1 - g2);
        const bDiff = Math.abs(b1 - b2);
        const colorDiff = Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
        
        totalDiff += colorDiff;
        pixelCount++;
        
        // Count significant changes (pixels that changed by more than 40 in any channel - balanced threshold to reduce noise)
        if (rDiff > 40 || gDiff > 40 || bDiff > 40) {
            significantChanges++;
        }
    }
    
    const avgDiff = totalDiff / pixelCount;
    const changeRatio = significantChanges / pixelCount;
    
    // Check if enough of the frame changed (minimum motion area requirement)
    if (changeRatio < MIN_MOTION_AREA) {
        // Not enough of the frame changed - likely noise, return low score
        return avgDiff * 0.1; // Heavily penalize small changes
    }
    
    // Return a weighted score that emphasizes both average change and percentage of changed pixels
    // Reduced multiplier for less sensitivity
    const motionScore = avgDiff * (1 + changeRatio * 1.2);
    
    return motionScore;
}

// Initialize motion detection with callbacks
function initMotionDetection(callbacks) {
    onMotionDetected = callbacks.onMotionDetected;
    onMotionWhileVisible = callbacks.onMotionWhileVisible;
    getDashboardState = callbacks.getDashboardState;
    return initCamera();
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initMotionDetection };
}

