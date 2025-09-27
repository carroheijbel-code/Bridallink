import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { 
  Calendar,
  Clock, 
  Plus, 
  Edit,
  Trash2,
  MapPin,
  Users,
  Camera,
  Music,
  Utensils,
  Heart,
  Download,
  Save,
  Sparkles,
  Car
} from 'lucide-react';

// Simple toast function
const toast = {
  success: (message: string) => alert(message),
  error: (message: string) => alert(message)
};

interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  duration: number; // in minutes
  category: 'preparation' | 'ceremony' | 'reception' | 'photos' | 'transport' | 'personal' | 'vendor';
  participants: string[];
  notes: string;
  isComplete: boolean;
}

interface WeddingDayScheduleData {
  weddingDate: string;
  venues: {
    preparation: string;
    ceremony: string;
    reception: string;
    photos: string;
  };
  events: ScheduleEvent[];
}

export function WeddingDaySchedule() {
  const [scheduleData, setScheduleData] = useState<WeddingDayScheduleData>({
    weddingDate: '',
    venues: {
      preparation: '',
      ceremony: '',
      reception: '',
      photos: ''
    },
    events: [
      {
        id: '1',
        time: '08:00',
        title: 'Hair & Makeup Starts',
        description: 'Bridal party hair and makeup begins',
        location: 'Bridal Suite',
        duration: 180,
        category: 'preparation',
        participants: ['Bride', 'Bridesmaids', 'Hair Stylist', 'Makeup Artist'],
        notes: 'Start with bridesmaids, bride last',
        isComplete: false
      },
      {
        id: '2',
        time: '10:30',
        title: 'Photographer Arrives',
        description: 'Getting ready photos begin',
        location: 'Bridal Suite',
        duration: 90,
        category: 'photos',
        participants: ['Bride', 'Bridesmaids', 'Photographer'],
        notes: 'Capture candid moments and details',
        isComplete: false
      },
      {
        id: '3',
        time: '12:00',
        title: 'Light Lunch',
        description: 'Bridal party meal',
        location: 'Bridal Suite',
        duration: 60,
        category: 'personal',
        participants: ['Bride', 'Bridesmaids'],
        notes: 'Keep it light and healthy',
        isComplete: false
      },
      {
        id: '4',
        time: '14:00',
        title: 'Bride Gets Dressed',
        description: 'Final preparations and dress',
        location: 'Bridal Suite',
        duration: 45,
        category: 'preparation',
        participants: ['Bride', 'Mother of Bride', 'Maid of Honor'],
        notes: 'Save time for emotional moments',
        isComplete: false
      },
      {
        id: '5',
        time: '15:00',
        title: 'First Look & Couples Photos',
        description: 'Private first look and portrait session',
        location: 'Garden/Photo Location',
        duration: 60,
        category: 'photos',
        participants: ['Bride', 'Groom', 'Photographer'],
        notes: 'Private intimate moment',
        isComplete: false
      },
      {
        id: '6',
        time: '16:30',
        title: 'Ceremony',
        description: 'Wedding ceremony',
        location: 'Ceremony Venue',
        duration: 45,
        category: 'ceremony',
        participants: ['All Guests'],
        notes: 'The main event!',
        isComplete: false
      },
      {
        id: '7',
        time: '17:15',
        title: 'Cocktail Hour',
        description: 'Drinks and mingling while couple takes photos',
        location: 'Reception Venue',
        duration: 75,
        category: 'reception',
        participants: ['All Guests'],
        notes: 'Live music and appetizers',
        isComplete: false
      },
      {
        id: '8',
        time: '18:30',
        title: 'Reception Begins',
        description: 'Grand entrance and dinner service',
        location: 'Reception Venue',
        duration: 240,
        category: 'reception',
        participants: ['All Guests'],
        notes: 'Speeches, first dance, dinner',
        isComplete: false
      }
    ]
  });

  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  const [isEditVenuesDialogOpen, setIsEditVenuesDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<ScheduleEvent>>({
    time: '',
    title: '',
    description: '',
    location: '',
    duration: 60,
    category: 'personal',
    participants: [],
    notes: ''
  });

  const categoryColors = {
    preparation: 'bg-pink-100 text-pink-800',
    ceremony: 'bg-purple-100 text-purple-800',
    reception: 'bg-blue-100 text-blue-800',
    photos: 'bg-green-100 text-green-800',
    transport: 'bg-yellow-100 text-yellow-800',
    personal: 'bg-orange-100 text-orange-800',
    vendor: 'bg-gray-100 text-gray-800'
  };

  const categoryIcons = {
    preparation: Sparkles,
    ceremony: Heart,
    reception: Utensils,
    photos: Camera,
    transport: Car,
    personal: Users,
    vendor: MapPin
  };

  const handleAddEvent = () => {
    if (!newEvent.time || !newEvent.title) {
      toast.error('Please fill in time and title');
      return;
    }

    const event: ScheduleEvent = {
      id: Date.now().toString(),
      time: newEvent.time!,
      title: newEvent.title!,
      description: newEvent.description || '',
      location: newEvent.location || '',
      duration: newEvent.duration || 60,
      category: newEvent.category as ScheduleEvent['category'] || 'personal',
      participants: newEvent.participants || [],
      notes: newEvent.notes || '',
      isComplete: false
    };

    const updatedEvents = [...scheduleData.events, event]
      .sort((a, b) => a.time.localeCompare(b.time));

    setScheduleData({
      ...scheduleData,
      events: updatedEvents
    });

    setNewEvent({
      time: '',
      title: '',
      description: '',
      location: '',
      duration: 60,
      category: 'personal',
      participants: [],
      notes: ''
    });
    setIsAddEventDialogOpen(false);
    toast.success('Event added successfully!');
  };

  const handleEditEvent = (event: ScheduleEvent) => {
    setEditingEvent(event);
    setNewEvent(event);
    setIsAddEventDialogOpen(true);
  };

  const handleUpdateEvent = () => {
    if (!editingEvent || !newEvent.time || !newEvent.title) {
      toast.error('Please fill in time and title');
      return;
    }

    const updatedEvents = scheduleData.events
      .map(event => 
        event.id === editingEvent.id 
          ? { ...event, ...newEvent }
          : event
      )
      .sort((a, b) => a.time.localeCompare(b.time));

    setScheduleData({
      ...scheduleData,
      events: updatedEvents
    });

    setEditingEvent(null);
    setNewEvent({
      time: '',
      title: '',
      description: '',
      location: '',
      duration: 60,
      category: 'personal',
      participants: [],
      notes: ''
    });
    setIsAddEventDialogOpen(false);
    toast.success('Event updated successfully!');
  };

  const handleDeleteEvent = (eventId: string) => {
    const updatedEvents = scheduleData.events.filter(event => event.id !== eventId);
    setScheduleData({
      ...scheduleData,
      events: updatedEvents
    });
    toast.success('Event deleted');
  };

  const handleToggleComplete = (eventId: string) => {
    const updatedEvents = scheduleData.events.map(event =>
      event.id === eventId 
        ? { ...event, isComplete: !event.isComplete }
        : event
    );
    setScheduleData({
      ...scheduleData,
      events: updatedEvents
    });
  };

  const handleSaveSchedule = () => {
    localStorage.setItem('bridallink_wedding_schedule', JSON.stringify(scheduleData));
    toast.success('Schedule saved successfully!');
  };

  const handleExportSchedule = () => {
    const exportData = {
      ...scheduleData,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `wedding_day_schedule_${scheduleData.weddingDate || 'draft'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Schedule exported successfully!');
  };

  const handleUpdateVenues = (venues: typeof scheduleData.venues) => {
    setScheduleData({
      ...scheduleData,
      venues
    });
    setIsEditVenuesDialogOpen(false);
    toast.success('Venues updated successfully!');
  };

  const addPresetEvents = () => {
    const presetEvents: Partial<ScheduleEvent>[] = [
      {
        time: '07:00',
        title: 'Vendor Setup Begins',
        description: 'Caterers, florists, and decorators arrive',
        location: 'Reception Venue',
        duration: 120,
        category: 'vendor',
        participants: ['Vendors', 'Wedding Coordinator'],
        notes: 'Coordinate all vendor arrivals'
      },
      {
        time: '11:00',
        title: 'Groom Preparation',
        description: 'Groom and groomsmen get ready',
        location: 'Groom Suite',
        duration: 120,
        category: 'preparation',
        participants: ['Groom', 'Groomsmen', 'Best Man'],
        notes: 'Keep it relaxed and fun'
      },
      {
        time: '13:30',
        title: 'Bridal Party Photos',
        description: 'Group photos with bridesmaids',
        location: 'Photo Location',
        duration: 30,
        category: 'photos',
        participants: ['Bride', 'Bridesmaids', 'Photographer'],
        notes: 'Fun group shots'
      },
      {
        time: '20:00',
        title: 'Dancing & Party',
        description: 'Open dance floor and celebration',
        location: 'Reception Venue',
        duration: 180,
        category: 'reception',
        participants: ['All Guests', 'DJ'],
        notes: 'Party time!'
      },
      {
        time: '23:00',
        title: 'Last Dance & Send-off',
        description: 'Final dance and couple exit',
        location: 'Reception Venue',
        duration: 30,
        category: 'reception',
        participants: ['All Guests'],
        notes: 'Sparklers or bubbles for send-off'
      }
    ];

    const newEvents = presetEvents.map(preset => ({
      id: Date.now().toString() + Math.random(),
      time: preset.time!,
      title: preset.title!,
      description: preset.description || '',
      location: preset.location || '',
      duration: preset.duration || 60,
      category: preset.category as ScheduleEvent['category'] || 'personal',
      participants: preset.participants || [],
      notes: preset.notes || '',
      isComplete: false
    }));

    const allEvents = [...scheduleData.events, ...newEvents]
      .sort((a, b) => a.time.localeCompare(b.time));

    setScheduleData({
      ...scheduleData,
      events: allEvents
    });

    toast.success('Preset events added!');
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
    return formatTime(endTime);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-rose-500" />
            <span>Wedding Day Schedule</span>
          </h1>
          <p className="text-gray-600 mt-1">Plan every moment of your perfect day</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={addPresetEvents}>
            <Sparkles className="h-4 w-4 mr-2" />
            Add Presets
          </Button>
          <Button variant="outline" onClick={handleSaveSchedule}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" onClick={handleExportSchedule}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Wedding Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Wedding Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Wedding Date</Label>
              <Input
                type="date"
                value={scheduleData.weddingDate}
                onChange={(e) => setScheduleData({
                  ...scheduleData,
                  weddingDate: e.target.value
                })}
              />
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setIsEditVenuesDialogOpen(true)}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Edit Venues
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Events:</span>
                <span className="font-medium">{scheduleData.events.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completed:</span>
                <span className="font-medium text-green-600">
                  {scheduleData.events.filter(e => e.isComplete).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Remaining:</span>
                <span className="font-medium text-blue-600">
                  {scheduleData.events.filter(e => !e.isComplete).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Timeline</CardTitle>
            <Dialog open={isAddEventDialogOpen} onOpenChange={setIsAddEventDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => {
                    setEditingEvent(null);
                    setNewEvent({
                      time: '',
                      title: '',
                      description: '',
                      location: '',
                      duration: 60,
                      category: 'personal',
                      participants: [],
                      notes: ''
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingEvent ? 'Edit Event' : 'Add New Event'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Time</Label>
                      <Input
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Duration (minutes)</Label>
                      <Input
                        type="number"
                        value={newEvent.duration}
                        onChange={(e) => setNewEvent({...newEvent, duration: parseInt(e.target.value) || 60})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      placeholder="Event title"
                    />
                  </div>

                  <div>
                    <Label>Category</Label>
                    <Select 
                      value={newEvent.category} 
                      onValueChange={(value: ScheduleEvent['category']) => 
                        setNewEvent({...newEvent, category: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="preparation">Preparation</SelectItem>
                        <SelectItem value="ceremony">Ceremony</SelectItem>
                        <SelectItem value="reception">Reception</SelectItem>
                        <SelectItem value="photos">Photos</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="vendor">Vendor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Location</Label>
                    <Input
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                      placeholder="Event location"
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      placeholder="Brief description"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      value={newEvent.notes}
                      onChange={(e) => setNewEvent({...newEvent, notes: e.target.value})}
                      placeholder="Additional notes"
                      rows={2}
                    />
                  </div>

                  <Button 
                    onClick={editingEvent ? handleUpdateEvent : handleAddEvent}
                    className="w-full"
                  >
                    {editingEvent ? 'Update Event' : 'Add Event'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduleData.events.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No events scheduled yet</p>
                <p className="text-sm">Add your first event to get started!</p>
              </div>
            ) : (
              scheduleData.events.map((event) => {
                const IconComponent = categoryIcons[event.category];
                return (
                  <div
                    key={event.id}
                    className={`border rounded-lg p-4 ${
                      event.isComplete 
                        ? 'bg-green-50 border-green-200 opacity-75' 
                        : 'bg-white border-gray-200 hover:shadow-md'
                    } transition-all`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={event.isComplete}
                              onChange={() => handleToggleComplete(event.id)}
                              className="rounded border-gray-300"
                            />
                            <span className="font-bold text-lg">
                              {formatTime(event.time)}
                            </span>
                            <span className="text-sm text-gray-500">
                              - {getEndTime(event.time, event.duration)}
                            </span>
                          </div>
                          <Badge className={categoryColors[event.category]}>
                            <IconComponent className="h-3 w-3 mr-1" />
                            {event.category}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1">
                          <h3 className={`font-semibold ${event.isComplete ? 'line-through' : ''}`}>
                            {event.title}
                          </h3>
                          {event.description && (
                            <p className="text-gray-600 text-sm">{event.description}</p>
                          )}
                          {event.location && (
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="h-3 w-3 mr-1" />
                              {event.location}
                            </div>
                          )}
                          {event.participants.length > 0 && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Users className="h-3 w-3 mr-1" />
                              {event.participants.join(', ')}
                            </div>
                          )}
                          {event.notes && (
                            <p className="text-xs text-gray-400 mt-2 italic">
                              "{event.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditEvent(event)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Venues Dialog */}
      <Dialog open={isEditVenuesDialogOpen} onOpenChange={setIsEditVenuesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Venue Locations</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Preparation Venue</Label>
              <Input
                value={scheduleData.venues.preparation}
                onChange={(e) => setScheduleData({
                  ...scheduleData,
                  venues: { ...scheduleData.venues, preparation: e.target.value }
                })}
                placeholder="Hotel, home, bridal suite..."
              />
            </div>
            <div>
              <Label>Ceremony Venue</Label>
              <Input
                value={scheduleData.venues.ceremony}
                onChange={(e) => setScheduleData({
                  ...scheduleData,
                  venues: { ...scheduleData.venues, ceremony: e.target.value }
                })}
                placeholder="Church, beach, garden..."
              />
            </div>
            <div>
              <Label>Reception Venue</Label>
              <Input
                value={scheduleData.venues.reception}
                onChange={(e) => setScheduleData({
                  ...scheduleData,
                  venues: { ...scheduleData.venues, reception: e.target.value }
                })}
                placeholder="Reception hall, restaurant..."
              />
            </div>
            <div>
              <Label>Photo Locations</Label>
              <Input
                value={scheduleData.venues.photos}
                onChange={(e) => setScheduleData({
                  ...scheduleData,
                  venues: { ...scheduleData.venues, photos: e.target.value }
                })}
                placeholder="Park, beach, scenic spots..."
              />
            </div>
            <Button 
              onClick={() => handleUpdateVenues(scheduleData.venues)}
              className="w-full"
            >
              Update Venues
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}