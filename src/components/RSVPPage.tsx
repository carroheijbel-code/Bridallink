import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Heart, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  MapPin, 
  Clock,
  Users,
  MessageSquare,
  Utensils,
  Loader
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface RSVPPageProps {
  token: string;
}

interface GuestData {
  name: string;
  email: string;
  plusOne: boolean;
  rsvpStatus: string;
  alreadyResponded: boolean;
}

interface EventData {
  coupleName: string;
  eventDate: string;
  venue: string;
  time: string;
}

const getDemoData = (token: string) => {
  const demoGuests = {
    'demo-sarah-johnson-123': {
      guest: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        plusOne: true,
        rsvpStatus: '',
        alreadyResponded: false
      },
      event: {
        coupleName: 'Emma & Michael',
        eventDate: '2024-08-15',
        venue: 'Rose Garden Chapel',
        time: '4:00 PM'
      }
    },
    'demo-mike-chen-456': {
      guest: {
        name: 'Mike Chen',
        email: 'mike.chen@example.com',
        plusOne: false,
        rsvpStatus: '',
        alreadyResponded: false
      },
      event: {
        coupleName: 'Emma & Michael',
        eventDate: '2024-08-15',
        venue: 'Rose Garden Chapel',
        time: '4:00 PM'
      }
    },
    'demo-robert-williams-789': {
      guest: {
        name: 'Robert Williams',
        email: 'robert.williams@example.com',
        plusOne: true,
        rsvpStatus: '',
        alreadyResponded: false
      },
      event: {
        coupleName: 'Emma & Michael',
        eventDate: '2024-08-15',
        venue: 'Rose Garden Chapel',
        time: '4:00 PM'
      }
    }
  };
  
  return demoGuests[token] || {
    guest: {
      name: 'Demo Guest',
      email: 'guest@example.com',
      plusOne: false,
      rsvpStatus: '',
      alreadyResponded: false
    },
    event: {
      coupleName: 'Emma & Michael',
      eventDate: '2024-08-15',
      venue: 'Rose Garden Chapel',
      time: '4:00 PM'
    }
  };
};

