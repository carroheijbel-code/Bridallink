// This file has been moved to WeddingTimeline.tsx
// Keeping this as placeholder to avoid import conflicts

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number; // in minutes
  category: 'ceremony' | 'reception' | 'photography' | 'preparation' | 'other';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  vendor?: string;
  location?: string;
  notes?: string;
  dependencies?: string[]; // IDs of events this depends on
}

export function Timeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: '1',
      title: 'Bridal Party Hair & Makeup',
      description: 'Hair and makeup for bride and bridesmaids',
      date: '2024-08-15',
      time: '08:00',
      duration: 180,
      category: 'preparation',
      priority: 'high',
      status: 'pending',
      vendor: 'Glamour Beauty Studio',
      location: 'Bridal Suite',
      notes: 'Start with bridesmaids, bride last'
    },
    {
      id: '2',
      title: 'Groom & Groomsmen Preparation',
      description: 'Getting ready and final preparations',
      date: '2024-08-15',
      time: '10:00',
      duration: 120,
      category: 'preparation',
      priority: 'medium',
      status: 'pending',
      location: 'Groom Suite',
      notes: 'Include outfit check and photos'
    },
    {
      id: '3',
      title: 'First Look Photography',
      description: 'Private first look session between bride and groom',
      date: '2024-08-15',
      time: '12:00',
      duration: 30,
      category: 'photography',
      priority: 'high',
      status: 'pending',
      vendor: 'Island Moments Photography',
      location: 'Garden Terrace',
      dependencies: ['1', '2']
    },
    {
      id: '4',
      title: 'Bridal Party Photos',
      description: 'Group photos with bridesmaids and groomsmen',
      date: '2024-08-15',
      time: '12:45',
      duration: 45,
      category: 'photography',
      priority: 'high',
      status: 'pending',
      vendor: 'Island Moments Photography',
      location: 'Beach Area',
      dependencies: ['3']
    },
    {
      id: '5',
      title: 'Guest Arrival',
      description: 'Guests arrive and are seated for ceremony',
      date: '2024-08-15',
      time: '14:30',
      duration: 30,
      category: 'ceremony',
      priority: 'high',
      status: 'pending',
      location: 'Beach Ceremony Site'
    },
    {
      id: '6',
      title: 'Wedding Ceremony',
      description: 'The main wedding ceremony',
      date: '2024-08-15',
      time: '15:00',
      duration: 45,
      category: 'ceremony',
      priority: 'high',
      status: 'pending',
      location: 'Beach Ceremony Site',
      notes: 'Sunset ceremony with ocean backdrop'
    },
    {
      id: '7',
      title: 'Cocktail Hour',
      description: 'Drinks and appetizers while photos are taken',
      date: '2024-08-15',
      time: '15:45',
      duration: 75,
      category: 'reception',
      priority: 'medium',
      status: 'pending',
      location: 'Terrace Bar',
      vendor: 'Mediterranean Catering'
    },
    {
      id: '8',
      title: 'Couple Portraits',
      description: 'Romantic couple photos during golden hour',
      date: '2024-08-15',
      time: '16:00',
      duration: 60,
      category: 'photography',
      priority: 'high',
      status: 'pending',
      vendor: 'Island Moments Photography',
      location: 'Various scenic spots'
    },
    {
      id: '9',
      title: 'Reception Entrance',
      description: 'Grand entrance of newlyweds to reception',
      date: '2024-08-15',
      time: '17:00',
      duration: 15,
      category: 'reception',
      priority: 'high',
      status: 'pending',
      location: 'Reception Hall'
    },
    {
      id: '10',
      title: 'Welcome Speech & Toast',
      description: 'Welcome speech and champagne toast',
      date: '2024-08-15',
      time: '17:15',
      duration: 15,
      category: 'reception',
      priority: 'medium',
      status: 'pending',
      location: 'Reception Hall'
    },
    {
      id: '11',
      title: 'Dinner Service',
      description: 'Three-course Mediterranean dinner',
      date: '2024-08-15',
      time: '17:30',
      duration: 90,
      category: 'reception',
      priority: 'high',
      status: 'pending',
      vendor: 'Mediterranean Catering',
      location: 'Reception Hall'
    },
    {
      id: '12',
      title: 'Speeches',
      description: 'Wedding speeches from family and friends',
      date: '2024-08-15',
      time: '19:00',
      duration: 30,
      category: 'reception',
      priority: 'medium',
      status: 'pending',
      location: 'Reception Hall'
    },
    {
      id: '13',
      title: 'First Dance',
      description: 'Couple\'s first dance as married couple',
      date: '2024-08-15',
      time: '19:30',
      duration: 15,
      category: 'reception',
      priority: 'high',
      status: 'pending',
      location: 'Dance Floor'
    },
    {
      id: '14',
      title: 'Dancing & Celebration',
      description: 'Open dancing and celebration',
      date: '2024-08-15',
      time: '19:45',
      duration: 165,
      category: 'reception',
      priority: 'medium',
      status: 'pending',
      vendor: 'Island Beats DJ',
      location: 'Dance Floor'
    },
    {
      id: '15',
      title: 'Cake Cutting',
      description: 'Traditional cake cutting ceremony',
      date: '2024-08-15',
      time: '21:00',
      duration: 15,
      category: 'reception',
      priority: 'medium',
      status: 'pending',
      location: 'Reception Hall'
    },
    {
      id: '16',
      title: 'Grand Exit',
      description: 'Sparkler send-off and departure',
      date: '2024-08-15',
      time: '22:30',
      duration: 15,
      category: 'reception',
      priority: 'high',
      status: 'pending',
      location: 'Main Entrance'
    }
  ]);

  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState('2024-08-15'); // Wedding day
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '2024-08-15',
    time: '',
    duration: 60,
    category: 'other' as TimelineEvent['category'],
    priority: 'medium' as TimelineEvent['priority'],
    vendor: '',
    location: '',
    notes: ''
  });

  const categories = [
    { value: 'ceremony', label: 'Ceremony', color: 'bg-pink-100 text-pink-800' },
    { value: 'reception', label: 'Reception', color: 'bg-blue-100 text-blue-800' },
    { value: 'photography', label: 'Photography', color: 'bg-purple-100 text-purple-800' },
    { value: 'preparation', label: 'Preparation', color: 'bg-green-100 text-green-800' },
    { value: 'other', label: 'Other', color: 'bg-gray-100 text-gray-800' }
  ];

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };

  const filteredEvents = events.filter(event => {
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    const matchesDate = event.date === selectedDate;
    return matchesCategory && matchesDate;
  }).sort((a, b) => {
    const timeA = new Date(`${a.date}T${a.time}`).getTime();
    const timeB = new Date(`${b.date}T${b.time}`).getTime();
    return timeA - timeB;
  });

  const completedEvents = events.filter(e => e.status === 'completed').length;
  const totalEvents = events.length;
  const progressPercentage = totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0;

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.time) {
      toast.error('Please fill in the required fields');
      return;
    }

    const event: TimelineEvent = {
      id: Date.now().toString(),
      ...newEvent,
      status: 'pending'
    };

    setEvents([...events, event]);
    setNewEvent({
      title: '',
      description: '',
      date: '2024-08-15',
      time: '',
      duration: 60,
      category: 'other',
      priority: 'medium',
      vendor: '',
      location: '',
      notes: ''
    });
    setIsAddEventDialogOpen(false);
    toast.success('Event added to timeline!');
  };

  const handleStatusUpdate = (eventId: string, status: TimelineEvent['status']) => {
    setEvents(events.map(event =>
      event.id === eventId ? { ...event, status } : event
    ));
    toast.success(`Event marked as ${status}`);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
    toast.success('Event removed from timeline');
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  const getEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;
    const endHours = Math.floor(endMinutes / 60) % 24;
    const endMins = endMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  const getCategoryColor = (category: TimelineEvent['category']) => {
    const categoryObj = categories.find(c => c.value === category);
    return categoryObj?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-2">
            <Clock className="h-8 w-8 text-blue-500" />
            <span>Wedding Day Timeline</span>
          </h1>
          <p className="text-gray-600 mt-1">Plan every moment of your perfect day</p>
        </div>
        
        <Dialog open={isAddEventDialogOpen} onOpenChange={setIsAddEventDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Timeline Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Event Title *</Label>
                <Input
                  placeholder="e.g., Ceremony Rehearsal"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="Event details..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Start Time *</Label>
                  <Input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({...newEvent, duration: parseInt(e.target.value) || 60})}
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={newEvent.category} onValueChange={(value: TimelineEvent['category']) => setNewEvent({...newEvent, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Priority</Label>
                  <Select value={newEvent.priority} onValueChange={(value: TimelineEvent['priority']) => setNewEvent({...newEvent, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    placeholder="Event location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label>Vendor (Optional)</Label>
                <Input
                  placeholder="Vendor name"
                  value={newEvent.vendor}
                  onChange={(e) => setNewEvent({...newEvent, vendor: e.target.value})}
                />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  placeholder="Additional notes..."
                  value={newEvent.notes}
                  onChange={(e) => setNewEvent({...newEvent, notes: e.target.value})}
                />
              </div>
              <Button onClick={handleAddEvent} className="w-full">
                Add Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Completed: {completedEvents} events</span>
              <span>Total: {totalEvents} events</span>
            </div>
            <Progress value={progressPercentage} className="h-4" />
            <p className="text-center text-sm text-gray-600">
              {progressPercentage.toFixed(1)}% Complete
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <Label>Date</Label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full sm:w-48"
          />
        </div>
        <div>
          <Label>Category</Label>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>
            Timeline for {new Date(selectedDate).toLocaleDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No events scheduled for this date</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event, index) => {
                const endTime = getEndTime(event.time, event.duration);
                const isOverlapping = index > 0 && 
                  filteredEvents[index - 1] && 
                  getEndTime(filteredEvents[index - 1].time, filteredEvents[index - 1].duration) > event.time;

                return (
                  <div key={event.id} className={`relative ${isOverlapping ? 'border-l-4 border-yellow-400 pl-4' : ''}`}>
                    {isOverlapping && (
                      <div className="absolute -left-2 top-0 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        Schedule Conflict
                      </div>
                    )}
                    
                    <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      {/* Time Column */}
                      <div className="flex-shrink-0 w-24 text-center">
                        <div className="text-lg font-bold text-gray-800">
                          {formatTime(event.time)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDuration(event.duration)}
                        </div>
                        <div className="text-xs text-gray-400">
                          to {formatTime(endTime)}
                        </div>
                      </div>

                      {/* Status Icon */}
                      <div className="flex-shrink-0 pt-2">
                        {event.status === 'completed' ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : event.status === 'in-progress' ? (
                          <Clock className="h-6 w-6 text-blue-500" />
                        ) : (
                          <Circle className="h-6 w-6 text-gray-400" />
                        )}
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className={`font-medium ${event.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                              {event.title}
                            </h3>
                            {event.description && (
                              <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className={getCategoryColor(event.category)}>
                              {categories.find(c => c.value === event.category)?.label}
                            </Badge>
                            <Badge className={priorityColors[event.priority]}>
                              {event.priority}
                            </Badge>
                            {event.priority === 'high' && (
                              <Star className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                          {event.location && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          {event.vendor && (
                            <div className="flex items-center space-x-1">
                              <span>Vendor: {event.vendor}</span>
                            </div>
                          )}
                        </div>

                        {event.notes && (
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            <strong>Notes:</strong> {event.notes}
                          </p>
                        )}

                        {/* Dependencies */}
                        {event.dependencies && event.dependencies.length > 0 && (
                          <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                            <AlertTriangle className="h-3 w-3 inline mr-1" />
                            Depends on: {event.dependencies.map(depId => {
                              const depEvent = events.find(e => e.id === depId);
                              return depEvent?.title;
                            }).join(', ')}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-2">
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStatusUpdate(event.id, 'completed')}
                            className={event.status === 'completed' ? 'text-green-600' : ''}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStatusUpdate(event.id, 'in-progress')}
                            className={event.status === 'in-progress' ? 'text-blue-600' : ''}
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {categories.slice(0, 4).map((category) => {
          const categoryEvents = events.filter(e => e.category === category.value);
          const completedInCategory = categoryEvents.filter(e => e.status === 'completed').length;
          
          return (
            <Card key={category.value}>
              <CardContent className="p-4 text-center">
                <h3 className="font-medium">{category.label}</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {completedInCategory}/{categoryEvents.length}
                </p>
                <p className="text-sm text-gray-600">Events Complete</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}