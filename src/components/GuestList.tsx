import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Heart,
  Briefcase,
  Home,
  Upload,
  FileText,
  Download,
  AlertTriangle,
  X,
  Send,
  Eye,
  Calendar,
  MapPin,
  Loader
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: 'family' | 'friends' | 'colleagues' | 'other';
  rsvpStatus: 'pending' | 'confirmed' | 'declined';
  plusOne: boolean;
  dietaryRestrictions: string;
  notes: string;
  addedDate: string;
  invitationSent?: boolean;
  invitationSentAt?: string;
  rsvpRespondedAt?: string;
}

const SAMPLE_GUESTS: Guest[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    category: 'family',
    rsvpStatus: 'confirmed',
    plusOne: true,
    dietaryRestrictions: 'Vegetarian',
    notes: 'Aunt Sarah - loves flowers',
    addedDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Mike & Lisa Chen',
    email: 'mike.chen@email.com',
    phone: '(555) 234-5678',
    category: 'friends',
    rsvpStatus: 'confirmed',
    plusOne: false,
    dietaryRestrictions: '',
    notes: 'College friends',
    addedDate: '2024-01-16'
  },
  {
    id: '3',
    name: 'Robert Williams',
    email: 'rob.williams@company.com',
    phone: '(555) 345-6789',
    category: 'colleagues',
    rsvpStatus: 'pending',
    plusOne: true,
    dietaryRestrictions: 'Gluten-free',
    notes: 'Manager at work',
    addedDate: '2024-01-17'
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    email: 'emily.rod@email.com',
    phone: '(555) 456-7890',
    category: 'friends',
    rsvpStatus: 'declined',
    plusOne: false,
    dietaryRestrictions: '',
    notes: 'Will be traveling',
    addedDate: '2024-01-18'
  },
  {
    id: '5',
    name: 'David & Karen Smith',
    email: 'david.smith@email.com',
    phone: '(555) 567-8901',
    category: 'family',
    rsvpStatus: 'confirmed',
    plusOne: false,
    dietaryRestrictions: 'No shellfish',
    notes: 'Uncle David and Aunt Karen',
    addedDate: '2024-01-19'
  }
];

interface ImportError {
  row: number;
  field: string;
  message: string;
}

interface ParsedGuest extends Omit<Guest, 'id' | 'addedDate'> {
  rowIndex: number;
}

