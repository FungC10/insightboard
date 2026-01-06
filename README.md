# 🚀 InsightBoard

A modern, professional-grade cryptocurrency market dashboard built with Next.js 14, featuring real-time data, interactive charts, and comprehensive market analytics.

![InsightBoard Dashboard](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)

## ✨ Features

- **📊 Local Fake Data** - Uses locally generated fake cryptocurrency data (no API required)
- **📈 Interactive Charts** - Beautiful price charts with Recharts integration
- **🎨 Modern UI/UX** - Responsive design with Tailwind CSS and custom animations
- **⚡ Fast Performance** - Built with Next.js 14 App Router for optimal speed
- **🔒 Type Safety** - Full TypeScript implementation with Zod validation
- **📱 Mobile Responsive** - Works perfectly on all device sizes
- **🎯 Professional Design** - Clean, modern interface inspired by financial dashboards

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts
- **Validation**: Zod
- **Data**: Local fake data (no external API)
- **Deployment**: Vercel Ready

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- **No API key required** - The app uses locally generated fake data

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/pazu/insightboard.git
   cd insightboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
insightboard/
├── app/                    # Next.js 14 App Router
│   ├── (app)/             # Route group for app pages
│   │   └── dashboard/     # Dashboard page
│   ├── about/             # About page
│   ├── api/               # API routes
│   │   └── coins/         # Coins API endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── providers.tsx      # React Query provider
├── components/            # Reusable components
│   ├── charts/            # Chart components
│   ├── layout/            # Layout components
│   └── ui/                # UI components
├── lib/                   # Utility libraries
│   ├── constants.ts       # App constants
│   ├── fakeData.ts        # Local fake data generator
│   ├── fetcher.ts         # Data fetching logic (legacy)
│   ├── types.ts           # TypeScript types
│   ├── useCoins.ts        # React Query hook
│   └── zod.ts             # Zod schemas
└── docs/                  # Documentation
    └── architecture.md    # Architecture documentation
```

## 🔧 Configuration

### Data Source

**The app uses a mocked API layer backed by deterministic fake data.** No API configuration or API keys are required.

The fake data includes:

- **Bitcoin (BTC)** - Sample price data with realistic variations
- **Ethereum (ETH)** - Sample price data with realistic variations
- **Cardano (ADA)** - Sample price data with realistic variations

All data is generated locally using deterministic algorithms that create realistic price history with natural variations. The data flows through the `/api/coins` endpoint, providing a production-shaped architecture with demo-safe data. This ensures:

- **Stable demos** - Reproducible results every time
- **Reproducible charts** - Consistent data for testing
- **No external dependencies** - Works completely offline

## 📊 Data Structure

The app uses the `/api/coins` endpoint as the single source of data. All data access flows through this API boundary, which is backed by deterministic fake data.

**API Endpoint:**

```
GET /api/coins?ids=bitcoin,ethereum
```

**Response Format:**

```json
{
  "coins": [
    {
      "id": "bitcoin",
      "symbol": "BTC",
      "name": "Bitcoin",
      "currentPrice": 43250.5,
      "priceChange24h": 2.34,
      "marketCap": 850000000000,
      "totalVolume": 25000000000,
      "history": [
        {
          "timestamp": 1760877651757,
          "price": 44115.51
        }
      ]
    }
  ]
}
```

**Architecture:**

- All data flows through `/api/coins` endpoint
- Fake data generation lives in `lib/fakeData.ts`
- React Query hooks fetch via HTTP (`fetch('/api/coins?...')`)
- Clean swap path to real backend later
- Production-shaped architecture with demo-safe data

## 🎨 UI Components

### Available Components

- **Header** - Responsive navigation with scroll effects
- **Footer** - Brand information and links
- **StatCard** - Display statistics with trend indicators
- **Card** - Reusable card container
- **Badge** - Status and category indicators
- **PriceLine** - Interactive price charts
- **Button** - Styled button variants

### Styling

The project uses Tailwind CSS with custom animations and effects:

- Custom CSS animations (`fadeInUp`, `slideInRight`, etc.)
- Glass morphism effects
- Gradient backgrounds
- Hover animations
- Responsive design patterns

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app is compatible with any platform that supports Next.js:

- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Commit Convention

We follow conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `refactor:` - Code refactoring
- `chore:` - Build/tooling changes
- `docs:` - Documentation changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Recharts](https://recharts.org/) for the beautiful chart components

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/pazu/insightboard/issues) page
2. Create a new issue if your problem isn't already reported
3. Join our community discussions

---

**Built with ❤️ by [pazu](https://github.com/pazu)**
