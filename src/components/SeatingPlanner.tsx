import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  MapPin, 
  Plus, 
  Users, 
  Edit,
  Trash2,
  Move,
  RotateCcw,
  Save,
  Download,
  Upload
} from 'lucide-react';
// Simple toast function since we don't have a toast library
const toast = {
  success: (message: string) => alert(message),
  error: (message: string) => alert(message)
};

interface Guest {
  id: string;
  name: string;
  category: 'family' | 'friends' | 'colleagues' | 'plus-one';
  side: 'bride' | 'groom' | 'both';
  tableId?: string;
  seatNumber?: number;
}

interface Table {
  id: string;
  name: string;
  shape: 'round' | 'rectangular' | 'square';
  capacity: number;
  x: number;
  y: number;
  rotation: number;
  guests: Guest[];
}

interface SeatingLayout {
  id: string;
  name: string;
  tables: Table[];
  venueWidth: number;
  venueHeight: number;
}

export function SeatingPlanner() {
  const [guests] = useState<Guest[]>([
    { id: '1', name: 'Sarah Johnson', category: 'friends', side: 'bride' },
    { id: '2', name: 'Mike Johnson', category: 'plus-one', side: 'bride' },
    { id: '3', name: 'David Smith', category: 'colleagues', side: 'groom' },
    { id: '4', name: 'Emma Wilson', category: 'family', side: 'bride' },
    { id: '5', name: 'James Brown', category: 'friends', side: 'groom' },
    { id: '6', name: 'Lisa Taylor', category: 'friends', side: 'bride' },
    { id: '7', name: 'Tom Davis', category: 'family', side: 'groom' },
    { id: '8', name: 'Anna Garcia', category: 'colleagues', side: 'bride' },
    { id: '9', name: 'Chris Wilson', category: 'friends', side: 'groom' },
    { id: '10', name: 'Maria Lopez', category: 'family', side: 'bride' }
  ]);

  const [currentLayout, setCurrentLayout] = useState<SeatingLayout>({
    id: '1',
    name: 'Main Reception Layout',
    venueWidth: 800,
    venueHeight: 600,
    tables: [
      {
        id: '1',
        name: 'Head Table',
        shape: 'rectangular',
        capacity: 8,
        x: 400,
        y: 100,
        rotation: 0,
        guests: []
      },
      {
        id: '2',
        name: 'Table 1',
        shape: 'round',
        capacity: 8,
        x: 200,
        y: 250,
        rotation: 0,
        guests: []
      },
      {
        id: '3',
        name: 'Table 2',
        shape: 'round',
        capacity: 8,
        x: 400,
        y: 250,
        rotation: 0,
        guests: []
      },
      {
        id: '4',
        name: 'Table 3',
        shape: 'round',
        capacity: 8,
        x: 600,
        y: 250,
        rotation: 0,
        guests: []
      },
      {
        id: '5',
        name: 'Table 4',
        shape: 'round',
        capacity: 6,
        x: 200,
        y: 400,
        rotation: 0,
        guests: []
      },
      {
        id: '6',
        name: 'Table 5',
        shape: 'round',
        capacity: 6,
        x: 600,
        y: 400,
        rotation: 0,
        guests: []
      }
    ]
  });

  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [draggedGuest, setDraggedGuest] = useState<Guest | null>(null);
  const [isAddTableDialogOpen, setIsAddTableDialogOpen] = useState(false);
  const [isEditVenueDialogOpen, setIsEditVenueDialogOpen] = useState(false);
  const [newTable, setNewTable] = useState({
    name: '',
    shape: 'round' as Table['shape'],
    capacity: 8
  });
  const [venueSettings, setVenueSettings] = useState({
    name: currentLayout.name,
    width: currentLayout.venueWidth,
    height: currentLayout.venueHeight
  });

  const unassignedGuests = guests.filter(guest => !guest.tableId);
  const totalCapacity = currentLayout.tables.reduce((sum, table) => sum + table.capacity, 0);
  const assignedGuests = guests.filter(guest => guest.tableId).length;

  const handleAddTable = () => {
    if (!newTable.name) {
      toast.error('Please enter a table name');
      return;
    }

    const table: Table = {
      id: Date.now().toString(),
      name: newTable.name,
      shape: newTable.shape,
      capacity: newTable.capacity,
      x: 400, // Center position
      y: 300,
      rotation: 0,
      guests: []
    };

    setCurrentLayout({
      ...currentLayout,
      tables: [...currentLayout.tables, table]
    });

    setNewTable({ name: '', shape: 'round', capacity: 8 });
    setIsAddTableDialogOpen(false);
    toast.success('Table added successfully!');
  };

  const handleRemoveTable = (tableId: string) => {
    const table = currentLayout.tables.find(t => t.id === tableId);
    if (table && table.guests.length > 0) {
      toast.error('Cannot remove table with assigned guests');
      return;
    }

    setCurrentLayout({
      ...currentLayout,
      tables: currentLayout.tables.filter(t => t.id !== tableId)
    });
    toast.success('Table removed');
  };

  const handleAssignGuestToTable = (guest: Guest, tableId: string, seatNumber?: number) => {
    const table = currentLayout.tables.find(t => t.id === tableId);
    if (!table) return;

    if (table.guests.length >= table.capacity) {
      toast.error('Table is at full capacity');
      return;
    }

    // Remove guest from current table if assigned
    const updatedTables = currentLayout.tables.map(t => ({
      ...t,
      guests: t.guests.filter(g => g.id !== guest.id)
    }));

    // Add guest to new table
    const tableIndex = updatedTables.findIndex(t => t.id === tableId);
    updatedTables[tableIndex].guests.push({
      ...guest,
      tableId,
      seatNumber: seatNumber || table.guests.length + 1
    });

    setCurrentLayout({
      ...currentLayout,
      tables: updatedTables
    });

    toast.success(`${guest.name} assigned to ${table.name}`);
  };

  const handleRemoveGuestFromTable = (guestId: string) => {
    const updatedTables = currentLayout.tables.map(table => ({
      ...table,
      guests: table.guests.filter(g => g.id !== guestId)
    }));

    setCurrentLayout({
      ...currentLayout,
      tables: updatedTables
    });

    toast.success('Guest removed from table');
  };

  const getTableShape = (table: Table) => {
    const size = Math.min(80, table.capacity * 8);
    const props = {
      width: table.shape === 'rectangular' ? size * 1.5 : size,
      height: table.shape === 'rectangular' ? size * 0.6 : size,
      rx: table.shape === 'round' ? size / 2 : table.shape === 'square' ? 0 : 8,
      fill: table.guests.length === table.capacity ? '#fee2e2' : '#f0f9ff',
      stroke: table.guests.length === table.capacity ? '#dc2626' : '#0369a1',
      strokeWidth: 2
    };
    return <rect {...props} />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'family': return 'bg-purple-100 text-purple-800';
      case 'friends': return 'bg-blue-100 text-blue-800';
      case 'colleagues': return 'bg-green-100 text-green-800';
      case 'plus-one': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const autoAssignGuests = () => {
    const unassigned = unassignedGuests.slice();
    let updatedTables = [...currentLayout.tables];

    // Try to assign guests to tables based on category and side
    unassigned.forEach(guest => {
      // Find a suitable table with space
      const availableTable = updatedTables.find(table => 
        table.guests.length < table.capacity &&
        (!table.guests.length || // Empty table
         table.guests.some(g => g.side === guest.side || g.category === guest.category)) // Similar guests
      );

      if (availableTable) {
        availableTable.guests.push({
          ...guest,
          tableId: availableTable.id,
          seatNumber: availableTable.guests.length + 1
        });
      }
    });

    setCurrentLayout({
      ...currentLayout,
      tables: updatedTables
    });

    toast.success('Guests auto-assigned to tables!');
  };

  // Layout Actions Functions
  const handleExportLayout = () => {
    const exportData = {
      layout: currentLayout,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentLayout.name.replace(/\s+/g, '_').toLowerCase()}_layout.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Layout exported successfully!');
  };

  const handleImportLayout = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importData = JSON.parse(event.target?.result as string);
          
          if (importData.layout && importData.layout.tables && importData.layout.venueWidth) {
            setCurrentLayout(importData.layout);
            setVenueSettings({
              name: importData.layout.name,
              width: importData.layout.venueWidth,
              height: importData.layout.venueHeight
            });
            toast.success('Layout imported successfully!');
          } else {
            toast.error('Invalid layout file format');
          }
        } catch (error) {
          toast.error('Error reading layout file');
        }
      };
      reader.readAsText(file);
    };

    input.click();
  };

  const handleSaveLayout = () => {
    // In a real app, this would save to a database or cloud storage
    localStorage.setItem('bridallink_seating_layout', JSON.stringify(currentLayout));
    toast.success('Layout saved successfully!');
  };

  const handleEditVenue = () => {
    setVenueSettings({
      name: currentLayout.name,
      width: currentLayout.venueWidth,
      height: currentLayout.venueHeight
    });
    setIsEditVenueDialogOpen(true);
  };

  const handleUpdateVenue = () => {
    if (!venueSettings.name.trim()) {
      toast.error('Please enter a venue name');
      return;
    }

    if (venueSettings.width < 400 || venueSettings.width > 2000) {
      toast.error('Venue width must be between 400 and 2000 pixels');
      return;
    }

    if (venueSettings.height < 300 || venueSettings.height > 1500) {
      toast.error('Venue height must be between 300 and 1500 pixels');
      return;
    }

    setCurrentLayout({
      ...currentLayout,
      name: venueSettings.name,
      venueWidth: venueSettings.width,
      venueHeight: venueSettings.height
    });

    setIsEditVenueDialogOpen(false);
    toast.success('Venue settings updated successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-yellow-500" />
            <span>Seating Planner</span>
          </h1>
          <p className="text-gray-600 mt-1">Arrange your guests for the perfect reception</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={autoAssignGuests}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Auto Assign
          </Button>
          <Dialog open={isAddTableDialogOpen} onOpenChange={setIsAddTableDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Table
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Table</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Table Name</Label>
                  <Input
                    placeholder="e.g., Table 1, Family Table"
                    value={newTable.name}
                    onChange={(e) => setNewTable({...newTable, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Shape</Label>
                  <Select 
                    value={newTable.shape} 
                    onValueChange={(value: Table['shape']) => setNewTable({...newTable, shape: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round">Round</SelectItem>
                      <SelectItem value="rectangular">Rectangular</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Capacity</Label>
                  <Select 
                    value={newTable.capacity.toString()} 
                    onValueChange={(value) => setNewTable({...newTable, capacity: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[4, 6, 8, 10, 12].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num} seats</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddTable} className="w-full">
                  Add Table
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button 
            className="bg-yellow-500 hover:bg-yellow-600"
            onClick={handleSaveLayout}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Layout
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Guests</p>
                <p className="text-2xl font-bold">{guests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Assigned</p>
                <p className="text-2xl font-bold text-green-600">{assignedGuests}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Unassigned</p>
                <p className="text-2xl font-bold text-yellow-600">{unassignedGuests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Total Tables</p>
                <p className="text-2xl font-bold">{currentLayout.tables.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Venue Layout */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{currentLayout.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-200 rounded-lg bg-gray-50 p-4">
                <div className="w-full flex justify-center items-center" style={{ minHeight: '600px' }}>
                  <div className="flex justify-center items-center w-full">
                    <svg 
                      width={currentLayout.venueWidth} 
                      height={currentLayout.venueHeight}
                      viewBox={`0 0 ${currentLayout.venueWidth} ${currentLayout.venueHeight}`}
                      className="border border-gray-300 bg-white rounded shadow-sm max-w-full h-auto"
                      style={{ 
                        width: '100%', 
                        maxWidth: `${currentLayout.venueWidth}px`,
                        height: 'auto'
                      }}
                    >
                  {/* Venue background */}
                  <rect 
                    width={currentLayout.venueWidth} 
                    height={currentLayout.venueHeight} 
                    fill="#fafafa" 
                  />
                  
                  {/* Stage/Altar area */}
                  <rect 
                    x={currentLayout.venueWidth / 2 - 100} 
                    y={20} 
                    width={200} 
                    height={40} 
                    fill="#e0e7ff" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                    rx={4}
                  />
                  <text 
                    x={currentLayout.venueWidth / 2} 
                    y={45} 
                    textAnchor="middle" 
                    className="text-sm fill-gray-600"
                  >
                    Stage / Altar
                  </text>

                  {/* Tables */}
                  {currentLayout.tables.map((table) => (
                    <g key={table.id}>
                      <g
                        transform={`translate(${table.x - 50}, ${table.y - 25})`}
                        onClick={() => setSelectedTable(table)}
                        style={{ cursor: 'pointer' }}
                      >
                        {getTableShape(table)}
                        <text 
                          x={table.shape === 'rectangular' ? 60 : 40} 
                          y={table.shape === 'rectangular' ? 15 : 20} 
                          textAnchor="middle" 
                          className="text-xs fill-gray-700 font-medium"
                        >
                          {table.name}
                        </text>
                        <text 
                          x={table.shape === 'rectangular' ? 60 : 40} 
                          y={table.shape === 'rectangular' ? 30 : 35} 
                          textAnchor="middle" 
                          className="text-xs fill-gray-500"
                        >
                          {table.guests.length}/{table.capacity}
                        </text>
                      </g>
                    </g>
                  ))}
                    </svg>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guest Management Panel */}
        <div className="space-y-4">
          {/* Unassigned Guests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Unassigned Guests</span>
                <Badge variant="outline">{unassignedGuests.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {unassignedGuests.length === 0 ? (
                <p className="text-center text-gray-600 py-4">
                  All guests have been assigned! 🎉
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {unassignedGuests.map((guest) => (
                    <div
                      key={guest.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-move"
                      draggable
                      onDragStart={() => setDraggedGuest(guest)}
                    >
                      <div>
                        <p className="font-medium text-sm">{guest.name}</p>
                        <div className="flex space-x-1">
                          <Badge className={getCategoryColor(guest.category)} variant="secondary">
                            {guest.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {guest.side}
                          </Badge>
                        </div>
                      </div>
                      <Move className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected Table Details */}
          {selectedTable && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedTable.name}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveTable(selectedTable.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Capacity:</span>
                    <span>{selectedTable.guests.length}/{selectedTable.capacity}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Seated Guests:</h4>
                    {selectedTable.guests.length === 0 ? (
                      <p className="text-gray-600 text-sm">No guests assigned</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedTable.guests.map((guest) => (
                          <div
                            key={guest.id}
                            className="flex items-center justify-between p-2 bg-blue-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-sm">{guest.name}</p>
                              <Badge className={getCategoryColor(guest.category)} variant="secondary">
                                {guest.category}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveGuestFromTable(guest.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick assign unassigned guests */}
                  {unassignedGuests.length > 0 && selectedTable.guests.length < selectedTable.capacity && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Quick Assign:</h4>
                      <div className="space-y-1">
                        {unassignedGuests.slice(0, 3).map((guest) => (
                          <Button
                            key={guest.id}
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-left"
                            onClick={() => handleAssignGuestToTable(guest, selectedTable.id)}
                          >
                            <Plus className="h-3 w-3 mr-2" />
                            {guest.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Layout Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Layout Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleExportLayout}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Layout
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleImportLayout}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Layout
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleEditVenue}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Venue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Venue Dialog */}
      <Dialog open={isEditVenueDialogOpen} onOpenChange={setIsEditVenueDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Venue Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Venue Name</Label>
              <Input
                placeholder="e.g., Grand Ballroom, Garden Pavilion"
                value={venueSettings.name}
                onChange={(e) => setVenueSettings({...venueSettings, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Width (pixels)</Label>
                <Input
                  type="number"
                  min="400"
                  max="2000"
                  placeholder="800"
                  value={venueSettings.width}
                  onChange={(e) => setVenueSettings({...venueSettings, width: parseInt(e.target.value) || 800})}
                />
                <p className="text-xs text-gray-500 mt-1">400-2000 pixels</p>
              </div>
              <div>
                <Label>Height (pixels)</Label>
                <Input
                  type="number"
                  min="300"
                  max="1500"
                  placeholder="600"
                  value={venueSettings.height}
                  onChange={(e) => setVenueSettings({...venueSettings, height: parseInt(e.target.value) || 600})}
                />
                <p className="text-xs text-gray-500 mt-1">300-1500 pixels</p>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Preview:</strong> {venueSettings.width} × {venueSettings.height} pixels
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Note: Changing dimensions may affect table positions
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsEditVenueDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateVenue}
                className="flex-1"
              >
                Update Venue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}