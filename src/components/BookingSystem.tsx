import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Calendar } from './ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Star, 
  Phone, 
  Mail,
  User,
  Heart,
  CheckCircle,
  Video,
  Coffee,
  Gift
} from 'lucide-react';
import { toast } from '../utils/toast';

interface Expert {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  experience: string;
  location: string;
  description: string;
  hourlyRate: number;
  languages: string[];
  availability: string[];
}

interface Booking {
  id: string;
  expertId: string;
  expertName: string;
  date: string;
  time: string;
  duration: number;
  type: 'free-consultation' | 'paid-session';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
  meetingLink?: string;
}

interface AuthUser {
  id: string;
  email: string;
  name: string;
  weddingDate?: string;
}

interface BookingSystemProps {
  user: AuthUser | null;
}

export function BookingSystem({ user }: BookingSystemProps) {
  const [experts] = useState<Expert[]>([
    {
      id: '1',
      name: 'Isabella Rodriguez',
      title: 'Senior Wedding Planner',
      avatar: '👩‍💼',
      rating: 4.9,
      reviewCount: 127,
      specialties: ['Beach Weddings', 'Luxury Events', 'Destination Planning'],
      experience: '8 years',
      location: 'Palma, Mallorca',
      description: 'Specializing in luxury beach weddings across Mallorca. I help couples create unforgettable celebrations with attention to every detail.',
      hourlyRate: 40,
      languages: ['English', 'Spanish', 'German'],
      availability: ['2024-01-25', '2024-01-26', '2024-01-29', '2024-01-30']
    },
    {
      id: '2',
      name: 'Maria Fernandez',
      title: 'Venue Specialist',
      avatar: '🏖️',
      rating: 4.8,
      reviewCount: 89,
      specialties: ['Venue Selection', 'Vendor Coordination', 'Budget Planning'],
      experience: '6 years',
      location: 'Alcudia, Mallorca',
      description: 'Expert in finding the perfect venues across Mallorca. From intimate beach ceremonies to grand resort celebrations.',
      hourlyRate: 35,
      languages: ['English', 'Spanish', 'French'],
      availability: ['2024-01-24', '2024-01-25', '2024-01-28', '2024-01-31']
    },
    {
      id: '3',
      name: 'Carmen Silva',
      title: 'Cultural Wedding Expert',
      avatar: '💃',
      rating: 4.9,
      reviewCount: 156,
      specialties: ['Cultural Ceremonies', 'Traditional Elements', 'Multi-cultural Weddings'],
      experience: '10 years',
      location: 'Ibiza & Mallorca',
      description: 'Bringing authentic Spanish and Mediterranean traditions to modern weddings. Perfect for couples wanting cultural authenticity.',
      hourlyRate: 45,
      languages: ['English', 'Spanish', 'Catalan', 'Italian'],
      availability: ['2024-01-26', '2024-01-27', '2024-01-29', '2024-02-01']
    }
  ]);

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      expertId: '1',
      expertName: 'Isabella Rodriguez',
      date: '2024-01-28',
      time: '14:00',
      duration: 10,
      type: 'free-consultation',
      status: 'scheduled',
      notes: 'Initial consultation about beach wedding venue options',
      meetingLink: 'https://meet.bridallink.com/consultation/1'
    }
  ]);

  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [sessionType, setSessionType] = useState<'free-consultation' | 'paid-session'>('free-consultation');
  const [bookingNotes, setBookingNotes] = useState('');
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00'
  ];

  const handleBookConsultation = () => {
    if (!selectedExpert || !selectedDate || !selectedTime) {
      toast.error('Please select an expert, date, and time');
      return;
    }

    const booking: Booking = {
      id: Date.now().toString(),
      expertId: selectedExpert.id,
      expertName: selectedExpert.name,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      duration: sessionType === 'free-consultation' ? 10 : 60,
      type: sessionType,
      status: 'scheduled',
      notes: bookingNotes,
      meetingLink: `https://meet.bridallink.com/${sessionType}/${Date.now()}`
    };

    setBookings([...bookings, booking]);
    setIsBookingDialogOpen(false);
    setSelectedExpert(null);
    setSelectedDate(new Date());
    setSelectedTime('');
    setBookingNotes('');
    
    toast.success('Consultation booked successfully! You\'ll receive a confirmation email shortly.');
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center space-x-2">
            <CalendarIcon className="h-8 w-8 text-blue-500" />
            <span>Expert Wedding Consultations</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Get personalized advice from Mallorca's top wedding planners
          </p>
        </div>
        
        {/* Free consultation highlight */}
        <div className="bg-gradient-to-r from-pink-50 to-blue-50 border border-pink-200 rounded-lg p-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Gift className="h-5 w-5 text-pink-500" />
            <span className="font-semibold text-pink-700">Free 10-Minute Consultation</span>
          </div>
          <p className="text-sm text-gray-600">
            Start with a complimentary consultation to discuss your wedding vision and get expert recommendations
          </p>
        </div>
      </div>

      <Tabs defaultValue="experts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="experts">Find Experts</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="experts" className="space-y-6">
          {/* Experts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {experts.map((expert) => (
              <Card key={expert.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{expert.avatar}</div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{expert.name}</CardTitle>
                      <p className="text-sm text-gray-600">{expert.title}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        {renderStars(expert.rating)}
                        <span className="text-sm text-gray-600 ml-2">
                          {expert.rating} ({expert.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-700">{expert.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{expert.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{expert.experience} experience</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {expert.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Languages:</span>
                      <span className="text-sm">{expert.languages.join(', ')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Hourly Rate:</span>
                      <span className="font-medium">£{expert.hourlyRate}/hour</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button
                      className="w-full bg-pink-500 hover:bg-pink-600"
                      onClick={() => {
                        setSelectedExpert(expert);
                        setSessionType('free-consultation');
                        setIsBookingDialogOpen(true);
                      }}
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      Book Free Consultation
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSelectedExpert(expert);
                        setSessionType('paid-session');
                        setIsBookingDialogOpen(true);
                      }}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Book 1-Hour Session (£{expert.hourlyRate})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          {/* Upcoming Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Consultations</CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.filter(b => b.status === 'scheduled').length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No upcoming consultations</p>
                  <p className="text-sm text-gray-500">Book your first consultation to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.filter(b => b.status === 'scheduled').map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div>
                          <h3 className="font-medium">{booking.expertName}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center space-x-1">
                              <CalendarIcon className="h-4 w-4" />
                              <span>{new Date(booking.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{booking.time} ({booking.duration} min)</span>
                            </div>
                          </div>
                          {booking.notes && (
                            <p className="text-sm text-gray-600 mt-1">Notes: {booking.notes}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                          <Badge variant="outline">
                            {booking.type === 'free-consultation' ? 'Free' : 'Paid'}
                          </Badge>
                          {booking.meetingLink && (
                            <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                              <Video className="h-4 w-4 mr-1" />
                              Join Call
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Past Bookings */}
          {bookings.filter(b => b.status === 'completed').length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Past Consultations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.filter(b => b.status === 'completed').map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4 opacity-75">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{booking.expertName}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span>{new Date(booking.date).toLocaleDateString()}</span>
                            <span>{booking.time}</span>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Star className="h-4 w-4 mr-1" />
                          Rate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Book {sessionType === 'free-consultation' ? 'Free Consultation' : 'Paid Session'} 
              {selectedExpert && ` with ${selectedExpert.name}`}
            </DialogTitle>
          </DialogHeader>
          
          {selectedExpert && (
            <div className="space-y-6">
              {/* Expert Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{selectedExpert.avatar}</div>
                  <div>
                    <h3 className="font-medium">{selectedExpert.name}</h3>
                    <p className="text-sm text-gray-600">{selectedExpert.title}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {renderStars(selectedExpert.rating)}
                      <span className="text-sm text-gray-600 ml-2">
                        {selectedExpert.rating} ({selectedExpert.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Type Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  {sessionType === 'free-consultation' ? (
                    <Gift className="h-5 w-5 text-blue-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-blue-500" />
                  )}
                  <span className="font-medium">
                    {sessionType === 'free-consultation' ? 'Free 10-Minute Consultation' : '1-Hour Paid Session'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {sessionType === 'free-consultation' 
                    ? 'Perfect for initial questions and getting to know your wedding planner. No commitment required.'
                    : `In-depth planning session with personalized recommendations. Rate: £${selectedExpert.hourlyRate}/hour`
                  }
                </p>
              </div>

              {/* Date Selection */}
              <div>
                <Label>Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => 
                    date < new Date() || 
                    !selectedExpert.availability.includes(date.toISOString().split('T')[0])
                  }
                  className="rounded-md border"
                />
              </div>

              {/* Time Selection */}
              <div>
                <Label>Select Time</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div>
                <Label>Notes (Optional)</Label>
                <Textarea
                  placeholder="Tell us about your wedding vision, specific questions, or areas you'd like to focus on..."
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                />
              </div>

              {/* Book Button */}
              <Button 
                onClick={handleBookConsultation}
                className="w-full bg-pink-500 hover:bg-pink-600"
                disabled={!selectedDate || !selectedTime}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Booking
                {sessionType === 'paid-session' && ` (£${selectedExpert.hourlyRate})`}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}