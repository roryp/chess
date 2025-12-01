// High Energy Weather JavaScript

const API_KEY = 'YOUR_API_KEY';
const CITY = 'Cape Town,ZA';
const API_BASE = 'https://api.openweathermap.org/data/2.5';

// Check if API key is set
if (API_KEY === 'YOUR_API_KEY') {
    document.getElementById('api-note').style.display = 'block';
    document.getElementById('loading').innerHTML = '<p>⚠️ Please add your OpenWeatherMap API key! ⚠️</p>';
}

// High Energy Effects
document.addEventListener('DOMContentLoaded', function() {
    createMouseTrail();
    addSparkleClick();
    animateOnScroll();
    
    // Fetch weather if API key is set
    if (API_KEY !== 'YOUR_API_KEY') {
        fetchWeather();
    }
});

// Mouse Trail Effect
function createMouseTrail() {
    const trail = [];
    const trailLength = 15;
    
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.style.cssText = `
            position: fixed;
            width: ${10 - i * 0.5}px;
            height: ${10 - i * 0.5}px;
            border-radius: 50%;
            background: hsl(${i * 20}, 100%, 50%);
            pointer-events: none;
            z-index: 9999;
            opacity: ${1 - i / trailLength};
            transition: transform 0.1s ease;
            box-shadow: 0 0 ${5 + i}px hsl(${i * 20}, 100%, 50%);
        `;
        document.body.appendChild(dot);
        trail.push(dot);
    }
    
    let mouseX = 0;
    let mouseY = 0;
    let trailX = Array(trailLength).fill(0);
    let trailY = Array(trailLength).fill(0);
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateTrail() {
        trailX[0] = mouseX;
        trailY[0] = mouseY;
        
        for (let i = trailLength - 1; i > 0; i--) {
            trailX[i] = trailX[i - 1];
            trailY[i] = trailY[i - 1];
        }
        
        trail.forEach((dot, i) => {
            dot.style.transform = `translate(${trailX[i] - 5}px, ${trailY[i] - 5}px)`;
        });
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
}

// Sparkle Click Effect
function addSparkleClick() {
    document.addEventListener('click', function(e) {
        if (Math.random() > 0.7) {
            for (let i = 0; i < 5; i++) {
                const miniSparkle = document.createElement('span');
                miniSparkle.textContent = '✨';
                const x = e.clientX || e.touches?.[0]?.clientX || 0;
                const y = e.clientY || e.touches?.[0]?.clientY || 0;
                miniSparkle.style.cssText = `
                    position: fixed;
                    left: ${x}px;
                    top: ${y}px;
                    font-size: 1.5rem;
                    pointer-events: none;
                    z-index: 10000;
                    animation: sparkleBurst 1s ease-out forwards;
                `;
                
                const angle = (Math.PI * 2 * i) / 5;
                const distance = 50 + Math.random() * 30;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                
                miniSparkle.style.setProperty('--x', `${x}px`);
                miniSparkle.style.setProperty('--y', `${y}px`);
                
                document.body.appendChild(miniSparkle);
                setTimeout(() => miniSparkle.remove(), 1000);
            }
        }
    });
}

// Add sparkle burst animation
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkleBurst {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--x), var(--y)) scale(0);
            opacity: 0;
        }
    }
    
    .loading-spinner {
        width: 60px;
        height: 60px;
        border: 5px solid rgba(255, 0, 255, 0.3);
        border-top-color: #ff00ff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 20px;
        box-shadow: 0 0 20px #ff00ff;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Animate on Scroll
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideIn 0.8s ease-out forwards';
                entry.target.style.opacity = '1';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });
}

// Add random color shifts to weather cards
setInterval(() => {
    const cards = document.querySelectorAll('.weather-card, .forecast-card');
    cards.forEach(card => {
        const colors = ['#ff00ff', '#00ffff', '#39ff14', '#ffff00', '#bf00ff', '#ff6600'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        if (Math.random() > 0.8) {
            card.style.borderColor = randomColor;
            card.style.boxShadow = `0 0 20px ${randomColor}, inset 0 0 20px ${randomColor}40`;
        }
    });
}, 3000);

// Weather Fetching Functions
async function fetchWeather() {
    try {
        // Fetch current weather
        const currentResponse = await fetch(
            `${API_BASE}/weather?q=${CITY}&appid=${API_KEY}&units=metric`
        );

        if (!currentResponse.ok) {
            throw new Error(`Weather API error: ${currentResponse.status}`);
        }

        const currentData = await currentResponse.json();

        // Fetch 5-day forecast
        const forecastResponse = await fetch(
            `${API_BASE}/forecast?q=${CITY}&appid=${API_KEY}&units=metric`
        );

        if (!forecastResponse.ok) {
            throw new Error(`Forecast API error: ${forecastResponse.status}`);
        }

        const forecastData = await forecastResponse.json();

        // Display current weather with high energy effects
        displayCurrentWeather(currentData);
        
        // Display forecast with animations
        displayForecast(forecastData);

        document.getElementById('loading').style.display = 'none';
        document.getElementById('weather-content').style.display = 'grid';
        
        // Add entrance animation
        addWeatherEntranceEffects();
        
    } catch (error) {
        document.getElementById('loading').style.display = 'none';
        const errorDiv = document.getElementById('error');
        errorDiv.style.display = 'block';
        
        if (error.message.includes('401') || error.message.includes('Invalid')) {
            errorDiv.innerHTML = `
                <h2>🔑 API KEY ERROR 🔑</h2>
                <p>Please add a valid OpenWeatherMap API key!</p>
                <p><a href="https://openweathermap.org/api" target="_blank" style="color: #00ffff;">Get a free API key here 🚀</a></p>
            `;
        } else if (error.message.includes('404')) {
            errorDiv.innerHTML = '<h2>❌ City not found! ❌</h2>';
        } else {
            errorDiv.innerHTML = `<h2>⚡ ERROR ⚡</h2><p>${error.message}</p>`;
        }
    }
}

function displayCurrentWeather(data) {
    const temp = Math.round(data.main.temp);
    const tempEl = document.getElementById('temperature');
    tempEl.textContent = `${temp}°C`;
    
    // Animate temperature with glow effect
    tempEl.style.textShadow = `0 0 20px #ff00ff, 0 0 40px #ff00ff`;
    setTimeout(() => {
        tempEl.style.textShadow = `0 0 10px #00ffff, 0 0 20px #00ffff`;
    }, 500);
    
    document.getElementById('description').textContent = data.weather[0].description.toUpperCase();
    document.getElementById('wind').textContent = data.wind.speed;
    document.getElementById('humidity').textContent = data.main.humidity;
    document.getElementById('feels-like').textContent = Math.round(data.main.feels_like);
    
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    const iconEl = document.getElementById('weather-icon');
    iconEl.src = iconUrl;
    iconEl.style.filter = 'drop-shadow(0 0 15px #ffff00)';
}

function displayForecast(data) {
    const forecastGrid = document.getElementById('forecast-grid');
    forecastGrid.innerHTML = '';

    // Group forecasts by date and get one forecast per day
    const dailyForecasts = {};
    
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toDateString();
        
        // Store the forecast closest to midday (12:00) for each day
        if (!dailyForecasts[dateKey] || Math.abs(date.getHours() - 12) < Math.abs(new Date(dailyForecasts[dateKey].dt * 1000).getHours() - 12)) {
            dailyForecasts[dateKey] = item;
        }
    });

    // Get the first 5 days
    const forecastDays = Object.values(dailyForecasts).slice(0, 5);

    forecastDays.forEach((item, index) => {
        const date = new Date(item.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item neon-item';
        forecastItem.style.animationDelay = `${index * 0.1}s`;
        forecastItem.innerHTML = `
            <div class="forecast-date">${dayName}<br>${monthDay}</div>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" 
                 alt="${item.weather[0].description}" 
                 class="forecast-icon">
            <div class="forecast-temp">${Math.round(item.main.temp)}°C</div>
            <div class="forecast-description">${item.weather[0].description}</div>
        `;
        forecastGrid.appendChild(forecastItem);
    });
}

function addWeatherEntranceEffects() {
    // Add pulse effect to temperature
    setInterval(() => {
        const tempEl = document.getElementById('temperature');
        if (tempEl) {
            tempEl.style.animation = 'none';
            setTimeout(() => {
                tempEl.style.animation = 'pulse 1s ease-in-out';
            }, 10);
        }
    }, 3000);
    
    // Random sparkles on forecast items
    document.querySelectorAll('.forecast-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(2deg)';
            this.style.boxShadow = '0 0 30px #ff00ff';
        });
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.boxShadow = '';
        });
    });
}
