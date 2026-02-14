# 🌤️ Clim8 - Modern Weather Application

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](https://www.docker.com/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue)](https://github.com/features/actions)

A professional, feature-rich weather application with real-time data, beautiful icons, and full responsive design. Built with vanilla JavaScript and powered by [WeatherAPI.com](https://weatherapi.com).

![Weather App Screenshot](./docs/screenshot.png)

## ✨ Features

### 🎨 User Experience

- **Real Weather Icons** - Dynamic icons that change based on conditions and time of day
- **Comprehensive Data** - 10+ data points including wind, humidity, pressure, UV index, and more
- **Sunrise & Sunset** - Astro data with moon phases
- **Responsive Design** - Perfect on desktop, tablet, and mobile devices
- **Geolocation** - Automatic weather detection for your current location
- **Search** - Find weather for any city worldwide

### 🔍 Technical Excellence

- **SEO Optimized** - Semantic HTML5 with descriptive headings
- **Accessible** - WCAG 2.1 Level AA compliant
- **Fast Performance** - Single API call, lazy loading, optimized assets
- **Modern Architecture** - Modular ES6 code, component-based design
- **Production Ready** - Docker support, CI/CD pipeline, nginx configuration

### 📊 Weather Information

**Current Weather:**

- Temperature with "feels like"
- Weather condition with icon
- Wind speed and direction
- Humidity percentage
- Atmospheric pressure
- Visibility distance
- UV index
- Precipitation (if any)

**Today's Forecast:**

- Temperature range (min/max)
- Weather condition with icon
- Maximum wind speed
- Average humidity
- Rain/snow probability
- UV index
- Sunrise and sunset times
- Moon phase and illumination

**3-Day Forecast:**

- Daily weather icons
- Average temperature
- Temperature range
- Weather conditions
- Rain probability
- Wind speed
- Humidity levels

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- WeatherAPI.com API key ([Get free API key](https://www.weatherapi.com/signup.aspx))

### Installation

1. **Clone the repository**

   ```bash
   git clone hhttps://github.com/mohamedfares186/weather-app.git
   cd weather-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your API key:

   ```env
   WEATHER_API_KEY=your_api_key_here
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

The easiest way to run the application with nginx reverse proxy:

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

Access the application at `http://localhost`

### Using Docker Only

```bash
# Build the image
docker build -t weather-app .

# Run the container
docker run -d \
  -p 3000:3000 \
  -e WEATHER_API_KEY=your_api_key
```

## 📁 Project Structure

```
clim8-weather/
├── src/
│   ├── controllers/           # API endpoint controllers
│   │   └── unifiedWeatherController.mjs
│   ├── middleware/            # Express middleware
│   │   └── logger.mjs
│   ├── routes/                # API routes
│   │   └── weather.routes.mjs
│   └── main.mjs              # Express server entry point
│
├── public/
│   ├── index.html            # Main HTML file
│   ├── 404.html              # 404 Error Page
│   ├── 500.html              # 500 Error Page
│   ├── css/
│   │   └── style.css         # Responsive styles
│   ├── js/
│   │   └── main.js           # Application entry point
│   │
│   └── img/
│       ├── favicon.svg
│       └── search-icon.svg
│
├── docker/
│   ├── Dockerfile            # Multi-stage production build
│   ├── docker-compose.yml    # Full stack orchestration
│   └── nginx.conf            # Nginx configuration
│
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions CI/CD
│
├── .env.example              # Environment template
├── package.json              # Dependencies
└── README.md                 # This file
```

## 🛠️ Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Start production server
npm start

# Build Docker image
npm run docker:build

# Start Docker Compose stack
npm run docker:up
```

### Environment Variables

| Variable          | Description                          | Default     | Required |
| ----------------- | ------------------------------------ | ----------- | -------- |
| `WEATHER_API_KEY` | WeatherAPI.com API key               | -           | ✅ Yes   |
| `PORT`            | Server port                          | 3000        | No       |
| `NODE_ENV`        | Environment (development/production) | development | No       |

## 🏗️ Architecture

### Backend (Node.js/Express)

- **Single API Endpoint:** `/api/weather`
- **Unified Controller:** Handles all weather data in one request
- **Efficient:** Reduced from 3 API calls to 1
- **Error Handling:** Comprehensive error management and logging

### Frontend (Vanilla JavaScript)

- **Modular Design:** Separated concerns (API, Components, Utils)
- **Component-Based:** Reusable UI components
- **Responsive:** Mobile-first CSS with Grid and Flexbox

### Key Design Decisions

1. **Single API Call**
   - Consolidated multiple endpoints into one
   - Reduces latency and API quota usage
   - Simplifies error handling

2. **Component Architecture**
   - Reusable `WeatherCard` components
   - Separation of data fetching and rendering
   - Easy to test and maintain

3. **Semantic HTML**
   - Proper heading hierarchy
   - ARIA labels for accessibility
   - SEO-friendly structure

## 📱 Responsive Design

### Breakpoints

- **Desktop:** 1200px+ (2-column layout, full details)
- **Laptop:** 992px+ (optimized layout)
- **Tablet:** 768px (adaptive columns)
- **Mobile:** 480px (stacked, centered)
- **Small:** 360px (compact design)

### Touch-Friendly

- Minimum 44px touch targets
- Large, readable fonts
- Optimized spacing
- Easy navigation

## 🔒 Security

- Environment variables for sensitive data
- HTTPS support via nginx
- Input validation
- CORS configuration

## 🚀 CI/CD

Automated deployment with GitHub Actions:

- **On Push to Main:** Build Docker image

## 📊 API Usage

### WeatherAPI.com

**Free Tier Limits:**

- 3 days forecast (today + 2 future days)
- 1 million calls/month
- Real-time weather data
- Astro data included

**Upgrade Benefits:**

- Up to 14 days forecast
- Higher rate limits
- Historical data
- Advanced features

## 🎨 Customization

### Change Theme Colors

Edit CSS variables in `public/css/style.css`:

```css
:root {
  --text-primary: #222;
  --bg-card: #ffffff;
  --accent-color: #3b82f6;
  --border-color: #d1d5db;
}
```

### Modify Breakpoints

Update media queries in `style.css`:

```css
@media (max-width: 768px) {
  /* Your custom tablet styles */
}
```

### Add Weather Data

Enhance `WeatherCard.js` components:

```javascript
// Add new detail row
detailsContainer.appendChild(
  createDetailRow("🌊", "Dew Point", `${current.dewpoint_c}°C`),
);
```

## 📈 Performance

### Optimizations

- Lazy loading images
- CSS Grid for layouts (no JS calculations)
- Hardware-accelerated transitions
- Minimal dependencies
- CDN-hosted weather icons

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use ESLint configuration
- Write semantic commit messages
- Add tests for new features
- Update documentation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **WeatherAPI.com** - Weather data provider
- **Montserrat Font** - Google Fonts
- **Icons** - Weather icons from WeatherAPI CDN
- **Inspiration** - Modern weather app design trends

## 📞 Support

- **Documentation:** [GitHub Wiki](https://github.com/yourusername/clim8-weather/wiki)
- **Issues:** [GitHub Issues](https://github.com/yourusername/clim8-weather/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/clim8-weather/discussions)

## 🗺️ Roadmap

### Version 2.0 (Planned)

- [ ] Hourly forecast (24-48 hours)
- [ ] Weather alerts and warnings
- [ ] Historical weather data
- [ ] Weather radar/maps
- [ ] Multiple location bookmarks
- [ ] Dark mode theme
- [ ] PWA support (offline mode)
- [ ] Multi-language support

### Version 1.5 (In Progress)

- [ ] Unit and integration tests
- [ ] Performance monitoring
- [ ] Analytics integration
- [ ] Advanced error tracking

### Version 1.0 (Current)

- [x] Real-time weather data
- [x] 3-day forecast
- [x] Geolocation support
- [x] Responsive design
- [x] Docker deployment
- [x] CI/CD pipeline

## 💡 Tips

### Getting Started

1. Start with the free WeatherAPI tier (3 days)
2. Test locally before deploying
3. Use Docker Compose for production
4. Enable HTTPS in production
5. Monitor API usage to stay within limits

### Production Deployment

1. Use environment variables for secrets
2. Enable nginx caching
3. Set up monitoring and logging
4. Configure backup and recovery

---

**Made with ❤️ by [Mohamed Fares](https://github.com/mohamedfares186)**

**Star ⭐ this repository if you find it helpful!**
