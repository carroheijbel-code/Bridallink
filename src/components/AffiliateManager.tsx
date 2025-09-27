import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ExternalLink, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  DollarSign,
  Calendar,
  BarChart3,
  Settings
} from 'lucide-react';

interface AffiliateProgram {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'rejected';
  commissionRate: string;
  cookieDuration: number;
  monthlyClicks: number;
  monthlyEarnings: number;
  conversionRate: number;
  affiliateId?: string;
  trackingDomain?: string;
  apiKey?: string;
}

interface AffiliateLink {
  id: string;
  programId: string;
  productName: string;
  originalUrl: string;
  affiliateUrl: string;
  clicks: number;
  conversions: number;
  earnings: number;
  isActive: boolean;
}

const AFFILIATE_PROGRAMS: AffiliateProgram[] = [
  {
    id: 'amazon-uk',
    name: 'Amazon Associates UK',
    status: 'active',
    commissionRate: '1-10%',
    cookieDuration: 24,
    monthlyClicks: 1247,
    monthlyEarnings: 186.50,
    conversionRate: 3.2,
    affiliateId: 'bridallink-21',
    trackingDomain: 'amazon.co.uk',
    apiKey: process.env.AMAZON_AFFILIATE_KEY
  },
  {
    id: 'asos',
    name: 'ASOS Affiliate',
    status: 'active',
    commissionRate: '5-8%',
    cookieDuration: 30,
    monthlyClicks: 856,
    monthlyEarnings: 245.80,
    conversionRate: 4.1,
    affiliateId: 'bridallink_asos',
    trackingDomain: 'awin1.com',
    apiKey: process.env.ASOS_AFFILIATE_KEY
  },
  {
    id: 'etsy',
    name: 'Etsy Affiliate',
    status: 'pending',
    commissionRate: '4%',
    cookieDuration: 30,
    monthlyClicks: 0,
    monthlyEarnings: 0,
    conversionRate: 0
  },
  {
    id: 'booking',
    name: 'Booking.com',
    status: 'active',
    commissionRate: '25-40%',
    cookieDuration: 30,
    monthlyClicks: 324,
    monthlyEarnings: 1250.00,
    conversionRate: 8.5,
    affiliateId: '12345678',
    trackingDomain: 'booking.com'
  }
];

