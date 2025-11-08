// Function to format duration in seconds to hours and minutes
function formatDuration(seconds) {
    if (!seconds) return '-';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

// Function to format distance in meters
function formatDistance(meters) {
    if (!meters) return '-';
    if (meters >= 1000) {
        return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${meters} m`;
}

// Function to format date/time
function formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString();
}

// Function to format time range
function formatTimeRange(start, end) {
    if (!start || !end) return '-';
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleTimeString()} - ${endDate.toLocaleTimeString()}`;
}

// Function to populate progress bars
function setProgress(elementId, value) {
    const element = document.getElementById(elementId);
    if (element && value !== null && value !== undefined) {
        element.style.width = `${value}%`;
    }
}

// Function to load and parse JSON data
async function loadData() {
    try {
        const response = await fetch('oura_sample_user.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
}

// Function to populate all divs with extracted values
function populateDashboard(data) {
    if (!data || !data.user) return;

    const user = data.user;

    // Personal Info
    if (user.personal_info) {
        document.getElementById('age').textContent = user.personal_info.age || '-';
        document.getElementById('weight').textContent = user.personal_info.weight ? `${user.personal_info.weight} kg` : '-';
        document.getElementById('height').textContent = user.personal_info.height ? `${user.personal_info.height} m` : '-';
        document.getElementById('biological_sex').textContent = user.personal_info.biological_sex || '-';
        document.getElementById('email').textContent = user.personal_info.email || '-';
    }

    // Daily Activity
    if (user.daily_activity) {
        const activity = user.daily_activity;
        document.getElementById('activity_score').textContent = activity.score || '-';
        document.getElementById('steps').textContent = activity.steps ? activity.steps.toLocaleString() : '-';
        document.getElementById('active_calories').textContent = activity.active_calories || '-';
        document.getElementById('total_calories').textContent = activity.total_calories || '-';
        document.getElementById('target_calories').textContent = activity.target_calories || '-';
        document.getElementById('equivalent_walking_distance').textContent = formatDistance(activity.equivalent_walking_distance);

        if (activity.contributors) {
            document.getElementById('contrib_meet_daily_targets').textContent = activity.contributors.meet_daily_targets || '-';
            document.getElementById('contrib_move_every_hour').textContent = activity.contributors.move_every_hour || '-';
            document.getElementById('contrib_recovery_time').textContent = activity.contributors.recovery_time || '-';
            setProgress('progress_meet_daily_targets', activity.contributors.meet_daily_targets);
            setProgress('progress_move_every_hour', activity.contributors.move_every_hour);
            setProgress('progress_recovery_time', activity.contributors.recovery_time);
        }
    }

    // Daily Sleep
    if (user.daily_sleep) {
        const sleep = user.daily_sleep;
        document.getElementById('sleep_score').textContent = sleep.score || '-';
        if (sleep.contributors) {
            document.getElementById('contrib_total_sleep').textContent = sleep.contributors.total_sleep || '-';
            document.getElementById('contrib_efficiency').textContent = sleep.contributors.efficiency || '-';
            document.getElementById('contrib_deep_sleep').textContent = sleep.contributors.deep_sleep || '-';
            document.getElementById('contrib_rem_sleep').textContent = sleep.contributors.rem_sleep || '-';
            setProgress('progress_total_sleep', sleep.contributors.total_sleep);
            setProgress('progress_efficiency', sleep.contributors.efficiency);
            setProgress('progress_deep_sleep', sleep.contributors.deep_sleep);
            setProgress('progress_rem_sleep', sleep.contributors.rem_sleep);
        }
    }

    // Sleep Details
    if (user.sleep_details) {
        const sleepDetails = user.sleep_details;
        document.getElementById('total_sleep_duration').textContent = formatDuration(sleepDetails.total_sleep_duration);
        document.getElementById('deep_sleep_duration').textContent = formatDuration(sleepDetails.deep_sleep_duration);
        document.getElementById('rem_sleep_duration').textContent = formatDuration(sleepDetails.rem_sleep_duration);
        document.getElementById('light_sleep_duration').textContent = formatDuration(sleepDetails.light_sleep_duration);
        document.getElementById('awake_time').textContent = formatDuration(sleepDetails.awake_time);
        document.getElementById('sleep_efficiency').textContent = sleepDetails.efficiency ? `${sleepDetails.efficiency}%` : '-';
        document.getElementById('sleep_latency').textContent = formatDuration(sleepDetails.latency);
        document.getElementById('avg_heart_rate_sleep').textContent = sleepDetails.average_heart_rate ? `${sleepDetails.average_heart_rate} bpm` : '-';
        document.getElementById('avg_hrv').textContent = sleepDetails.average_hrv || '-';
        document.getElementById('bedtime_range').textContent = formatTimeRange(sleepDetails.bedtime_start, sleepDetails.bedtime_end);
    }

    // Daily Readiness
    if (user.daily_readiness) {
        const readiness = user.daily_readiness;
        document.getElementById('readiness_score').textContent = readiness.score || '-';
        if (readiness.contributors) {
            document.getElementById('contrib_previous_night_sleep').textContent = readiness.contributors.previous_night_sleep || '-';
            document.getElementById('contrib_body_temperature').textContent = readiness.contributors.body_temperature || '-';
            document.getElementById('contrib_hrv_balance').textContent = readiness.contributors.hrv_balance || '-';
            document.getElementById('contrib_resting_heart_rate').textContent = readiness.contributors.resting_heart_rate || '-';
            setProgress('progress_previous_night_sleep', readiness.contributors.previous_night_sleep);
            setProgress('progress_body_temperature', readiness.contributors.body_temperature);
            setProgress('progress_hrv_balance', readiness.contributors.hrv_balance);
            setProgress('progress_resting_heart_rate', readiness.contributors.resting_heart_rate);
        }
    }

    // Daily Stress
    if (user.daily_stress) {
        document.getElementById('stress_high').textContent = user.daily_stress.stress_high || '-';
        document.getElementById('recovery_high').textContent = user.daily_stress.recovery_high || '-';
        document.getElementById('day_summary').textContent = user.daily_stress.day_summary || '-';
    }

    // Daily Resilience
    if (user.daily_resilience) {
        document.getElementById('resilience_level').textContent = user.daily_resilience.level || '-';
    }

    // Workout
    if (user.workout) {
        const workout = user.workout;
        document.getElementById('workout_activity').textContent = workout.activity || '-';
        document.getElementById('workout_intensity').textContent = workout.intensity || '-';
        document.getElementById('workout_calories').textContent = workout.calories || '-';
        document.getElementById('workout_distance').textContent = formatDistance(workout.distance);
        document.getElementById('workout_avg_hr').textContent = workout.average_heart_rate ? `${workout.average_heart_rate} bpm` : '-';
        document.getElementById('workout_max_hr').textContent = workout.max_heart_rate ? `${workout.max_heart_rate} bpm` : '-';
        document.getElementById('workout_time').textContent = formatTimeRange(workout.start_datetime, workout.end_datetime);
    }

    // Health Metrics
    if (user.spo2) {
        document.getElementById('spo2_average').textContent = user.spo2.spo2_percentage?.average ? `${user.spo2.spo2_percentage.average}%` : '-';
        document.getElementById('breathing_disturbance').textContent = user.spo2.breathing_disturbance_index || '-';
    }
    if (user.vo2_max) {
        document.getElementById('vo2_max').textContent = user.vo2_max.vo2_max || '-';
    }
    if (user.daily_cardiovascular_age) {
        document.getElementById('vascular_age').textContent = user.daily_cardiovascular_age.vascular_age ? `${user.daily_cardiovascular_age.vascular_age} years` : '-';
    }

    // Ring Configuration
    if (user.ring_configuration) {
        const ring = user.ring_configuration;
        document.getElementById('ring_color').textContent = ring.color || '-';
        document.getElementById('ring_design').textContent = ring.design || '-';
        document.getElementById('ring_size').textContent = ring.size || '-';
        document.getElementById('ring_hardware').textContent = ring.hardware_type || '-';
        document.getElementById('ring_firmware').textContent = ring.firmware_version || '-';
    }

    // Sleep Recommendation
    if (user.sleep_time_recommendation) {
        document.getElementById('sleep_recommendation').textContent = user.sleep_time_recommendation.recommendation || '-';
        document.getElementById('sleep_status').textContent = user.sleep_time_recommendation.status || '-';
    }

    // Enhanced Tags
    if (user.enhanced_tags && Array.isArray(user.enhanced_tags)) {
        const tagsContainer = document.getElementById('enhanced_tags');
        if (user.enhanced_tags.length === 0) {
            tagsContainer.textContent = 'No tags';
        } else {
            tagsContainer.innerHTML = user.enhanced_tags.map(tag => {
                const name = tag.custom_name || tag.comment || 'Untitled';
                const time = tag.start_time ? formatDateTime(tag.start_time) : '';
                return `<div class="tag">${name}${time ? ` (${time})` : ''}</div>`;
            }).join('');
        }
    }
}

// Function to balance card heights in the grid
function balanceCardHeights() {
    const dashboard = document.querySelector('.dashboard');
    if (!dashboard) return;
    
    const cards = Array.from(dashboard.querySelectorAll('.card:not(.hide)'));
    if (cards.length === 0) return;
    
    // Reset any existing row spans and height constraints
    cards.forEach(card => {
        card.style.gridRow = '';
        const originalHeight = card.style.height;
        const originalMinHeight = card.style.minHeight;
        card.style.height = 'auto';
        card.style.minHeight = 'auto';
    });
    
    // Force a reflow to get accurate measurements
    void dashboard.offsetHeight;
    
    // Calculate content heights
    const cardData = cards.map(card => {
        const height = card.getBoundingClientRect().height;
        // Count number of metrics and contributors to estimate content density
        const metrics = card.querySelectorAll('.metric').length;
        const contributors = card.querySelectorAll('.contributor').length;
        const hasScore = card.querySelector('.score-large') !== null;
        const contentScore = metrics * 2 + contributors * 3 + (hasScore ? 5 : 0);
        
        return { card, height, contentScore };
    });
    
    // Calculate average height
    const avgHeight = cardData.reduce((sum, item) => sum + item.height, 0) / cardData.length;
    const maxHeight = Math.max(...cardData.map(item => item.height));
    
    // Allow cards that are significantly taller to span 2 rows
    // This redistributes vertical space more evenly
    cardData.forEach(item => {
        if (item.height > avgHeight * 1.3 && item.height > maxHeight * 0.6) {
            item.card.style.gridRow = 'span 2';
        }
    });
    
    // Restore height constraints
    cards.forEach(card => {
        card.style.height = '100%';
    });
}

// Motion detection variables
let video = null;
let canvas = null;
let ctx = null;
let lastFrame = null;
let backgroundFrame = null;
let frameCount = 0;
let motionDetectionActive = false;
let lastMotionTime = null;
let noMotionTimeout = null;
const NO_MOTION_TIMEOUT = 3 * 60 * 1000; // 3 minutes in milliseconds
const MOTION_THRESHOLD = 8; // Sensitivity threshold for motion detection (much less sensitive)
const MOTION_SAMPLES = 30; // Number of consecutive frames with motion required (reduces false positives significantly)
const BACKGROUND_LEARNING_RATE = 0.005; // How quickly background adapts (very slow - less sensitive)
const MOTION_COOLDOWN = 5000; // Milliseconds to wait after motion before allowing new detection
const MIN_MOTION_AREA = 0.05; // Minimum percentage of frame that must change (5%)
let motionSampleCount = 0;
let lastMotionTriggerTime = 0;
let isDashboardVisible = false;
let isLoading = false;

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
                console.log('Video started playing, starting motion detection');
                // Wait a bit for the first frame to be available
                setTimeout(() => {
                    startMotionDetection();
                }, 500);
            }).catch(err => {
                console.error('Error playing video:', err);
            });
        });
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        // If camera fails, still allow manual trigger (for testing)
    }
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
        
        // Initialize background frame on first frame
        if (!backgroundFrame) {
            backgroundFrame = ctx.createImageData(canvas.width, canvas.height);
            const bgData = backgroundFrame.data;
            const curData = currentFrame.data;
            for (let i = 0; i < curData.length; i++) {
                bgData[i] = curData[i];
            }
            console.log('Background frame initialized, waiting for motion...');
            lastFrame = currentFrame;
            requestAnimationFrame(detectMotion);
            return;
        }
        
        // Update background frame very slowly (running average)
        // This allows the background to adapt to lighting changes while detecting motion
        // Only update background when dashboard is hidden AND no recent motion was detected
        const timeSinceLastMotion = Date.now() - lastMotionTriggerTime;
        // Wait 10 seconds after motion before updating background, and only update every 10th frame
        if (!isDashboardVisible && timeSinceLastMotion > 10000 && frameCount % 10 === 0) {
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
            console.log('Current motion:', motion.toFixed(2), 'Threshold:', MOTION_THRESHOLD, 'Samples:', motionSampleCount, 'Dashboard visible:', isDashboardVisible, 'Loading:', isLoading);
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
                lastMotionTime = now;
                lastMotionTriggerTime = now; // Set cooldown timer
                motionSampleCount = 0; // Reset counter
                
                // Reset background frame to current frame to prevent false positives
                const bgData = backgroundFrame.data;
                const curData = currentFrame.data;
                for (let i = 0; i < curData.length; i++) {
                    bgData[i] = curData[i];
                }
                console.log('Background reset after motion detection');
                
                // Clear any existing timeout
                if (noMotionTimeout) {
                    clearTimeout(noMotionTimeout);
                    noMotionTimeout = null;
                }
                
                // If dashboard is visible, reset the timer (motion keeps it alive)
                if (isDashboardVisible) {
                    // Set new timeout for 3 minutes from now
                    noMotionTimeout = setTimeout(() => {
                        fadeToBlack();
                        lastMotionTime = null;
                        noMotionTimeout = null;
                    }, NO_MOTION_TIMEOUT);
                }
                
                // If dashboard is not visible and not loading, trigger load
                if (!isDashboardVisible && !isLoading) {
                    console.log('Calling triggerDashboardLoad()');
                    triggerDashboardLoad();
                }
            }
        } else {
            // No motion detected or in cooldown - reset sample count
            if (!inCooldown) {
                motionSampleCount = 0;
            }
            // No motion detected - timeout is already set when motion was last detected
            // No need to check here, the timeout will handle fading to black
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
        
        // Count significant changes (pixels that changed by more than 30 in any channel - much higher threshold)
        if (rDiff > 30 || gDiff > 30 || bDiff > 30) {
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

// Trigger dashboard load on motion
async function triggerDashboardLoad() {
    if (isLoading) return;
    isLoading = true;
    
    const startTime = Date.now();
    const minLoadingTime = 3000; // 3 seconds minimum
    
    showLoading();
    const data = await loadData();
    if (data) {
        populateDashboard(data);
        // Balance card heights after content is loaded
        setTimeout(balanceCardHeights, 100);
        // Rebalance on window resize
        window.addEventListener('resize', () => {
            setTimeout(balanceCardHeights, 100);
        });
    } else {
        console.error('Failed to load data');
    }
    
    // Ensure loading animation shows for at least 3 seconds
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
    setTimeout(() => {
        hideLoading();
        isLoading = false;
        isDashboardVisible = true;
        lastMotionTime = Date.now(); // Reset motion timer when dashboard appears
        // Set initial timeout for 3 minutes of no motion
        noMotionTimeout = setTimeout(() => {
            fadeToBlack();
            lastMotionTime = null;
            noMotionTimeout = null;
        }, NO_MOTION_TIMEOUT);
    }, remainingTime);
}

// Fade to black after no motion
function fadeToBlack() {
    if (!isDashboardVisible) return;
    
    // Clear any existing timeout
    if (noMotionTimeout) {
        clearTimeout(noMotionTimeout);
        noMotionTimeout = null;
    }
    
    // Hide dashboard with fade
    document.body.classList.add('black-screen');
    isDashboardVisible = false;
    lastMotionTime = null;
}

// Main function to initialize the dashboard (now called on motion)
async function init() {
    // Start with black screen
    document.body.classList.add('black-screen');
    isDashboardVisible = false;
    
    // Request camera permission immediately
    await initCamera();
}

// Loading animation functions
function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('hide');
    }
    // Hide dashboard content during loading
    document.body.classList.add('loading');
    // Play scanning sound
    const scanAudio = document.getElementById('scanAudio');
    if (scanAudio) {
        scanAudio.currentTime = 0;
        scanAudio.play().catch(err => {
            console.log('Audio play failed:', err);
        });
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('hide');
    }
    // Let audio continue playing until it ends naturally
    const scanAudio = document.getElementById('scanAudio');
    if (scanAudio) {
        scanAudio.loop = false; // Disable looping so it plays once to the end
    }
    // Show dashboard content after loading
    document.body.classList.remove('loading');
    document.body.classList.remove('black-screen'); // Remove black screen
    // Animate cards one by one
    animateCards();
}

function animateCards() {
    const cards = document.querySelectorAll('.card:not(.hide)');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('card-visible');
            // Animate text in this card
            animateCardText(card);
        }, index * 100); // 100ms delay between each card
    });
}

function animateCardText(card) {
    const textElements = card.querySelectorAll(
        '.metric-value, .metric-label, .card-title, .score-large, .contributor-label, .contributor-score, .time-display, .status-badge'
    );
    
    textElements.forEach((element, elementIndex) => {
        const text = element.textContent;
        if (!text || text === '-') return;
        
        // Wrap each character in a span
        const chars = text.split('');
        element.innerHTML = '';
        chars.forEach((char, charIndex) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.opacity = '0';
            span.style.display = 'inline-block';
            element.appendChild(span);
            
            // Animate character appearance very rapidly
            setTimeout(() => {
                span.style.transition = 'opacity 0.05s ease';
                span.style.opacity = '1';
            }, (elementIndex * 20) + (charIndex * 5)); // Very fast: 5ms per character
        });
    });
}

// Initialize when page loads
init();

