import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Phone, 
  Clock, 
  Star, 
  MapPin, 
  Crown, 
  Check, 
  Calendar,
  Heart,
  MessageCircle,
  Users,
  Camera,
  Music,
  Flower
} from 'lucide-react';

interface ExpertAdviceProps {
  isPremiumMember: boolean;
  onUpgradeToPremium: () => void;
}

export default function ExpertAdvice({ isPremiumMember, onUpgradeToPremium }: ExpertAdviceProps) {
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleBookConsultation = () => {
    if (!isPremiumMember) {
      setShowUpgrade(true);
    } else {
      // Handle actual booking logic here
      alert('Booking consultation with Carolina... You\'ll receive an email with available time slots and Zoom meeting details.');
    }
  };

  const handleUpgradeClick = () => {
    onUpgradeToPremium();
    setShowUpgrade(false);

  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-amber-100 to-rose-100 p-4 rounded-full">
            <div className="text-4xl">🌴</div>
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl text-amber-800">Expert Wedding Advice</h1>
          {isPremiumMember && (
            <div className="flex justify-center">
              <Badge className="bg-gradient-to-r from-amber-100 to-rose-100 text-amber-800 border-amber-200">
                <Crown className="h-3 w-3 mr-1" />
                Premium Member - Consultations Available
              </Badge>
            </div>
          )}
        </div>
        <p className="text-amber-700 max-w-2xl mx-auto">
          Get personalized guidance from Carolina, a UK-based wedding planner with extensive experience planning beautiful weddings in Mallorca. Spanish-speaking and ready to help you navigate every detail.
        </p>
      </div>

      {/* Premium Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-r from-amber-100 to-rose-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Crown className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <h3 className="text-2xl text-amber-800 mb-2">Upgrade to Premium</h3>
                <p className="text-amber-700">Access Carolina's expert consultations and premium features</p>
              </div>
              
              <div className="bg-rose-50 rounded-lg p-6 space-y-4">
                <div className="text-center">
                  <div className="text-3xl text-amber-800 mb-2">£4.99</div>
                  <div className="text-sm text-amber-600">per month</div>
                </div>
                
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-amber-700">Carolina's expert consultations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-amber-700">Spanish translation assistance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-amber-700">Provider booking support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-amber-700">Mallorca venue insights</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowUpgrade(false)}
                  className="flex-1"
                >
                  Maybe Later
                </Button>
                <Button 
                  onClick={handleUpgradeClick}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Upgrade Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expert Profile */}
      <Card className="bg-rose-100 p-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-amber-200 to-rose-200 rounded-full flex items-center justify-center text-6xl">
              👰‍♀️
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-500 rounded-full p-2">
              <Star className="h-4 w-4 text-white" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h2 className="text-2xl text-amber-800">Carolina</h2>
              <div className="flex items-center justify-center md:justify-start gap-2 text-amber-600 mt-1">
                <MapPin className="h-4 w-4" />
                <span>United Kingdom</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <Badge className="bg-amber-100 text-amber-800">Mallorca Expert</Badge>
              <Badge className="bg-rose-100 text-rose-800">UK-Based</Badge>
              <Badge className="bg-purple-100 text-purple-800">Spanish Speaker</Badge>
            </div>
            
            <p className="text-amber-700">
              Based in the UK with extensive experience as a wedding planner in Mallorca, Carolina specializes in helping couples navigate the unique challenges of planning a destination wedding. Fluent in Spanish and deeply connected to local vendors and venues.
            </p>
            
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-amber-700">4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-rose-500" />
                <span className="text-sm text-amber-700">98% Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Services & Pricing */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-8 bg-gradient-to-br from-rose-50 to-amber-50">
          <div className="space-y-6">
            <div className="text-center">
              <Phone className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-xl text-amber-800 mb-2">Consultation Call</h3>
              <p className="text-amber-700">One-on-one expert guidance</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    <span className="text-amber-800">First 10 minutes</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">FREE</Badge>
                </div>
                <p className="text-sm text-amber-600 mt-2">Get to know each other and discuss your vision</p>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <span className="text-amber-800">Additional time</span>
                  </div>
                  <span className="text-xl text-amber-800">£40/hour</span>
                </div>
                <p className="text-sm text-amber-600 mt-2">In-depth planning and personalized advice</p>
              </div>
            </div>
            
            <Button 
              onClick={handleBookConsultation}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isPremiumMember ? 'Book Consultation' : 'Upgrade to Book'}
              {!isPremiumMember && <Crown className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </Card>

        <Card className="p-8 bg-gradient-to-br from-purple-50 to-rose-50">
          <div className="space-y-6">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl text-amber-800 mb-2">What We'll Cover</h3>
              <p className="text-amber-700">Comprehensive wedding planning guidance</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-purple-500" />
                <span className="text-amber-700">Mallorca venue selection & recommendations</span>
              </div>
              <div className="flex items-center gap-3">
                <Camera className="h-5 w-5 text-purple-500" />
                <span className="text-amber-700">Music, flowers & photography advice</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-purple-500" />
                <span className="text-amber-700">Spanish translation assistance</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-purple-500" />
                <span className="text-amber-700">Provider booking support</span>
              </div>
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-purple-500" />
                <span className="text-amber-700">Planning considerations & logistics</span>
              </div>
            </div>
            
            <div className="bg-purple-100 rounded-lg p-4">
              <p className="text-sm text-purple-800 italic">
                "Carolina's knowledge of Mallorca vendors and her Spanish translation help were invaluable. She made our destination wedding planning so much easier!" 
                <span className="block mt-1">- Emma & David, 2024</span>
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Premium Status */}
      {isPremiumMember ? (
        <Card className="bg-gradient-to-r from-amber-100 to-rose-100 p-6">
          <div className="flex items-center justify-center gap-3">
            <Crown className="h-6 w-6 text-amber-600" />
            <span className="text-lg text-amber-800">Premium Member - Expert Consultations Available!</span>
            <Crown className="h-6 w-6 text-amber-600" />
          </div>
        </Card>
      ) : (
        <Card className="bg-rose-100 p-6">
          <div className="text-center space-y-4">
            <Crown className="h-8 w-8 text-amber-600 mx-auto" />
            <div>
              <h3 className="text-lg text-amber-800">Ready to get expert advice?</h3>
              <p className="text-amber-700">Upgrade to Premium for just £4.99/month to access Carolina's consultations</p>
            </div>
            <Button 
              onClick={onUpgradeToPremium}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Upgrade to Premium
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}