export default function RSVPPage({ token }: RSVPPageProps) {
  const [guestData, setGuestData] = useState<GuestData | null>(null);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [response, setResponse] = useState<'attending' | 'not-attending' | ''>('');
  const [attendeeCount, setAttendeeCount] = useState(1);
  const [message, setMessage] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');

  useEffect(() => {
    loadRSVPData();
  }, [token]);

  const loadRSVPData = async () => {
    try {
      setLoading(true);
      
      // Handle demo tokens with mock data
      if (token.startsWith('demo-')) {
        const demoData = getDemoData(token);
        setGuestData(demoData.guest);
        setEventData(demoData.event);
        setLoading(false);
        return;
      }
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5ea3da9c/rsvp/${token}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load RSVP data');
      }

      const data = await response.json();
      setGuestData(data.guest);
      setEventData(data.event);
      
      if (data.guest.alreadyResponded) {
        setResponse(data.guest.rsvpStatus === 'confirmed' ? 'attending' : 'not-attending');
        setSubmitted(true);
      }
      
    } catch (error) {
      console.error('Error loading RSVP data:', error);
      setError('Failed to load invitation. Please check your link.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRSVP = async () => {
    if (!response) return;

    try {
      setSubmitting(true);
      
      // Handle demo tokens - simulate submission
      if (token.startsWith('demo-')) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSubmitted(true);
        return;
      }
      
      const submitResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5ea3da9c/rsvp/${token}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            response: response === 'attending' ? 'attending' : 'not-attending',
            message,
            attendeeCount: response === 'attending' ? attendeeCount : 0,
            dietaryRestrictions
          })
        }
      );

      if (!submitResponse.ok) {
        throw new Error('Failed to submit RSVP');
      }

      setSubmitted(true);
      
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      setError('Failed to submit RSVP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center">
        <Card className="p-8 text-center bg-rose-100">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-rose-400" />
          <p className="text-amber-700">Loading your invitation...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md bg-rose-100">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl text-amber-800 mb-2">Oops!</h2>
          <p className="text-amber-700">{error}</p>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md bg-rose-100">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl text-amber-800 mb-2">
            {response === 'attending' ? 'Thank You!' : 'Thank You for Responding'}
          </h2>
          <p className="text-amber-700 mb-4">
            {response === 'attending' 
              ? `We're excited to celebrate with you, ${guestData?.name}!`
              : `We understand you can't make it, ${guestData?.name}. You'll be missed!`
            }
          </p>
          {eventData && (
            <div className="text-sm text-amber-600">
              <p>{eventData.coupleName}'s Wedding</p>
              <p>{new Date(eventData.eventDate).toLocaleDateString()}</p>
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Heart className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h1 className="text-3xl text-amber-800 mb-2">
            You're Invited!
          </h1>
          {eventData && (
            <p className="text-xl text-amber-700">
              {eventData.coupleName}'s Wedding
            </p>
          )}
        </div>

        {/* Event Details */}
        {eventData && (
          <Card className="p-6 mb-6 bg-rose-100">
            <h2 className="text-lg text-amber-800 mb-4">Event Details</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-rose-400" />
                <span className="text-amber-700">
                  {new Date(eventData.eventDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-rose-400" />
                <span className="text-amber-700">{eventData.time}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-rose-400" />
                <span className="text-amber-700">{eventData.venue}</span>
              </div>
            </div>
          </Card>
        )}

        {/* RSVP Form */}
        <Card className="p-6 bg-rose-100">
          <div className="mb-6">
            <h2 className="text-lg text-amber-800 mb-2">
              Dear {guestData?.name},
            </h2>
            <p className="text-amber-700">
              Please let us know if you'll be able to celebrate with us!
            </p>
          </div>

          <div className="space-y-6">
            {/* Response Selection */}
            <div>
              <Label className="text-base text-amber-800 mb-3 block">
                Will you be attending?
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={response === 'attending' ? 'default' : 'outline'}
                  onClick={() => setResponse('attending')}
                  className={`p-4 h-auto ${
                    response === 'attending' 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'border-green-300 text-green-700 hover:bg-green-50'
                  }`}
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div>Yes, I'll be there!</div>
                    <div className="text-sm opacity-80">Can't wait to celebrate</div>
                  </div>
                </Button>
                
                <Button
                  variant={response === 'not-attending' ? 'default' : 'outline'}
                  onClick={() => setResponse('not-attending')}
                  className={`p-4 h-auto ${
                    response === 'not-attending' 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'border-red-300 text-red-700 hover:bg-red-50'
                  }`}
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div>Sorry, can't make it</div>
                    <div className="text-sm opacity-80">Will be there in spirit</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Attendee Count (if attending and plus one allowed) */}
            {response === 'attending' && guestData?.plusOne && (
              <div>
                <Label htmlFor="attendeeCount" className="text-base text-amber-800">
                  Number of Guests
                </Label>
                <div className="flex items-center gap-3 mt-2">
                  <Users className="h-5 w-5 text-rose-400" />
                  <select
                    id="attendeeCount"
                    value={attendeeCount}
                    onChange={(e) => setAttendeeCount(Number(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value={1}>Just me</option>
                    <option value={2}>Me + 1 guest</option>
                  </select>
                </div>
              </div>
            )}

            {/* Dietary Restrictions (if attending) */}
            {response === 'attending' && (
              <div>
                <Label htmlFor="dietary" className="text-base text-amber-800">
                  Dietary Restrictions or Allergies
                </Label>
                <div className="flex items-start gap-3 mt-2">
                  <Utensils className="h-5 w-5 text-rose-400 mt-2" />
                  <Input
                    id="dietary"
                    value={dietaryRestrictions}
                    onChange={(e) => setDietaryRestrictions(e.target.value)}
                    placeholder="e.g., Vegetarian, Gluten-free, No nuts..."
                    className="flex-1"
                  />
                </div>
              </div>
            )}

            {/* Message */}
            <div>
              <Label htmlFor="message" className="text-base text-amber-800">
                Message for the Couple (Optional)
              </Label>
              <div className="flex items-start gap-3 mt-2">
                <MessageSquare className="h-5 w-5 text-rose-400 mt-2" />
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your excitement or well wishes..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmitRSVP}
              disabled={!response || submitting}
              className="w-full bg-rose-400 hover:bg-rose-500 text-white py-3"
            >
              {submitting ? (
                <>
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit RSVP'
              )}
            </Button>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-amber-600">
          <p>Questions? Contact the couple directly.</p>
          <p className="mt-2">💕 Thank you for being part of our special day! 💕</p>
        </div>
      </div>
    </div>
  );
}