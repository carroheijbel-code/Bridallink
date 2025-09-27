import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  ShoppingBag, 
  Heart, 
  Star, 
  ExternalLink, 
  Crown, 
  Flower2, 
  Gift, 
  Sparkles, 
  Camera, 
  Gem,
  Search,
  Filter,
  Tag,
  Award,
  Copy,
  CheckCircle,
  Mail,
  Calendar,
  PoundSterling
} from 'lucide-react';

interface WeddingResource {
  id: string;
  name: string;
  description: string;
  category: string;
  priceRange: string;
  rating: number;
  isLuxury?: boolean;
  isSecondHand?: boolean;
  specialOffer?: string;
  website: string;
  isSponsored?: boolean;
  isFeatured?: boolean;
  affiliateLink?: string;
  exclusiveCode?: string;
  commission?: string;
}

const WEDDING_RESOURCES: WeddingResource[] = [
  // Wedding Dresses - Luxury
  {
    id: '1',
    name: 'Vera Wang',
    description: 'Iconic luxury wedding dresses with modern sophistication and timeless elegance.',
    category: 'Wedding Dresses',
    priceRange: '£2,000 - £8,000',
    rating: 4.9,
    isLuxury: true,
    isFeatured: true,
    isSponsored: true,
    website: 'verawang.com',
    affiliateLink: 'https://verawang.com?ref=bridallink',
    commission: '8%'
  },
  {
    id: '2',
    name: 'Jenny Packham',
    description: 'British luxury bridal wear with vintage-inspired glamour and intricate beadwork.',
    category: 'Wedding Dresses',
    priceRange: '£1,500 - £5,000',
    rating: 4.8,
    isLuxury: true,
    website: 'jennypackham.com'
  },
  
  // Wedding Dresses - Second Hand
  {
    id: '3',
    name: 'Stillwhite',
    description: 'Global marketplace for pre-owned designer wedding dresses at up to 60% off.',
    category: 'Wedding Dresses',
    priceRange: '£200 - £2,000',
    rating: 4.6,
    isSecondHand: true,
    isFeatured: true,
    specialOffer: 'Up to 60% off retail',
    exclusiveCode: 'BRIDALLINK15',
    website: 'stillwhite.co.uk',
    affiliateLink: 'https://stillwhite.co.uk?ref=bridallink',
    commission: '12%'
  },
  {
    id: '4',
    name: 'Nearly Newlywed',
    description: 'Carefully curated pre-loved designer wedding dresses and accessories.',
    category: 'Wedding Dresses',
    priceRange: '£150 - £1,500',
    rating: 4.5,
    isSecondHand: true,
    website: 'nearlynewlywed.co.uk'
  },

  // Groom & Wedding Party Attire
  {
    id: '5',
    name: 'Moss Bros',
    description: 'Complete formal wear hire and purchase for grooms and wedding parties.',
    category: 'Groom & Party Attire',
    priceRange: '£150 - £800',
    rating: 4.4,
    specialOffer: 'Free groom suit with party hire',
    website: 'moss.co.uk'
  },
  {
    id: '6',
    name: 'ASOS Design',
    description: 'Trendy bridesmaid dresses and groomsmen attire at affordable prices.',
    category: 'Groom & Party Attire',
    priceRange: '£50 - £300',
    rating: 4.3,
    exclusiveCode: 'BRIDALLINK20',
    specialOffer: '20% off wedding collections',
    website: 'asos.com',
    affiliateLink: 'https://asos.com?ref=bridallink',
    commission: '5%'
  },

  // Flowers
  {
    id: '7',
    name: 'Appleyard Flowers',
    description: 'London\'s premier wedding florists creating bespoke bridal arrangements.',
    category: 'Flowers',
    priceRange: '£800 - £5,000',
    rating: 4.9,
    isLuxury: true,
    website: 'appleyardflowers.co.uk'
  },
  {
    id: '8',
    name: 'Bloom & Wild',
    description: 'Beautiful wedding flowers delivered, with DIY options and professional service.',
    category: 'Flowers',
    priceRange: '£200 - £1,500',
    rating: 4.6,
    isFeatured: true,
    specialOffer: '15% off first wedding order',
    exclusiveCode: 'BRIDALWILD15',
    website: 'bloomandwild.com',
    affiliateLink: 'https://bloomandwild.com?ref=bridallink',
    commission: '10%'
  },

  // Wedding Favors
  {
    id: '9',
    name: 'The Favour Box',
    description: 'Personalized wedding favors from luxury chocolates to custom keepsakes.',
    category: 'Wedding Favors',
    priceRange: '£2 - £15 per guest',
    rating: 4.7,
    website: 'thefavourbox.co.uk'
  },
  {
    id: '10',
    name: 'Love Bird Favours',
    description: 'Eco-friendly and sustainable wedding favors with personalization options.',
    category: 'Wedding Favors',
    priceRange: '£1 - £8 per guest',
    rating: 4.5,
    specialOffer: 'Free personalization',
    website: 'lovebirdfavours.co.uk'
  },

  // Accessories & Jewelry
  {
    id: '11',
    name: 'Tiffany & Co.',
    description: 'Iconic engagement rings and wedding jewelry with timeless elegance.',
    category: 'Jewelry & Accessories',
    priceRange: '£1,000 - £50,000+',
    rating: 4.9,
    isLuxury: true,
    website: 'tiffany.co.uk'
  },
  {
    id: '12',
    name: 'Pandora',
    description: 'Beautiful wedding jewelry and accessories at accessible luxury prices.',
    category: 'Jewelry & Accessories',
    priceRange: '£50 - £500',
    rating: 4.4,
    specialOffer: 'Wedding collection 20% off',
    website: 'pandora.net'
  },

  // Wedding Inspiration
  {
    id: '13',
    name: 'Rock My Wedding',
    description: 'UK\'s leading wedding inspiration blog with real weddings and styling tips.',
    category: 'Inspiration & Planning',
    priceRange: 'Free content',
    rating: 4.8,
    website: 'rockmywedding.co.uk'
  },
  {
    id: '14',
    name: 'You & Your Wedding',
    description: 'Comprehensive wedding planning magazine with trends, tips, and supplier directory.',
    category: 'Inspiration & Planning',
    priceRange: 'Free - £5/month',
    rating: 4.6,
    website: 'youandyourwedding.co.uk'
  }
];

