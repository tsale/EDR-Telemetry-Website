# EDR Telemetry Website

A comprehensive Next.js implementation of the EDR Telemetry Website, featuring Vercel Speed Insights for performance monitoring.

## Getting Started

First, clone the repository:

```bash
git clone https://github.com/tsale/EDR-Telemetry-Website.git
cd EDR-Telemetry-Website
```

Then, install the dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
EDR-Telemetry-Website/
├── components/     # Reusable React components
├── hooks/          # Custom React hooks
├── pages/          # Page components and routes
│   ├── about.js
│   ├── blog.js
│   ├── contact.js
│   ├── contribute.js
│   ├── eligibility.js
│   ├── index.js    # Homepage
│   ├── linux.js
│   ├── macos.js
│   ├── mitre-mappings.js
│   ├── premium-services.js
│   ├── roadmap.js
│   ├── scores.js
│   ├── sponsorship.js
│   ├── statistics.js
│   ├── windows.js
│   ├── _app.js     # Custom App component
│   └── _document.js # Custom Document
├── public/         # Static assets (images, etc.)
├── styles/         # CSS files
└── utils/          # Utility functions
```

## Features

- **Speed Insights**: Integrated Vercel Speed Insights for performance monitoring
- **Chart.js Integration**: Data visualization with Chart.js and react-chartjs-2
- **Responsive Design**: Mobile-friendly interface
- **React Components**: Modular, reusable components
- **Next.js Routing**: File-based routing system
- **Platform-specific Pages**: Dedicated pages for Windows, Linux, and macOS

## Technologies Used

- **Next.js**: React framework for production
- **React**: UI library
- **Chart.js**: Data visualization
- **Vercel Speed Insights**: Performance monitoring

## Deployment

This project is configured for deployment on Vercel, with `vercel.json` providing custom configuration.

## Contributing

To contribute to this project:

1. Create a feature branch
2. Make your changes
3. Submit a pull request

Please ensure your code follows the existing style and structure.

## License

ISC License 