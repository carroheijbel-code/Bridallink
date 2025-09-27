import React from 'react';

interface CalendlySectionProps {
  calendlyUrl?: string;
}

const CalendlySection: React.FC<CalendlySectionProps> = ({
  calendlyUrl = 'https://calendly.com/carolina-bridallink/new-meeting'
}) => {
  const openCalendlyPopup = () => {
    if (typeof window !== 'undefined') {
      // Try to open Calendly popup if widget is loaded
      if ((window as any).Calendly) {
        (window as any).Calendly.initPopupWidget({
          url: calendlyUrl,
          text: 'Book your 10-minute consultation',
          color: '#3b82f6',
          textColor: '#ffffff',
          branding: false
        });
      } else {
        // Fallback - open Calendly in new window
        window.open(calendlyUrl, '_blank');
      }
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-xl">📅</span>
        <h3 className="text-xl font-bold text-blue-800">Book Your Free 10-Minute Call</h3>
      </div>
      <p className="text-blue-700 text-center mb-4">
        Skip the email - book your complimentary consultation instantly with our calendar booking system
      </p>
      
      {/* Calendly Inline Widget */}
      <div className="bg-white rounded-lg p-4">
        <div className="text-center mb-4">
          <div className="text-2xl mb-2">🗓️</div>
          <h4 className="font-semibold text-blue-800 mb-2">Direct Calendar Booking</h4>
          <p className="text-sm text-blue-700">Choose your preferred time slot instantly</p>
        </div>
        
        {/* Setup Instructions */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <h5 className="font-semibold text-amber-800 mb-2">🔧 Setup Instructions:</h5>
          <div className="text-sm text-amber-700 space-y-1">
            <p>1. Create your Calendly account at calendly.com</p>
            <p>2. Set up a "10-minute consultation" event type</p>
            <p>3. Replace the URL below with your actual Calendly link</p>
            <p>4. Current URL: <code className="bg-amber-100 px-1 rounded text-xs">{calendlyUrl}</code></p>
          </div>
        </div>
        
        {/* Calendly Inline Embed */}
        <div 
          className="calendly-inline-widget bg-gray-50 border-2 border-dashed border-blue-300 rounded-lg overflow-hidden" 
          data-url={calendlyUrl}
          style={{ minWidth: '320px', height: '500px' }}
        >
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8">
              <div className="text-4xl mb-4">📅</div>
              <h4 className="text-blue-800 font-semibold mb-2">Calendly Widget Will Load Here</h4>
              <p className="text-sm text-blue-700 mb-4">
                Once you add your actual Calendly URL, the booking widget will appear here
              </p>
              <button
                onClick={openCalendlyPopup}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg"
              >
                📅 Open Calendly Booking
              </button>
            </div>
          </div>
        </div>
        
        {/* Booking Benefits */}
        <div className="bg-blue-50 rounded-lg p-4 mt-4">
          <h5 className="font-semibold text-blue-800 mb-2 text-center">🎯 Booking Benefits:</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span><strong>Instant booking:</strong> No email back-and-forth needed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span><strong>Calendar integration:</strong> Automatic calendar invites</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span><strong>Question preparation:</strong> Add your questions during booking</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span><strong>Reminders:</strong> Automatic email and SMS reminders</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendlySection;