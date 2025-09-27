import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  Crown,
  Check,
  X,
  CreditCard,
  Star,
  Heart,
  Sparkles,
  Calendar,
  MessageCircle,
  Phone,
  Video,
  Clock,
  Shield,
  Zap,
  Gift,
  Users,
  Award,
  Infinity,
  Lock,
  Unlock
} from 'lucide-react';

interface PremiumUpgradeProps {
  isPremiumMember: boolean;
  onUpgradeToPremium: (planType: 'monthly' | 'yearly') => void;
  onCancelSubscription?: () => void;
}

interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  email: string;
  billingAddress: {
    line1: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

const PREMIUM_FEATURES = [
  {
    icon: <MessageCircle className="h-5 w-5" />,
    title: "Personal Wedding Planner Access",
    description: "Direct consultation with Carolina, UK-based Mallorca wedding specialist",
    premium: true
  },
  {
    icon: <Phone className="h-5 w-5" />,
    title: "10-Minute Free Consultation",
    description: "Complimentary initial consultation to discuss your vision",
    premium: true
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "£40/Hour Expert Advice",
    description: "Ongoing support at affordable hourly rates",
    premium: true
  },
  {
    icon: <Video className="h-5 w-5" />,
    title: "Video Call Planning Sessions",
    description: "Face-to-face planning meetings via video call",
    premium: true
  },
  {
    icon: <Star className="h-5 w-5" />,
    title: "Mallorca Venue Recommendations",
    description: "Insider knowledge of the best venues in Mallorca",
    premium: true
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Local Vendor Network",
    description: "Access to trusted local photographers, florists, and caterers",
    premium: true
  },
  {
    icon: <Calendar className="h-5 w-5" />,
    title: "Priority Planning Support",
    description: "Fast-track responses to all your planning questions",
    premium: true
  },
  {
    icon: <Award className="h-5 w-5" />,
    title: "Custom Planning Timeline",
    description: "Personalized timeline based on your specific needs",
    premium: true
  },
  {
    icon: <Heart className="h-5 w-5" />,
    title: "All Core Planning Tools",
    description: "Budget tracker, guest list, timeline, and more",
    premium: false
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "Advanced Features",
    description: "Seating planner, document manager, music playlist",
    premium: false
  }
];

export default function PremiumUpgrade({ isPremiumMember, onUpgradeToPremium, onCancelSubscription }: PremiumUpgradeProps) {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [paymentForm, setPaymentForm] = useState<PaymentFormData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
    billingAddress: {
      line1: '',
      city: '',
      postalCode: '',
      country: 'United Kingdom'
    }
  });

  // Load subscription data from localStorage
  useEffect(() => {
    const savedSubscription = localStorage.getItem('premiumSubscription');
    if (savedSubscription) {
      setSubscriptionData(JSON.parse(savedSubscription));
    }
  }, []);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const subscription = {
      planType: selectedPlan,
      price: selectedPlan === 'monthly' ? 4.99 : 49.99,
      startDate: new Date().toISOString(),
      nextBilling: selectedPlan === 'monthly' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      paymentMethod: `****${paymentForm.cardNumber.slice(-4)}`,
      email: paymentForm.email
    };

    localStorage.setItem('premiumSubscription', JSON.stringify(subscription));
    setSubscriptionData(subscription);
    setIsProcessing(false);
    setShowPayment(false);
    onUpgradeToPremium(selectedPlan);
    
    alert(`🎉 Welcome to BridalLink Premium! Your ${selectedPlan} subscription is now active.`);
  };

  const handleCancelSubscription = () => {
    if (window.confirm('Are you sure you want to cancel your premium subscription? You will lose access to expert advice and premium features.')) {
      localStorage.removeItem('premiumSubscription');
      setSubscriptionData(null);
      if (onCancelSubscription) {
        onCancelSubscription();
      }
      alert('Your subscription has been cancelled. You will retain access until the end of your current billing period.');
    }
  };

  const updatePaymentForm = (field: string, value: string) => {
    if (field === 'cardNumber') {
      value = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      value = formatExpiryDate(value);
    } else if (field === 'cvv') {
      value = value.replace(/[^0-9]/g, '').substring(0, 3);
    }

    if (field.startsWith('billingAddress.')) {
      const addressField = field.split('.')[1];
      setPaymentForm(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [addressField]: value
        }
      }));
    } else {
      setPaymentForm(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  if (isPremiumMember && subscriptionData) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Premium Member Header */}
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <Crown className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="text-3xl text-amber-800">Premium Member Dashboard</h1>
          <p className="text-amber-700">You have access to expert wedding planning advice</p>
        </div>

        {/* Subscription Status */}
        <Card className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-amber-600" />
              <h3 className="text-lg text-amber-800">Premium Subscription</h3>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="text-right">
              <div className="text-2xl text-amber-800">
                £{subscriptionData.price}/{subscriptionData.planType === 'monthly' ? 'month' : 'year'}
              </div>
              <div className="text-sm text-amber-600">
                Next billing: {new Date(subscriptionData.nextBilling).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-amber-700 mb-2">Subscription Details</h4>
              <div className="space-y-1 text-sm">
                <div>Plan: {subscriptionData.planType === 'monthly' ? 'Monthly' : 'Annual'}</div>
                <div>Started: {new Date(subscriptionData.startDate).toLocaleDateString()}</div>
                <div>Payment Method: {subscriptionData.paymentMethod}</div>
                <div>Email: {subscriptionData.email}</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-amber-700 mb-2">Expert Access</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">10-minute free consultation available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">£40/hour expert advice</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Priority support responses</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={() => window.location.href = '/expert-advice'}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Book Consultation
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelSubscription}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Cancel Subscription
            </Button>
          </div>
        </Card>

        {/* Premium Features Overview */}
        <Card className="p-6">
          <h3 className="text-lg text-amber-800 mb-4">Your Premium Benefits</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {PREMIUM_FEATURES.filter(feature => feature.premium).map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                <div className="text-amber-600 mt-0.5">{feature.icon}</div>
                <div>
                  <h4 className="text-amber-800 text-sm">{feature.title}</h4>
                  <p className="text-amber-600 text-xs mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <Crown className="h-8 w-8 text-amber-600" />
        </div>
        <h1 className="text-3xl text-amber-800">Upgrade to Premium</h1>
        <p className="text-amber-700">Get expert wedding planning advice from a UK-based Mallorca specialist</p>
      </div>

      {/* Pricing Plans */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Monthly Plan */}
        <Card className={`p-8 relative ${selectedPlan === 'monthly' ? 'border-amber-400 shadow-lg' : 'border-gray-200'}`}>
          <div className="text-center space-y-4">
            <div className="bg-amber-100 p-3 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
              <Calendar className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl text-amber-800">Monthly Plan</h3>
            <div className="text-3xl text-amber-800">
              £4.99<span className="text-base text-amber-600">/month</span>
            </div>
            <p className="text-amber-600 text-sm">Perfect for short-term planning</p>
            
            <Button
              onClick={() => {
                setSelectedPlan('monthly');
                setShowPayment(true);
              }}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              Choose Monthly
            </Button>
          </div>
        </Card>

        {/* Annual Plan */}
        <Card className={`p-8 relative ${selectedPlan === 'yearly' ? 'border-amber-400 shadow-lg' : 'border-gray-200'}`}>
          <div className="absolute top-4 right-4">
            <Badge className="bg-green-100 text-green-800">Save 17%</Badge>
          </div>
          
          <div className="text-center space-y-4">
            <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-3 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
              <Crown className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl text-amber-800">Annual Plan</h3>
            <div className="text-3xl text-amber-800">
              £49.99<span className="text-base text-amber-600">/year</span>
            </div>
            <p className="text-amber-600 text-sm">
              Save £10 annually • Just £4.17/month
            </p>
            
            <Button
              onClick={() => {
                setSelectedPlan('yearly');
                setShowPayment(true);
              }}
              className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white"
            >
              Choose Annual
            </Button>
          </div>
        </Card>
      </div>

      {/* Features Comparison */}
      <Card className="p-8">
        <h3 className="text-xl text-amber-800 text-center mb-8">What's Included in Premium</h3>
        
        <div className="grid gap-6">
          {PREMIUM_FEATURES.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${feature.premium ? 'bg-amber-100' : 'bg-gray-100'}`}>
                <div className={feature.premium ? 'text-amber-600' : 'text-gray-600'}>
                  {feature.icon}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="text-amber-800">{feature.title}</h4>
                  {feature.premium ? (
                    <Badge className="bg-amber-100 text-amber-800 text-xs">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Free
                    </Badge>
                  )}
                </div>
                <p className="text-amber-600 text-sm mt-1">{feature.description}</p>
              </div>
              
              <div className="text-right">
                {feature.premium ? (
                  <Check className="h-5 w-5 text-amber-600" />
                ) : (
                  <Check className="h-5 w-5 text-green-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* About Carolina */}
      <Card className="p-8 bg-gradient-to-r from-amber-50 to-rose-50">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-xl text-amber-800 mb-4">Meet Your Wedding Expert</h3>
            <div className="space-y-3">
              <p className="text-amber-700">
                <strong>Carolina</strong> is a UK-based wedding planner specializing in Mallorca destinations. 
                With years of experience creating dream weddings on the beautiful island, she offers 
                insider knowledge and personal attention to make your day perfect.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-amber-700">Expert in Mallorca venue selection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-amber-700">Trusted local vendor network</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-amber-700">Personalized planning approach</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-amber-700">UK-based for easy communication</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="text-amber-800 mb-3">Premium Consultation Package</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-amber-700">Initial consultation:</span>
                <span className="text-green-600">Free (10 minutes)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700">Extended planning sessions:</span>
                <span className="text-amber-800">£40/hour</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700">Response time:</span>
                <span className="text-amber-800">Priority support</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700">Communication:</span>
                <span className="text-amber-800">Video calls & messaging</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-amber-600" />
              </div>
              <DialogTitle className="text-xl text-amber-800">Complete Your Premium Upgrade</DialogTitle>
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="text-2xl text-amber-800">
                  £{selectedPlan === 'monthly' ? '4.99/month' : '49.99/year'}
                </div>
                <div className="text-sm text-amber-600">
                  {selectedPlan === 'yearly' && 'Save £10 annually • '}
                  {selectedPlan === 'monthly' ? 'Monthly' : 'Annual'} Premium Plan
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-amber-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={paymentForm.email}
                onChange={(e) => updatePaymentForm('email', e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="cardholderName" className="text-amber-700">Cardholder Name</Label>
              <Input
                id="cardholderName"
                value={paymentForm.cardholderName}
                onChange={(e) => updatePaymentForm('cardholderName', e.target.value)}
                placeholder="John Smith"
                required
              />
            </div>

            <div>
              <Label htmlFor="cardNumber" className="text-amber-700">Card Number</Label>
              <Input
                id="cardNumber"
                value={paymentForm.cardNumber}
                onChange={(e) => updatePaymentForm('cardNumber', e.target.value)}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate" className="text-amber-700">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  value={paymentForm.expiryDate}
                  onChange={(e) => updatePaymentForm('expiryDate', e.target.value)}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvv" className="text-amber-700">CVV</Label>
                <Input
                  id="cvv"
                  value={paymentForm.cvv}
                  onChange={(e) => updatePaymentForm('cvv', e.target.value)}
                  placeholder="123"
                  maxLength={3}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="billingAddress" className="text-amber-700">Billing Address</Label>
              <div className="space-y-2">
                <Input
                  value={paymentForm.billingAddress.line1}
                  onChange={(e) => updatePaymentForm('billingAddress.line1', e.target.value)}
                  placeholder="Address Line 1"
                  required
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={paymentForm.billingAddress.city}
                    onChange={(e) => updatePaymentForm('billingAddress.city', e.target.value)}
                    placeholder="City"
                    required
                  />
                  <Input
                    value={paymentForm.billingAddress.postalCode}
                    onChange={(e) => updatePaymentForm('billingAddress.postalCode', e.target.value)}
                    placeholder="Postal Code"
                    required
                  />
                </div>
                <Input
                  value={paymentForm.billingAddress.country}
                  onChange={(e) => updatePaymentForm('billingAddress.country', e.target.value)}
                  placeholder="Country"
                  required
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4" />
                <span>Secure Payment</span>
              </div>
              <p>Your payment information is encrypted and secure. This is a demo payment form - no real charges will be made.</p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowPayment(false)}
                className="flex-1"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                onClick={handlePayment}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                disabled={isProcessing || !paymentForm.email || !paymentForm.cardNumber || !paymentForm.cardholderName}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay £{selectedPlan === 'monthly' ? '4.99' : '49.99'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}