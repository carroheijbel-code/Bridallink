import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Gift,
  Plus,
  Edit,
  Trash2,
  Check,
  Clock,
  Heart,
  Mail,
  ExternalLink,
  Search,
  Filter,
  Download,
  Upload,
  Star,
  DollarSign,
  Users,
  Calendar,
  Package,
  CheckCircle,
  AlertCircle,
  ShoppingCart,
  Globe
} from 'lucide-react';

interface GiftItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'kitchen' | 'bedroom' | 'bathroom' | 'home-decor' | 'experience' | 'cash' | 'other';
  priority: 'high' | 'medium' | 'low';
  isReceived: boolean;
  receivedDate?: string;
  giver?: string;
  thankYouSent: boolean;
  thankYouDate?: string;
  store: string;
  url?: string;
  notes?: string;
}

interface ThankYouNote {
  id: string;
  giftId: string;
  giver: string;
  giftName: string;
  sentDate: string;
  method: 'card' | 'email' | 'phone' | 'in-person';
  personalMessage: string;
}

const GIFT_CATEGORIES = {
  kitchen: { name: 'Kitchen & Dining', icon: '🍽️', color: 'bg-orange-100 text-orange-800' },
  bedroom: { name: 'Bedroom & Bath', icon: '🛏️', color: 'bg-purple-100 text-purple-800' },
  bathroom: { name: 'Bathroom', icon: '🛁', color: 'bg-blue-100 text-blue-800' },
  'home-decor': { name: 'Home Décor', icon: '🏠', color: 'bg-green-100 text-green-800' },
  experience: { name: 'Experiences', icon: '🎁', color: 'bg-pink-100 text-pink-800' },
  cash: { name: 'Cash Gifts', icon: '💰', color: 'bg-yellow-100 text-yellow-800' },
  other: { name: 'Other', icon: '📦', color: 'bg-gray-100 text-gray-800' }
};

const POPULAR_STORES = [
  'John Lewis', 'Marks & Spencer', 'IKEA', 'Next', 'Amazon',
  'Argos', 'Dunelm', 'The White Company', 'Zara Home', 'H&M Home'
];

