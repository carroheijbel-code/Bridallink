import React, { useEffect } from 'react';

interface CalendlyWidgetProps {
  url?: string;
  mode?: 'inline' | 'popup';
  className?: string;
  height?: string;
}

declare global {
  interface Window {
    Calendly?: any;
  }
}

export const CalendlyWidget: React.FC<CalendlyWidgetProps> = ({
  url = 'https://calendly.com/carolina-bridallink/new-meeting',
  mode = 'inline',
  className = '',
  height = '700px'
}) => {
  useEffect(() => {
    // Load Calendly widget script
    if (mode === 'inline' && typeof window !== 'undefined') {
      const existingScript = document.querySelector('script[src*="calendly"]');
      
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        document.head.appendChild(script);
      }
    }
  }, [mode]);

  const openCalendlyPopup = () => {
    if (typeof window !== 'undefined' && window.Calendly) {
      window.Calendly.initPopupWidget({
        url: url,
        text: 'Book your consultation',
        color: '#3b82f6',
        textColor: '#ffffff',
        branding: false
      });
    } else {
      // Fallback - open in new window
      window.open(url, '_blank');
    }
  };

  if (mode === 'popup') {
    return (
      <div className={`text-center ${className}`}>
        <button
          onClick={openCalendlyPopup}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg"
        >
          📅 Book Your Free Call Now
        </button>
        <p className="text-xs text-blue-600 mt-2">
          Opens Calendly booking widget
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Live Calendly Integration Status */}
      <div className="bg-green-50 border border-green-200 p-4 mb-4 rounded-lg">
        <h5 className="font-semibold text-green-800 mb-2">📅 Live Calendar Booking:</h5>
        <div className="text-sm text-green-700 space-y-1">
          <p>✅ Connected to Carolina's live calendar system</p>
          <p>✅ Bookings will be confirmed automatically</p>
          <p>✅ You'll receive email confirmation and reminders</p>
          <p>🔗 Booking: <code className="bg-green-100 px-1 rounded text-xs">carolina-bridallink</code></p>
        </div>
      </div>
      
      {/* Calendly Inline Embed */}
      <div 
        className="calendly-inline-widget bg-white rounded-lg overflow-hidden" 
        data-url={url}
        style={{ minWidth: '320px', height: height }}
      />
      
      {/* Fallback button in case widget doesn't load */}
      <div className="text-center p-4 bg-blue-50 rounded-lg mt-4">
        <p className="text-sm text-blue-700 mb-3">Having trouble? Use the direct link:</p>
        <button
          onClick={openCalendlyPopup}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg"
        >
          📅 Open Calendly Booking
        </button>
      </div>
    </div>
  );
};

export default CalendlyWidget;