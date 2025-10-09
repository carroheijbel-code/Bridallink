import React, { useState } from 'react';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'meeting' | 'appointment' | 'reminder' | 'deadline';
  description?: string;
}

export default function EventCalendar() {
  const [events, setEvents] = useState<Event[]>(() => {
    // Load events from localStorage on initial mount
    try {
      const savedEvents = localStorage.getItem('bridallink_calendar_events');
      if (savedEvents) {
        return JSON.parse(savedEvents);
      }
    } catch (error) {
      console.error('Error loading calendar events from localStorage:', error);
    }
    return [];
  });
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    time: '',
    type: 'meeting',
    description: ''
  });

  // Save events to localStorage whenever they change
  React.useEffect(() => {
    try {
      localStorage.setItem('bridallink_calendar_events', JSON.stringify(events));
      console.log('✅ Calendar events saved to localStorage:', events.length, 'events');
    } catch (error) {
      console.error('❌ Error saving calendar events to localStorage:', error);
    }
  }, [events]);

  // Get current month and year
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const formatDate = (day: number) => {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getEventsForDate = (day: number | null) => {
    if (!day) return [];
    const dateStr = formatDate(day);
    return events.filter(event => event.date === dateStr);
  };

  const addEvent = () => {
    // Simple and reliable validation
    const title = newEvent.title?.trim();
    const time = newEvent.time?.trim();
    
    // Validate title
    if (!title) {
      alert('Please enter an event title.');
      return;
    }
    
    // Validate time - HTML5 time input always provides valid format when filled
    if (!time) {
      alert('Please select a time for the event.');
      return;
    }

    // Create the event
    const event: Event = {
      id: Date.now().toString(),
      title: title,
      date: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`,
      time: time,
      type: newEvent.type as Event['type'] || 'meeting',
      description: newEvent.description?.trim() || ''
    };
    
    setEvents(prevEvents => [...prevEvents, event]);
    
    // Reset form and close
    resetEventForm();
    setShowAddForm(false);
    
    // Show success message
    alert(`✅ Event "${event.title}" saved successfully for ${selectedDate.toLocaleDateString('en-GB')}!`);
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  // Helper function to reset the form completely
  const resetEventForm = () => {
    setNewEvent({
      title: '',
      time: '',
      type: 'meeting' as Event['type'],
      description: ''
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    setSelectedDate(newDate);
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500';
      case 'appointment': return 'bg-green-500';
      case 'reminder': return 'bg-yellow-500';
      case 'deadline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="bg-gradient-to-r from-amber-100 to-rose-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <span className="text-2xl">📅</span>
        </div>
        <h1 className="text-3xl font-bold text-amber-800">Wedding Calendar</h1>
        <p className="text-amber-700">Keep track of all your important meetings and appointments</p>
        
        {/* Instructions */}
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 max-w-md mx-auto">
          <div className="flex items-center gap-2 justify-center text-sm text-rose-800">
            <span className="text-rose-600">💡</span>
            <span className="font-semibold">Click any date</span>
            <span>to add an event instantly!</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ←
              </button>
              <h2 className="text-xl font-bold text-amber-800">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                →
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div key={day} className="p-2 text-center font-semibold text-gray-600 text-sm">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const dayEvents = getEventsForDate(day);
                const isSelected = day && 
                  day === selectedDate.getDate() && 
                  currentMonth === selectedDate.getMonth() && 
                  currentYear === selectedDate.getFullYear();
                
                return (
                  <div
                    key={index}
                    className={`min-h-[80px] p-1 border rounded-lg cursor-pointer transition-colors ${
                      day ? 'hover:bg-gray-50' : ''
                    } ${
                      isToday(day) ? 'bg-amber-100 border-amber-300' : 
                      isSelected ? 'bg-rose-100 border-rose-300' :
                      'bg-white border-gray-200'
                    }`}
                    onClick={() => {
                      if (day) {
                        setSelectedDate(new Date(currentYear, currentMonth, day));
                        // Reset form when selecting a new date to ensure clean state
                        resetEventForm();
                        setShowAddForm(true); // Automatically show add form when clicking a date
                      }
                    }}
                  >
                    {day && (
                      <>
                        <div className={`text-sm font-medium ${isToday(day) ? 'text-amber-800' : isSelected ? 'text-rose-800' : 'text-gray-700'}`}>
                          {day}
                        </div>
                        <div className="space-y-1 mt-1">
                          {dayEvents.slice(0, 2).map(event => (
                            <div
                              key={event.id}
                              className={`text-xs px-1 py-0.5 rounded text-white truncate ${getEventTypeColor(event.type)}`}
                              title={event.title}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Event Panel */}
        <div className="space-y-6">
          {/* Add Event Button */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <button
              onClick={() => {
                if (!showAddForm) {
                  // Reset form when opening the add form
                  resetEventForm();
                }
                setShowAddForm(!showAddForm);
              }}
              className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Add New Event
            </button>
          </div>

          {/* Add Event Form */}
          {showAddForm && (
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-amber-800 mb-4">New Event</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={newEvent.title || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                    placeholder="Enter event title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    {selectedDate.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                    {newEvent.time && newEvent.time.trim().length > 0 && (
                      <span className="text-green-600 ml-2">✓ Time set: {newEvent.time}</span>
                    )}
                  </label>
                  <input
                    type="time"
                    value={newEvent.time || ''}
                    onChange={(e) => {
                      console.log('Time input changed:', e.target.value);
                      console.log('Previous time value:', newEvent.time);
                      // Create a completely new state object to ensure React detects the change
                      setNewEvent(prevState => ({
                        ...prevState,
                        time: e.target.value
                      }));
                      console.log('Time updated to:', e.target.value);
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                      newEvent.time && newEvent.time.trim().length > 0 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-300'
                    }`}
                    required
                  />
                  {newEvent.time && newEvent.time.trim().length > 0 && (
                    <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <span>✓</span>
                      <span>Time selected: {newEvent.time}</span>
                    </div>
                  )}
                  {(!newEvent.time || newEvent.time.trim().length === 0) && (
                    <div className="text-xs text-gray-500 mt-1">
                      Please select a time for your event
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type
                  </label>
                  <select
                    value={newEvent.type || 'meeting'}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as Event['type'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="appointment">Appointment</option>
                    <option value="reminder">Reminder</option>
                    <option value="deadline">Deadline</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newEvent.description || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                    placeholder="Add any additional notes..."
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={addEvent}
                    className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Save Event
                  </button>
                  <button
                    onClick={() => {
                      resetEventForm();
                      setShowAddForm(false);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Today's Events */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-amber-800 mb-4">
              Events for {selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {getEventsForDate(selectedDate.getDate()).length > 0 ? (
                getEventsForDate(selectedDate.getDate()).map(event => (
                  <div key={event.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`}></div>
                        <span className="font-medium text-amber-800">{event.title}</span>
                      </div>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="text-red-600 hover:text-red-800 text-xs px-1"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      {event.time} • {event.type}
                    </div>
                    {event.description && (
                      <div className="text-sm text-gray-500 mt-1">
                        {event.description}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No events scheduled for this date
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-amber-800 mb-4">All Upcoming Events</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {events
                .filter(event => new Date(event.date) >= new Date())
                .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
                .slice(0, 5)
                .map(event => (
                  <div key={event.id} className="flex items-center gap-2 p-2 rounded bg-gray-50">
                    <div className={`w-2 h-2 rounded-full ${getEventTypeColor(event.type)}`}></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">{event.title}</div>
                      <div className="text-xs text-gray-500">{event.date} at {event.time}</div>
                    </div>
                  </div>
                ))
              }
              {events.filter(event => new Date(event.date) >= new Date()).length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No upcoming events
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}