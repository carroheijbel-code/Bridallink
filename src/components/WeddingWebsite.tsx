import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Globe, ExternalLink } from 'lucide-react';

export default function WeddingWebsite() {
  const [websiteData, setWebsiteData] = useState({
    isPublished: false,
    url: '',
    coupleNames: { bride: '', groom: '' },
    weddingDate: ''
  });

  const updateWebsiteData = (updates: any) => {
    setWebsiteData(prev => ({ ...prev, ...updates }));
  };

  const publishWebsite = () => {
    updateWebsiteData({ 
      isPublished: true, 
      url: 'bridallink.com/your-wedding' 
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <Globe className="h-8 w-8 text-purple-600" />
        </div>
        <h1 className="text-3xl text-amber-800">Wedding Website</h1>
        <p className="text-amber-700">Create a beautiful website to share your wedding details</p>
      </div>

      {/* Status Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg text-amber-800 mb-2">Website Status</h3>
            <div className="flex items-center gap-4">
              {websiteData.isPublished ? (
                <>
                  <Badge className="bg-green-100 text-green-800">Published</Badge>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Globe className="h-4 w-4" />
                    <span>{websiteData.url}</span>
                  </div>
                </>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            {websiteData.isPublished ? (
              <Button 
                variant="outline"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View Live Site
              </Button>
            ) : (
              <Button 
                onClick={publishWebsite}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Globe className="h-4 w-4 mr-2" />
                Publish Website
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Simple Editor */}
      <Card className="p-6">
        <h3 className="text-lg text-amber-800 mb-4">Basic Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-amber-700 mb-2">Bride's Name</label>
              <input
                type="text"
                value={websiteData.coupleNames.bride}
                onChange={(e) => updateWebsiteData({
                  coupleNames: { ...websiteData.coupleNames, bride: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                placeholder="Bride's name"
              />
            </div>
            <div>
              <label className="block text-sm text-amber-700 mb-2">Groom's Name</label>
              <input
                type="text"
                value={websiteData.coupleNames.groom}
                onChange={(e) => updateWebsiteData({
                  coupleNames: { ...websiteData.coupleNames, groom: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                placeholder="Groom's name"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-amber-700 mb-2">Wedding Date</label>
            <input
              type="date"
              value={websiteData.weddingDate}
              onChange={(e) => updateWebsiteData({ weddingDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>
        </div>
      </Card>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="text-3xl mb-3">📱</div>
          <h3 className="text-lg text-amber-800">Mobile Responsive</h3>
          <p className="text-sm text-amber-700 mt-2">Looks perfect on all devices</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-3xl mb-3">🎨</div>
          <h3 className="text-lg text-amber-800">Beautiful Themes</h3>
          <p className="text-sm text-amber-700 mt-2">Choose from elegant designs</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-3xl mb-3">🔗</div>
          <h3 className="text-lg text-amber-800">Easy Sharing</h3>
          <p className="text-sm text-amber-700 mt-2">Share your unique URL with guests</p>
        </Card>
      </div>

      {/* Tips */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <h3 className="text-lg text-amber-800 mb-4">💡 Website Tips</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-amber-700 mb-2">Essential Information:</h4>
            <ul className="text-sm space-y-1">
              <li>• Wedding date, time, and venue details</li>
              <li>• RSVP instructions and deadline</li>
              <li>• Accommodation recommendations</li>
              <li>• Gift registry information</li>
            </ul>
          </div>
          <div>
            <h4 className="text-amber-700 mb-2">Nice to Have:</h4>
            <ul className="text-sm space-y-1">
              <li>• Your love story and engagement photos</li>
              <li>• Schedule of wedding day events</li>
              <li>• Local area recommendations</li>
              <li>• Wedding party introductions</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}