export default function GuestList() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterRSVP, setFilterRSVP] = useState<string>('all');
  
  // CSV Import states
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedGuest[]>([]);
  const [importErrors, setImportErrors] = useState<ImportError[]>([]);
  const [importStep, setImportStep] = useState<'upload' | 'preview' | 'complete'>('upload');

  // Invitation states
  const [isInvitationDialogOpen, setIsInvitationDialogOpen] = useState(false);
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [isInvitationDialogOnly, setIsInvitationDialogOnly] = useState(false);
  const [sendingInvitations, setSendingInvitations] = useState(false);
  const [invitationResults, setInvitationResults] = useState<any[]>([]);
  const [invitationStep, setInvitationStep] = useState<'compose' | 'sending' | 'results'>('compose');
  
  // Event details for invitations
  const [eventDetails, setEventDetails] = useState({
    coupleName: 'Sarah & John',
    eventDate: '2024-06-15',
    venue: 'Rose Garden Chapel',
    time: '4:00 PM'
  });

  const [newGuest, setNewGuest] = useState<Omit<Guest, 'id' | 'addedDate'>>({
    name: '',
    email: '',
    phone: '',
    category: 'friends',
    rsvpStatus: 'pending',
    plusOne: false,
    dietaryRestrictions: '',
    notes: ''
  });

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || guest.category === filterCategory;
    const matchesRSVP = filterRSVP === 'all' || guest.rsvpStatus === filterRSVP;
    
    return matchesSearch && matchesCategory && matchesRSVP;
  });

  const handleAddGuest = () => {
    if (!newGuest.name.trim()) return;

    const guest: Guest = {
      ...newGuest,
      id: Date.now().toString(),
      addedDate: new Date().toISOString().split('T')[0]
    };

    const updatedGuests = [...guests, guest];
    setGuests(updatedGuests);
    saveGuests(updatedGuests);
    
    setNewGuest({
      name: '',
      email: '',
      phone: '',
      category: 'friends',
      rsvpStatus: 'pending',
      plusOne: false,
      dietaryRestrictions: '',
      notes: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest);
    setNewGuest(guest);
    setIsAddDialogOpen(true);
  };

  const handleUpdateGuest = () => {
    if (!editingGuest || !newGuest.name.trim()) return;

    const updatedGuests = guests.map(guest => 
      guest.id === editingGuest.id 
        ? { ...newGuest, id: editingGuest.id, addedDate: editingGuest.addedDate }
        : guest
    );
    
    setGuests(updatedGuests);
    saveGuests(updatedGuests);
    
    setEditingGuest(null);
    setNewGuest({
      name: '',
      email: '',
      phone: '',
      category: 'friends',
      rsvpStatus: 'pending',
      plusOne: false,
      dietaryRestrictions: '',
      notes: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleDeleteGuest = (guestId: string) => {
    setGuests(guests.filter(guest => guest.id !== guestId));
  };

  const getStats = () => {
    const total = guests.length;
    const confirmed = guests.filter(g => g.rsvpStatus === 'confirmed').length;
    const declined = guests.filter(g => g.rsvpStatus === 'declined').length;
    const pending = guests.filter(g => g.rsvpStatus === 'pending').length;
    const plusOnes = guests.filter(g => g.plusOne && g.rsvpStatus === 'confirmed').length;
    const invitationsSent = guests.filter(g => g.invitationSent).length;

    return { total, confirmed, declined, pending, plusOnes, invitationsSent };
  };

  const stats = getStats();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'family': return <Heart className="h-4 w-4" />;
      case 'friends': return <Users className="h-4 w-4" />;
      case 'colleagues': return <Briefcase className="h-4 w-4" />;
      default: return <Home className="h-4 w-4" />;
    }
  };

  const getRSVPIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'declined': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  // CSV Import Functions
  const parseCSV = (text: string): ParsedGuest[] => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const data: ParsedGuest[] = [];
    const errors: ImportError[] = [];
    
    // Expected headers mapping
    const headerMap = {
      'name': ['name', 'guest name', 'full name'],
      'email': ['email', 'email address', 'e-mail'],
      'phone': ['phone', 'phone number', 'telephone', 'mobile'],
      'category': ['category', 'type', 'relation', 'group'],
      'rsvpstatus': ['rsvp', 'rsvp status', 'status', 'response'],
      'plusone': ['plus one', 'plusone', '+1', 'guest'],
      'dietaryrestrictions': ['dietary restrictions', 'dietary', 'diet', 'allergies'],
      'notes': ['notes', 'comments', 'remarks', 'memo']
    };
    
    const findHeaderIndex = (field: string): number => {
      const possibleNames = headerMap[field as keyof typeof headerMap] || [field];
      return headers.findIndex(header => 
        possibleNames.some(name => header.includes(name))
      );
    };
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      const nameIndex = findHeaderIndex('name');
      const emailIndex = findHeaderIndex('email');
      const phoneIndex = findHeaderIndex('phone');
      const categoryIndex = findHeaderIndex('category');
      const rsvpIndex = findHeaderIndex('rsvpstatus');
      const plusOneIndex = findHeaderIndex('plusone');
      const dietaryIndex = findHeaderIndex('dietaryrestrictions');
      const notesIndex = findHeaderIndex('notes');
      
      const name = nameIndex >= 0 ? values[nameIndex] || '' : '';
      
      if (!name.trim()) {
        errors.push({
          row: i + 1,
          field: 'name',
          message: 'Name is required'
        });
        continue;
      }
      
      // Validate and normalize category
      const rawCategory = categoryIndex >= 0 ? values[categoryIndex]?.toLowerCase() || 'friends' : 'friends';
      let category: Guest['category'] = 'friends';
      if (['family', 'friends', 'colleagues', 'other'].includes(rawCategory)) {
        category = rawCategory as Guest['category'];
      }
      
      // Validate and normalize RSVP status
      const rawRSVP = rsvpIndex >= 0 ? values[rsvpIndex]?.toLowerCase() || 'pending' : 'pending';
      let rsvpStatus: Guest['rsvpStatus'] = 'pending';
      if (['pending', 'confirmed', 'declined'].includes(rawRSVP)) {
        rsvpStatus = rawRSVP as Guest['rsvpStatus'];
      }
      
      // Validate plus one
      const rawPlusOne = plusOneIndex >= 0 ? values[plusOneIndex]?.toLowerCase() || 'false' : 'false';
      const plusOne = ['true', 'yes', '1', 'y'].includes(rawPlusOne);
      
      data.push({
        name,
        email: emailIndex >= 0 ? values[emailIndex] || '' : '',
        phone: phoneIndex >= 0 ? values[phoneIndex] || '' : '',
        category,
        rsvpStatus,
        plusOne,
        dietaryRestrictions: dietaryIndex >= 0 ? values[dietaryIndex] || '' : '',
        notes: notesIndex >= 0 ? values[notesIndex] || '' : '',
        rowIndex: i + 1
      });
    }
    
    setImportErrors(errors);
    return data;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setImportErrors([{
        row: 0,
        field: 'file',
        message: 'Please select a CSV file'
      }]);
      return;
    }
    
    setImportFile(file);
    setImportErrors([]);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);
      setParsedData(parsed);
      setImportStep('preview');
    };
    reader.readAsText(file);
  };

  const handleImportConfirm = () => {
    const newGuests: Guest[] = parsedData.map(guest => ({
      ...guest,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      addedDate: new Date().toISOString().split('T')[0]
    }));
    
    setGuests([...guests, ...newGuests]);
    setImportStep('complete');
    
    // Auto close after 2 seconds
    setTimeout(() => {
      resetImportDialog();
    }, 2000);
  };

  const resetImportDialog = () => {
    setIsImportDialogOpen(false);
    setImportFile(null);
    setParsedData([]);
    setImportErrors([]);
    setImportStep('upload');
  };

  const generateSampleCSV = () => {
    const headers = 'Name,Email,Phone,Category,RSVP Status,Plus One,Dietary Restrictions,Notes';
    const sampleData = [
      'John Smith,john@email.com,(555) 123-4567,family,pending,true,Vegetarian,Brother of bride',
      'Jane Doe,jane@email.com,(555) 987-6543,friends,confirmed,false,,College roommate',
      'Bob Johnson,bob@company.com,(555) 555-0123,colleagues,pending,true,Gluten-free,Work colleague'
    ];
    
    const csvContent = [headers, ...sampleData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guest_list_sample.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Invitation Functions
  const handleSendInvitations = async (guestIds: string[]) => {
    try {
      setSendingInvitations(true);
      setInvitationStep('sending');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5ea3da9c/invitations/send`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            guestIds,
            eventDetails,
            senderEmail: 'couple@wedding.com'
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send invitations');
      }

      const data = await response.json();
      setInvitationResults(data.results);
      
      // Update local guest data to reflect sent invitations
      setGuests(prevGuests => 
        prevGuests.map(guest => {
          const result = data.results.find((r: any) => r.guestId === guest.id);
          if (result && result.status === 'sent') {
            return {
              ...guest,
              invitationSent: true,
              invitationSentAt: new Date().toISOString()
            };
          }
          return guest;
        })
      );
      
      setInvitationStep('results');
      
    } catch (error) {
      console.error('Error sending invitations:', error);
      setInvitationResults([{
        guestId: 'error',
        status: 'error',
        message: 'Failed to send invitations. Please try again.'
      }]);
      setInvitationStep('results');
    } finally {
      setSendingInvitations(false);
    }
  };

  const openInvitationDialog = (guestIds?: string[]) => {
    if (guestIds) {
      setSelectedGuests(guestIds);
      setIsInvitationDialogOnly(true);
    } else {
      setSelectedGuests([]);
      setIsInvitationDialogOnly(false);
    }
    setIsInvitationDialogOpen(true);
    setInvitationStep('compose');
    setInvitationResults([]);
  };

  const resetInvitationDialog = () => {
    setIsInvitationDialogOpen(false);
    setSelectedGuests([]);
    setIsInvitationDialogOnly(false);
    setInvitationStep('compose');
    setInvitationResults([]);
  };

  const getGuestsWithEmail = () => {
    return guests.filter(guest => guest.email && guest.email.trim() !== '');
  };

  // Load guests on component mount
  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = async () => {
    try {
      setIsLoading(true);
      // For demo purposes, load sample guests if none exist
      const storedGuests = localStorage.getItem('bridallink_guests');
      if (storedGuests) {
        setGuests(JSON.parse(storedGuests));
      } else {
        setGuests(SAMPLE_GUESTS);
        saveGuests(SAMPLE_GUESTS);
      }
    } catch (error) {
      console.error('Error loading guests:', error);
      setGuests(SAMPLE_GUESTS);
    } finally {
      setIsLoading(false);
    }
  };

  const saveGuests = async (guestList: Guest[]) => {
    try {
      // Save to localStorage for demo
      localStorage.setItem('bridallink_guests', JSON.stringify(guestList));
      
      // In a real implementation, you would also save to backend
      for (const guest of guestList) {
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-5ea3da9c/guests/${guest.id}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(guest)
          }
        ).catch(err => console.log('Backend save failed (demo mode):', err));
      }
    } catch (error) {
      console.error('Error saving guests:', error);
    }
  };

  const getSelectedGuestDetails = () => {
    if (isInvitationDialogOnly) {
      return guests.filter(guest => selectedGuests.includes(guest.id));
    }
    return getGuestsWithEmail().filter(guest => selectedGuests.includes(guest.id));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="flex items-center justify-center gap-2">
          <Users className="h-8 w-8 text-purple-500" />
          <h1 className="text-3xl text-gray-800">Guest List Management</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Organize your wedding guest list, track RSVPs, and manage all the important details for your special day.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <Card className="p-4 text-center">
          <div className="text-2xl text-purple-600 mb-1">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Guests</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl text-green-600 mb-1">{stats.confirmed}</div>
          <div className="text-sm text-gray-600">Confirmed</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl text-red-600 mb-1">{stats.declined}</div>
          <div className="text-sm text-gray-600">Declined</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl text-yellow-600 mb-1">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl text-blue-600 mb-1">{stats.plusOnes}</div>
          <div className="text-sm text-gray-600">Plus Ones</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl text-purple-600 mb-1">{stats.invitationsSent}</div>
          <div className="text-sm text-gray-600">Invitations Sent</div>
        </Card>
      </div>

      {/* Controls */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-3 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="search guests by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Categories</option>
              <option value="family">Family</option>
              <option value="friends">Friends</option>
              <option value="colleagues">Colleagues</option>
              <option value="other">Other</option>
            </select>

            <select
              value={filterRSVP}
              onChange={(e) => setFilterRSVP(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All RSVP</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="declined">Declined</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Guest
            </Button>
            <Button
              onClick={() => setIsImportDialogOpen(true)}
              variant="outline"
              className="border-purple-500 text-purple-500 hover:bg-purple-50"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
            <Button
              onClick={() => openInvitationDialog()}
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-50"
              disabled={getGuestsWithEmail().length === 0}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Invitations
            </Button>
          </div>
        </div>
      </Card>

      {/* Guest Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-gray-600">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedGuests(getGuestsWithEmail().map(g => g.id));
                      } else {
                        setSelectedGuests([]);
                      }
                    }}
                    className="rounded mr-2"
                  />
                  Guest
                </th>
                <th className="text-left p-4 text-gray-600">Contact</th>
                <th className="text-left p-4 text-gray-600">Category</th>
                <th className="text-left p-4 text-gray-600">RSVP Status</th>
                <th className="text-left p-4 text-gray-600">Plus One</th>
                <th className="text-left p-4 text-gray-600">Invitation</th>
                <th className="text-left p-4 text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.map((guest) => (
                <tr key={guest.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-start gap-3">
                      {guest.email && (
                        <input
                          type="checkbox"
                          checked={selectedGuests.includes(guest.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedGuests([...selectedGuests, guest.id]);
                            } else {
                              setSelectedGuests(selectedGuests.filter(id => id !== guest.id));
                            }
                          }}
                          className="rounded mt-1"
                        />
                      )}
                      <div>
                        <div className="text-gray-800">{guest.name}</div>
                        {guest.notes && (
                          <div className="text-sm text-gray-500 mt-1">{guest.notes}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-3 w-3" />
                        {guest.email || 'No email'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-3 w-3" />
                        {guest.phone || 'No phone'}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      {getCategoryIcon(guest.category)}
                      {guest.category}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getRSVPIcon(guest.rsvpStatus)}
                      <span className="capitalize text-sm">{guest.rsvpStatus}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={guest.plusOne ? "default" : "secondary"}>
                      {guest.plusOne ? 'Yes' : 'No'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      {guest.invitationSent ? (
                        <>
                          <Badge variant="default" className="w-fit text-xs bg-green-500">
                            <Send className="h-3 w-3 mr-1" />
                            Sent
                          </Badge>
                          {guest.invitationSentAt && (
                            <div className="text-xs text-gray-500">
                              {new Date(guest.invitationSentAt).toLocaleDateString()}
                            </div>
                          )}
                        </>
                      ) : guest.email ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openInvitationDialog([guest.id])}
                          className="w-fit text-xs p-1 h-6"
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Send
                        </Button>
                      ) : (
                        <Badge variant="secondary" className="w-fit text-xs">
                          No Email
                        </Badge>
                      )}
                      {guest.rsvpRespondedAt && (
                        <div className="text-xs text-gray-500">
                          Responded {new Date(guest.rsvpRespondedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditGuest(guest)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteGuest(guest.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Guest Dialog */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 p-6">
            <h2 className="text-xl text-gray-800 mb-4">
              {editingGuest ? 'Edit Guest' : 'Add New Guest'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newGuest.name}
                  onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                  placeholder="Guest name"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newGuest.email}
                  onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
                  placeholder="guest@email.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newGuest.phone}
                  onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={newGuest.category}
                    onChange={(e) => setNewGuest({...newGuest, category: e.target.value as Guest['category']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="family">Family</option>
                    <option value="friends">Friends</option>
                    <option value="colleagues">Colleagues</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="rsvpStatus">RSVP Status</Label>
                  <select
                    id="rsvpStatus"
                    value={newGuest.rsvpStatus}
                    onChange={(e) => setNewGuest({...newGuest, rsvpStatus: e.target.value as Guest['rsvpStatus']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="plusOne"
                  checked={newGuest.plusOne}
                  onChange={(e) => setNewGuest({...newGuest, plusOne: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="plusOne">Plus One</Label>
              </div>

              <div>
                <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
                <Input
                  id="dietaryRestrictions"
                  value={newGuest.dietaryRestrictions}
                  onChange={(e) => setNewGuest({...newGuest, dietaryRestrictions: e.target.value})}
                  placeholder="Vegetarian, gluten-free, etc."
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={newGuest.notes}
                  onChange={(e) => setNewGuest({...newGuest, notes: e.target.value})}
                  placeholder="Additional notes..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setEditingGuest(null);
                  setNewGuest({
                    name: '',
                    email: '',
                    phone: '',
                    category: 'friends',
                    rsvpStatus: 'pending',
                    plusOne: false,
                    dietaryRestrictions: '',
                    notes: ''
                  });
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={editingGuest ? handleUpdateGuest : handleAddGuest}
                disabled={!newGuest.name.trim()}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
              >
                {editingGuest ? 'Update' : 'Add'} Guest
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* CSV Import Dialog */}
      {isImportDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl text-gray-800">Import Guest List from CSV</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetImportDialog}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {importStep === 'upload' && (
              <div className="space-y-6">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Upload a CSV file to import multiple guests at once. Make sure your CSV includes at least a "Name" column.
                  </p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-purple-400 transition-colors">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label
                      htmlFor="csv-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-gray-600">Click to upload CSV file</span>
                      <span className="text-sm text-gray-400 mt-1">or drag and drop</span>
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm text-gray-700 mb-2">Expected CSV Format:</h3>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p><strong>Required:</strong> Name</p>
                    <p><strong>Optional:</strong> Email, Phone, Category (family/friends/colleagues/other), RSVP Status (pending/confirmed/declined), Plus One (true/false/yes/no), Dietary Restrictions, Notes</p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={generateSampleCSV}
                    className="mt-3 text-purple-600 hover:text-purple-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Sample CSV
                  </Button>
                </div>

                {importErrors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-800 mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">Import Errors</span>
                    </div>
                    <div className="space-y-1">
                      {importErrors.map((error, index) => (
                        <p key={index} className="text-sm text-red-600">
                          {error.row > 0 ? `Row ${error.row}: ` : ''}{error.message}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {importStep === 'preview' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg text-gray-800">Preview Import Data</h3>
                    <p className="text-sm text-gray-600">
                      Review the {parsedData.length} guests that will be imported
                    </p>
                  </div>
                  {importErrors.length > 0 && (
                    <Badge variant="outline" className="text-orange-600 border-orange-300">
                      {importErrors.length} errors found
                    </Badge>
                  )}
                </div>

                {importErrors.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-orange-800 mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">Some rows had errors and will be skipped:</span>
                    </div>
                    <div className="space-y-1 max-h-20 overflow-y-auto">
                      {importErrors.map((error, index) => (
                        <p key={index} className="text-sm text-orange-600">
                          Row {error.row}: {error.message}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="max-h-80 overflow-y-auto border rounded-lg">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="text-left p-3 text-sm text-gray-600">Name</th>
                        <th className="text-left p-3 text-sm text-gray-600">Email</th>
                        <th className="text-left p-3 text-sm text-gray-600">Category</th>
                        <th className="text-left p-3 text-sm text-gray-600">RSVP</th>
                        <th className="text-left p-3 text-sm text-gray-600">Plus One</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData.map((guest, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-3 text-sm">{guest.name}</td>
                          <td className="p-3 text-sm text-gray-600">{guest.email || '-'}</td>
                          <td className="p-3">
                            <Badge variant="outline" className="text-xs">
                              {guest.category}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="text-xs">
                              {guest.rsvpStatus}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm">
                            {guest.plusOne ? 'Yes' : 'No'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setImportStep('upload')}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleImportConfirm}
                    disabled={parsedData.length === 0}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    Import {parsedData.length} Guests
                  </Button>
                </div>
              </div>
            )}

            {importStep === 'complete' && (
              <div className="text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h3 className="text-lg text-gray-800">Import Successful!</h3>
                <p className="text-gray-600">
                  Successfully imported {parsedData.length} guests to your wedding list.
                </p>
                <div className="text-sm text-gray-500">
                  This dialog will close automatically...
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Invitation Dialog */}
      {isInvitationDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl text-gray-800">Send Wedding Invitations</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetInvitationDialog}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {invitationStep === 'compose' && (
              <div className="space-y-6">
                {/* Event Details */}
                <div>
                  <h3 className="text-lg text-gray-800 mb-4">Event Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="coupleName">Couple Names</Label>
                      <Input
                        id="coupleName"
                        value={eventDetails.coupleName}
                        onChange={(e) => setEventDetails({...eventDetails, coupleName: e.target.value})}
                        placeholder="Sarah & John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="eventDate">Wedding Date</Label>
                      <Input
                        id="eventDate"
                        type="date"
                        value={eventDetails.eventDate}
                        onChange={(e) => setEventDetails({...eventDetails, eventDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="venue">Venue</Label>
                      <Input
                        id="venue"
                        value={eventDetails.venue}
                        onChange={(e) => setEventDetails({...eventDetails, venue: e.target.value})}
                        placeholder="Rose Garden Chapel"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        value={eventDetails.time}
                        onChange={(e) => setEventDetails({...eventDetails, time: e.target.value})}
                        placeholder="4:00 PM"
                      />
                    </div>
                  </div>
                </div>

                {/* Guest Selection */}
                {!isInvitationDialogOnly && (
                  <div>
                    <h3 className="text-lg text-gray-800 mb-4">Select Guests to Invite</h3>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          {selectedGuests.length} of {getGuestsWithEmail().length} guests selected
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedGuests(getGuestsWithEmail().map(g => g.id))}
                          >
                            Select All
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedGuests([])}
                          >
                            Clear All
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto border rounded-lg">
                      {getGuestsWithEmail().map(guest => (
                        <div
                          key={guest.id}
                          className="flex items-center gap-3 p-3 border-b hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedGuests.includes(guest.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedGuests([...selectedGuests, guest.id]);
                              } else {
                                setSelectedGuests(selectedGuests.filter(id => id !== guest.id));
                              }
                            }}
                            className="rounded"
                          />
                          <div className="flex-1">
                            <div className="text-gray-800">{guest.name}</div>
                            <div className="text-sm text-gray-500">{guest.email}</div>
                          </div>
                          {guest.invitationSent && (
                            <Badge variant="default" className="text-xs bg-green-500">
                              Already Sent
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Guests Summary (for single/multiple guest invitations) */}
                {isInvitationDialogOnly && (
                  <div>
                    <h3 className="text-lg text-gray-800 mb-4">Sending Invitation To:</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {getSelectedGuestDetails().map(guest => (
                        <div key={guest.id} className="flex items-center justify-between py-2">
                          <div>
                            <div className="text-gray-800">{guest.name}</div>
                            <div className="text-sm text-gray-500">{guest.email}</div>
                          </div>
                          {guest.invitationSent && (
                            <Badge variant="default" className="text-xs bg-green-500">
                              Already Sent
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preview */}
                <div>
                  <h3 className="text-lg text-gray-800 mb-4">Invitation Preview</h3>
                  <Card className="p-4 bg-gradient-to-br from-rose-50 to-pink-100">
                    <div className="text-center space-y-3">
                      <Heart className="h-8 w-8 text-rose-500 mx-auto" />
                      <h4 className="text-xl text-gray-800">You're Invited!</h4>
                      <p className="text-lg text-gray-700">{eventDetails.coupleName}'s Wedding</p>
                      <div className="space-y-2 text-gray-600">
                        <div className="flex items-center justify-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(eventDetails.eventDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <Clock className="h-4 w-4" />
                          {eventDetails.time}
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {eventDetails.venue}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-4">
                        Click the RSVP link in your email to respond
                      </p>
                    </div>
                  </Card>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={resetInvitationDialog}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleSendInvitations(isInvitationDialogOnly ? selectedGuests : selectedGuests)}
                    disabled={selectedGuests.length === 0}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    Send {selectedGuests.length} Invitation{selectedGuests.length !== 1 ? 's' : ''}
                  </Button>
                </div>
              </div>
            )}

            {invitationStep === 'sending' && (
              <div className="text-center space-y-4">
                <Loader className="h-12 w-12 animate-spin mx-auto text-purple-500" />
                <h3 className="text-lg text-gray-800">Sending Invitations...</h3>
                <p className="text-gray-600">
                  Please wait while we send invitations to your selected guests.
                </p>
              </div>
            )}

            {invitationStep === 'results' && (
              <div className="space-y-4">
                <h3 className="text-lg text-gray-800">Invitation Results</h3>
                
                <div className="space-y-2">
                  {invitationResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        result.status === 'sent' 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {result.status === 'sent' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm">
                          {result.status === 'sent' 
                            ? `Invitation sent to ${result.email}`
                            : `Failed: ${result.message}`
                          }
                        </span>
                      </div>
                      {result.rsvpUrl && (
                        <div className="text-xs text-gray-500 mt-1">
                          RSVP URL: {result.rsvpUrl}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> In a real implementation, invitation emails would be sent automatically. 
                    For this demo, the RSVP URLs above can be shared with guests directly.
                  </p>
                </div>

                <Button
                  onClick={resetInvitationDialog}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                >
                  Done
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}