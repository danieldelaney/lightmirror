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

// Main function to initialize the dashboard
async function init() {
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
}

// Initialize when page loads
init();

