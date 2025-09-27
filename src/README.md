# BridalLink - Wedding Planning App

A comprehensive wedding planning application built with React, TypeScript, and Tailwind CSS.

## Features

### Core Planning Tools
- **Wedding Dashboard** - Overview of your wedding planning progress
- **Budget Tracker** - Track expenses and manage wedding budget
- **Guest List Manager** - Manage invitations, RSVPs, and guest details
- **Task Manager** - Wedding to-do lists and timeline management
- **Vendor Manager** - Track vendors, contracts, and communications
- **Document Manager** - Store contracts, receipts, and important files

### Advanced Features
- **Wedding Day Schedule** - Plan your perfect wedding day timeline
- **Music Playlists** - Spotify integration for wedding music
- **Seating Planner** - Design ceremony and reception seating layouts
- **Weather Forecast** - Wedding day weather predictions
- **Shopping Hub** - Access to 50+ wedding retailers
- **Gift Registry** - Create registries across multiple stores
- **Cash Fund** - Create honeymoon and experience funds
- **Hashtag Generator** - Create perfect wedding hashtags

### Community & Support
- **Bride Community** - Connect with fellow brides
- **AI Wedding Assistant** - Get personalized wedding advice
- **Expert Consultations** - Access to Mallorca wedding specialist
- **Premium Support** - Priority email support for premium members

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS v4
- **Backend**: Supabase (Database, Auth, Functions)
- **Payments**: Stripe integration
- **Music**: Spotify Web API integration
- **Booking**: Calendly integration
- **Build Tool**: Vite
- **UI Components**: shadcn/ui

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd bridallink
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
```

4. Start development server
```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## Project Structure

```
├── App.tsx                 # Main application component
├── main.tsx               # Application entry point
├── index.html             # HTML template
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── figma/            # Protected components
│   ├── AIWeddingAssistant.tsx
│   ├── CalendlyWidget.tsx
│   ├── EventCalendar.tsx
│   ├── PaymentIntegration.tsx
│   ├── PrivacyPolicy.tsx
│   ├── WeatherForecast.tsx
│   └── ...               # Other functional components
├── styles/               # CSS and styling
│   ├── globals.css       # Global styles and Tailwind
│   └── mobile.css        # Mobile-specific styles
├── utils/                # Utility functions
│   ├── supabase/         # Supabase configuration
│   └── toast.ts          # Toast notifications
├── supabase/             # Backend functions
│   └── functions/server/ # Edge functions
├── public/               # Static assets
│   ├── favicon.svg
│   ├── manifest.json
│   └── privacy-policy.html
└── package.json          # Dependencies and scripts
```

## Key Features

### Premium Subscription
- Monthly (£4.99) and Yearly (£49.99) plans
- 10-minute free consultation with Carolina (UK-based Mallorca specialist)
- £40/hour extended consultations
- Priority email support within 24 hours
- Spanish translation support
- Mallorca vendor network access

### Mobile Optimization
- Responsive design for all screen sizes
- Touch-friendly interface
- Progressive Web App (PWA) features
- iOS and Android compatible

### Data Management
- Supabase backend for secure data storage
- Real-time updates and synchronization
- User authentication and authorization
- GDPR compliant data handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

© 2024 BridalLink. All rights reserved.

## Support

- **Email**: carolina@bridallink.co.uk
- **Premium Support**: 24-hour response time for premium members
- **Community**: Join our bride community for peer support

---

Built with ❤️ for couples planning their dream wedding.