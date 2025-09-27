import React, { useState } from 'react';

// Vendor Categories Data
const vendorCategories = {
  'venue': { icon: '🏛️', color: 'bg-blue-100 text-blue-800', name: 'Venue' },
  'catering': { icon: '🍽️', color: 'bg-green-100 text-green-800', name: 'Catering' },
  'photography': { icon: '📸', color: 'bg-purple-100 text-purple-800', name: 'Photography' },
  'music': { icon: '🎵', color: 'bg-pink-100 text-pink-800', name: 'Music & DJ' },
  'flowers': { icon: '💐', color: 'bg-rose-100 text-rose-800', name: 'Flowers' },
  'transportation': { icon: '🚗', color: 'bg-indigo-100 text-indigo-800', name: 'Transportation' },
  'beauty': { icon: '💄', color: 'bg-amber-100 text-amber-800', name: 'Beauty & Hair' },
  'attire': { icon: '👗', color: 'bg-cyan-100 text-cyan-800', name: 'Attire' },
  'rings': { icon: '💍', color: 'bg-yellow-100 text-yellow-800', name: 'Rings & Jewelry' },
  'other': { icon: '📋', color: 'bg-gray-100 text-gray-800', name: 'Other' }
};

interface ContractCalendarProps {
  vendors: Array<{
    id: string;
    name: string;
    category: keyof typeof vendorCategories;
    status: 'researching' | 'contacted' | 'quoted' | 'booked' | 'paid' | 'completed';
    contractDate?: string;
    eventDate?: string;
    balanceDue?: number;
    finalPrice?: number;
    quotedPrice?: number;
  }>;
  customEvents: Array<{
    id: string;
    title: string;
    date: string;
    time?: string;
    type: 'meeting' | 'deadline' | 'reminder' | 'appointment' | 'other';
    description?: string;
    vendor?: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  onCustomEventsChange: (events: Array<{
    id: string;
    title: string;
    date: string;
    time?: string;
    type: 'meeting' | 'deadline' | 'reminder' | 'appointment' | 'other';
    description?: string;
    vendor?: string;
    priority: 'high' | 'medium' | 'low';
  }>) => void;
  onDateSelect: (date: string | null) => void;
  selectedDate: string | null;
}

export default function ContractCalendar({ 
  vendors, 
  customEvents, 
  onCustomEventsChange, 
  onDateSelect, 
  selectedDate 
}: ContractCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedViewType, setSelectedViewType] = useState<'month' | 'list'>('month');
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    type: 'meeting' as 'meeting' | 'deadline' | 'reminder' | 'appointment' | 'other',
    description: '',
    vendor: '',
    priority: 'medium' as 'high' | 'medium' | 'low'
  });

  // Handle keyboard events for the modal
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showAddEvent) {
        resetEventForm();
      }
    };

    if (showAddEvent) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showAddEvent]);

  // Enhanced event management functions
  const addCustomEvent = () => {
    try {
      // Enhanced validation
      if (!newEvent.title?.trim()) {
        alert('⚠️ Event title is required. Please enter a descriptive title for your event.');
        return;
      }
      
      if (!newEvent.date) {
        alert('⚠️ Event date is required. Please select a date for your event.');
        return;
      }

      const event = {
        id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: newEvent.title.trim(),
        date: newEvent.date,
        time: newEvent.time || '',
        type: newEvent.type,
        description: newEvent.description?.trim() || '',
        vendor: newEvent.vendor?.trim() || '',
        priority: newEvent.priority
      };
      
      onCustomEventsChange([...customEvents, event]);
      resetEventForm();
      
      alert(`✅ Event "${newEvent.title}" successfully added!`);
    } catch (error) {
      console.error('Error adding custom event:', error);
      alert('❌ Error adding event. Please check your input and try again.');
    }
  };

  const editCustomEvent = (eventId: string) => {
    try {
      const event = customEvents.find(e => e.id === eventId);
      if (event) {
        setNewEvent({
          title: event.title,
          date: event.date,
          time: event.time || '',
          type: event.type,
          description: event.description || '',
          vendor: event.vendor || '',
          priority: event.priority
        });
        setEditingEvent(eventId);
        setShowAddEvent(true);
      }
    } catch (error) {
      console.error('Error editing custom event:', error);
      alert('❌ Error loading event for editing. Please try again.');
    }
  };

  const updateCustomEvent = () => {
    try {
      if (!newEvent.title?.trim()) {
        alert('⚠️ Event title is required. Please enter a descriptive title for your event.');
        return;
      }
      
      if (!newEvent.date) {
        alert('⚠️ Event date is required. Please select a date for your event.');
        return;
      }

      if (!editingEvent) {
        alert('❌ Error: No event selected for editing. Please try again.');
        return;
      }

      const originalEvent = customEvents.find(e => e.id === editingEvent);
      const updatedEvent = {
        ...originalEvent,
        title: newEvent.title.trim(),
        date: newEvent.date,
        time: newEvent.time || '',
        type: newEvent.type,
        description: newEvent.description?.trim() || '',
        vendor: newEvent.vendor?.trim() || '',
        priority: newEvent.priority
      };
      
      const updatedEvents = customEvents.map(event =>
        event.id === editingEvent ? updatedEvent : event
      );
      
      onCustomEventsChange(updatedEvents);
      resetEventForm();
      alert(`✅ Event "${newEvent.title}" successfully updated!`);
      
    } catch (error) {
      console.error('Error updating custom event:', error);
      alert('❌ Error updating event. Please check your input and try again.');
    }
  };

  const deleteCustomEvent = (eventId: string) => {
    try {
      const eventToDelete = customEvents.find(event => event.id === eventId);
      if (!eventToDelete) {
        alert('❌ Event not found. It may have already been deleted.');
        return;
      }

      const confirmMessage = `Are you sure you want to delete this event?\n\n"${eventToDelete.title}"\n\nThis action cannot be undone.`;
      
      if (confirm(confirmMessage)) {
        const updatedEvents = customEvents.filter(event => event.id !== eventId);
        onCustomEventsChange(updatedEvents);
        alert(`✅ Event "${eventToDelete.title}" has been successfully deleted.`);
      }
    } catch (error) {
      console.error('Error deleting custom event:', error);
      alert('❌ Error deleting event. Please try again.');
    }
  };

  const resetEventForm = () => {
    try {
      setShowAddEvent(false);
      setEditingEvent(null);
      setNewEvent({
        title: '',
        date: '',
        time: '',
        type: 'meeting',
        description: '',
        vendor: '',
        priority: 'medium'
      });
    } catch (error) {
      console.error('Error resetting form:', error);
    }
  };

  // Calendar data processing
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthName = monthNames[currentMonth.getMonth()] + ' ' + currentMonth.getFullYear();

  // Get all calendar events from vendors and custom events
  const calendarEvents = [
    // Vendor contract events
    ...vendors.filter(v => v.contractDate).map(vendor => ({
      id: `contract-${vendor.id}`,
      title: `${vendor.name} Contract`,
      date: vendor.contractDate!,
      type: 'contract' as const,
      vendor: vendor.name,
      category: vendor.category,
      priority: 'high' as const
    })),
    // Vendor payment events
    ...vendors.filter(v => v.balanceDue && v.balanceDue > 0).map(vendor => ({
      id: `payment-${vendor.id}`,
      title: `${vendor.name} Payment Due`,
      date: vendor.eventDate || vendor.contractDate!,
      type: 'payment' as const,
      vendor: vendor.name,
      category: vendor.category,
      priority: 'high' as const,
      amount: vendor.balanceDue
    })),
    // Vendor service events
    ...vendors.filter(v => v.eventDate).map(vendor => ({
      id: `service-${vendor.id}`,
      title: `${vendor.name} Service`,
      date: vendor.eventDate!,
      type: 'service' as const,
      vendor: vendor.name,
      category: vendor.category,
      priority: 'medium' as const
    })),
    // Custom events
    ...customEvents.map(event => ({
      ...event,
      type: 'custom' as const
    }))
  ];

  // Get events for current month
  const currentMonthEvents = calendarEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === currentMonth.getMonth() && 
           eventDate.getFullYear() === currentMonth.getFullYear();
  });

  // Get upcoming events (next 30 days)
  const getUpcomingEvents = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    return calendarEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today && eventDate <= thirtyDaysFromNow;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Generate calendar grid
  const generateCalendarDays = () => {
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dateStr = date.toISOString().split('T')[0];
      const dayEvents = calendarEvents.filter(event => event.date === dateStr);
      const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate === dateStr;
      
      days.push({
        date,
        dateStr,
        dayEvents,
        isCurrentMonth,
        isToday,
        isSelected
      });
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newMonth);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'contract': return 'bg-blue-500';
      case 'payment': return 'bg-red-500';
      case 'service': return 'bg-green-500';
      case 'meeting': return 'bg-purple-500';
      case 'deadline': return 'bg-orange-500';
      case 'reminder': return 'bg-yellow-500';
      case 'appointment': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-amber-500 bg-amber-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const handleAddEventClick = () => {
    console.log('Add Event button clicked'); // Debug log
    
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Smart default based on selected date if any
    const defaultDate = selectedDate || todayStr;
    
    setNewEvent({
      title: '',
      date: defaultDate,
      time: '',
      type: 'meeting',
      description: '',
      vendor: '',
      priority: 'medium'
    });
    setEditingEvent(null);
    setShowAddEvent(true);
  };

  const quickAddEvent = (dateStr: string) => {
    try {
      // Set up quick add for the selected date
      const nextHour = new Date();
      nextHour.setHours(nextHour.getHours() + 1);
      nextHour.setMinutes(0);
      const defaultTime = nextHour.toTimeString().slice(0, 5);
      
      setNewEvent({
        title: '',
        date: dateStr,
        time: dateStr === new Date().toISOString().split('T')[0] ? defaultTime : '',
        type: 'meeting',
        description: '',
        vendor: '',
        priority: 'medium'
      });
      setEditingEvent(null);
      setShowAddEvent(true);
      
      // Focus on title input after modal opens
      setTimeout(() => {
        const titleInput = document.querySelector('input[placeholder*="Enter event title"]') as HTMLInputElement;
        if (titleInput) {
          titleInput.focus();
        }
      }, 100);
    } catch (error) {
      console.error('Error in quick add event:', error);
      alert('❌ Error opening event form. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-amber-800">{monthName}</h4>
          <p className="text-sm text-amber-700">Track contract deadlines and important vendor dates</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddEventClick();
            }}
            type="button"
            className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700 transition-colors font-semibold flex items-center gap-2 cursor-pointer"
          >
            <span className="text-base">➕</span>
            Add Event
          </button>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setSelectedViewType('month')}
              className={`px-4 py-2 text-sm transition-colors ${
                selectedViewType === 'month' 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setSelectedViewType('list')}
              className={`px-4 py-2 text-sm transition-colors ${
                selectedViewType === 'list' 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between bg-white rounded-lg border p-4">
        <button
          onClick={() => navigateMonth('prev')}
          className="px-3 py-1 text-amber-700 hover:bg-amber-50 rounded transition-colors"
        >
          ← Previous
        </button>
        <h3 className="text-lg font-semibold text-amber-800">{monthName}</h3>
        <button
          onClick={() => navigateMonth('next')}
          className="px-3 py-1 text-amber-700 hover:bg-amber-50 rounded transition-colors"
        >
          Next →
        </button>
      </div>

      {/* Calendar Content */}
      {selectedViewType === 'month' ? (
        <div className="bg-white rounded-lg border overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 bg-gray-50 border-b">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-700">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {generateCalendarDays().map((day, index) => (
              <div
                key={index}
                onClick={() => {\n                  if (day.isCurrentMonth) {\n                    quickAddEvent(day.dateStr);\n                  }\n                }}
                onDoubleClick={() => {
                  if (day.isCurrentMonth) {
                    quickAddEvent(day.dateStr);
                  }
                }}
                className={`min-h-[100px] p-2 border-b border-r cursor-pointer transition-colors ${
                  !day.isCurrentMonth 
                    ? 'bg-gray-50 text-gray-400 cursor-default' 
                    : day.isSelected
                      ? 'bg-amber-50 border-amber-300'
                      : day.isToday
                        ? 'bg-blue-50 hover:bg-blue-100'
                        : 'hover:bg-rose-50'
                }`}
                title={day.isCurrentMonth ? 'Click to add event for this date' : ''}
              >
                <div className={`text-sm mb-1 ${
                  day.isToday ? 'font-bold text-blue-600' : ''
                }`}>
                  {day.date.getDate()}
                </div>
                
                <div className="space-y-1">
                  {day.dayEvents.slice(0, 3).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`text-xs p-1 rounded truncate ${getEventTypeColor(event.type)} text-white`}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {day.dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{day.dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-amber-800">Upcoming Events</h3>
          </div>
          <div className="divide-y">
            {getUpcomingEvents().slice(0, 20).map((event, index) => (
              <div key={index} className={`p-4 border-l-4 ${getPriorityColor(event.priority)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`}></div>
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        event.priority === 'high' ? 'bg-red-100 text-red-800' :
                        event.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {event.priority}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {new Date(event.date).toLocaleDateString()} 
                      {event.time && ` at ${event.time}`}
                    </div>
                    {event.vendor && (
                      <div className="text-sm text-gray-500 mt-1">
                        Vendor: {event.vendor}
                      </div>
                    )}
                    {event.description && (
                      <div className="text-sm text-gray-600 mt-2">
                        {event.description}
                      </div>
                    )}
                  </div>
                  {event.type === 'custom' && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => editCustomEvent(event.id)}
                        className="text-amber-600 hover:text-amber-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCustomEvent(event.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {getUpcomingEvents().length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No upcoming events in the next 30 days
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <h4 className="font-semibold text-amber-800 mb-2">Quick Tips</h4>
            <div className="text-sm text-amber-700 space-y-1">
              <div>• <strong>Click</strong> any calendar date to quickly add an event</div>
              <div>• Click the <strong>"Add Event"</strong> button for full options</div>
              <div>• Events are automatically validated for duplicates and past dates</div>
              <div>• Use descriptive titles and set appropriate priorities for better organization</div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{calendarEvents.filter(e => e.type === 'contract').length}</div>
          <div className="text-sm text-gray-600">Contract Events</div>
        </div>
        <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{calendarEvents.filter(e => e.type === 'payment').length}</div>
          <div className="text-sm text-gray-600">Payment Due</div>
        </div>
        <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{calendarEvents.filter(e => e.type === 'service').length}</div>
          <div className="text-sm text-gray-600">Service Dates</div>
        </div>
        <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{customEvents.length}</div>
          <div className="text-sm text-gray-600">Custom Events</div>
        </div>
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 p-2 text-xs text-gray-600">
          Debug: showAddEvent = {showAddEvent.toString()}, editingEvent = {editingEvent || 'null'}
        </div>
      )}

      {/* Add/Edit Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-amber-800">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h3>
                <button
                  onClick={resetEventForm}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                editingEvent ? updateCustomEvent() : addCustomEvent();
              }}>
                <div className="space-y-4">
                  {/* Event Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      placeholder="Enter event title (e.g., Vendor meeting, Final fitting)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                      autoFocus
                      required
                    />
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                      />
                    </div>
                  </div>

                  {/* Event Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Type
                    </label>
                    <select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({...newEvent, type: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                    >
                      <option value="meeting">Meeting</option>
                      <option value="deadline">Deadline</option>
                      <option value="reminder">Reminder</option>
                      <option value="appointment">Appointment</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={newEvent.priority}
                      onChange={(e) => setNewEvent({...newEvent, priority: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  {/* Vendor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Related Vendor (Optional)
                    </label>
                    <input
                      type="text"
                      value={newEvent.vendor}
                      onChange={(e) => setNewEvent({...newEvent, vendor: e.target.value})}
                      placeholder="Enter vendor name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      placeholder="Enter event description, notes, or additional details"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 mt-6 pt-4 border-t">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-semibold"
                  >
                    {editingEvent ? 'Update Event' : 'Add Event'}
                  </button>
                  <button
                    type="button"
                    onClick={resetEventForm}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}