import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals'; // Optional for performance monitoring
import { FaRobot } from 'react-icons/fa'; 

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    // You can log errors to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h1>Something went wrong</h1>
          <p>We're sorry for the inconvenience. Please try refreshing the page.</p>
          <button onClick={() => window.location.reload()}>Refresh</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Component
const LoadingScreen = () => (
  <div className="initial-load">
    <div className="loading-logo">
      <FaRobot size={64} />
    </div>
    <p className="loading-text">Initializing AI Chatbot...</p>
  </div>
);

// Service Worker Registration (for PWA)
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    } catch (error) {
      console.error('ServiceWorker registration failed: ', error);
    }
  }
};

// Main Render Function
const root = ReactDOM.createRoot(document.getElementById('root'));

const renderApp = () => {
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <React.Suspense fallback={<LoadingScreen />}>
          <App />
        </React.Suspense>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

// Initialization
if (process.env.NODE_ENV === 'production') {
  registerServiceWorker();
}

// Check for browser compatibility before rendering
if ('Promise' in window && 'fetch' in window && 'IntersectionObserver' in window) {
  renderApp();
} else {
  root.render(
    <div className="browser-warning">
      <h2>Unsupported Browser</h2>
      <p>
        Your browser doesn't support all the features required by this application.
        Please update to the latest version of Chrome, Firefox, Edge, or Safari.
      </p>
    </div>
  );
}

// Optional: If you want to measure performance
reportWebVitals(console.log); // Or send to analytics service