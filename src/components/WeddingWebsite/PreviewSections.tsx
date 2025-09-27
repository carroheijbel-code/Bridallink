import React from 'react';
import { 
  Calendar,
  MapPin,
  Clock,
  Heart,
  Gift
} from 'lucide-react';
import { WeddingWebsiteData, ThemeConfig } from './types';

interface PreviewSectionsProps {
  previewSection: string;
  websiteData: WeddingWebsiteData;
  theme: ThemeConfig;
}

export default function PreviewSections({ previewSection, websiteData, theme }: PreviewSectionsProps) {
  if (previewSection === 'home') {
    return (
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center">
          <h2 className="text-2xl mb-4" style={{ color: theme.colors.primary }}>
            Welcome to our Wedding
          </h2>
          <p className="text-sm leading-relaxed">
            We're so excited to celebrate our special day with you! Please explore our website to find all the details you need.
          </p>
        </div>

        {/* Quick Details */}
        <div 
          className="p-6 rounded-lg"
          style={{ backgroundColor: theme.colors.accent }}
        >
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" style={{ color: theme.colors.secondary }} />
              <span>{websiteData.weddingDate ? new Date(websiteData.weddingDate).toLocaleDateString() : 'Date TBD'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" style={{ color: theme.colors.secondary }} />
              <span>Ceremony: {websiteData.venue.ceremonyTime || 'Time TBD'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" style={{ color: theme.colors.secondary }} />
              <span>{websiteData.venue.name || 'Venue TBD'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" style={{ color: theme.colors.secondary }} />
              <span>Reception: {websiteData.venue.receptionTime || 'Time TBD'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (previewSection === 'story') {
    return (
      <div>
        <h2 className="text-xl mb-4" style={{ color: theme.colors.primary }}>
          Our Love Story
        </h2>
        {websiteData.story ? (
          <p className="text-sm leading-relaxed">{websiteData.story}</p>
        ) : (
          <div 
            className="p-6 rounded-lg text-center"
            style={{ backgroundColor: theme.colors.accent }}
          >
            <Heart className="h-8 w-8 mx-auto mb-3" style={{ color: theme.colors.secondary }} />
            <p className="text-sm">Share your love story in the editor to have it appear here!</p>
          </div>
        )}
      </div>
    );
  }

  if (previewSection === 'details') {
    return (
      <div>
        <h2 className="text-xl mb-6" style={{ color: theme.colors.primary }}>
          Wedding Details
        </h2>
        
        {/* Ceremony & Reception */}
        <div className="space-y-6">
          <div 
            className="p-4 rounded-lg"
            style={{ backgroundColor: theme.colors.accent }}
          >
            <h3 className="text-lg mb-3" style={{ color: theme.colors.primary }}>
              Ceremony & Reception
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4" style={{ color: theme.colors.secondary }} />
                <div>
                  <strong>Date:</strong> {websiteData.weddingDate ? 
                    new Date(websiteData.weddingDate).toLocaleDateString('en-GB', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Date TBD'}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4" style={{ color: theme.colors.secondary }} />
                <div>
                  <strong>Ceremony:</strong> {websiteData.venue.ceremonyTime || 'Time TBD'}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4" style={{ color: theme.colors.secondary }} />
                <div>
                  <strong>Reception:</strong> {websiteData.venue.receptionTime || 'Time TBD'}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5" style={{ color: theme.colors.secondary }} />
                <div>
                  <strong>Venue:</strong><br/>
                  {websiteData.venue.name || 'Venue TBD'}<br/>
                  {websiteData.venue.address && (
                    <span className="text-gray-600">{websiteData.venue.address}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dress Code & Additional Info */}
          <div 
            className="p-4 rounded-lg"
            style={{ backgroundColor: theme.colors.accent }}
          >
            <h3 className="text-lg mb-3" style={{ color: theme.colors.primary }}>
              What to Expect
            </h3>
            <div className="text-sm space-y-2">
              <p><strong>Dress Code:</strong> Formal / Cocktail Attire</p>
              <p><strong>Weather:</strong> We'll be celebrating outdoors, so please dress accordingly!</p>
              <p><strong>Parking:</strong> Complimentary parking available at the venue</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (previewSection === 'rsvp') {
    return (
      <div>
        <h2 className="text-xl mb-6" style={{ color: theme.colors.primary }}>
          RSVP
        </h2>
        
        <div 
          className="p-6 rounded-lg text-center"
          style={{ backgroundColor: theme.colors.accent }}
        >
          <Heart className="h-12 w-12 mx-auto mb-4" style={{ color: theme.colors.primary }} />
          <h3 className="text-xl mb-3" style={{ color: theme.colors.primary }}>
            We Hope You Can Join Us!
          </h3>
          <p className="text-sm mb-6 max-w-md mx-auto">
            {websiteData.rsvp.message || 'Your presence would make our day even more special. Please let us know if you\'ll be able to celebrate with us.'}
          </p>
          
          <div className="space-y-4">
            <div className="text-sm">
              <strong>RSVP Deadline:</strong> {websiteData.rsvp.deadline ? 
                new Date(websiteData.rsvp.deadline).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : '2 weeks before the wedding'}
            </div>
            
            <button 
              className="px-8 py-3 rounded-lg text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: theme.colors.primary }}
            >
              RSVP Now
            </button>
            
            <p className="text-xs text-gray-600">
              Having trouble with the RSVP form? Please contact us directly.
            </p>
          </div>
        </div>

        {/* RSVP Information */}
        <div className="mt-6 space-y-4">
          <div 
            className="p-4 rounded-lg"
            style={{ backgroundColor: theme.colors.accent }}
          >
            <h4 className="text-lg mb-2" style={{ color: theme.colors.primary }}>
              RSVP Information
            </h4>
            <div className="text-sm space-y-2">
              <p>• Please respond for each person included in your invitation</p>
              <p>• Let us know about any dietary restrictions or allergies</p>
              <p>• Include song requests for the reception!</p>
              <p>• We can't wait to celebrate with you</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (previewSection === 'registry') {
    return (
      <div>
        <h2 className="text-xl mb-6" style={{ color: theme.colors.primary }}>
          Gift Registry
        </h2>
        
        <div 
          className="p-6 rounded-lg text-center"
          style={{ backgroundColor: theme.colors.accent }}
        >
          <Gift className="h-12 w-12 mx-auto mb-4" style={{ color: theme.colors.primary }} />
          <h3 className="text-xl mb-3" style={{ color: theme.colors.primary }}>
            Your Presence is Our Present
          </h3>
          <p className="text-sm mb-6 max-w-md mx-auto">
            {websiteData.giftRegistry.message || 'The most important thing to us is having you there to celebrate. However, if you\'d like to honor us with a gift, we\'ve registered at a few of our favorite stores.'}
          </p>
        </div>

        {/* Registry Links */}
        <div className="mt-6 space-y-4">
          <div 
            className="p-4 rounded-lg"
            style={{ backgroundColor: theme.colors.accent }}
          >
            <h4 className="text-lg mb-4" style={{ color: theme.colors.primary }}>
              Registry Links
            </h4>
            {websiteData.giftRegistry.links.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {websiteData.giftRegistry.links.map((store, index) => (
                  <a
                    key={index}
                    href={store.url || '#'}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                    style={{ borderLeft: `4px solid ${theme.colors.primary}` }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-xl">🎁</span>
                    <div>
                      <div className="text-sm" style={{ color: theme.colors.primary }}>
                        {store.store || 'Registry Store'}
                      </div>
                      <div className="text-xs text-gray-500">View Registry</div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Gift className="h-12 w-12 mx-auto mb-3" style={{ color: theme.colors.secondary }} />
                <p className="text-sm text-gray-600">Add registry links in the editor to display them here.</p>
              </div>
            )}
          </div>

          {/* Alternative Gift Options */}
          <div 
            className="p-4 rounded-lg"
            style={{ backgroundColor: theme.colors.accent }}
          >
            <h4 className="text-lg mb-3" style={{ color: theme.colors.primary }}>
              Other Ways to Celebrate
            </h4>
            <div className="text-sm space-y-2">
              <p>🏡 <strong>Cash Gifts:</strong> Help us start our new life together</p>
              <p>✈️ <strong>Honeymoon Fund:</strong> Contribute to our dream trip</p>
              <p>💝 <strong>Charity Donations:</strong> Donate to our favorite charity in lieu of gifts</p>
              <p>📝 <strong>Written Wishes:</strong> Share your favorite memory or advice for our marriage</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}