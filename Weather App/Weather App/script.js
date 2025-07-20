const API_KEY = '416cfc87eb98419fb9f180705252007';
const BASE_URL = 'https://api.weatherapi.com/v1/forecast.json';

const elements = {
  searchInput: document.getElementById('search-input'),
  searchBtn: document.getElementById('search-btn'),
  locationLabel: document.getElementById('location-label'),
  dateToday: document.getElementById('date-today'),
  currentTemp: document.getElementById('current-temp'),
  weatherIcon: document.getElementById('weather-icon'),
  weatherCondition: document.getElementById('weather-condition'),
  highTemp: document.getElementById('high-temp'),
  lowTemp: document.getElementById('low-temp'),
  precipChance: document.getElementById('precip-chance'),
  humidity: document.getElementById('humidity'),
  wind: document.getElementById('wind'),
  uv: document.getElementById('uv'),
  airQualityValue: document.getElementById('air-quality-value'),
  aqi: document.getElementById('aqi'),
  sunrise: document.getElementById('sunrise'),
  sunset: document.getElementById('sunset'),
  precipAmount: document.getElementById('precip-amount'),
  feelsLike: document.getElementById('feels-like'),
  hourlyList: document.getElementById('hourly-list'),
  dailyList: document.getElementById('daily-list'),
  themeToggle: document.getElementById('toggle-theme'),
  themeLabel: document.getElementById('theme-label'),
  background: document.getElementById('background-animation'),
  body: document.body
};

let currentCity = 'New York';
let currentCountry = 'USA';