export default function GiftRegistry() {
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [thankYouNotes, setThankYouNotes] = useState<ThankYouNote[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showAddGift, setShowAddGift] = useState<boolean>(false);
  const [showThankYouTracker, setShowThankYouTracker] = useState<boolean>(false);
  const [newGift, setNewGift] = useState({
    name: '',
    description: '',
    price: '',
    category: 'other' as GiftItem['category'],
    priority: 'medium' as GiftItem['priority'],
    store: '',
    url: '',
    notes: ''
  });

  // Load data from localStorage
  useEffect(() => {
    try {
      const savedGifts = localStorage.getItem('weddingGifts');
      const savedThankYous = localStorage.getItem('thankYouNotes');
      
      if (savedGifts) {
        setGifts(JSON.parse(savedGifts));
      } else {
        // Add some sample gifts
        const sampleGifts: GiftItem[] = [
          {
            id: '1',
            name: 'KitchenAid Stand Mixer',
            description: 'Professional 5-quart stand mixer in rose gold',
            price: 429,
            category: 'kitchen',
            priority: 'high',
            isReceived: true,
            receivedDate: '2024-02-14',
            giver: 'Sarah & Mike Johnson',
            thankYouSent: true,
            thankYouDate: '2024-02-20',
            store: 'John Lewis',
            url: 'https://johnlewis.com/kitchenaid-mixer'
          },
          {
            id: '2',
            name: 'Egyptian Cotton Bedding Set',
            description: '400 thread count king size duvet set in white',
            price: 189,
            category: 'bedroom',
            priority: 'medium',
            isReceived: false,
            thankYouSent: false,
            store: 'The White Company'
          },
          {
            id: '3',
            name: 'Weekend in Paris',
            description: 'Romantic weekend getaway for two',
            price: 650,
            category: 'experience',
            priority: 'high',
            isReceived: true,
            receivedDate: '2024-01-28',
            giver: 'Parents',
            thankYouSent: false,
            store: 'Experience Days'
          }
        ];
        setGifts(sampleGifts);
      }
      
      if (savedThankYous) {
        setThankYouNotes(JSON.parse(savedThankYous));
      }
    } catch (error) {
      console.error('Error loading gift data:', error);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('weddingGifts', JSON.stringify(gifts));
      localStorage.setItem('thankYouNotes', JSON.stringify(thankYouNotes));
    } catch (error) {
      console.error('Error saving gift data:', error);
    }
  }, [gifts, thankYouNotes]);

  const handleAddGift = () => {
    if (!newGift.name.trim()) return;

    const gift: GiftItem = {
      id: Date.now().toString(),
      name: newGift.name.trim(),
      description: newGift.description.trim(),
      price: parseFloat(newGift.price) || 0,
      category: newGift.category,
      priority: newGift.priority,
      isReceived: false,
      thankYouSent: false,
      store: newGift.store.trim(),
      url: newGift.url.trim() || undefined,
      notes: newGift.notes.trim() || undefined
    };

    setGifts([...gifts, gift]);
    setNewGift({
      name: '',
      description: '',
      price: '',
      category: 'other',
      priority: 'medium',
      store: '',
      url: '',
      notes: ''
    });
    setShowAddGift(false);
  };

  const markAsReceived = (id: string, giver: string) => {
    setGifts(gifts.map(gift => 
      gift.id === id 
        ? { 
            ...gift, 
            isReceived: true, 
            receivedDate: new Date().toISOString().split('T')[0],
            giver: giver.trim()
          }
        : gift
    ));
  };

  const markThankYouSent = (id: string) => {
    setGifts(gifts.map(gift => 
      gift.id === id 
        ? { 
            ...gift, 
            thankYouSent: true, 
            thankYouDate: new Date().toISOString().split('T')[0]
          }
        : gift
    ));
  };

  const deleteGift = (id: string) => {
    setGifts(gifts.filter(gift => gift.id !== id));
  };

  // Filter gifts
  const filteredGifts = gifts.filter(gift => {
    const matchesSearch = gift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gift.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (gift.giver && gift.giver.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || gift.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'received' && gift.isReceived) ||
                         (selectedStatus === 'pending' && !gift.isReceived) ||
                         (selectedStatus === 'thank-you-needed' && gift.isReceived && !gift.thankYouSent);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate statistics
  const totalGifts = gifts.length;
  const receivedGifts = gifts.filter(gift => gift.isReceived).length;
  const totalValue = gifts.reduce((sum, gift) => sum + gift.price, 0);
  const receivedValue = gifts.filter(gift => gift.isReceived).reduce((sum, gift) => sum + gift.price, 0);
  const thankYousNeeded = gifts.filter(gift => gift.isReceived && !gift.thankYouSent).length;
  const completionPercentage = totalGifts > 0 ? (receivedGifts / totalGifts) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <Gift className="h-8 w-8 text-pink-600" />
        </div>
        <h1 className="text-3xl text-amber-800">Gift Registry</h1>
        <p className="text-amber-700">Track your wedding gifts and manage thank you notes</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-pink-50 to-pink-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-pink-600" />
              <span className="text-sm text-pink-700">Total Gifts</span>
            </div>
            <div className="text-2xl text-pink-800">{totalGifts}</div>
            <Progress value={completionPercentage} className="w-full h-2" />
            <p className="text-xs text-pink-600">{receivedGifts} received</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-700">Total Value</span>
            </div>
            <div className="text-2xl text-green-800">£{totalValue.toLocaleString()}</div>
            <p className="text-xs text-green-600">£{receivedValue.toLocaleString()} received</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-orange-600" />
              <span className="text-sm text-orange-700">Thank You Notes</span>
            </div>
            <div className="text-2xl text-orange-800">{thankYousNeeded}</div>
            <p className="text-xs text-orange-600">Pending to send</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-purple-700">High Priority</span>
            </div>
            <div className="text-2xl text-purple-800">
              {gifts.filter(gift => gift.priority === 'high').length}
            </div>
          </div>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search gifts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 w-64"
            />
          </div>

          {/* Filters */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            <option value="all">All Categories</option>
            {Object.entries(GIFT_CATEGORIES).map(([key, category]) => (
              <option key={key} value={key}>{category.name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="received">Received</option>
            <option value="thank-you-needed">Thank You Needed</option>
          </select>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowThankYouTracker(!showThankYouTracker)}
            className="border-purple-200 text-purple-800 hover:bg-purple-50"
          >
            <Mail className="h-4 w-4 mr-2" />
            Thank You Tracker
          </Button>
          <Button
            onClick={() => setShowAddGift(true)}
            className="bg-pink-600 hover:bg-pink-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Gift
          </Button>
        </div>
      </div>

      {/* Thank You Notes Tracker */}
      {showThankYouTracker && (
        <Card className="p-6 bg-purple-50">
          <h3 className="text-lg text-amber-800 mb-4">Thank You Notes Needed</h3>
          {thankYousNeeded === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-green-700">All thank you notes have been sent! 🎉</p>
            </div>
          ) : (
            <div className="space-y-3">
              {gifts.filter(gift => gift.isReceived && !gift.thankYouSent).map((gift) => (
                <div key={gift.id} className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <div>
                    <h4 className="text-amber-800">{gift.name}</h4>
                    <p className="text-sm text-amber-600">From: {gift.giver}</p>
                    <p className="text-xs text-gray-500">
                      Received: {gift.receivedDate ? new Date(gift.receivedDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => markThankYouSent(gift.id)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Mark Sent
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Gifts Grid */}
      {filteredGifts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl text-gray-300 mb-4">🎁</div>
          <p className="text-gray-600 mb-4">No gifts found</p>
          <Button 
            onClick={() => setShowAddGift(true)}
            className="bg-pink-600 hover:bg-pink-700 text-white"
          >
            Add Your First Gift
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredGifts.map((gift) => {
            const category = GIFT_CATEGORIES[gift.category];
            
            return (
              <Card key={gift.id} className={`p-6 ${gift.isReceived ? 'bg-green-50' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-4xl">{category.icon}</div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg text-amber-800">{gift.name}</h3>
                        {gift.isReceived && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        {gift.isReceived && !gift.thankYouSent && (
                          <AlertCircle className="h-5 w-5 text-orange-500" />
                        )}
                      </div>
                      
                      <p className="text-sm text-amber-700 mb-3">{gift.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge className={category.color}>
                          {category.name}
                        </Badge>
                        <Badge className={`${
                          gift.priority === 'high' ? 'bg-red-100 text-red-800' :
                          gift.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {gift.priority} priority
                        </Badge>
                        {gift.isReceived ? (
                          <Badge className="bg-green-100 text-green-800">Received</Badge>
                        ) : (
                          <Badge className="bg-blue-100 text-blue-800">Pending</Badge>
                        )}
                        {gift.thankYouSent && (
                          <Badge className="bg-purple-100 text-purple-800">Thank You Sent</Badge>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <span>£{gift.price.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            <span>{gift.store}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          {gift.isReceived && gift.giver && (
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>From: {gift.giver}</span>
                            </div>
                          )}
                          {gift.receivedDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>Received: {new Date(gift.receivedDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {gift.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{gift.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {gift.url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(gift.url, '_blank')}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {!gift.isReceived && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const giver = prompt('Who gave this gift?');
                          if (giver) markAsReceived(gift.id, giver);
                        }}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {gift.isReceived && !gift.thankYouSent && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markThankYouSent(gift.id)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteGift(gift.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Gift Modal */}
      {showAddGift && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl text-amber-800">Add Gift to Registry</h3>
                <p className="text-amber-600">Add items you'd love to receive</p>
              </div>

              <div>
                <label className="block text-sm text-amber-700 mb-2">Gift Name</label>
                <input
                  type="text"
                  value={newGift.name}
                  onChange={(e) => setNewGift(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="e.g. KitchenAid Stand Mixer"
                />
              </div>

              <div>
                <label className="block text-sm text-amber-700 mb-2">Description</label>
                <textarea
                  value={newGift.description}
                  onChange={(e) => setNewGift(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="Color, size, specific model, etc."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-amber-700 mb-2">Price (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newGift.price}
                    onChange={(e) => setNewGift(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm text-amber-700 mb-2">Priority</label>
                  <select
                    value={newGift.priority}
                    onChange={(e) => setNewGift(prev => ({ ...prev, priority: e.target.value as GiftItem['priority'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-amber-700 mb-2">Category</label>
                <select
                  value={newGift.category}
                  onChange={(e) => setNewGift(prev => ({ ...prev, category: e.target.value as GiftItem['category'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                >
                  {Object.entries(GIFT_CATEGORIES).map(([key, category]) => (
                    <option key={key} value={key}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-amber-700 mb-2">Store</label>
                <input
                  list="stores"
                  value={newGift.store}
                  onChange={(e) => setNewGift(prev => ({ ...prev, store: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="Where can this be purchased?"
                />
                <datalist id="stores">
                  {POPULAR_STORES.map(store => (
                    <option key={store} value={store} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm text-amber-700 mb-2">Product URL (Optional)</label>
                <input
                  type="url"
                  value={newGift.url}
                  onChange={(e) => setNewGift(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm text-amber-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={newGift.notes}
                  onChange={(e) => setNewGift(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="Any additional notes or preferences"
                  rows={2}
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddGift(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddGift}
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white"
                  disabled={!newGift.name.trim()}
                >
                  Add Gift
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}