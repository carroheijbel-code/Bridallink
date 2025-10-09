import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'
import { AuthProvider } from './components/AuthContext'
import { AppWithAuth } from './components/AppWithAuth'

// CRITICAL DEBUG - This should be the FIRST thing in console
console.log('🎬 main.tsx is LOADING!');
console.log('📦 All imports successful');
console.log('⏰ main.tsx load time:', new Date().toISOString());

// Error boundary for the entire app
class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-rose-50 flex items-center justify-center p-4">
          <div className="text-center space-y-4 max-w-md">
            <div className="text-6xl">💒</div>
            <h1 className="text-2xl font-bold text-amber-800">BridalLink</h1>
            <p className="text-amber-700">Something went wrong, but don't worry - your wedding planning data is safe!</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Initialize app
console.log('🔍 Looking for root element...');
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ ROOT ELEMENT NOT FOUND!');
  throw new Error('Root element not found');
}
console.log('✅ Root element found!', rootElement);

console.log('🎨 Creating React root...');
const root = ReactDOM.createRoot(rootElement);
console.log('✅ React root created!');

console.log('🚀 Starting React render...');
root.render(
  <React.StrictMode>
    <AppErrorBoundary>
      <AuthProvider>
        <AppWithAuth>
          <App />
        </AppWithAuth>
      </AuthProvider>
    </AppErrorBoundary>
  </React.StrictMode>
);
console.log('✅ React render called! App should be mounting...');