function setLoading(isLoading) {
  if (isLoading) {
    elements.body.classList.add('loading');
  } else {
    elements.body.classList.remove('loading');
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

function getWeatherBgClass(condition) {
  const c = condition.toLowerCase();
  if (c.includes('thunder')) return 'bg-thunder';
  if (c.includes('snow') || c.includes('blizzard') || c.includes('sleet')) return 'bg-snow';
  if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return 'bg-rain';
  if (c.includes('cloud')) return 'bg-cloudy';
  if (c.includes('clear') || c.includes('sunny')) return 'bg-clear';
  return 'bg-clear';
}

async function fetchWeather(city) {
  setLoading(true);
  try {
    const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(city)}&days=7&aqi=yes&alerts=no`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('City not found');
    const data = await res.json();
    updateUI(data);
  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(false);
  }
}

function updateUI(data) {
  // Location
  elements.locationLabel.textContent = `${data.location.name}, ${data.location.country}`;
  currentCity = data.location.name;
  currentCountry = data.location.country;

  // Date
  const now = new Date(data.location.localtime);
  elements.dateToday.textContent = `Today • ${formatDate(now)}`;

  // Current Weather
  const current = data.current;
  elements.currentTemp.textContent = `${Math.round(current.temp_c)}°C`;
  elements.weatherIcon.src = `https:${current.condition.icon}`;
  elements.weatherIcon.alt = current.condition.text;
  elements.weatherCondition.textContent = current.condition.text;
  elements.highTemp.textContent = `${Math.round(data.forecast.forecastday[0].day.maxtemp_c)}°C`;
  elements.lowTemp.textContent = `${Math.round(data.forecast.forecastday[0].day.mintemp_c)}°C`;
  elements.precipChance.textContent = `${data.forecast.forecastday[0].day.daily_chance_of_rain}%`;
  elements.humidity.textContent = `${current.humidity}%`;
  elements.wind.textContent = `${Math.round(current.wind_kph)} km/h`;
  elements.uv.textContent = current.uv;
  elements.feelsLike.textContent = `${Math.round(current.feelslike_c)}°C`;

  // Air Quality
  if (current.air_quality && current.air_quality['us-epa-index']) {
    const aqi = current.air_quality['us-epa-index'];
    let aqiText = 'Good';
    if (aqi === 2) aqiText = 'Moderate';
    else if (aqi === 3) aqiText = 'Unhealthy for Sensitive';
    else if (aqi === 4) aqiText = 'Unhealthy';
    else if (aqi === 5) aqiText = 'Very Unhealthy';
    else if (aqi === 6) aqiText = 'Hazardous';
    elements.airQualityValue.textContent = aqiText;
    elements.aqi.textContent = `AQI: ${Math.round(current.air_quality.pm2_5)}`;
  } else {
    elements.airQualityValue.textContent = 'N/A';
    elements.aqi.textContent = '';
  }

  // Sunrise/Sunset
  const astro = data.forecast.forecastday[0].astro;
  elements.sunrise.textContent = astro.sunrise;
  elements.sunset.textContent = astro.sunset;

  // Precipitation
  elements.precipAmount.textContent = `${data.forecast.forecastday[0].day.totalprecip_mm} mm`;

  // Hourly Forecast (next 8 hours)
  const hours = data.forecast.forecastday[0].hour;
  const nowHour = now.getHours();
  let hourlyHtml = '';
  for (let i = 0; i < 8; i++) {
    const h = hours[(nowHour + i) % 24];
    hourlyHtml += `
      <div class="hour-card">
        <div>${h.time.split(' ')[1].slice(0,5)}</div>
        <img src="https:${h.condition.icon}" alt="${h.condition.text}" width="36" height="36">
        <div>${Math.round(h.temp_c)}°C</div>
      </div>
    `;
  }
  elements.hourlyList.innerHTML = hourlyHtml;

  // 7-Day Forecast
  let dailyHtml = '';
  for (let i = 0; i < data.forecast.forecastday.length; i++) {
    const d = data.forecast.forecastday[i];
    dailyHtml += `
      <div class="day-card">
        <div>${formatDate(d.date).split(',')[0]}</div>
        <img src="https:${d.day.condition.icon}" alt="${d.day.condition.text}" width="38" height="38">
        <div>${Math.round(d.day.maxtemp_c)}°C / ${Math.round(d.day.mintemp_c)}°C</div>
        <div style="font-size:0.95em;color:var(--text-secondary)">${d.day.condition.text}</div>
      </div>
    `;
  }
  elements.dailyList.innerHTML = dailyHtml;

  // Animated Weather Background
  const bgClass = getWeatherBgClass(current.condition.text);
  elements.background.className = '';
  elements.background.classList.add(bgClass);
}

function showError(msg) {
  elements.locationLabel.textContent = msg;
  elements.currentTemp.textContent = '--';
  elements.weatherIcon.src = '';
  elements.weatherCondition.textContent = '';
  elements.highTemp.textContent = '--';
  elements.lowTemp.textContent = '--';
  elements.precipChance.textContent = '--';
  elements.humidity.textContent = '--';
  elements.wind.textContent = '--';
  elements.uv.textContent = '--';
  elements.feelsLike.textContent = '--';
  elements.airQualityValue.textContent = '--';
  elements.aqi.textContent = '';
  elements.sunrise.textContent = '--';
  elements.sunset.textContent = '--';
  elements.precipAmount.textContent = '--';
  elements.hourlyList.innerHTML = '';
  elements.dailyList.innerHTML = '';
  elements.background.className = 'bg-clear';
}

// Theme Toggle
function setTheme(isDark) {
  if (isDark) {
    elements.body.classList.add('dark');
    elements.themeLabel.textContent = '☀️ Light Mode';
  } else {
    elements.body.classList.remove('dark');
    elements.themeLabel.textContent = '🌙 Dark Mode';
  }
}

elements.themeToggle.addEventListener('change', (e) => {
  setTheme(e.target.checked);
  // Animate background transition
  elements.background.style.transition = 'background 0.7s cubic-bezier(.4,2,.3,1)';
});

// Search
function handleSearch() {
  const city = elements.searchInput.value.trim();
  if (city) fetchWeather(city);
}
elements.searchBtn.addEventListener('click', handleSearch);
elements.searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSearch();
});

document.addEventListener('DOMContentLoaded', () => {
  // Load theme from localStorage
  const isDark = localStorage.getItem('theme') === 'dark';
  elements.themeToggle.checked = isDark;
  setTheme(isDark);

  // Save theme on toggle
  elements.themeToggle.addEventListener('change', (e) => {
    localStorage.setItem('theme', e.target.checked ? 'dark' : 'light');
  });

  // Initial fetch
  fetchWeather(currentCity);
}); 