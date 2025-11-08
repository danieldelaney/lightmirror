// Motion detection state
let lastMotionTime = null;
let noMotionTimeout = null;
const NO_MOTION_TIMEOUT = 3 * 60 * 1000; // 3 minutes in milliseconds
let isDashboardVisible = false;
let isLoading = false;

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
    
    // Initialize motion detection with callbacks
    await initMotionDetection({
        onMotionDetected: triggerDashboardLoad,
        onMotionWhileVisible: (now) => {
            lastMotionTime = now;
            // Clear any existing timeout
            if (noMotionTimeout) {
                clearTimeout(noMotionTimeout);
                noMotionTimeout = null;
            }
            // Set new timeout for 3 minutes from now
            noMotionTimeout = setTimeout(() => {
                fadeToBlack();
                lastMotionTime = null;
                noMotionTimeout = null;
            }, NO_MOTION_TIMEOUT);
        },
        getDashboardState: () => ({
            isVisible: isDashboardVisible,
            isLoading: isLoading
        })
    });
}


// Initialize when page loads
init();

