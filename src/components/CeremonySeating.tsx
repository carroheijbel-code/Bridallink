import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Heart,
  Users, 
  Plus, 
  Edit,
  Trash2,
  Crown,
  Save,
  Download,
  Upload,
  RotateCcw
} from 'lucide-react';

// Simple toast function
const toast = {
  success: (message: string) => alert(message),
  error: (message: string) => alert(message)
};

interface Guest {
  id: string;
  name: string;
  relationship: 'parent' | 'grandparent' | 'sibling' | 'family' | 'close-friend' | 'wedding-party';
  side: 'bride' | 'groom';
  rowNumber?: number;
  seatNumber?: number;
  isVIP: boolean;
}

interface CeremonySeat {
  rowNumber: number;
  seatNumber: number;
  side: 'bride' | 'groom';
  guest: Guest | null;
  isReserved: boolean;
}

interface CeremonyLayout {
  totalRows: number;
  seatsPerRow: number;
  brideSeats: CeremonySeat[][];
  groomSeats: CeremonySeat[][];
}

export function CeremonySeating() {
  const [vipGuests] = useState<Guest[]>([
    { id: '1', name: 'Sarah\'s Mother', relationship: 'parent', side: 'bride', isVIP: true },
    { id: '2', name: 'Sarah\'s Father', relationship: 'parent', side: 'bride', isVIP: true },
    { id: '3', name: 'Mike\'s Mother', relationship: 'parent', side: 'groom', isVIP: true },
    { id: '4', name: 'Mike\'s Father', relationship: 'parent', side: 'groom', isVIP: true },
    { id: '5', name: 'Grandma Rose', relationship: 'grandparent', side: 'bride', isVIP: true },
    { id: '6', name: 'Grandpa Joe', relationship: 'grandparent', side: 'groom', isVIP: true },
    { id: '7', name: 'Emma (Sister)', relationship: 'sibling', side: 'bride', isVIP: true },
    { id: '8', name: 'James (Brother)', relationship: 'sibling', side: 'groom', isVIP: true },
    { id: '9', name: 'Maid of Honor', relationship: 'wedding-party', side: 'bride', isVIP: true },
    { id: '10', name: 'Best Man', relationship: 'wedding-party', side: 'groom', isVIP: true },
    { id: '11', name: 'Uncle Tom', relationship: 'family', side: 'bride', isVIP: true },
    { id: '12', name: 'Aunt Lisa', relationship: 'family', side: 'groom', isVIP: true }
  ]);

  // Initialize ceremony layout - focusing on first 2 rows
  const initializeCeremonyLayout = (): CeremonyLayout => {
    const totalRows = 8;
    const seatsPerRow = 8;
    const brideSeats: CeremonySeat[][] = [];
    const groomSeats: CeremonySeat[][] = [];

    for (let row = 1; row <= totalRows; row++) {
      const brideRow: CeremonySeat[] = [];
      const groomRow: CeremonySeat[] = [];

      for (let seat = 1; seat <= seatsPerRow; seat++) {
        brideRow.push({
          rowNumber: row,
          seatNumber: seat,
          side: 'bride',
          guest: null,
          isReserved: row <= 2 // First 2 rows are reserved for VIP
        });

        groomRow.push({
          rowNumber: row,
          seatNumber: seat,
          side: 'groom',
          guest: null,
          isReserved: row <= 2 // First 2 rows are reserved for VIP
        });
      }

      brideSeats.push(brideRow);
      groomSeats.push(groomRow);
    }

    return { totalRows, seatsPerRow, brideSeats, groomSeats };
  };

  const [ceremonyLayout, setCeremonyLayout] = useState<CeremonyLayout>(initializeCeremonyLayout());
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isAddGuestDialogOpen, setIsAddGuestDialogOpen] = useState(false);
  const [newGuest, setNewGuest] = useState({
    name: '',
    relationship: 'family' as Guest['relationship'],
    side: 'bride' as Guest['side']
  });

  const unassignedVIPGuests = vipGuests.filter(guest => !guest.rowNumber);
  
  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case 'parent': return 'bg-red-100 text-red-800';
      case 'grandparent': return 'bg-purple-100 text-purple-800';
      case 'sibling': return 'bg-blue-100 text-blue-800';
      case 'wedding-party': return 'bg-yellow-100 text-yellow-800';
      case 'family': return 'bg-green-100 text-green-800';
      case 'close-friend': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAssignGuestToSeat = (guest: Guest, rowNumber: number, seatNumber: number, side: 'bride' | 'groom') => {
    // Check if seat is available
    const seats = side === 'bride' ? ceremonyLayout.brideSeats : ceremonyLayout.groomSeats;
    const seat = seats[rowNumber - 1][seatNumber - 1];
    
    if (seat.guest) {
      toast.error('Seat is already occupied');
      return;
    }

    // For VIP guests, only allow first 2 rows
    if (guest.isVIP && rowNumber > 2) {
      toast.error('VIP guests should be seated in the first 2 rows');
      return;
    }

    // Remove guest from previous seat if assigned
    const updatedLayout = { ...ceremonyLayout };
    
    // Clear previous assignment
    if (guest.rowNumber && guest.seatNumber) {
      const oldSide = guest.side;
      const oldSeats = oldSide === 'bride' ? updatedLayout.brideSeats : updatedLayout.groomSeats;
      oldSeats[guest.rowNumber - 1][guest.seatNumber - 1].guest = null;
    }

    // Assign to new seat
    const newSeats = side === 'bride' ? updatedLayout.brideSeats : updatedLayout.groomSeats;
    newSeats[rowNumber - 1][seatNumber - 1].guest = {
      ...guest,
      rowNumber,
      seatNumber,
      side
    };

    setCeremonyLayout(updatedLayout);
    toast.success(`${guest.name} assigned to Row ${rowNumber}, Seat ${seatNumber}`);
  };

  const handleRemoveGuestFromSeat = (rowNumber: number, seatNumber: number, side: 'bride' | 'groom') => {
    const updatedLayout = { ...ceremonyLayout };
    const seats = side === 'bride' ? updatedLayout.brideSeats : updatedLayout.groomSeats;
    const guest = seats[rowNumber - 1][seatNumber - 1].guest;
    
    if (guest) {
      seats[rowNumber - 1][seatNumber - 1].guest = null;
      setCeremonyLayout(updatedLayout);
      toast.success(`${guest.name} removed from seat`);
    }
  };

  const autoAssignVIPGuests = () => {
    const updatedLayout = { ...ceremonyLayout };
    
    // Get available seats in first 2 rows
    const availableBrideSeats = [];
    const availableGroomSeats = [];
    
    for (let row = 1; row <= 2; row++) {
      for (let seat = 1; seat <= ceremonyLayout.seatsPerRow; seat++) {
        if (!updatedLayout.brideSeats[row - 1][seat - 1].guest) {
          availableBrideSeats.push({ row, seat });
        }
        if (!updatedLayout.groomSeats[row - 1][seat - 1].guest) {
          availableGroomSeats.push({ row, seat });
        }
      }
    }

    // Assign unassigned VIP guests
    unassignedVIPGuests.forEach((guest, index) => {
      const availableSeats = guest.side === 'bride' ? availableBrideSeats : availableGroomSeats;
      
      if (availableSeats.length > 0) {
        const { row, seat } = availableSeats.shift()!;
        const seats = guest.side === 'bride' ? updatedLayout.brideSeats : updatedLayout.groomSeats;
        
        seats[row - 1][seat - 1].guest = {
          ...guest,
          rowNumber: row,
          seatNumber: seat
        };
      }
    });

    setCeremonyLayout(updatedLayout);
    toast.success('VIP guests auto-assigned to front rows!');
  };

  const handleSaveLayout = () => {
    localStorage.setItem('bridallink_ceremony_seating', JSON.stringify(ceremonyLayout));
    toast.success('Ceremony seating saved!');
  };

  const handleExportLayout = () => {
    const exportData = {
      ceremony: ceremonyLayout,
      guests: vipGuests,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ceremony_seating_plan.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Ceremony seating exported!');
  };

  const renderSeat = (seat: CeremonySeat, rowNumber: number, seatNumber: number) => {
    const isVIPRow = rowNumber <= 2;
    const hasGuest = !!seat.guest;
    
    return (
      <div
        key={`${seat.side}-${rowNumber}-${seatNumber}`}
        className={`
          w-12 h-12 border-2 rounded-lg flex items-center justify-center cursor-pointer
          transition-all text-xs font-medium
          ${hasGuest 
            ? 'bg-blue-100 border-blue-300 hover:bg-blue-200' 
            : isVIPRow 
              ? 'bg-yellow-50 border-yellow-300 hover:bg-yellow-100'
              : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
          }
          ${isVIPRow ? 'ring-2 ring-yellow-200' : ''}
        `}
        onClick={() => {
          if (hasGuest) {
            // Show guest info or remove
            if (window.confirm(`Remove ${seat.guest!.name} from this seat?`)) {
              handleRemoveGuestFromSeat(rowNumber, seatNumber, seat.side);
            }
          } else if (selectedGuest) {
            // Assign selected guest to this seat
            handleAssignGuestToSeat(selectedGuest, rowNumber, seatNumber, seat.side);
            setSelectedGuest(null);
          }
        }}
        title={hasGuest ? seat.guest!.name : `Row ${rowNumber}, Seat ${seatNumber}`}
      >
        {hasGuest ? (
          <div className="text-center">
            <div className="text-blue-800 font-bold">{seat.guest!.name.split(' ')[0]}</div>
          </div>
        ) : (
          <div className="text-gray-500">
            {isVIPRow ? <Crown className="h-4 w-4" /> : seatNumber}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-2">
            <Heart className="h-8 w-8 text-rose-500" />
            <span>Ceremony Seating</span>
          </h1>
          <p className="text-gray-600 mt-1">Arrange your VIP guests in the front rows</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={autoAssignVIPGuests}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Auto Assign VIPs
          </Button>
          <Button variant="outline" onClick={handleSaveLayout}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" onClick={handleExportLayout}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">VIP Guests</p>
                <p className="text-2xl font-bold">{vipGuests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Assigned</p>
                <p className="text-2xl font-bold text-green-600">
                  {vipGuests.filter(g => g.rowNumber).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-rose-500" />
              <div>
                <p className="text-sm text-gray-600">Front Row Seats</p>
                <p className="text-2xl font-bold">16</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Capacity</p>
                <p className="text-2xl font-bold">128</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Ceremony Layout */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <Heart className="h-5 w-5 text-rose-500 mr-2" />
                Wedding Ceremony Layout
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-b from-rose-50 to-white border-2 border-rose-200 rounded-lg p-6">
                {/* Altar/Stage */}
                <div className="text-center mb-8">
                  <div className="bg-gradient-to-r from-rose-200 to-pink-200 rounded-lg p-4 mb-2 inline-block">
                    <Heart className="h-8 w-8 text-rose-600 mx-auto" />
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Altar / Wedding Arch</p>
                </div>

                {/* Ceremony Seating */}
                <div className="flex justify-center">
                  <div className="flex gap-12">
                    {/* Bride's Side */}
                    <div className="space-y-3">
                      <div className="text-center">
                        <h3 className="font-semibold text-rose-700 mb-2">Bride's Side</h3>
                        <div className="text-xs text-gray-500 mb-4">
                          <Crown className="h-4 w-4 inline mr-1" />
                          First 2 rows: VIP guests
                        </div>
                      </div>
                      
                      {ceremonyLayout.brideSeats.slice(0, 6).map((row, rowIndex) => (
                        <div key={rowIndex} className="flex gap-1">
                          <span className="w-6 text-xs text-gray-500 flex items-center justify-center">
                            {rowIndex + 1}
                          </span>
                          <div className="flex gap-1">
                            {row.map((seat, seatIndex) => 
                              renderSeat(seat, rowIndex + 1, seatIndex + 1)
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Center Aisle */}
                    <div className="w-16 flex flex-col items-center justify-center">
                      <div className="h-full w-0.5 bg-gradient-to-b from-rose-300 to-pink-300"></div>
                      <span className="text-xs text-gray-500 -rotate-90 mt-4">Aisle</span>
                    </div>

                    {/* Groom's Side */}
                    <div className="space-y-3">
                      <div className="text-center">
                        <h3 className="font-semibold text-blue-700 mb-2">Groom's Side</h3>
                        <div className="text-xs text-gray-500 mb-4">
                          <Crown className="h-4 w-4 inline mr-1" />
                          First 2 rows: VIP guests
                        </div>
                      </div>
                      
                      {ceremonyLayout.groomSeats.slice(0, 6).map((row, rowIndex) => (
                        <div key={rowIndex} className="flex gap-1">
                          <div className="flex gap-1">
                            {row.map((seat, seatIndex) => 
                              renderSeat(seat, rowIndex + 1, seatIndex + 1)
                            )}
                          </div>
                          <span className="w-6 text-xs text-gray-500 flex items-center justify-center">
                            {rowIndex + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-50 border-2 border-yellow-300 ring-2 ring-yellow-200 rounded"></div>
                    <span>VIP Reserved Seats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
                    <span>Occupied</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-50 border-2 border-gray-300 rounded"></div>
                    <span>Available</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* VIP Guest Management */}
        <div className="space-y-4">
          {/* Selected Guest */}
          {selectedGuest && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Selected Guest</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedGuest(null)}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div>
                  <p className="font-medium">{selectedGuest.name}</p>
                  <Badge className={getRelationshipColor(selectedGuest.relationship)}>
                    {selectedGuest.relationship}
                  </Badge>
                  <p className="text-xs text-gray-600 mt-1">
                    Click any available seat to assign
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Unassigned VIP Guests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Crown className="h-4 w-4 text-yellow-500 mr-2" />
                  VIP Guests
                </span>
                <Badge variant="outline">{unassignedVIPGuests.length} unassigned</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {unassignedVIPGuests.length === 0 ? (
                <p className="text-center text-gray-600 py-4 text-sm">
                  All VIP guests are seated! 🎉
                </p>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {unassignedVIPGuests.map((guest) => (
                    <div
                      key={guest.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedGuest?.id === guest.id 
                          ? 'bg-blue-100 border-blue-300' 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedGuest(selectedGuest?.id === guest.id ? null : guest)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{guest.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getRelationshipColor(guest.relationship)} variant="secondary">
                              {guest.relationship}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {guest.side}'s side
                            </Badge>
                          </div>
                        </div>
                        <Crown className="h-4 w-4 text-yellow-500" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">How to Use</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="flex items-start gap-2">
                <span className="bg-yellow-100 text-yellow-800 rounded-full w-4 h-4 flex items-center justify-center text-xs">1</span>
                <p>Select a VIP guest from the list</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-yellow-100 text-yellow-800 rounded-full w-4 h-4 flex items-center justify-center text-xs">2</span>
                <p>Click any available seat in the ceremony layout</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-yellow-100 text-yellow-800 rounded-full w-4 h-4 flex items-center justify-center text-xs">3</span>
                <p>VIP guests should be in the first 2 rows (marked with crowns)</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-yellow-100 text-yellow-800 rounded-full w-4 h-4 flex items-center justify-center text-xs">4</span>
                <p>Click occupied seats to remove guests</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}