export default function AffiliateManager() {
  const [programs, setPrograms] = useState<AffiliateProgram[]>(AFFILIATE_PROGRAMS);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [showLinkGenerator, setShowLinkGenerator] = useState(false);
  const [newProductUrl, setNewProductUrl] = useState('');

  // Calculate total monthly stats
  const totalMonthlyEarnings = programs.reduce((sum, program) => sum + program.monthlyEarnings, 0);
  const totalMonthlyClicks = programs.reduce((sum, program) => sum + program.monthlyClicks, 0);
  const averageConversionRate = programs.length > 0 
    ? programs.reduce((sum, program) => sum + program.conversionRate, 0) / programs.length 
    : 0;

  // Generate affiliate link
  const generateAffiliateLink = (originalUrl: string, programId: string): string => {
    const program = programs.find(p => p.id === programId);
    if (!program || !program.affiliateId) return originalUrl;

    switch (programId) {
      case 'amazon-uk':
        // Amazon UK affiliate link format
        const amazonTag = `tag=${program.affiliateId}`;
        const separator = originalUrl.includes('?') ? '&' : '?';
        return `${originalUrl}${separator}${amazonTag}`;
        
      case 'asos':
        // ASOS via Awin network
        const encodedUrl = encodeURIComponent(originalUrl);
        return `https://www.awin1.com/cread.php?awinmid=3785&awinaffid=${program.affiliateId}&clickref=bridallink&p=${encodedUrl}`;
        
      case 'booking':
        // Booking.com partner link
        const bookingParams = `aid=${program.affiliateId}&label=bridallink`;
        const bookingSeparator = originalUrl.includes('?') ? '&' : '?';
        return `${originalUrl}${bookingSeparator}${bookingParams}`;
        
      case 'etsy':
        // Etsy affiliate link
        const etsyRef = `ref=bridallink&utm_source=${program.affiliateId}`;
        const etsySeparator = originalUrl.includes('?') ? '&' : '?';
        return `${originalUrl}${etsySeparator}${etsyRef}`;
        
      default:
        return originalUrl;
    }
  };

  // Track click function
  const trackClick = async (affiliateUrl: string, programId: string, productName: string) => {
    try {
      // In real implementation, send to your analytics/tracking service
      await fetch('/api/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programId,
          productName,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer
        })
      });
      
      // Open affiliate link in new tab
      window.open(affiliateUrl, '_blank');
    } catch (error) {
      console.error('Failed to track click:', error);
      // Still open the link even if tracking fails
      window.open(affiliateUrl, '_blank');
    }
  };

  const handleGenerateLink = () => {
    if (!newProductUrl || !selectedProgram) return;
    
    const affiliateUrl = generateAffiliateLink(newProductUrl, selectedProgram);
    
    // Copy to clipboard
    navigator.clipboard.writeText(affiliateUrl);
    alert(`Affiliate link generated and copied to clipboard!\n\n${affiliateUrl}`);
    
    setNewProductUrl('');
    setShowLinkGenerator(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl text-amber-800">Affiliate Program Management</h1>
        <p className="text-amber-700">Track your affiliate partnerships and revenue</p>
      </div>

      {/* Monthly Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6 bg-green-50">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-700">Monthly Earnings</span>
            </div>
            <div className="text-2xl text-green-800">£{totalMonthlyEarnings.toFixed(2)}</div>
          </div>
        </Card>
        
        <Card className="p-6 bg-blue-50">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MousePointer className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-blue-700">Monthly Clicks</span>
            </div>
            <div className="text-2xl text-blue-800">{totalMonthlyClicks.toLocaleString()}</div>
          </div>
        </Card>
        
        <Card className="p-6 bg-purple-50">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-purple-700">Avg. Conversion</span>
            </div>
            <div className="text-2xl text-purple-800">{averageConversionRate.toFixed(1)}%</div>
          </div>
        </Card>
        
        <Card className="p-6 bg-amber-50">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-amber-600" />
              <span className="text-sm text-amber-700">Active Programs</span>
            </div>
            <div className="text-2xl text-amber-800">{programs.filter(p => p.status === 'active').length}</div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Button 
          onClick={() => setShowLinkGenerator(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Generate Affiliate Link
        </Button>
        
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Program Settings
        </Button>
      </div>

      {/* Link Generator Modal */}
      {showLinkGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="space-y-6">
              <h3 className="text-xl text-amber-800">Generate Affiliate Link</h3>
              
              <div>
                <label className="block text-sm text-amber-700 mb-2">Select Program</label>
                <select
                  value={selectedProgram || ''}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                >
                  <option value="">Choose affiliate program</option>
                  {programs.filter(p => p.status === 'active').map(program => (
                    <option key={program.id} value={program.id}>
                      {program.name} ({program.commissionRate})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-amber-700 mb-2">Product URL</label>
                <input
                  type="url"
                  value={newProductUrl}
                  onChange={(e) => setNewProductUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  placeholder="https://example.com/product"
                />
              </div>

              <div className="bg-amber-50 rounded-lg p-4">
                <p className="text-xs text-amber-700">
                  The affiliate link will be automatically generated with your tracking parameters and copied to clipboard.
                </p>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowLinkGenerator(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleGenerateLink}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={!newProductUrl || !selectedProgram}
                >
                  Generate Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Affiliate Programs List */}
      <div className="space-y-4">
        <h2 className="text-xl text-amber-800">Your Affiliate Programs</h2>
        
        <div className="space-y-4">
          {programs.map((program) => (
            <Card key={program.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg text-amber-800">{program.name}</h3>
                    <Badge 
                      className={
                        program.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : program.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {program.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-amber-600">Commission:</span>
                      <div className="text-amber-800">{program.commissionRate}</div>
                    </div>
                    <div>
                      <span className="text-amber-600">Cookie Duration:</span>
                      <div className="text-amber-800">{program.cookieDuration} days</div>
                    </div>
                    <div>
                      <span className="text-amber-600">Monthly Clicks:</span>
                      <div className="text-amber-800">{program.monthlyClicks.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-amber-600">Monthly Earnings:</span>
                      <div className="text-amber-800">£{program.monthlyEarnings.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl text-green-600">
                    {program.conversionRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-amber-600">Conversion Rate</div>
                </div>
              </div>
              
              {program.affiliateId && (
                <div className="mt-4 bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600">Affiliate ID: {program.affiliateId}</div>
                  <div className="text-xs text-gray-600">Tracking: {program.trackingDomain}</div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Setup Instructions */}
      <Card className="p-6 bg-blue-50">
        <h3 className="text-lg text-amber-800 mb-4">Next Steps to Activate Real Affiliate Revenue</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">1</div>
            <div>
              <strong>Apply to Programs:</strong> Visit each affiliate program's website and submit your application with BridalLink details
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">2</div>
            <div>
              <strong>Get Approved:</strong> Wait for approval (1-14 days) and receive your unique affiliate ID and tracking links
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">3</div>
            <div>
              <strong>Update Links:</strong> Replace mock links in WeddingResources with real affiliate links using this generator
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">4</div>
            <div>
              <strong>Track Revenue:</strong> Monitor clicks, conversions, and earnings through affiliate dashboards and this system
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}