const categories = [
  'All',
  'Wedding Dresses',
  'Groom & Party Attire',
  'Flowers',
  'Wedding Favors',
  'Jewelry & Accessories',
  'Inspiration & Planning'
];

export default function WeddingResources() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showLuxuryOnly, setShowLuxuryOnly] = useState(false);
  const [showSecondHandOnly, setShowSecondHandOnly] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadFormData, setLeadFormData] = useState({
    name: '',
    email: '',
    weddingDate: '',
    budget: '',
    interests: [] as string[]
  });

  const filteredResources = WEDDING_RESOURCES.filter(resource => {
    const categoryMatch = selectedCategory === 'All' || resource.category === selectedCategory;
    const luxuryMatch = !showLuxuryOnly || resource.isLuxury;
    const secondHandMatch = !showSecondHandOnly || resource.isSecondHand;
    return categoryMatch && luxuryMatch && secondHandMatch;
  });

  const featuredResources = WEDDING_RESOURCES.filter(resource => resource.isFeatured);

  const copyDiscountCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real implementation, send to CRM/email marketing system
    console.log('Lead generated:', leadFormData);
    alert(`Thank you ${leadFormData.name}! We'll send you personalized wedding deals and exclusive offers to ${leadFormData.email}.`);
    setShowLeadForm(false);
    setLeadFormData({ name: '', email: '', weddingDate: '', budget: '', interests: [] });
  };



  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Wedding Dresses': return '👰';
      case 'Groom & Party Attire': return '🤵';
      case 'Flowers': return '💐';
      case 'Wedding Favors': return '🎁';
      case 'Jewelry & Accessories': return '💎';
      case 'Inspiration & Planning': return '📋';
      default: return '💕';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-purple-100 to-rose-100 p-4 rounded-full">
            <ShoppingBag className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <h1 className="text-3xl text-amber-800">Wedding Shopping Resources</h1>
        <p className="text-amber-700 max-w-2xl mx-auto">
          Discover carefully curated wedding resources from luxury designers to budget-friendly options. 
          Find everything you need for your perfect day with our trusted partner recommendations.
        </p>
      </div>

      {/* Featured Partners Section */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl text-amber-800 mb-2">Featured Partners</h2>
          <p className="text-amber-700">Exclusive deals and offers from our trusted wedding partners</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredResources.map((resource) => (
            <Card key={`featured-${resource.id}`} className="p-4 border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-rose-50">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-lg">{getCategoryIcon(resource.category)}</div>
                    <h3 className="text-amber-800">{resource.name}</h3>
                  </div>
                  <div className="flex gap-1">
                    <Badge className="bg-amber-100 text-amber-800 text-xs">
                      <Award className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                    {resource.isSponsored && (
                      <Badge className="bg-purple-100 text-purple-800 text-xs">
                        Sponsored
                      </Badge>
                    )}
                  </div>
                </div>
                
                {resource.exclusiveCode && (
                  <div className="bg-amber-100 border border-amber-300 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-amber-700">Exclusive Code:</div>
                        <div className="font-mono text-amber-800">{resource.exclusiveCode}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyDiscountCode(resource.exclusiveCode!)}
                        className="h-8"
                      >
                        {copiedCode === resource.exclusiveCode ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
                
                <Button 
                  size="sm"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  onClick={() => window.open(`https://${resource.website}`, '_blank')}
                >
                  Shop Now <ExternalLink className="h-3 w-3 ml-2" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg text-amber-800 mb-4">Filter Resources</h3>
          
          {/* Category Filter */}
          <div>
            <label className="text-sm text-amber-700 mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'secondary'}
                  className="cursor-pointer bg-rose-100 text-amber-800 hover:bg-rose-200"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Special Filters */}
          <div className="flex gap-4">
            <Button
              variant={showLuxuryOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setShowLuxuryOnly(!showLuxuryOnly);
                if (!showLuxuryOnly) setShowSecondHandOnly(false);
              }}
              className="flex items-center gap-2"
            >
              <Crown className="h-4 w-4" />
              Luxury Only
            </Button>
            <Button
              variant={showSecondHandOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setShowSecondHandOnly(!showSecondHandOnly);
                if (!showSecondHandOnly) setShowLuxuryOnly(false);
              }}
              className="flex items-center gap-2"
            >
              <Heart className="h-4 w-4" />
              Second Hand
            </Button>
          </div>
        </div>
      </Card>

      {/* Resources Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {getCategoryIcon(resource.category)}
                  </div>
                  <div>
                    <h3 className="text-lg text-amber-800">{resource.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-amber-600">{resource.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  {resource.isSponsored && (
                    <Badge className="bg-purple-100 text-purple-800 text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Sponsored
                    </Badge>
                  )}
                  {resource.isLuxury && (
                    <Badge className="bg-purple-100 text-purple-800 text-xs">
                      <Crown className="h-3 w-3 mr-1" />
                      Luxury
                    </Badge>
                  )}
                  {resource.isSecondHand && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      <Heart className="h-3 w-3 mr-1" />
                      Pre-loved
                    </Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-amber-700 text-sm leading-relaxed">
                {resource.description}
              </p>

              {/* Price Range */}
              <div className="bg-rose-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-amber-700">Price Range:</span>
                  <span className="text-amber-800">{resource.priceRange}</span>
                </div>
              </div>

              {/* Special Offer */}
              {resource.specialOffer && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-600" />
                    <span className="text-sm text-amber-800">{resource.specialOffer}</span>
                  </div>
                </div>
              )}

              {/* Exclusive Discount Code */}
              {resource.exclusiveCode && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-green-600" />
                      <div>
                        <span className="text-sm text-green-800">Code: </span>
                        <span className="font-mono text-green-800">{resource.exclusiveCode}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyDiscountCode(resource.exclusiveCode!)}
                      className="h-6 px-2 border-green-300 text-green-700 hover:bg-green-100"
                    >
                      {copiedCode === resource.exclusiveCode ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => window.open(`https://${resource.website}`, '_blank')}
              >
                <span>Visit {resource.name}</span>
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>

              {/* Website */}
              <div className="text-center">
                <span className="text-xs text-amber-600">{resource.website}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Affiliate Disclosure */}
      <Card className="bg-amber-50 border border-amber-200 p-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Heart className="h-5 w-5 text-amber-600" />
          </div>
          <h4 className="text-amber-800">Resource Disclaimer</h4>
          <p className="text-sm text-amber-700 max-w-2xl mx-auto">
            BridalLink curates wedding resources to help couples find trusted suppliers. 
            We may earn commissions from purchases made through some links as we grow our partnerships. 
            All recommendations are based on quality and user satisfaction.
          </p>
        </div>
      </Card>

      {/* Lead Generation CTA */}
      <div className="text-center space-y-4">
        <div className="bg-gradient-to-r from-rose-100 to-purple-100 rounded-lg p-8">
          <div className="space-y-4">
            <div className="text-4xl">💌</div>
            <h3 className="text-xl text-amber-800">Get Exclusive Wedding Deals</h3>
            <p className="text-amber-700">
              Join our VIP list to receive personalized shopping recommendations, exclusive discount codes, and early access to wedding sales.
            </p>
            <Button 
              onClick={() => setShowLeadForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Mail className="h-4 w-4 mr-2" />
              Get Exclusive Deals
            </Button>
          </div>
        </div>
      </div>

      {/* Expert Advice CTA */}
      <div className="text-center space-y-4">
        <div className="bg-gradient-to-r from-amber-100 to-rose-100 rounded-lg p-6">
          <div className="space-y-3">
            <div className="text-3xl">🌴</div>
            <h3 className="text-lg text-amber-800">Need Expert Wedding Planning Advice?</h3>
            <p className="text-amber-700 text-sm">
              For personalized wedding planning advice and consultations with Carolina, our Mallorca wedding expert.
            </p>
            <Button 
              onClick={() => window.location.href = '#expert-advice'}
              size="sm"
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Get Expert Advice
            </Button>
          </div>
        </div>
      </div>

      {/* Lead Generation Modal */}
      {showLeadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <form onSubmit={handleLeadSubmit} className="space-y-6">
              <div className="text-center">
                <div className="text-4xl mb-3">💌</div>
                <h3 className="text-xl text-amber-800 mb-2">Join Our VIP List</h3>
                <p className="text-amber-700 text-sm">Get personalized deals and exclusive wedding offers</p>
              </div>

              <div className="space-y-4">
                <Input
                  placeholder="Your name"
                  value={leadFormData.name}
                  onChange={(e) => setLeadFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
                
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={leadFormData.email}
                  onChange={(e) => setLeadFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="date"
                    placeholder="Wedding date"
                    value={leadFormData.weddingDate}
                    onChange={(e) => setLeadFormData(prev => ({ ...prev, weddingDate: e.target.value }))}
                  />
                  
                  <select
                    value={leadFormData.budget}
                    onChange={(e) => setLeadFormData(prev => ({ ...prev, budget: e.target.value }))}
                    className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    <option value="">Budget range</option>
                    <option value="Under £5k">Under £5k</option>
                    <option value="£5k-£15k">£5k-£15k</option>
                    <option value="£15k-£30k">£15k-£30k</option>
                    <option value="£30k+">£30k+</option>
                  </select>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-xs text-purple-700">
                    ✨ You'll receive exclusive discount codes, early sale access, and personalized recommendations based on your style and budget.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setShowLeadForm(false)}
                  className="flex-1"
                >
                  Maybe Later
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={!leadFormData.name || !leadFormData.email}
                >
                  Join VIP List
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}