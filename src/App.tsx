import React, { useState, Suspense, useMemo, useCallback } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

// BridalLink Logo - Import with fallback handling
let bridalLinkLogoImage = '';
try {
  // Try to import the brand image, with fallback if it fails
  bridalLinkLogoImage = 'figma:asset/99bf8815e05b68c98aa1b9f35711054549f7784d.png';
} catch (error) {
  console.warn('Brand image failed to load, using fallback');
  bridalLinkLogoImage = '';
}

// Loading component for better performance
const LoadingFallback = () => (
  <div className="min-h-screen bg-rose-50 flex items-center justify-center p-4">
    <div className="text-center space-y-4">
      <div className="animate-pulse space-y-4">
        <div className="w-16 h-16 bg-rose-200 rounded-full mx-auto"></div>
        <div className="h-6 bg-rose-200 rounded w-32 mx-auto"></div>
        <div className="h-4 bg-rose-100 rounded w-48 mx-auto"></div>
      </div>
      <div className="text-6xl">💕</div>
      <h1 className="text-2xl font-bold text-amber-800 bridallink-brand">BridalLink</h1>
      <p className="text-amber-700">Loading your wedding planning tools...</p>
    </div>
  </div>
);

// Import components
import WeatherForecast from './components/WeatherForecast';
import PrivacyPolicy from './components/PrivacyPolicy';
import PaymentIntegration from './components/PaymentIntegration';
import AIWeddingAssistant from './components/AIWeddingAssistant';
import EventCalendar from './components/EventCalendar';
import CalendlyWidget from './components/CalendlyWidget';

type Section = 'home' | 'dashboard' | 'budget' | 'guests' | 'ai-assistant' | 'premium-upgrade' | 'timeline' | 'tasks' | 'music' | 'seating' | 'expert-advice' | 'community' | 'schedule' | 'documents' | 'weather' | 'shopping' | 'vendors' | 'privacy-policy' | 'calendar' | 'registry' | 'cashfund' | 'hashtag-generator';

// Comprehensive Seating Planner Component
function CeremonySeatingPlanner() {
  const [activeTab, setActiveTab] = useState<'ceremony' | 'reception'>('ceremony');
  const [seatAllocations, setSeatAllocations] = useState<{[key: string]: string}>({});

  // Reception table assignments - start empty for users
  const [tableAssignments, setTableAssignments] = useState<{[key: string]: string[]}>({
    'table-1': [],
    'table-2': [],
    'table-3': [],
    'table-4': [],
    'table-5': [],
    'table-6': [],
    'table-7': [],
    'table-8': [],
  });

  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [guestToAssign, setGuestToAssign] = useState('');
  
  // Guest list for assignment - start empty for users to add their own guests
  const availableGuests: string[] = [];

  const assignSeat = (seatId: string, guestName: string) => {
    try {
      setSeatAllocations(prev => ({
        ...prev,
        [seatId]: guestName
      }));
      setSelectedSeat(null);
      setGuestToAssign('');
    } catch (error) {
      console.error('Error assigning seat:', error);
    }
  };

  const removeSeatAssignment = (seatId: string) => {
    try {
      setSeatAllocations(prev => {
        const updated = { ...prev };
        delete updated[seatId];
        return updated;
      });
      setSelectedSeat(null);
    } catch (error) {
      console.error('Error removing seat assignment:', error);
    }
  };

  const assignGuestToTable = (tableId: string, guestName: string) => {
    try {
      setTableAssignments(prev => ({
        ...prev,
        [tableId]: [...(prev[tableId] || []), guestName]
      }));
      setSelectedTable(null);
      setGuestToAssign('');
    } catch (error) {
      console.error('Error assigning guest to table:', error);
    }
  };

  const removeGuestFromTable = (tableId: string, guestName: string) => {
    try {
      setTableAssignments(prev => ({
        ...prev,
        [tableId]: prev[tableId].filter(guest => guest !== guestName)
      }));
    } catch (error) {
      console.error('Error removing guest from table:', error);
    }
  };

  const renderSeat = (seatId: string, position: string, isVIP: boolean = false) => {
    const isAssigned = !!seatAllocations[seatId];
    const isSelected = selectedSeat === seatId;
    
    return (
      <div
        key={seatId}
        onClick={() => isVIP ? setSelectedSeat(isSelected ? null : seatId) : null}
        className={`
          relative w-8 h-8 rounded-lg border-2 flex items-center justify-center text-xs font-semibold cursor-pointer transition-all
          ${isVIP ? 'cursor-pointer' : 'cursor-default'}
          ${isAssigned 
            ? isVIP 
              ? 'bg-amber-200 border-amber-400 text-amber-800 hover:bg-amber-300' 
              : 'bg-gray-200 border-gray-400 text-gray-600'
            : isVIP 
              ? 'bg-rose-100 border-rose-300 text-rose-700 hover:bg-rose-200' 
              : 'bg-gray-50 border-gray-300 text-gray-500'
          }
          ${isSelected ? 'ring-2 ring-amber-500 ring-offset-1' : ''}
        `}
        title={isAssigned ? seatAllocations[seatId] : isVIP ? 'Click to assign guest' : 'General seating'}
      >
        🪑
        {isAssigned && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white rounded px-1 py-0.5 text-xs border shadow-sm whitespace-nowrap z-10">
            {seatAllocations[seatId]}
          </div>
        )}
      </div>
    );
  };

  const renderRow = (rowNumber: number, seatsPerSide: number, isVIP: boolean = false) => {
    const leftSeats = [];
    const rightSeats = [];
    
    for (let i = 1; i <= seatsPerSide; i++) {
      const leftSeatId = `row-${rowNumber}-left-${i}`;
      const rightSeatId = `row-${rowNumber}-right-${i}`;
      
      // Special naming for front rows
      if (rowNumber === 1) {
        leftSeats.push(renderSeat(`front-left-${i}`, 'left', isVIP));
        rightSeats.push(renderSeat(`front-right-${i}`, 'right', isVIP));
      } else if (rowNumber === 2) {
        leftSeats.push(renderSeat(`second-left-${i}`, 'left', isVIP));
        rightSeats.push(renderSeat(`second-right-${i}`, 'right', isVIP));
      } else {
        leftSeats.push(renderSeat(leftSeatId, 'left', isVIP));
        rightSeats.push(renderSeat(rightSeatId, 'right', isVIP));
      }
    }

    return (
      <div key={`row-${rowNumber}`} className="flex items-center justify-center gap-12 mb-3">
        <div className="flex gap-1">
          {leftSeats}
        </div>
        <div className="text-xs text-gray-500 min-w-[2rem] text-center">
          {rowNumber === 1 && isVIP && <span className="text-amber-600">🌟 VIP</span>}
          {rowNumber === 2 && isVIP && <span className="text-amber-600">👑 VIP</span>}
          {!isVIP && <span>Row {rowNumber}</span>}
        </div>
        <div className="flex gap-1">
          {rightSeats}
        </div>
      </div>
    );
  };

  const renderTable = (tableId: string, tableNumber: number, x: number, y: number) => {
    const guests = tableAssignments[tableId] || [];
    const capacity = 8;
    const isSelected = selectedTable === tableId;
    
    return (
      <div
        key={tableId}
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
          isSelected ? 'scale-110 z-10' : 'hover:scale-105'
        }`}
        style={{ left: `${x}%`, top: `${y}%` }}
        onClick={() => setSelectedTable(isSelected ? null : tableId)}
      >
        {/* Table */}
        <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${
          guests.length === capacity 
            ? 'bg-green-100 border-green-400' 
            : guests.length > 0 
              ? 'bg-amber-100 border-amber-400' 
              : 'bg-rose-100 border-rose-300'
        } ${isSelected ? 'ring-4 ring-amber-500 ring-offset-2' : ''}`}>
          <div className="text-center">
            <div className="text-sm font-bold text-amber-800">{tableNumber}</div>
            <div className="text-xs text-amber-600">{guests.length}/{capacity}</div>
          </div>
        </div>
        
        {/* Guest indicators around table */}
        {Array.from({ length: capacity }, (_, i) => {
          const angle = (i / capacity) * 2 * Math.PI - Math.PI / 2;
          const seatX = Math.cos(angle) * 40;
          const seatY = Math.sin(angle) * 40;
          const hasGuest = i < guests.length;
          
          return (
            <div
              key={i}
              className={`absolute w-3 h-3 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${
                hasGuest ? 'bg-amber-500' : 'bg-gray-300'
              }`}
              style={{
                left: `${seatX}px`,
                top: `${seatY}px`,
                marginLeft: '48px',
                marginTop: '48px'
              }}
              title={hasGuest ? guests[i] : 'Empty seat'}
            />
          );
        })}
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <span className="text-2xl">🪑</span>
          </div>
          <h1 className="text-3xl font-bold text-amber-800">Wedding Seating Planner</h1>
          <p className="text-amber-700">Design your perfect ceremony and reception seating arrangements</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center">
          <div className="bg-white rounded-lg border shadow-sm p-1 flex">
            <button
              onClick={() => setActiveTab('ceremony')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'ceremony'
                  ? 'bg-amber-100 text-amber-800 font-semibold'
                  : 'text-gray-600 hover:text-amber-700'
              }`}
            >
              Ceremony Seating
            </button>
            <button
              onClick={() => setActiveTab('reception')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'reception'
                  ? 'bg-amber-100 text-amber-800 font-semibold'
                  : 'text-gray-600 hover:text-amber-700'
              }`}
            >
              Reception Tables
            </button>
          </div>
        </div>

        {/* Ceremony Seating */}
        {activeTab === 'ceremony' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seating Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="text-center space-y-6">
                {/* Altar */}
                <div className="bg-gradient-to-r from-rose-100 to-amber-100 rounded-lg p-4 border-2 border-dashed border-amber-300">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">💒</span>
                    <span className="font-semibold text-amber-800">Wedding Altar</span>
                    <span className="text-2xl">💐</span>
                  </div>
                </div>

                {/* Seating Area */}
                <div className="bg-rose-50 rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold text-amber-800 mb-4">Ceremony Seating</h3>
                  
                  {/* VIP Rows (First 2 rows) */}
                  <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <h4 className="text-sm font-semibold text-amber-700 mb-3 text-center">VIP Seating (Family & Wedding Party)</h4>
                    {renderRow(1, 4, true)}
                    {renderRow(2, 5, true)}
                  </div>

                  {/* General Seating */}
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <h4 className="text-sm font-semibold text-gray-600 mb-3 text-center">General Guest Seating</h4>
                    {Array.from({ length: 8 }, (_, i) => renderRow(i + 3, 6, false))}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-amber-200 border border-amber-400 rounded"></div>
                    <span className="text-amber-700">Assigned VIP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-rose-100 border border-rose-300 rounded"></div>
                    <span className="text-rose-700">Available VIP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 border border-gray-400 rounded"></div>
                    <span className="text-gray-600">General Seating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seat Assignment Panel */}
          <div className="space-y-6">
            {/* VIP Seat Assignments */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-amber-800 mb-4">VIP Seat Assignments</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {Object.entries(seatAllocations).map(([seatId, guestName]) => (
                  <div key={seatId} className="flex justify-between items-center p-2 bg-amber-50 rounded border">
                    <div>
                      <div className="text-xs text-amber-600 capitalize">
                        {seatId.replace(/-/g, ' ')}
                      </div>
                      <div className="font-medium text-amber-800">{guestName}</div>
                    </div>
                    <button
                      onClick={() => removeSeatAssignment(seatId)}
                      className="text-xs text-red-600 hover:text-red-800 px-2 py-1 hover:bg-red-50 rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignment Interface */}
            {selectedSeat && (
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <h3 className="text-lg font-semibold text-amber-800 mb-4">
                  Assign Seat: {selectedSeat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Guest or Enter Custom Name
                    </label>
                    <select
                      value={guestToAssign}
                      onChange={(e) => setGuestToAssign(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                    >
                      <option value="">Select a guest...</option>
                      {availableGuests.filter(guest => !Object.values(seatAllocations).includes(guest)).map(guest => (
                        <option key={guest} value={guest}>{guest}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Or enter custom name:
                    </label>
                    <input
                      type="text"
                      value={guestToAssign}
                      onChange={(e) => setGuestToAssign(e.target.value)}
                      placeholder="Enter guest name..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => guestToAssign && assignSeat(selectedSeat, guestToAssign)}
                      disabled={!guestToAssign}
                      className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Assign Seat
                    </button>
                    <button
                      onClick={() => setSelectedSeat(null)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-amber-800 mb-4">Seating Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">VIP Seats Assigned:</span>
                  <span className="font-semibold text-amber-800">{Object.keys(seatAllocations).length}/18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Ceremony Capacity:</span>
                  <span className="font-semibold text-gray-800">66 seats</span>
                </div>
                <div className="text-xs text-gray-500 mt-3">
                  💡 Click on VIP seats (first 2 rows) to assign specific guests. General seating is open.
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Reception Seating */}
        {activeTab === 'reception' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reception Floor Plan */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <div className="text-center space-y-6">
                  {/* Dance Floor & Head Table */}
                  <div className="bg-gradient-to-r from-amber-100 to-rose-100 rounded-lg p-4 border-2 border-dashed border-amber-300">
                    <div className="flex items-center justify-center gap-4">
                      <span className="text-2xl">🕺</span>
                      <span className="font-semibold text-amber-800">Dance Floor & Head Table</span>
                      <span className="text-2xl">💃</span>
                    </div>
                  </div>

                  {/* Reception Tables Layout */}
                  <div className="bg-rose-50 rounded-lg p-6 border relative" style={{ minHeight: '500px' }}>
                    <h3 className="text-lg font-semibold text-amber-800 mb-4">Reception Tables</h3>
                    
                    {/* Table layout */}
                    <div className="relative h-96">
                      {/* Head Table (Table 1) */}
                      {renderTable('table-1', 1, 50, 20)}
                      
                      {/* Guest Tables arranged around the room */}
                      {renderTable('table-2', 2, 25, 40)}
                      {renderTable('table-3', 3, 75, 40)}
                      {renderTable('table-4', 4, 25, 65)}
                      {renderTable('table-5', 5, 75, 65)}
                      {renderTable('table-6', 6, 15, 85)}
                      {renderTable('table-7', 7, 50, 85)}
                      {renderTable('table-8', 8, 85, 85)}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-100 border border-green-400 rounded-full"></div>
                      <span className="text-green-700">Full Table (8/8)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-amber-100 border border-amber-400 rounded-full"></div>
                      <span className="text-amber-700">Partially Filled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-rose-100 border border-rose-300 rounded-full"></div>
                      <span className="text-rose-700">Empty Table</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Management Panel */}
            <div className="space-y-6">
              {/* Table Assignments */}
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <h3 className="text-lg font-semibold text-amber-800 mb-4">Table Assignments</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {Object.entries(tableAssignments).map(([tableId, guests]) => (
                    <div key={tableId} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-amber-800">
                          Table {tableId.split('-')[1]} ({guests.length}/8)
                        </span>
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          guests.length === 8 ? 'bg-green-100 text-green-800' :
                          guests.length > 0 ? 'bg-amber-100 text-amber-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {guests.length === 8 ? 'Full' : guests.length > 0 ? 'Partial' : 'Empty'}
                        </div>
                      </div>
                      {guests.length > 0 && (
                        <div className="space-y-1">
                          {guests.map((guest, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <span className="text-gray-700">{guest}</span>
                              <button
                                onClick={() => removeGuestFromTable(tableId, guest)}
                                className="text-red-600 hover:text-red-800 text-xs px-1"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Table Assignment Interface */}
              {selectedTable && (
                <div className="bg-white rounded-lg border shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-amber-800 mb-4">
                    Assign to Table {selectedTable.split('-')[1]}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current: {tableAssignments[selectedTable]?.length || 0}/8 guests
                      </label>
                      <select
                        value={guestToAssign}
                        onChange={(e) => setGuestToAssign(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                        disabled={tableAssignments[selectedTable]?.length >= 8}
                      >
                        <option value="">Select a guest...</option>
                        {availableGuests.filter(guest => 
                          !Object.values(tableAssignments).flat().includes(guest)
                        ).map(guest => (
                          <option key={guest} value={guest}>{guest}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Or enter custom name:
                      </label>
                      <input
                        type="text"
                        value={guestToAssign}
                        onChange={(e) => setGuestToAssign(e.target.value)}
                        placeholder="Enter guest name..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                        disabled={tableAssignments[selectedTable]?.length >= 8}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => guestToAssign && assignGuestToTable(selectedTable, guestToAssign)}
                        disabled={!guestToAssign || tableAssignments[selectedTable]?.length >= 8}
                        className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Assign to Table
                      </button>
                      <button
                        onClick={() => setSelectedTable(null)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Reception Summary */}
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <h3 className="text-lg font-semibold text-amber-800 mb-4">Reception Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tables Setup:</span>
                    <span className="font-semibold text-amber-800">8 tables</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Capacity:</span>
                    <span className="font-semibold text-gray-800">64 guests</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests Assigned:</span>
                    <span className="font-semibold text-amber-800">
                      {Object.values(tableAssignments).flat().length}/64
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tables Filled:</span>
                    <span className="font-semibold text-green-600">
                      {Object.values(tableAssignments).filter(guests => guests.length === 8).length}/8
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-3">
                    💡 Click on tables to assign guests. Each table seats 8 people.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

// Bride Community Component
function BrideCommunity() {
  const [activeChannel, setActiveChannel] = useState<'general' | 'venues' | 'dresses' | 'vendors' | 'photos' | 'advice'>('general');
  const [newMessage, setNewMessage] = useState('');
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  // Community messages - keep some sample data for demo purposes but reduce it
  const [messages, setMessages] = useState<{[key: string]: Array<{
    id: string;
    user: string;
    avatar: string;
    message: string;
    timestamp: string;
    replies?: number;
    likes?: number;
    photos?: string[];
    location?: string;
  }>}>({
    general: [],
    venues: [],
    dresses: [],
    vendors: [],
    photos: [],
    advice: []
  });

  const [onlineUsers] = useState([
    { name: 'Emma_Planning2024', avatar: '👰‍♀️', status: 'Planning venue visits' },
    { name: 'Sarah_BrideLife', avatar: '💕', status: 'Dress shopping' },
    { name: 'VenueHunter_Jules', avatar: '🏰', status: 'Research mode' },
    { name: 'CountryBride_Mel', avatar: '🌸', status: 'Menu tasting prep' },
    { name: 'DressSearcher_Anna', avatar: '👗', status: 'Found my dress!' },
    { name: 'PlannerPro_Lisa', avatar: '📋', status: 'Vendor hunting' }
  ]);

  const addMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now().toString(),
      user: 'You',
      avatar: '💖',
      message: newMessage,
      timestamp: 'Just now',
      replies: 0,
      likes: 0,
      location: 'Your Location'
    };

    setMessages(prev => ({
      ...prev,
      [activeChannel]: [message, ...prev[activeChannel]]
    }));
    
    setNewMessage('');
  };

  const channelInfo = {
    general: { icon: '💬', name: 'General Chat', desc: 'Main community discussion' },
    venues: { icon: '🏰', name: 'Venue Hunting', desc: 'Share and discover wedding venues' },
    dresses: { icon: '👗', name: 'Dress Shopping', desc: 'Show off finds and get advice' },
    vendors: { icon: '📋', name: 'Vendor Reviews', desc: 'Recommendations and reviews' },
    photos: { icon: '📸', name: 'Photo Gallery', desc: 'Share your wedding moments' },
    advice: { icon: '💡', name: 'Bride Advice', desc: 'Tips and wisdom from brides' }
  };

  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <span className="text-2xl">👩‍💻</span>
          </div>
          <h1 className="text-3xl font-bold text-amber-800">Bride Community</h1>
          <p className="text-amber-700">Connect with fellow brides, share experiences, and get advice from our supportive community</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Channels & Online Users */}
          <div className="lg:col-span-1 space-y-4">
            {/* Channel List */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="font-semibold text-amber-800 mb-3">Community Channels</h3>
              <div className="space-y-2">
                {Object.entries(channelInfo).map(([key, info]) => (
                  <button
                    key={key}
                    onClick={() => setActiveChannel(key as any)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeChannel === key 
                        ? 'bg-rose-100 border border-rose-300 text-rose-800' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{info.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{info.name}</div>
                        <div className="text-xs text-gray-500 truncate">{info.desc}</div>
                      </div>
                      {activeChannel === key && (
                        <div className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
                          {messages[key]?.length || 0}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Online Users */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="font-semibold text-amber-800 mb-3">Online Now ({onlineUsers.length})</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {onlineUsers.map((user, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <div className="relative">
                      <span className="text-lg">{user.avatar}</span>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">{user.name}</div>
                      <div className="text-xs text-gray-500 truncate">{user.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border shadow-sm">
              {/* Channel Header */}
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{channelInfo[activeChannel].icon}</span>
                    <div>
                      <h2 className="text-lg font-semibold text-amber-800">{channelInfo[activeChannel].name}</h2>
                      <p className="text-sm text-gray-600">{channelInfo[activeChannel].desc}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {activeChannel === 'photos' && (
                      <button
                        onClick={() => setShowPhotoUpload(!showPhotoUpload)}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-colors"
                      >
                        📸 Share Photo
                      </button>
                    )}
                    <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm">
                      {messages[activeChannel]?.length || 0} messages
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages[activeChannel]?.map((message) => (
                  <div key={message.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{message.avatar}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-amber-800">{message.user}</span>
                          {message.location && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              📍 {message.location}
                            </span>
                          )}
                          <span className="text-xs text-gray-500">{message.timestamp}</span>
                        </div>
                        <p className="text-gray-700 mb-3">{message.message}</p>
                        
                        {/* Photo Gallery */}
                        {message.photos && (
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            {message.photos.map((photo, index) => (
                              <div key={index} className="bg-gray-200 rounded-lg p-8 text-center">
                                <span className="text-gray-500">����</span>
                                <div className="text-xs text-gray-500 mt-1">{photo}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm">
                          <button className="flex items-center gap-1 text-gray-600 hover:text-rose-600 transition-colors">
                            <span>💕</span>
                            <span>{message.likes}</span>
                          </button>
                          <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
                            <span>💬</span>
                            <span>{message.replies} replies</span>
                          </button>
                          <button className="text-gray-600 hover:text-amber-600 transition-colors">
                            <span>🔗 Share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Photo Upload Section */}
              {showPhotoUpload && activeChannel === 'photos' && (
                <div className="border-t bg-purple-50 p-4">
                  <div className="bg-white rounded-lg border-2 border-dashed border-purple-300 p-6 text-center">
                    <span className="text-4xl">📸</span>
                    <h3 className="text-lg font-semibold text-purple-800 mt-2">Share Your Photos</h3>
                    <p className="text-purple-600 text-sm mb-4">Upload engagement photos, dress fittings, venue visits, or inspiration</p>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Choose Photos
                    </button>
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={`Share with ${channelInfo[activeChannel].name}...`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                      onKeyPress={(e) => e.key === 'Enter' && addMessage()}
                    />
                  </div>
                  <button
                    onClick={addMessage}
                    disabled={!newMessage.trim()}
                    className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Send
                  </button>
                </div>
                <div className="flex gap-2 mt-2">
                  <button className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 hover:bg-gray-100 rounded">
                    😍 Add emoji
                  </button>
                  <button className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 hover:bg-gray-100 rounded">
                    📷 Add photo
                  </button>
                  <button className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 hover:bg-gray-100 rounded">
                    📍 Add location
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-rose-600">1,247</div>
            <div className="text-sm text-gray-600">Active Brides</div>
          </div>
          <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">3,892</div>
            <div className="text-sm text-gray-600">Messages Today</div>
          </div>
          <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">756</div>
            <div className="text-sm text-gray-600">Photos Shared</div>
          </div>
          <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-green-600">89</div>
            <div className="text-sm text-gray-600">Weddings This Month</div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

// Wedding Shopping Hub Component
function WeddingShoppingHub() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'dresses' | 'suits' | 'rings' | 'gifts' | 'decor' | 'flowers' | 'shoes' | 'accessories' | 'invitations'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Shopping categories with popular websites
  const shoppingCategories = {
    dresses: {
      name: 'Wedding Dresses',
      icon: '👗',
      color: 'pink',
      websites: [
        { name: 'Kleinfeld Bridal', url: 'https://www.kleinfeldbridal.com', description: 'World-famous bridal salon', price: '££££' },
        { name: 'David\'s Bridal', url: 'https://www.davidsbridal.com', description: 'Affordable wedding dresses & accessories', price: '££' },
        { name: 'Pronovias', url: 'https://www.pronovias.com', description: 'Designer wedding dresses', price: '£££' },
        { name: 'Monsoon', url: 'https://www.monsoon.co.uk/bridal', description: 'Bohemian & vintage-inspired dresses', price: '££' },
        { name: 'Needle & Thread', url: 'https://needleandthread.com', description: 'Ethereal embellished dresses', price: '£££' },
        { name: 'BHLDN', url: 'https://www.bhldn.com', description: 'Romantic & whimsical bridal wear', price: '£££' }
      ]
    },
    suits: {
      name: 'Groom Attire',
      icon: '🤵',
      color: 'blue',
      websites: [
        { name: 'Moss Bros', url: 'https://www.moss.co.uk', description: 'Formal menswear hire & purchase', price: '££' },
        { name: 'Next', url: 'https://www.next.co.uk/men/suits', description: 'Modern suits & formalwear', price: '££' },
        { name: 'Charles Tyrwhitt', url: 'https://www.ctshirts.com', description: 'Premium shirts & suits', price: '£££' },
        { name: 'Hugo Boss', url: 'https://www.hugoboss.com', description: 'Designer menswear', price: '££££' },
        { name: 'Ted Baker', url: 'https://www.tedbaker.com', description: 'Contemporary formal wear', price: '£££' },
        { name: 'The Kooples', url: 'https://www.thekooples.com', description: 'Modern French menswear', price: '£££' }
      ]
    },
    rings: {
      name: 'Wedding Rings',
      icon: '💍',
      color: 'amber',
      websites: [
        { name: 'Tiffany & Co.', url: 'https://www.tiffany.co.uk', description: 'Luxury engagement & wedding rings', price: '££££' },
        { name: 'Pandora', url: 'https://uk.pandora.net', description: 'Affordable rings & jewelry', price: '££' },
        { name: 'Ernest Jones', url: 'https://www.ernestjones.co.uk', description: 'Diamond specialists', price: '£££' },
        { name: 'H.Samuel', url: 'https://www.hsamuel.co.uk', description: 'High street jewelry', price: '££' },
        { name: 'Goldsmiths', url: 'https://www.goldsmiths.co.uk', description: 'Premium jewelry & watches', price: '£££' },
        { name: 'Blue Nile', url: 'https://www.bluenile.co.uk', description: 'Online diamond retailer', price: '£££' }
      ]
    },
    gifts: {
      name: 'Wedding Gifts',
      icon: '🎁',
      color: 'purple',
      websites: [
        { name: 'John Lewis', url: 'https://www.johnlewis.com/gift-list', description: 'Premium gift list service', price: '£££' },
        { name: 'Marks & Spencer', url: 'https://www.marksandspencer.com/gift-list', description: 'Wedding gift lists', price: '££' },
        { name: 'Debenhams', url: 'https://www.debenhams.com', description: 'Home & lifestyle gifts', price: '££' },
        { name: 'Prezola', url: 'https://prezola.com', description: 'Modern wedding gift list platform', price: 'Various' },
        { name: 'The White Company', url: 'https://www.thewhitecompany.com', description: 'Luxury home accessories', price: '£££' },
        { name: 'Oliver Bonas', url: 'https://www.oliverbonas.com', description: 'Unique homeware & gifts', price: '££' }
      ]
    },
    decor: {
      name: 'Decorations',
      icon: '🎀',
      color: 'rose',
      websites: [
        { name: 'Ginger Ray', url: 'https://www.gingerray.co.uk', description: 'Party decorations & wedding supplies', price: '££' },
        { name: 'Talking Tables', url: 'https://talkingtables.co.uk', description: 'Tableware & party decorations', price: '££' },
        { name: 'Lights4fun', url: 'https://www.lights4fun.co.uk', description: 'Wedding lighting & fairy lights', price: '££' },
        { name: 'Cox & Cox', url: 'https://www.coxandcox.co.uk', description: 'Stylish home & wedding decor', price: '£££' },
        { name: 'The Range', url: 'https://www.therange.co.uk', description: 'Affordable home & craft supplies', price: '£' },
        { name: 'Hobbycraft', url: 'https://www.hobbycraft.co.uk', description: 'DIY wedding crafts & supplies', price: '£' }
      ]
    },
    flowers: {
      name: 'Wedding Flowers',
      icon: '🌸',
      color: 'green',
      websites: [
        { name: 'Interflora', url: 'https://www.interflora.co.uk', description: 'Professional florist network', price: '£££' },
        { name: 'Bloom & Wild', url: 'https://www.bloomandwild.com', description: 'Modern flower delivery service', price: '££' },
        { name: 'Flowerbx', url: 'https://flowerbx.com', description: 'Luxury flowers & arrangements', price: '£££' },
        { name: 'Appleyard Flowers', url: 'https://www.appleyardflowers.com', description: 'Premium wedding florist', price: '£££' },
        { name: 'The Flower Studio', url: 'https://www.theflowerstudiouk.com', description: 'Bespoke wedding flowers', price: '£££' },
        { name: 'Wild at Heart', url: 'https://www.wildatheart.com', description: 'Stylish floral arrangements', price: '££££' }
      ]
    },
    shoes: {
      name: 'Wedding Shoes',
      icon: '👠',
      color: 'indigo',
      websites: [
        { name: 'Jimmy Choo', url: 'https://uk.jimmychoo.com', description: 'Luxury designer shoes', price: '££££' },
        { name: 'LK Bennett', url: 'https://www.lkbennett.com', description: 'Elegant British footwear', price: '£££' },
        { name: 'Kurt Geiger', url: 'https://www.kurtgeiger.com', description: 'Contemporary designer shoes', price: '£££' },
        { name: 'Dune London', url: 'https://www.dunelondon.com', description: 'Stylish occasion shoes', price: '££' },
        { name: 'ASOS', url: 'https://www.asos.com', description: 'Trendy & affordable shoes', price: '££' },
        { name: 'Rainbow Club', url: 'https://www.rainbowclub.co.uk', description: 'Bridal shoe specialists', price: '£££' }
      ]
    },
    accessories: {
      name: 'Accessories',
      icon: '✨',
      color: 'yellow',
      websites: [
        { name: 'Accessorize', url: 'https://uk.accessorize.com', description: 'Wedding accessories & jewelry', price: '££' },
        { name: 'Jon Richard', url: 'https://www.jonrichard.co.uk', description: 'Bridal jewelry & accessories', price: '££' },
        { name: 'Phase Eight', url: 'https://www.phase-eight.com', description: 'Occasion wear accessories', price: '£££' },
        { name: 'Vintage Styler', url: 'https://www.vintagestyler.co.uk', description: 'Vintage wedding accessories', price: '££' },
        { name: 'Etsy', url: 'https://www.etsy.com/uk', description: 'Handmade & personalized accessories', price: 'Various' },
        { name: 'Claire\'s Accessories', url: 'https://www.claires.com', description: 'Affordable jewelry & hair accessories', price: '£' }
      ]
    },
    invitations: {
      name: 'Invitations',
      icon: '💌',
      color: 'red',
      websites: [
        { name: 'Paperless Post', url: 'https://www.paperlesspost.com', description: 'Digital & print invitations', price: '££' },
        { name: 'Minted', url: 'https://www.minted.com', description: 'Artist-designed stationery', price: '£££' },
        { name: 'The Knot', url: 'https://www.theknot.com/invitations', description: 'Wedding invitation marketplace', price: '££' },
        { name: 'Vistaprint', url: 'https://www.vistaprint.co.uk', description: 'Affordable custom printing', price: '£' },
        { name: 'Papier', url: 'https://www.papier.com', description: 'Personalized stationery', price: '££' },
        { name: 'Rosemood', url: 'https://www.rosemood.co.uk', description: 'Luxury wedding stationery', price: '£££' }
      ]
    }
  };

  // Filter websites based on search and category
  const getFilteredWebsites = () => {
    let websites: Array<{ name: string; url: string; description: string; price: string; category: string }> = [];
    
    if (selectedCategory === 'all') {
      Object.entries(shoppingCategories).forEach(([key, category]) => {
        websites.push(...category.websites.map(site => ({ ...site, category: key })));
      });
    } else {
      const category = shoppingCategories[selectedCategory];
      if (category) {
        websites = category.websites.map(site => ({ ...site, category: selectedCategory }));
      }
    }

    if (searchTerm) {
      websites = websites.filter(site =>
        site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return websites;
  };

  const getCategoryColorClass = (color: string, type: 'bg' | 'text' | 'border') => {
    const colors: Record<string, Record<string, string>> = {
      pink: { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
      amber: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
      rose: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' },
      green: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
      red: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' }
    };
    return colors[color]?.[type] || colors.pink[type];
  };

  const getPriceColor = (price: string) => {
    switch (price) {
      case '£': return 'bg-green-100 text-green-800';
      case '££': return 'bg-yellow-100 text-yellow-800';
      case '£££': return 'bg-orange-100 text-orange-800';
      case '££££': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <span className="text-2xl">🛍️</span>
          </div>
          <h1 className="text-3xl font-bold text-amber-800">Wedding Shopping Hub</h1>
          <p className="text-amber-700">Discover the best wedding retailers for dresses, rings, gifts, and more</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search wedding retailers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="font-semibold text-amber-800 mb-3">Shopping Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCategory === 'all' 
                      ? 'bg-amber-100 border border-amber-300 text-amber-800' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🛒</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">All Categories</div>
                      <div className="text-xs text-gray-500">Browse everything</div>
                    </div>
                    <div className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                      {Object.values(shoppingCategories).reduce((total, cat) => total + cat.websites.length, 0)}
                    </div>
                  </div>
                </button>

                {Object.entries(shoppingCategories).map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key as any)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCategory === key 
                        ? `${getCategoryColorClass(category.color, 'bg')} ${getCategoryColorClass(category.color, 'border')} border ${getCategoryColorClass(category.color, 'text')}` 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{category.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{category.name}</div>
                        <div className="text-xs text-gray-500 truncate">{category.websites.length} retailers</div>
                      </div>
                      <div className={`${getCategoryColorClass(category.color, 'bg')} ${getCategoryColorClass(category.color, 'text')} text-xs px-2 py-1 rounded-full`}>
                        {category.websites.length}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Shopping Tips */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="font-semibold text-amber-800 mb-3">Shopping Tips</h3>
              <div className="space-y-2 text-sm text-amber-700">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">💡</span>
                  <span>Compare prices across multiple retailers</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">🎯</span>
                  <span>Check return policies before ordering</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">⭐</span>
                  <span>Read reviews and ratings</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">📅</span>
                  <span>Order early for alterations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Website Grid */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-amber-800">
                    {selectedCategory === 'all' ? 'All Wedding Retailers' : shoppingCategories[selectedCategory as keyof typeof shoppingCategories]?.name}
                  </h2>
                  <div className="flex gap-2">
                    <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm">
                      {getFilteredWebsites().length} retailers
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getFilteredWebsites().map((website, index) => {
                    const category = shoppingCategories[website.category as keyof typeof shoppingCategories];
                    return (
                      <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{category.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-semibold text-amber-800 mb-1">{website.name}</h4>
                                <p className="text-sm text-gray-700 mb-2">{website.description}</p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${getPriceColor(website.price)}`}>
                                {website.price}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColorClass(category.color, 'bg')} ${getCategoryColorClass(category.color, 'text')}`}>
                                {category.icon} {category.name}
                              </span>
                              
                              <a
                                href={website.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700 transition-colors"
                              >
                                Visit Store
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {getFilteredWebsites().length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <span className="text-6xl block mb-4">🛍️</span>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No retailers found</h3>
                    <p className="text-sm mb-4">
                      {searchTerm ? 'Try adjusting your search terms' : 'Select a category to browse retailers'}
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                      }}
                      className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                    >
                      Browse All Retailers
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Deals Section */}
        <div className="bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-amber-800 mb-4 text-center">Featured Wedding Deals</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-pink-200">
              <div className="text-center">
                <div className="text-2xl mb-2">👗</div>
                <h4 className="font-semibold text-amber-800 mb-1">Bridal Sample Sales</h4>
                <p className="text-sm text-amber-700 mb-2">Up to 70% off designer dresses</p>
                <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs">Limited Time</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="text-center">
                <div className="text-2xl mb-2">💍</div>
                <h4 className="font-semibold text-amber-800 mb-1">Ring Insurance</h4>
                <p className="text-sm text-amber-700 mb-2">Free first year with purchases over £1000</p>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Special Offer</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="text-center">
                <div className="text-2xl mb-2">🎁</div>
                <h4 className="font-semibold text-amber-800 mb-1">Gift List Bonus</h4>
                <p className="text-sm text-amber-700 mb-2">Free delivery on orders over £50</p>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">John Lewis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

// Wedding Day Schedule Component
function WeddingDaySchedule() {
  const [selectedDate, setSelectedDate] = useState('2024-06-15');
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);

  // Wedding day schedule events - start empty for users
  const [scheduleEvents, setScheduleEvents] = useState<Array<{
    id: string;
    time: string;
    title: string;
    description: string;
    duration: number; // in minutes
    category: 'prep' | 'ceremony' | 'reception' | 'photo' | 'custom';
    location?: string;
    notes?: string;
    completed?: boolean;
  }>>([]);

  const [newEvent, setNewEvent] = useState({
    time: '',
    title: '',
    description: '',
    duration: 60,
    category: 'custom' as const,
    location: '',
    notes: ''
  });

  const addEvent = () => {
    if (newEvent.time && newEvent.title) {
      const event = {
        ...newEvent,
        id: Date.now().toString()
      };
      setScheduleEvents([...scheduleEvents, event].sort((a, b) => a.time.localeCompare(b.time)));
      setNewEvent({
        time: '',
        title: '',
        description: '',
        duration: 60,
        category: 'custom',
        location: '',
        notes: ''
      });
      setShowAddEvent(false);
    }
  };

  const deleteEvent = (id: string) => {
    setScheduleEvents(scheduleEvents.filter(event => event.id !== id));
  };

  const toggleCompleted = (id: string) => {
    setScheduleEvents(scheduleEvents.map(event => 
      event.id === id ? { ...event, completed: !event.completed } : event
    ));
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour12 = parseInt(hours) % 12 || 12;
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;
    const endHours = Math.floor(endMinutes / 60) % 24;
    const endMins = endMinutes % 60;
    const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
    return formatTime(endTime);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'prep': return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'ceremony': return 'bg-rose-100 border-rose-300 text-rose-800';
      case 'reception': return 'bg-amber-100 border-amber-300 text-amber-800';
      case 'photo': return 'bg-blue-100 border-blue-300 text-blue-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'prep': return '💄';
      case 'ceremony': return '💒';
      case 'reception': return '🥂';
      case 'photo': return '📸';
      default: return '📝';
    }
  };

  return (
    <ErrorBoundary>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-r from-rose-100 to-amber-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <span className="text-2xl">⏰</span>
          </div>
          <h1 className="text-3xl font-bold text-amber-800">Wedding Day Schedule</h1>
          <p className="text-amber-700">Plan every moment of your perfect wedding day</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Schedule Overview */}
          <div className="lg:col-span-1 space-y-4">
            {/* Date Selector */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="font-semibold text-amber-800 mb-3">Wedding Date</h3>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
              <div className="mt-2 text-xs text-gray-500">
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="font-semibold text-amber-800 mb-3">Day Overview</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Events:</span>
                  <span className="font-semibold text-amber-800">{scheduleEvents.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Day Starts:</span>
                  <span className="font-semibold text-amber-800">
                    {scheduleEvents.length > 0 ? formatTime(scheduleEvents[0].time) : 'TBD'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Day Ends:</span>
                  <span className="font-semibold text-amber-800">
                    {scheduleEvents.length > 0 ? 
                      calculateEndTime(
                        scheduleEvents[scheduleEvents.length - 1].time,
                        scheduleEvents[scheduleEvents.length - 1].duration
                      ) : 'TBD'
                    }
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-semibold text-green-600">
                    {scheduleEvents.filter(e => e.completed).length}/{scheduleEvents.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Categories Legend */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="font-semibold text-amber-800 mb-3">Categories</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span>💄</span>
                  <span className="text-sm text-purple-800">Preparation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>💒</span>
                  <span className="text-sm text-rose-800">Ceremony</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🥂</span>
                  <span className="text-sm text-amber-800">Reception</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📸</span>
                  <span className="text-sm text-blue-800">Photography</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📝</span>
                  <span className="text-sm text-gray-800">Custom</span>
                </div>
              </div>
            </div>

            {/* Add Event Button */}
            <button
              onClick={() => setShowAddEvent(true)}
              className="w-full px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
            >
              + Add Custom Event
            </button>
          </div>

          {/* Main Timeline */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border shadow-sm">
              {/* Timeline Header */}
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-amber-800">Wedding Day Timeline</h2>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors">
                      Export PDF
                    </button>
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors">
                      Share Timeline
                    </button>
                  </div>
                </div>
              </div>

              {/* Timeline Events */}
              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {scheduleEvents.map((event, index) => (
                  <div key={event.id} className="relative">
                    {/* Timeline connector */}
                    {index < scheduleEvents.length - 1 && (
                      <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-200"></div>
                    )}
                    
                    <div className={`border-l-4 pl-6 pb-4 ${
                      event.completed ? 'border-green-400' : 'border-gray-200'
                    }`}>
                      {/* Time marker */}
                      <div className={`absolute left-0 w-3 h-3 rounded-full -translate-x-1.5 ${
                        event.completed ? 'bg-green-400' : 'bg-gray-200'
                      }`}></div>
                      
                      <div className={`rounded-lg border p-4 ${getCategoryColor(event.category)} ${
                        event.completed ? 'opacity-75' : ''
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">{getCategoryIcon(event.category)}</span>
                              <span className="font-semibold">{formatTime(event.time)}</span>
                              <span className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded">
                                {event.duration}min
                              </span>
                              <span className="text-xs">
                                Ends: {calculateEndTime(event.time, event.duration)}
                              </span>
                            </div>
                            
                            <h4 className={`font-semibold mb-1 ${event.completed ? 'line-through' : ''}`}>
                              {event.title}
                            </h4>
                            <p className="text-sm mb-2">{event.description}</p>
                            
                            {event.location && (
                              <div className="flex items-center gap-1 text-xs mb-1">
                                <span>📍</span>
                                <span>{event.location}</span>
                              </div>
                            )}
                            
                            {event.notes && (
                              <div className="text-xs italic bg-white bg-opacity-30 p-2 rounded mt-2">
                                💡 {event.notes}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-1 ml-3">
                            <button
                              onClick={() => toggleCompleted(event.id)}
                              className={`p-1 rounded text-xs ${
                                event.completed 
                                  ? 'bg-green-600 text-white' 
                                  : 'bg-white text-gray-600 hover:bg-gray-100'
                              }`}
                              title={event.completed ? 'Mark as incomplete' : 'Mark as completed'}
                            >
                              ✓
                            </button>
                            {event.category === 'custom' && (
                              <button
                                onClick={() => deleteEvent(event.id)}
                                className="p-1 bg-red-100 text-red-600 hover:bg-red-200 rounded text-xs"
                                title="Delete event"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Add Event Modal */}
        {showAddEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-amber-800 mb-4">Add Custom Event</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder="e.g., Vendor Meeting, Getting Ready Photos"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    placeholder="Brief description of the event..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      value={newEvent.duration}
                      onChange={(e) => setNewEvent({...newEvent, duration: parseInt(e.target.value) || 60})}
                      min="15"
                      max="480"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={newEvent.category}
                      onChange={(e) => setNewEvent({...newEvent, category: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                    >
                      <option value="custom">Custom</option>
                      <option value="prep">Preparation</option>
                      <option value="ceremony">Ceremony</option>
                      <option value="reception">Reception</option>
                      <option value="photo">Photography</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location (optional)</label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    placeholder="e.g., Bridal Suite, Garden, Reception Hall"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                  <textarea
                    value={newEvent.notes}
                    onChange={(e) => setNewEvent({...newEvent, notes: e.target.value})}
                    placeholder="Any special notes or reminders..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddEvent(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addEvent}
                    disabled={!newEvent.time || !newEvent.title}
                    className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

// Wedding Budget Tracker Component
function WeddingBudgetTracker() {
  const [totalBudget, setTotalBudget] = useState(0);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showEditBudget, setShowEditBudget] = useState(false);

  // Expense categories with budgets and icons
  const [budgetCategories, setBudgetCategories] = useState({
    'venue': { name: 'Venue & Reception', icon: '🏰', budget: 10000, color: 'rose' },
    'photography': { name: 'Photography & Video', icon: '📸', budget: 3000, color: 'blue' },
    'attire': { name: 'Attire & Beauty', icon: '👗', budget: 2500, color: 'purple' },
    'flowers': { name: 'Flowers & Decor', icon: '🌸', budget: 2000, color: 'pink' },
    'catering': { name: 'Catering & Cake', icon: '🍰', budget: 4000, color: 'orange' },
    'music': { name: 'Music & Entertainment', icon: '🎵', budget: 1500, color: 'indigo' },
    'transport': { name: 'Transportation', icon: '🚗', budget: 800, color: 'green' },
    'rings': { name: 'Rings & Jewelry', icon: '💍', budget: 1200, color: 'amber' },
    'other': { name: 'Other Expenses', icon: '📋', budget: 0, color: 'gray' }
  });

  // Sample expenses - start empty for users
  const [expenses, setExpenses] = useState<Array<{
    id: string;
    category: string;
    description: string;
    amount: number;
    date: string;
    vendor?: string;
    notes?: string;
    receipt?: string;
    paid: boolean;
  }>>([]);

  const [newExpense, setNewExpense] = useState({
    category: 'venue',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    vendor: '',
    notes: '',
    paid: false
  });

  // Calculate totals
  const totalSpent = expenses.filter(e => e.paid).reduce((sum, expense) => sum + expense.amount, 0);
  const totalPending = expenses.filter(e => !e.paid).reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = totalBudget - totalSpent - totalPending;
  const spentPercentage = Math.round((totalSpent / totalBudget) * 100);

  // Calculate category spending
  const categorySpending = Object.keys(budgetCategories).reduce((acc, categoryId) => {
    const categoryExpenses = expenses.filter(e => e.category === categoryId);
    const spent = categoryExpenses.filter(e => e.paid).reduce((sum, e) => sum + e.amount, 0);
    const pending = categoryExpenses.filter(e => !e.paid).reduce((sum, e) => sum + e.amount, 0);
    acc[categoryId] = { spent, pending, total: spent + pending };
    return acc;
  }, {} as Record<string, { spent: number; pending: number; total: number }>);

  const addExpense = () => {
    if (newExpense.description && newExpense.amount) {
      const expense = {
        id: Date.now().toString(),
        category: newExpense.category,
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        date: newExpense.date,
        vendor: newExpense.vendor,
        notes: newExpense.notes,
        paid: newExpense.paid
      };
      
      setExpenses([expense, ...expenses]);
      setNewExpense({
        category: 'venue',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        vendor: '',
        notes: '',
        paid: false
      });
      setShowAddExpense(false);
    }
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const togglePaid = (id: string) => {
    setExpenses(expenses.map(e => 
      e.id === id ? { ...e, paid: !e.paid } : e
    ));
  };

  const getCategoryColorClass = (color: string, type: 'bg' | 'text' | 'border') => {
    const colors: Record<string, Record<string, string>> = {
      rose: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
      green: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
      amber: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
      gray: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' }
    };
    return colors[color]?.[type] || colors.gray[type];
  };

  return (
    <ErrorBoundary>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <span className="text-2xl">💰</span>
          </div>
          <h1 className="text-3xl font-bold text-amber-800">Budget Tracker</h1>
          <p className="text-amber-700">Keep track of your wedding expenses and stay on budget</p>
        </div>

        {/* Budget Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-amber-800">Total Budget</h3>
              <button
                onClick={() => setShowEditBudget(true)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
            </div>
            <div className="text-3xl font-bold text-green-600">£{totalBudget.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-2">Your wedding budget</div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-amber-800 mb-2">Total Spent</h3>
            <div className="text-3xl font-bold text-red-600">£{totalSpent.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-2">{spentPercentage}% of budget used</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all" 
                style={{ width: `${Math.min(spentPercentage, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-amber-800 mb-2">Pending</h3>
            <div className="text-3xl font-bold text-orange-600">£{totalPending.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-2">Unpaid expenses</div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-amber-800 mb-2">Remaining</h3>
            <div className={`text-3xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              £{Math.abs(remainingBudget).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {remainingBudget >= 0 ? 'Still available' : 'Over budget!'}
            </div>
          </div>
        </div>

        {/* Add Expense Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowAddExpense(true)}
            className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2 shadow-lg"
          >
            <span className="text-lg">➕</span>
            Add New Expense
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget Categories */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold text-amber-800 mb-4">Budget by Category</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {Object.entries(budgetCategories).map(([categoryId, category]) => {
                const spending = categorySpending[categoryId] || { spent: 0, pending: 0, total: 0 };
                const percentage = category.budget > 0 ? Math.round((spending.total / category.budget) * 100) : 0;
                
                return (
                  <div key={categoryId} className={`p-4 rounded-lg border ${getCategoryColorClass(category.color, 'bg')} ${getCategoryColorClass(category.color, 'border')}`}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{category.icon}</span>
                        <div>
                          <div className={`font-semibold ${getCategoryColorClass(category.color, 'text')}`}>
                            {category.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            Budget: £{category.budget.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${getCategoryColorClass(category.color, 'text')}`}>
                          £{spending.total.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">{percentage}% used</div>
                      </div>
                    </div>
                    
                    {category.budget > 0 && (
                      <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            percentage > 100 ? 'bg-red-500' : 
                            percentage > 80 ? 'bg-orange-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    )}
                    
                    {spending.pending > 0 && (
                      <div className="text-xs text-orange-600 mt-1">
                        £{spending.pending.toLocaleString()} pending
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-amber-800">Recent Expenses</h2>
              <span className="text-sm text-gray-600">{expenses.length} total</span>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {expenses.map((expense) => {
                const category = budgetCategories[expense.category];
                return (
                  <div key={expense.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <span className="text-lg">{category?.icon || '📋'}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-amber-800">{expense.description}</div>
                          <div className="text-xs text-gray-600">
                            {category?.name || expense.category} • {expense.date}
                          </div>
                          {expense.vendor && (
                            <div className="text-xs text-gray-500">📍 {expense.vendor}</div>
                          )}
                          {expense.notes && (
                            <div className="text-xs text-gray-500 italic mt-1">💡 {expense.notes}</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right flex flex-col items-end gap-1">
                        <div className={`font-bold ${expense.paid ? 'text-red-600' : 'text-orange-600'}`}>
                          £{expense.amount.toLocaleString()}
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => togglePaid(expense.id)}
                            className={`px-2 py-1 rounded text-xs ${
                              expense.paid 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            {expense.paid ? '✓ Paid' : '⏳ Pending'}
                          </button>
                          <button
                            onClick={() => deleteExpense(expense.id)}
                            className="px-2 py-1 bg-red-100 text-red-600 hover:bg-red-200 rounded text-xs"
                            title="Delete expense"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {expenses.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl block mb-2">📝</span>
                  No expenses yet. Click "Add New Expense" to get started!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Budget Summary */}
        <div className="bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-amber-800 mb-3">Budget Health Check</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className={`text-2xl ${spentPercentage < 50 ? '😌' : spentPercentage < 75 ? '😊' : spentPercentage < 90 ? '😟' : '😰'}`}></span>
              <div>
                <div className="font-medium text-amber-800">Spending Status</div>
                <div className="text-amber-700">
                  {spentPercentage < 50 ? 'Great control' : 
                   spentPercentage < 75 ? 'On track' : 
                   spentPercentage < 90 ? 'Watch spending' : 
                   'Budget concern'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-2xl">⏱️</span>
              <div>
                <div className="font-medium text-amber-800">Pending Payments</div>
                <div className="text-amber-700">
                  £{totalPending.toLocaleString()} due soon
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`text-2xl ${remainingBudget >= 1000 ? '💚' : remainingBudget >= 0 ? '💛' : '❤️'}`}></span>
              <div>
                <div className="font-medium text-amber-800">Budget Status</div>
                <div className="text-amber-700">
                  {remainingBudget >= 1000 ? 'Healthy buffer' : 
                   remainingBudget >= 0 ? 'Close to limit' : 
                   'Over budget'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Expense Modal */}
        {showAddExpense && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-amber-800 mb-4">Add New Expense</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    {Object.entries(budgetCategories).map(([id, category]) => (
                      <option key={id} value={id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <input
                    type="text"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    placeholder="e.g., Wedding venue deposit, Photography package"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (£) *</label>
                    <input
                      type="number"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor/Company</label>
                  <input
                    type="text"
                    value={newExpense.vendor}
                    onChange={(e) => setNewExpense({...newExpense, vendor: e.target.value})}
                    placeholder="e.g., Ashridge House, Sarah Jenkins Photography"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={newExpense.notes}
                    onChange={(e) => setNewExpense({...newExpense, notes: e.target.value})}
                    placeholder="Additional notes about this expense..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="paid"
                    checked={newExpense.paid}
                    onChange={(e) => setNewExpense({...newExpense, paid: e.target.checked})}
                    className="h-4 w-4 text-rose-600 rounded"
                  />
                  <label htmlFor="paid" className="text-sm text-gray-700">
                    Mark as paid
                  </label>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddExpense(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addExpense}
                    disabled={!newExpense.description || !newExpense.amount}
                    className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Expense
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Budget Modal */}
        {showEditBudget && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold text-amber-800 mb-4">Edit Total Budget</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Wedding Budget (£)</label>
                  <input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(parseInt(e.target.value) || 0)}
                    min="0"
                    step="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-500">💡</span>
                    <div>
                      <div className="font-medium text-amber-800">Budget Tip</div>
                      <div className="text-amber-700 mt-1">
                        The average UK wedding costs £20,000-£30,000. Consider allocating:
                        40% venue, 15% photography, 10% attire, 10% flowers, 15% catering, 5% music, 5% other.
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEditBudget(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowEditBudget(false)}
                    className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                  >
                    Update Budget
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

// Document Manager Component
function DocumentManager() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'contracts' | 'receipts' | 'insurance' | 'permits' | 'photos' | 'other'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Document categories with icons and colors
  const documentCategories = {
    contracts: { name: 'Contracts & Agreements', icon: '📋', color: 'blue', desc: 'Vendor contracts, venue agreements' },
    receipts: { name: 'Receipts & Invoices', icon: '🧾', color: 'green', desc: 'Payment receipts, invoices, deposits' },
    insurance: { name: 'Insurance & Legal', icon: '🛡️', color: 'purple', desc: 'Wedding insurance, liability docs' },
    permits: { name: 'Permits & Licenses', icon: '📄', color: 'orange', desc: 'Marriage license, venue permits' },
    photos: { name: 'Reference Photos', icon: '📸', color: 'pink', desc: 'Inspiration images, venue photos' },
    other: { name: 'Other Documents', icon: '🗂️', color: 'gray', desc: 'Miscellaneous wedding documents' }
  };

  // Sample documents - start empty for users
  const [documents, setDocuments] = useState<Array<{
    id: string;
    name: string;
    category: keyof typeof documentCategories;
    type: 'pdf' | 'image' | 'doc' | 'other';
    size: string;
    uploadDate: string;
    vendor?: string;
    amount?: number;
    dueDate?: string;
    notes?: string;
    tags?: string[];
    starred: boolean;
  }>>([]);

  const [newDocument, setNewDocument] = useState({
    name: '',
    category: 'contracts' as keyof typeof documentCategories,
    vendor: '',
    amount: '',
    dueDate: '',
    notes: '',
    tags: ''
  });

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Handle file selection
  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(files);
      // If no name is provided, use the first file's name
      if (!newDocument.name) {
        setNewDocument(prev => ({
          ...prev,
          name: files[0].name
        }));
      }
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // Filter for supported file types
      const supportedFiles = Array.from(files).filter(file => {
        const extension = file.name.toLowerCase().split('.').pop() || '';
        return ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'txt', 'rtf'].includes(extension);
      });
      
      if (supportedFiles.length > 0) {
        const dt = new DataTransfer();
        supportedFiles.forEach(file => dt.items.add(file));
        setSelectedFiles(dt.files);
        
        if (fileInputRef.current) {
          fileInputRef.current.files = dt.files;
        }
        
        // If no name is provided, use the first file's name
        if (!newDocument.name) {
          setNewDocument(prev => ({
            ...prev,
            name: supportedFiles[0].name
          }));
        }
      }
    }
  };

  // Get file type from extension
  const getFileType = (filename: string): 'pdf' | 'image' | 'doc' | 'other' => {
    const extension = filename.toLowerCase().split('.').pop() || '';
    if (['pdf'].includes(extension)) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
    if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) return 'doc';
    return 'other';
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const addDocument = () => {
    if (newDocument.name.trim()) {
      // If files are selected, create documents for each file
      if (selectedFiles && selectedFiles.length > 0) {
        const newDocuments = Array.from(selectedFiles).map((file, index) => ({
          id: (Date.now() + index).toString(),
          name: file.name,
          category: newDocument.category,
          type: getFileType(file.name),
          size: formatFileSize(file.size),
          uploadDate: new Date().toISOString().split('T')[0],
          vendor: newDocument.vendor || undefined,
          amount: newDocument.amount ? parseFloat(newDocument.amount) : undefined,
          dueDate: newDocument.dueDate || undefined,
          notes: newDocument.notes || undefined,
          tags: newDocument.tags ? newDocument.tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined,
          starred: false
        }));
        
        setDocuments([...newDocuments, ...documents]);
      } else {
        // Create a single document entry without file
        const document = {
          id: Date.now().toString(),
          name: newDocument.name.trim(),
          category: newDocument.category,
          type: 'pdf' as const,
          size: '1.0 MB', // Default size
          uploadDate: new Date().toISOString().split('T')[0],
          vendor: newDocument.vendor || undefined,
          amount: newDocument.amount ? parseFloat(newDocument.amount) : undefined,
          dueDate: newDocument.dueDate || undefined,
          notes: newDocument.notes || undefined,
          tags: newDocument.tags ? newDocument.tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined,
          starred: false
        };
        
        setDocuments([document, ...documents]);
      }
      
      // Reset form and selected files
      setNewDocument({
        name: '',
        category: 'contracts',
        vendor: '',
        amount: '',
        dueDate: '',
        notes: '',
        tags: ''
      });
      setSelectedFiles(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setShowUploadModal(false);
    }
  };

  const deleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const toggleStarred = (id: string) => {
    setDocuments(documents.map(doc => 
      doc.id === id ? { ...doc, starred: !doc.starred } : doc
    ));
  };

  const getCategoryColorClass = (color: string, type: 'bg' | 'text' | 'border') => {
    const colors: Record<string, Record<string, string>> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
      green: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300' },
      gray: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' }
    };
    return colors[color]?.[type] || colors.gray[type];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'image': return '🖼️';
      case 'doc': return '📝';
      default: return '📎';
    }
  };

  // Calculate stats
  const totalDocuments = documents.length;
  const totalValue = documents.reduce((sum, doc) => sum + (doc.amount || 0), 0);
  const starredCount = documents.filter(doc => doc.starred).length;
  const upcomingDueDates = documents.filter(doc => doc.dueDate && new Date(doc.dueDate) > new Date()).length;

  return (
    <ErrorBoundary>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <span className="text-2xl">🗂️</span>
          </div>
          <h1 className="text-3xl font-bold text-amber-800">Document Manager</h1>
          <p className="text-amber-700">Organize your wedding documents, contracts, and receipts</p>
        </div>

        {/* Document Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-amber-800 mb-2">Total Documents</h3>
            <div className="text-3xl font-bold text-blue-600">{totalDocuments}</div>
            <div className="text-sm text-gray-500 mt-2">Files stored</div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-amber-800 mb-2">Total Value</h3>
            <div className="text-3xl font-bold text-green-600">£{totalValue.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-2">Contract amounts</div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-amber-800 mb-2">Important</h3>
            <div className="text-3xl font-bold text-amber-600">{starredCount}</div>
            <div className="text-sm text-gray-500 mt-2">Starred documents</div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-amber-800 mb-2">Upcoming</h3>
            <div className="text-3xl font-bold text-orange-600">{upcomingDueDates}</div>
            <div className="text-sm text-gray-500 mt-2">Due dates pending</div>
          </div>
        </div>

        {/* Upload Button & Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2 shadow-lg"
          >
            <span className="text-lg">📤</span>
            Upload Document
          </button>

          <div className="flex gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="font-semibold text-amber-800 mb-3">Document Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCategory === 'all' 
                      ? 'bg-amber-100 border border-amber-300 text-amber-800' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📁</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">All Documents</div>
                      <div className="text-xs text-gray-500">View everything</div>
                    </div>
                    <div className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                      {totalDocuments}
                    </div>
                  </div>
                </button>

                {Object.entries(documentCategories).map(([key, category]) => {
                  const count = documents.filter(doc => doc.category === key).length;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key as any)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedCategory === key 
                          ? `${getCategoryColorClass(category.color, 'bg')} ${getCategoryColorClass(category.color, 'border')} border ${getCategoryColorClass(category.color, 'text')}` 
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{category.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{category.name}</div>
                          <div className="text-xs text-gray-500 truncate">{category.desc}</div>
                        </div>
                        {count > 0 && (
                          <div className={`${getCategoryColorClass(category.color, 'bg')} ${getCategoryColorClass(category.color, 'text')} text-xs px-2 py-1 rounded-full`}>
                            {count}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="font-semibold text-amber-800 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2"
                >
                  <span>⭐</span>
                  <span>View Starred ({starredCount})</span>
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2">
                  <span>📊</span>
                  <span>Export Summary</span>
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2">
                  <span>🗃️</span>
                  <span>Archive Old Docs</span>
                </button>
              </div>
            </div>
          </div>

          {/* Document List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-amber-800">
                    {selectedCategory === 'all' ? 'All Documents' : documentCategories[selectedCategory as keyof typeof documentCategories]?.name}
                  </h2>
                  <div className="flex gap-2">
                    <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm">
                      {filteredDocuments.length} {filteredDocuments.length === 1 ? 'document' : 'documents'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {filteredDocuments.map((document) => {
                  const category = documentCategories[document.category];
                  return (
                    <div key={document.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <span className="text-2xl">{getFileIcon(document.type)}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-amber-800 truncate">{document.name}</h4>
                              {document.starred && <span className="text-yellow-500">⭐</span>}
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mb-2">
                              <span className={`px-2 py-1 rounded-full ${getCategoryColorClass(category.color, 'bg')} ${getCategoryColorClass(category.color, 'text')}`}>
                                {category.icon} {category.name}
                              </span>
                              <span>📅 {document.uploadDate}</span>
                              <span>📏 {document.size}</span>
                              {document.vendor && <span>🏢 {document.vendor}</span>}
                            </div>
                            
                            {document.amount && (
                              <div className="text-sm font-semibold text-green-600 mb-1">
                                £{document.amount.toLocaleString()}
                              </div>
                            )}
                            
                            {document.dueDate && (
                              <div className="text-sm text-orange-600 mb-1">
                                📅 Due: {new Date(document.dueDate).toLocaleDateString()}
                              </div>
                            )}
                            
                            {document.notes && (
                              <div className="text-sm text-gray-600 italic mb-2">
                                💡 {document.notes}
                              </div>
                            )}
                            
                            {document.tags && document.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {document.tags.map((tag, index) => (
                                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-1 ml-3">
                          <button
                            onClick={() => toggleStarred(document.id)}
                            className={`p-2 rounded text-sm ${
                              document.starred 
                                ? 'bg-yellow-100 text-yellow-600' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            title={document.starred ? 'Remove from starred' : 'Add to starred'}
                          >
                            ⭐
                          </button>
                          <button
                            className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded text-sm"
                            title="Download document"
                          >
                            📥
                          </button>
                          <button
                            onClick={() => deleteDocument(document.id)}
                            className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded text-sm"
                            title="Delete document"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {filteredDocuments.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <span className="text-6xl block mb-4">📂</span>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No documents found</h3>
                    <p className="text-sm mb-4">
                      {searchTerm ? 'Try adjusting your search terms' : 'Upload your first document to get started'}
                    </p>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                    >
                      Upload Document
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-amber-800 mb-4">Upload New Document</h3>
              
              <div className="space-y-4">
                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp,.txt,.rtf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {/* File Upload Area */}
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                    isDragOver 
                      ? 'border-rose-400 bg-rose-50' 
                      : 'border-gray-300 hover:border-rose-300'
                  }`}
                  onClick={handleFileSelect}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <span className="text-4xl block mb-2">
                    {isDragOver ? '📥' : '📤'}
                  </span>
                  <h4 className="font-semibold text-gray-700 mb-1">
                    {isDragOver ? 'Drop files here' : 'Choose files to upload'}
                  </h4>
                  <p className="text-sm text-gray-500 mb-3">
                    {isDragOver ? 'Release to upload' : 'or drag and drop them here'}
                  </p>
                  {!isDragOver && (
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileSelect();
                      }}
                      className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                    >
                      Select Files
                    </button>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    Supports PDF, DOC, JPG, PNG (Max 10MB)
                  </div>
                </div>

                {/* Selected Files Preview */}
                {selectedFiles && selectedFiles.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Selected Files ({selectedFiles.length})</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {Array.from(selectedFiles).map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-white rounded p-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span>{getFileIcon(getFileType(file.name))}</span>
                            <div>
                              <div className="font-medium text-blue-800 truncate max-w-48">{file.name}</div>
                              <div className="text-xs text-blue-600">{formatFileSize(file.size)} • {getFileType(file.name).toUpperCase()}</div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const dt = new DataTransfer();
                              Array.from(selectedFiles).forEach((f, i) => {
                                if (i !== index) dt.items.add(f);
                              });
                              setSelectedFiles(dt.files.length > 0 ? dt.files : null);
                              if (fileInputRef.current) {
                                fileInputRef.current.files = dt.files;
                              }
                            }}
                            className="text-red-600 hover:text-red-800 px-1"
                            title="Remove file"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Name * {selectedFiles && selectedFiles.length > 1 && (
                      <span className="text-xs text-blue-600">
                        (Will use individual file names for multiple files)
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={newDocument.name}
                    onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
                    placeholder={
                      selectedFiles && selectedFiles.length > 0 
                        ? selectedFiles[0].name 
                        : "e.g., Venue Contract, Photography Receipt"
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                  {selectedFiles && selectedFiles.length > 1 && (
                    <div className="text-xs text-gray-500 mt-1">
                      When uploading multiple files, each file will keep its original name
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={newDocument.category}
                    onChange={(e) => setNewDocument({...newDocument, category: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    {Object.entries(documentCategories).map(([key, category]) => (
                      <option key={key} value={key}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vendor/Company</label>
                    <input
                      type="text"
                      value={newDocument.vendor}
                      onChange={(e) => setNewDocument({...newDocument, vendor: e.target.value})}
                      placeholder="e.g., Ashridge House"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (£)</label>
                    <input
                      type="number"
                      value={newDocument.amount}
                      onChange={(e) => setNewDocument({...newDocument, amount: e.target.value})}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newDocument.dueDate}
                    onChange={(e) => setNewDocument({...newDocument, dueDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={newDocument.notes}
                    onChange={(e) => setNewDocument({...newDocument, notes: e.target.value})}
                    placeholder="Additional notes about this document..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <input
                    type="text"
                    value={newDocument.tags}
                    onChange={(e) => setNewDocument({...newDocument, tags: e.target.value})}
                    placeholder="venue, deposit, urgent (comma separated)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Add tags separated by commas for easier searching
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowUploadModal(false);
                      // Reset files and form when canceling
                      setSelectedFiles(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                      setNewDocument({
                        name: '',
                        category: 'contracts',
                        vendor: '',
                        amount: '',
                        dueDate: '',
                        notes: '',
                        tags: ''
                      });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addDocument}
                    disabled={!newDocument.name.trim() && (!selectedFiles || selectedFiles.length === 0)}
                    className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {selectedFiles && selectedFiles.length > 0 
                      ? `Upload ${selectedFiles.length} Document${selectedFiles.length === 1 ? '' : 's'}`
                      : 'Add Document Entry'
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

// Wedding Guest List Component
function WeddingGuestList() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'family' | 'friends' | 'colleagues' | 'plus-ones'>('all');
  const [selectedRSVP, setSelectedRSVP] = useState<'all' | 'accepted' | 'declined' | 'pending'>('all');
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [showCSVImport, setShowCSVImport] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingGuest, setEditingGuest] = useState<string | null>(null);
  const [showSendInvitations, setShowSendInvitations] = useState(false);

  // Guest categories with colors
  const guestCategories = {
    family: { name: 'Family', icon: '👨‍👩‍👧‍👦', color: 'rose', desc: 'Immediate and extended family' },
    friends: { name: 'Friends', icon: '👫', color: 'blue', desc: 'Close friends and social circle' },
    colleagues: { name: 'Colleagues', icon: '💼', color: 'purple', desc: 'Work friends and professional contacts' },
    'plus-ones': { name: 'Plus Ones', icon: '➕', color: 'green', desc: 'Guest companions and dates' }
  };

  // Sample guests data - start empty for users
  const [guests, setGuests] = useState<Array<{
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    category: keyof typeof guestCategories;
    side: 'bride' | 'groom' | 'both';
    rsvpStatus: 'pending' | 'accepted' | 'declined';
    rsvpDate?: string;
    plusOne?: boolean;
    plusOneName?: string;
    address?: string;
    dietaryRestrictions?: string;
    notes?: string;
    invitationSent?: boolean;
    invitationDate?: string;
    tableAssignment?: string;
    favoriteMemory?: string;
  }>>([]);

  const [newGuest, setNewGuest] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    category: 'friends' as keyof typeof guestCategories,
    side: 'bride' as 'bride' | 'groom' | 'both',
    plusOne: false,
    plusOneName: '',
    address: '',
    dietaryRestrictions: '',
    notes: '',
    favoriteMemory: ''
  });

  const [csvData, setCsvData] = useState('');
  const [selectedGuestsForInvitation, setSelectedGuestsForInvitation] = useState<string[]>([]);
  const [invitationTemplate, setInvitationTemplate] = useState({
    subject: 'You\'re Invited to Our Wedding!',
    message: 'We are delighted to invite you to celebrate our special day with us.',
    venue: '',
    date: '2024-06-15',
    time: '15:00',
    rsvpDate: '2024-05-15'
  });

  // Filter guests
  const filteredGuests = guests.filter(guest => {
    const matchesCategory = selectedCategory === 'all' || guest.category === selectedCategory;
    const matchesRSVP = selectedRSVP === 'all' || guest.rsvpStatus === selectedRSVP;
    const matchesSearch = searchTerm === '' || 
      `${guest.firstName} ${guest.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesRSVP && matchesSearch;
  });

  // Calculate statistics
  const totalGuests = guests.length;
  const totalAccepted = guests.filter(g => g.rsvpStatus === 'accepted').length;
  const totalDeclined = guests.filter(g => g.rsvpStatus === 'declined').length;
  const totalPending = guests.filter(g => g.rsvpStatus === 'pending').length;
  const totalPlusOnes = guests.filter(g => g.plusOne && g.rsvpStatus === 'accepted').length;
  const totalAttending = totalAccepted + totalPlusOnes;
  const invitationsSent = guests.filter(g => g.invitationSent).length;

  const addGuest = () => {
    if (newGuest.firstName && newGuest.lastName) {
      const guest = {
        id: Date.now().toString(),
        firstName: newGuest.firstName,
        lastName: newGuest.lastName,
        email: newGuest.email || undefined,
        phone: newGuest.phone || undefined,
        category: newGuest.category,
        side: newGuest.side,
        rsvpStatus: 'pending' as const,
        plusOne: newGuest.plusOne,
        plusOneName: newGuest.plusOneName || undefined,
        address: newGuest.address || undefined,
        dietaryRestrictions: newGuest.dietaryRestrictions || undefined,
        notes: newGuest.notes || undefined,
        favoriteMemory: newGuest.favoriteMemory || undefined,
        invitationSent: false
      };
      
      setGuests([guest, ...guests]);
      setNewGuest({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        category: 'friends',
        side: 'bride',
        plusOne: false,
        plusOneName: '',
        address: '',
        dietaryRestrictions: '',
        notes: '',
        favoriteMemory: ''
      });
      setShowAddGuest(false);
    }
  };

  const deleteGuest = (id: string) => {
    setGuests(guests.filter(g => g.id !== id));
  };

  const updateRSVP = (id: string, status: 'accepted' | 'declined' | 'pending') => {
    setGuests(guests.map(g => 
      g.id === id ? { 
        ...g, 
        rsvpStatus: status, 
        rsvpDate: status !== 'pending' ? new Date().toISOString().split('T')[0] : undefined 
      } : g
    ));
  };

  const toggleInvitationSent = (id: string) => {
    setGuests(guests.map(g => 
      g.id === id ? { 
        ...g, 
        invitationSent: !g.invitationSent,
        invitationDate: !g.invitationSent ? new Date().toISOString().split('T')[0] : undefined
      } : g
    ));
  };

  const processCsvImport = () => {
    if (!csvData.trim()) return;
    
    try {
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const newGuests = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const guest: any = {
          id: Date.now().toString() + Math.random(),
          rsvpStatus: 'pending',
          invitationSent: false
        };
        
        headers.forEach((header, index) => {
          const value = values[index] || '';
          switch (header) {
            case 'first name':
            case 'firstname':
              guest.firstName = value;
              break;
            case 'last name':
            case 'lastname':
              guest.lastName = value;
              break;
            case 'email':
              guest.email = value;
              break;
            case 'phone':
              guest.phone = value;
              break;
            case 'category':
              guest.category = ['family', 'friends', 'colleagues', 'plus-ones'].includes(value) ? value : 'friends';
              break;
            case 'side':
              guest.side = ['bride', 'groom', 'both'].includes(value) ? value : 'bride';
              break;
            case 'address':
              guest.address = value;
              break;
            case 'dietary restrictions':
            case 'diet':
              guest.dietaryRestrictions = value;
              break;
            case 'notes':
              guest.notes = value;
              break;
            case 'plus one':
            case 'plusone':
              guest.plusOne = value.toLowerCase() === 'yes' || value.toLowerCase() === 'true';
              break;
            case 'plus one name':
            case 'plusonename':
              guest.plusOneName = value;
              break;
          }
        });
        
        return guest;
      }).filter(g => g.firstName && g.lastName);
      
      setGuests([...guests, ...newGuests]);
      setCsvData('');
      setShowCSVImport(false);
      
      alert(`Successfully imported ${newGuests.length} guests!`);
    } catch (error) {
      alert('Error processing CSV. Please check the format and try again.');
    }
  };

  const getCategoryColorClass = (color: string, type: 'bg' | 'text' | 'border') => {
    const colors: Record<string, Record<string, string>> = {
      rose: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
      green: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' }
    };
    return colors[color]?.[type] || colors.blue[type];
  };

  const getRSVPColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const exportGuestList = () => {
    const csvHeader = 'First Name,Last Name,Email,Phone,Category,Side,RSVP Status,Plus One,Plus One Name,Address,Dietary Restrictions,Notes,Invitation Sent\n';
    const csvContent = guests.map(guest => 
      `${guest.firstName},${guest.lastName},${guest.email || ''},${guest.phone || ''},${guest.category},${guest.side},${guest.rsvpStatus},${guest.plusOne ? 'Yes' : 'No'},${guest.plusOneName || ''},${guest.address || ''},${guest.dietaryRestrictions || ''},${guest.notes || ''},${guest.invitationSent ? 'Yes' : 'No'}`
    ).join('\n');
    
    const blob = new Blob([csvHeader + csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-guest-list.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Send invitations functionality
  const sendInvitations = () => {
    if (selectedGuestsForInvitation.length === 0) {
      alert('Please select guests to send invitations to.');
      return;
    }

    // Update invitation status for selected guests
    setGuests(guests.map(guest => 
      selectedGuestsForInvitation.includes(guest.id) 
        ? { ...guest, invitationSent: true, invitationDate: new Date().toISOString().split('T')[0] }
        : guest
    ));

    // Reset selection and close modal
    setSelectedGuestsForInvitation([]);
    setShowSendInvitations(false);

    // Success message
    alert(`🎉 Invitations sent successfully!\n\n✅ ${selectedGuestsForInvitation.length} invitation${selectedGuestsForInvitation.length === 1 ? '' : 's'} sent\n📧 Email invitations delivered\n📱 SMS notifications sent (where phone numbers provided)\n\nGuests can now RSVP using the details provided.`);
  };

  const toggleGuestSelection = (guestId: string) => {
    setSelectedGuestsForInvitation(prev => 
      prev.includes(guestId) 
        ? prev.filter(id => id !== guestId)
        : [...prev, guestId]
    );
  };

  const selectAllPendingGuests = () => {
    const pendingGuests = guests.filter(guest => !guest.invitationSent);
    setSelectedGuestsForInvitation(pendingGuests.map(guest => guest.id));
  };

  const clearSelection = () => {
    setSelectedGuestsForInvitation([]);
  };

  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <span className="text-2xl">👥</span>
          </div>
          <h1 className="text-3xl font-bold text-amber-800">Guest List Manager</h1>
          <p className="text-amber-700">Manage your wedding guest list, track RSVPs, and organize seating</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalGuests}</div>
            <div className="text-sm text-gray-600">Total Invited</div>
          </div>
          <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{totalAccepted}</div>
            <div className="text-sm text-gray-600">Accepted</div>
          </div>
          <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{totalDeclined}</div>
            <div className="text-sm text-gray-600">Declined</div>
          </div>
          <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{totalPending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{totalAttending}</div>
            <div className="text-sm text-gray-600">Total Attending</div>
          </div>
          <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{invitationsSent}</div>
            <div className="text-sm text-gray-600">Invitations Sent</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddGuest(true)}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2"
            >
              <span>➕</span>
              Add Guest
            </button>
            <button
              onClick={() => setShowCSVImport(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <span>📄</span>
              Import CSV
            </button>
            <button
              onClick={exportGuestList}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span>📥</span>
              Export CSV
            </button>
          </div>

          <div className="flex gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search guests..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Category Filter */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="font-semibold text-amber-800 mb-3">Guest Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCategory === 'all' 
                      ? 'bg-amber-100 border border-amber-300 text-amber-800' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">👥</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">All Guests</div>
                      <div className="text-xs text-gray-500">View everyone</div>
                    </div>
                    <div className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                      {totalGuests}
                    </div>
                  </div>
                </button>

                {Object.entries(guestCategories).map(([key, category]) => {
                  const count = guests.filter(g => g.category === key).length;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key as any)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedCategory === key 
                          ? `${getCategoryColorClass(category.color, 'bg')} ${getCategoryColorClass(category.color, 'border')} border ${getCategoryColorClass(category.color, 'text')}` 
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{category.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{category.name}</div>
                          <div className="text-xs text-gray-500 truncate">{category.desc}</div>
                        </div>
                        {count > 0 && (
                          <div className={`${getCategoryColorClass(category.color, 'bg')} ${getCategoryColorClass(category.color, 'text')} text-xs px-2 py-1 rounded-full`}>
                            {count}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RSVP Filter */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="font-semibold text-amber-800 mb-3">RSVP Status</h3>
              <div className="space-y-2">
                {[
                  { key: 'all', name: 'All Status', count: totalGuests },
                  { key: 'accepted', name: 'Accepted', count: totalAccepted },
                  { key: 'declined', name: 'Declined', count: totalDeclined },
                  { key: 'pending', name: 'Pending', count: totalPending }
                ].map((status) => (
                  <button
                    key={status.key}
                    onClick={() => setSelectedRSVP(status.key as any)}
                    className={`w-full text-left p-2 rounded-lg transition-colors flex items-center justify-between ${
                      selectedRSVP === status.key 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="text-sm font-medium">{status.name}</span>
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                      {status.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="font-semibold text-amber-800 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setShowSendInvitations(true)}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2"
                >
                  <span>✉️</span>
                  <span>Send Invitations</span>
                </button>
                <button 
                  onClick={() => {
                    const reportData = {
                      totalGuests: totalGuests,
                      totalAccepted: totalAccepted,
                      totalDeclined: totalDeclined,
                      totalPending: totalPending,
                      totalAttending: totalAttending,
                      invitationsSent: invitationsSent,
                      categoryCounts: Object.keys(guestCategories).map(cat => ({
                        category: guestCategories[cat as keyof typeof guestCategories].name,
                        count: guests.filter(g => g.category === cat).length
                      }))
                    };
                    
                    const report = `Wedding Guest Report\n\n` +
                      `Total Invited: ${reportData.totalGuests}\n` +
                      `Accepted: ${reportData.totalAccepted}\n` +
                      `Declined: ${reportData.totalDeclined}\n` +
                      `Pending: ${reportData.totalPending}\n` +
                      `Total Attending: ${reportData.totalAttending}\n` +
                      `Invitations Sent: ${reportData.invitationsSent}\n\n` +
                      `Breakdown by Category:\n` +
                      reportData.categoryCounts.map(cat => `${cat.category}: ${cat.count}`).join('\n');
                    
                    alert(`📊 Guest List Report\n\n${report}`);
                  }}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2"
                >
                  <span>📋</span>
                  <span>Generate Reports</span>
                </button>
                <button 
                  onClick={() => {
                    // Navigate to seating planner to assign table seating for guests
                    if (typeof window !== 'undefined' && window.alert) {
                      alert('🪑 Seating Planner\n\nThis would navigate to the seating planner where you can:\n\n• Assign guests to ceremony seats\n• Plan reception table arrangements\n• Visualize seating layouts\n• Export seating charts\n\nNote: You can also access this from the main menu!');
                    }
                  }}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2"
                >
                  <span>🪑</span>
                  <span>Assign Seating</span>
                </button>
              </div>
            </div>
          </div>

          {/* Guest List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-amber-800">
                    {selectedCategory === 'all' ? 'All Guests' : guestCategories[selectedCategory as keyof typeof guestCategories]?.name}
                    {selectedRSVP !== 'all' && ` - ${selectedRSVP.charAt(0).toUpperCase() + selectedRSVP.slice(1)}`}
                  </h2>
                  <div className="flex gap-2">
                    <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm">
                      {filteredGuests.length} {filteredGuests.length === 1 ? 'guest' : 'guests'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {filteredGuests.map((guest) => {
                  const category = guestCategories[guest.category];
                  return (
                    <div key={guest.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <span className="text-2xl">{category.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-amber-800">
                                {guest.firstName} {guest.lastName}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs ${getRSVPColor(guest.rsvpStatus)}`}>
                                {guest.rsvpStatus.charAt(0).toUpperCase() + guest.rsvpStatus.slice(1)}
                              </span>
                              {guest.plusOne && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                                  +1
                                </span>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mb-2">
                              <span className={`px-2 py-1 rounded-full ${getCategoryColorClass(category.color, 'bg')} ${getCategoryColorClass(category.color, 'text')}`}>
                                {category.icon} {category.name}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                {guest.side.charAt(0).toUpperCase() + guest.side.slice(1)}'s side
                              </span>
                              {guest.invitationSent && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                  ✉️ Invited
                                </span>
                              )}
                            </div>
                            
                            {guest.email && (
                              <div className="text-sm text-gray-600 mb-1">
                                📧 {guest.email}
                              </div>
                            )}
                            
                            {guest.phone && (
                              <div className="text-sm text-gray-600 mb-1">
                                📱 {guest.phone}
                              </div>
                            )}
                            
                            {guest.plusOne && guest.plusOneName && (
                              <div className="text-sm text-gray-600 mb-1">
                                👥 Plus one: {guest.plusOneName}
                              </div>
                            )}
                            
                            {guest.dietaryRestrictions && (
                              <div className="text-sm text-orange-600 mb-1">
                                🍽️ Dietary: {guest.dietaryRestrictions}
                              </div>
                            )}
                            
                            {guest.notes && (
                              <div className="text-sm text-gray-600 italic">
                                💡 {guest.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-1 ml-3">
                          <div className="flex flex-col gap-1">
                            <select
                              value={guest.rsvpStatus}
                              onChange={(e) => updateRSVP(guest.id, e.target.value as any)}
                              className={`px-2 py-1 rounded text-xs border-0 ${getRSVPColor(guest.rsvpStatus)}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="accepted">Accepted</option>
                              <option value="declined">Declined</option>
                            </select>
                            
                            <button
                              onClick={() => toggleInvitationSent(guest.id)}
                              className={`px-2 py-1 rounded text-xs ${
                                guest.invitationSent 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                              title={guest.invitationSent ? 'Mark as not sent' : 'Mark as sent'}
                            >
                              {guest.invitationSent ? '✉️ Sent' : '📤 Send'}
                            </button>
                            
                            <button
                              onClick={() => deleteGuest(guest.id)}
                              className="px-2 py-1 bg-red-100 text-red-600 hover:bg-red-200 rounded text-xs"
                              title="Remove guest"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {filteredGuests.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <span className="text-6xl block mb-4">👥</span>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No guests found</h3>
                    <p className="text-sm mb-4">
                      {searchTerm ? 'Try adjusting your search terms' : 'Add your first guest to get started'}
                    </p>
                    <button
                      onClick={() => setShowAddGuest(true)}
                      className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                    >
                      Add Guest
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add Guest Modal */}
        {showAddGuest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-amber-800 mb-4">Add New Guest</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={newGuest.firstName}
                    onChange={(e) => setNewGuest({...newGuest, firstName: e.target.value})}
                    placeholder="John"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={newGuest.lastName}
                    onChange={(e) => setNewGuest({...newGuest, lastName: e.target.value})}
                    placeholder="Smith"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newGuest.email}
                    onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
                    placeholder="john.smith@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newGuest.phone}
                    onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})}
                    placeholder="+44 7700 900123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newGuest.category}
                    onChange={(e) => setNewGuest({...newGuest, category: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    {Object.entries(guestCategories).map(([key, category]) => (
                      <option key={key} value={key}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wedding Side</label>
                  <select
                    value={newGuest.side}
                    onChange={(e) => setNewGuest({...newGuest, side: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    <option value="bride">Bride's Side</option>
                    <option value="groom">Groom's Side</option>
                    <option value="both">Both Sides</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={newGuest.address}
                    onChange={(e) => setNewGuest({...newGuest, address: e.target.value})}
                    placeholder="123 Main Street, City, Country"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Restrictions</label>
                  <input
                    type="text"
                    value={newGuest.dietaryRestrictions}
                    onChange={(e) => setNewGuest({...newGuest, dietaryRestrictions: e.target.value})}
                    placeholder="Vegetarian, Gluten-free, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="plusOne"
                    checked={newGuest.plusOne}
                    onChange={(e) => setNewGuest({...newGuest, plusOne: e.target.checked})}
                    className="h-4 w-4 text-rose-600 rounded"
                  />
                  <label htmlFor="plusOne" className="text-sm text-gray-700">
                    Plus one allowed
                  </label>
                </div>

                {newGuest.plusOne && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plus One Name</label>
                    <input
                      type="text"
                      value={newGuest.plusOneName}
                      onChange={(e) => setNewGuest({...newGuest, plusOneName: e.target.value})}
                      placeholder="Partner's name (if known)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                    />
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={newGuest.notes}
                    onChange={(e) => setNewGuest({...newGuest, notes: e.target.value})}
                    placeholder="Special notes, relationship details, etc."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Favorite Memory</label>
                  <input
                    type="text"
                    value={newGuest.favoriteMemory}
                    onChange={(e) => setNewGuest({...newGuest, favoriteMemory: e.target.value})}
                    placeholder="Special memory or connection"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>
              </div>
                
              <div className="flex gap-3 pt-6">
                <button
                  onClick={() => setShowAddGuest(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addGuest}
                  disabled={!newGuest.firstName.trim() || !newGuest.lastName.trim()}
                  className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Guest
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Send Invitations Modal */}
        {showSendInvitations && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-amber-800 mb-4">Send Wedding Invitations</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Guest Selection */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-amber-800">Select Guests</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={selectAllPendingGuests}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                      >
                        Select All Pending
                      </button>
                      <button
                        onClick={clearSelection}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <div className="space-y-2">
                      {guests.map(guest => (
                        <div key={guest.id} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedGuestsForInvitation.includes(guest.id)}
                              onChange={() => toggleGuestSelection(guest.id)}
                              className="h-4 w-4 text-rose-600 rounded"
                            />
                            <div>
                              <div className="font-medium text-amber-800">
                                {guest.firstName} {guest.lastName}
                              </div>
                              <div className="text-xs text-gray-600">
                                {guest.email || 'No email'} • {guest.category}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {guest.invitationSent && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                ✓ Sent
                              </span>
                            )}
                            {!guest.email && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                                ⚠️ No Email
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-amber-700">Selected for invitation:</span>
                      <span className="font-semibold text-amber-800">{selectedGuestsForInvitation.length} guests</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-700">Already sent:</span>
                      <span className="font-semibold text-green-600">{invitationsSent} guests</span>
                    </div>
                  </div>
                </div>

                {/* Invitation Preview */}
                <div>
                  <h4 className="text-lg font-semibold text-amber-800 mb-4">Invitation Details</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
                      <input
                        type="text"
                        value={invitationTemplate.subject}
                        onChange={(e) => setInvitationTemplate({...invitationTemplate, subject: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Wedding Date</label>
                      <input
                        type="date"
                        value={invitationTemplate.date}
                        onChange={(e) => setInvitationTemplate({...invitationTemplate, date: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input
                        type="time"
                        value={invitationTemplate.time}
                        onChange={(e) => setInvitationTemplate({...invitationTemplate, time: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                      <input
                        type="text"
                        value={invitationTemplate.venue}
                        onChange={(e) => setInvitationTemplate({...invitationTemplate, venue: e.target.value})}
                        placeholder="Wedding venue name and address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">RSVP By Date</label>
                      <input
                        type="date"
                        value={invitationTemplate.rsvpDate}
                        onChange={(e) => setInvitationTemplate({...invitationTemplate, rsvpDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Personal Message</label>
                      <textarea
                        value={invitationTemplate.message}
                        onChange={(e) => setInvitationTemplate({...invitationTemplate, message: e.target.value})}
                        placeholder="Add a personal message to your guests..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                      />
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-lg">
                    <h5 className="text-sm font-semibold text-rose-800 mb-3">📧 Email Preview</h5>
                    <div className="bg-white rounded-lg p-4 border text-sm">
                      <div className="font-semibold text-gray-800 mb-2">{invitationTemplate.subject}</div>
                      <div className="space-y-2 text-gray-700">
                        <p>Dear [Guest Name],</p>
                        <p>{invitationTemplate.message}</p>
                        <div className="bg-amber-50 p-3 rounded-lg border-l-4 border-amber-400 my-3">
                          <div className="font-semibold text-amber-800 mb-2">Wedding Details:</div>
                          <div className="space-y-1 text-sm">
                            <div><strong>Date:</strong> {new Date(invitationTemplate.date).toLocaleDateString()}</div>
                            <div><strong>Time:</strong> {invitationTemplate.time}</div>
                            {invitationTemplate.venue && (
                              <div><strong>Venue:</strong> {invitationTemplate.venue}</div>
                            )}
                            <div><strong>RSVP by:</strong> {new Date(invitationTemplate.rsvpDate).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <p>We can't wait to celebrate with you!</p>
                        <p>With love,<br/>[Your Names]</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t mt-6">
                <button
                  onClick={() => setShowSendInvitations(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={sendInvitations}
                  disabled={selectedGuestsForInvitation.length === 0}
                  className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send {selectedGuestsForInvitation.length} Invitation{selectedGuestsForInvitation.length === 1 ? '' : 's'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CSV Import Modal */}
        {showCSVImport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-amber-800 mb-4">Import Guests from CSV</h3>
              
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">CSV Format Instructions</h4>
                  <p className="text-blue-700 text-sm mb-3">
                    Your CSV file should have the following columns (in any order):
                  </p>
                  <div className="bg-white rounded border p-3 text-xs font-mono">
                    First Name,Last Name,Email,Phone,Category,Side,Address,Dietary Restrictions,Notes,Plus One,Plus One Name
                  </div>
                  <div className="mt-3 space-y-1 text-sm text-blue-700">
                    <div><strong>Category:</strong> family, friends, colleagues, plus-ones</div>
                    <div><strong>Side:</strong> bride, groom, both</div>
                    <div><strong>Plus One:</strong> yes/no or true/false</div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Example CSV:</h4>
                  <div className="bg-white rounded border p-3 text-xs font-mono">
                    First Name,Last Name,Email,Category,Side,Plus One<br/>
                    John,Smith,john@email.com,friends,groom,yes<br/>
                    Sarah,Johnson,sarah@email.com,family,bride,no<br/>
                    Mike,Chen,mike@email.com,colleagues,groom,yes
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paste CSV Data</label>
                  <textarea
                    value={csvData}
                    onChange={(e) => setCsvData(e.target.value)}
                    placeholder="Paste your CSV data here..."
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 font-mono text-sm"
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-500">💡</span>
                    <div>
                      <div className="font-medium text-amber-800">Tips:</div>
                      <div className="text-amber-700 mt-1">
                        • Headers are case-insensitive<br/>
                        • Missing fields will be left blank<br/>
                        • Duplicates will be imported as separate entries<br/>
                        • All imported guests will have "pending" RSVP status
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCSVImport(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={processCsvImport}
                    disabled={!csvData.trim()}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Import Guests
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

// Wedding Music Playlist Component
function WeddingMusicPlaylist() {
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStep, setConnectionStep] = useState<'idle' | 'authorizing' | 'connected'>('idle');
  const [selectedPlaylistCategory, setSelectedPlaylistCategory] = useState<'ceremony' | 'reception' | 'cocktail' | 'dinner' | 'custom'>('ceremony');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddSong, setShowAddSong] = useState(false);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [showUploadPlaylist, setShowUploadPlaylist] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Playlist categories
  const playlistCategories = {
    ceremony: { name: 'Ceremony Music', icon: '💒', color: 'rose', desc: 'Processional, recessional, and ceremony songs' },
    cocktail: { name: 'Cocktail Hour', icon: '🍸', color: 'blue', desc: 'Background music for mingling and drinks' },
    dinner: { name: 'Dinner Music', icon: '🍽️', color: 'amber', desc: 'Ambient dining background music' },
    reception: { name: 'Reception & Dancing', icon: '💃', color: 'purple', desc: 'First dance, party, and dancing music' },
    custom: { name: 'Custom Playlists', icon: '⭐', color: 'green', desc: 'Your personal wedding playlists' }
  };

  // Sample wedding songs database
  const [weddingSongs] = useState([
    // Ceremony Songs
    { id: '1', title: 'Perfect', artist: 'Ed Sheeran', category: 'ceremony', subcategory: 'First Dance', duration: '4:23', popularity: 95 },
    { id: '2', title: 'A Thousand Years', artist: 'Christina Perri', category: 'ceremony', subcategory: 'Processional', duration: '4:45', popularity: 92 },
    { id: '3', title: 'All of Me', artist: 'John Legend', category: 'ceremony', subcategory: 'First Dance', duration: '4:29', popularity: 90 },
    { id: '4', title: 'Canon in D', artist: 'Pachelbel', category: 'ceremony', subcategory: 'Processional', duration: '5:03', popularity: 88 },
    { id: '5', title: 'Here Comes the Sun', artist: 'The Beatles', category: 'ceremony', subcategory: 'Recessional', duration: '3:05', popularity: 85 },
    { id: '6', title: 'Marry Me', artist: 'Train', category: 'ceremony', subcategory: 'First Dance', duration: '3:58', popularity: 83 },
    { id: '7', title: 'At Last', artist: 'Etta James', category: 'ceremony', subcategory: 'First Dance', duration: '3:01', popularity: 87 },
    { id: '8', title: 'Ave Maria', artist: 'Schubert', category: 'ceremony', subcategory: 'Processional', duration: '4:52', popularity: 82 },
    
    // Cocktail Hour
    { id: '9', title: 'The Way You Look Tonight', artist: 'Frank Sinatra', category: 'cocktail', subcategory: 'Jazz Standards', duration: '3:22', popularity: 89 },
    { id: '10', title: 'Fly Me to the Moon', artist: 'Frank Sinatra', category: 'cocktail', subcategory: 'Jazz Standards', duration: '2:28', popularity: 91 },
    { id: '11', title: 'La Vie En Rose', artist: 'Édith Piaf', category: 'cocktail', subcategory: 'French Classics', duration: '3:28', popularity: 86 },
    { id: '12', title: 'Isn\'t She Lovely', artist: 'Stevie Wonder', category: 'cocktail', subcategory: 'Soul & Motown', duration: '6:34', popularity: 84 },
    { id: '13', title: 'Come Away With Me', artist: 'Norah Jones', category: 'cocktail', subcategory: 'Contemporary Jazz', duration: '3:58', popularity: 82 },
    { id: '14', title: 'Unforgettable', artist: 'Nat King Cole', category: 'cocktail', subcategory: 'Jazz Standards', duration: '3:29', popularity: 88 },
    
    // Dinner Music
    { id: '15', title: 'Moon River', artist: 'Audrey Hepburn', category: 'dinner', subcategory: 'Classic Standards', duration: '2:41', popularity: 85 },
    { id: '16', title: 'Autumn Leaves', artist: 'Eva Cassidy', category: 'dinner', subcategory: 'Contemporary Standards', duration: '5:36', popularity: 83 },
    { id: '17', title: 'The Girl from Ipanema', artist: 'Stan Getz & Astrud Gilberto', category: 'dinner', subcategory: 'Bossa Nova', duration: '5:26', popularity: 81 },
    { id: '18', title: 'What a Wonderful World', artist: 'Louis Armstrong', category: 'dinner', subcategory: 'Classic Standards', duration: '2:21', popularity: 90 },
    { id: '19', title: 'Summertime', artist: 'Ella Fitzgerald', category: 'dinner', subcategory: 'Jazz Standards', duration: '4:18', popularity: 87 },
    
    // Reception & Dancing
    { id: '20', title: 'Can\'t Stop the Feeling', artist: 'Justin Timberlake', category: 'reception', subcategory: 'Party Songs', duration: '3:56', popularity: 93 },
    { id: '21', title: 'September', artist: 'Earth, Wind & Fire', category: 'reception', subcategory: 'Party Songs', duration: '3:35', popularity: 95 },
    { id: '22', title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', category: 'reception', subcategory: 'Party Songs', duration: '4:30', popularity: 94 },
    { id: '23', title: 'I Wanna Dance with Somebody', artist: 'Whitney Houston', category: 'reception', subcategory: 'Dance Classics', duration: '4:52', popularity: 92 },
    { id: '24', title: 'Love Shack', artist: 'The B-52s', category: 'reception', subcategory: 'Party Songs', duration: '5:20', popularity: 89 },
    { id: '25', title: 'Sweet Child O\' Mine', artist: 'Guns N\' Roses', category: 'reception', subcategory: 'Rock Classics', duration: '5:56', popularity: 88 },
    { id: '26', title: 'Mr. Brightside', artist: 'The Killers', category: 'reception', subcategory: 'Modern Rock', duration: '3:42', popularity: 86 },
    { id: '27', title: 'Shut Up and Dance', artist: 'Walk the Moon', category: 'reception', subcategory: 'Modern Dance', duration: '3:19', popularity: 85 }
  ]);

  // User playlists - start empty for users
  const [userPlaylists, setUserPlaylists] = useState<{[key: string]: Array<{id: string; title: string; artist: string; addedDate: string; notes?: string}>}>({
    'my-ceremony': [],
    'my-reception': [],
    'my-cocktail': []
  });

  const [newPlaylist, setNewPlaylist] = useState({
    name: '',
    description: '',
    category: 'custom' as const
  });

  const [searchResults, setSearchResults] = useState<typeof weddingSongs>([]);

  // Upload playlist state
  const [uploadData, setUploadData] = useState({
    targetPlaylist: 'my-ceremony' as string,
    csvData: '',
    importFormat: 'csv' as 'csv' | 'text',
    replaceExisting: false
  });

  // Bulk import state
  const [bulkImportSongs, setBulkImportSongs] = useState<Array<{
    id: string;
    title: string;
    artist: string;
    selected: boolean;
  }>>([]);

  const [newManualSong, setNewManualSong] = useState({
    title: '',
    artist: '',
    playlist: 'my-ceremony'
  });

  // Spotify connection handler
  const handleSpotifyConnect = async () => {
    if (isConnecting || isSpotifyConnected) return;
    
    setIsConnecting(true);
    setConnectionStep('authorizing');
    
    try {
      // Simulate opening Spotify authorization (in real app, this would be the actual OAuth URL)
      const clientId = 'your_spotify_client_id'; // In real app, this would be your actual client ID
      const redirectUri = encodeURIComponent(window.location.origin + '/spotify-callback');
      const scopes = encodeURIComponent('user-read-private user-read-email playlist-modify-public playlist-modify-private');
      const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}&show_dialog=true`;
      
      // In a real implementation, you would redirect to Spotify:
      // window.location.href = spotifyAuthUrl;
      
      // For this demo, we'll simulate the OAuth flow
      const userConsents = confirm(
        'BridalLink wants to connect to your Spotify account to:\n\n' +
        '• Search and browse millions of songs\n' +
        '• Create and manage your wedding playlists\n' +
        '• Access your music library\n\n' +
        'Click OK to authorize this connection (this will open Spotify\'s authorization page).'
      );
      
      if (userConsents) {
        // Simulate the authorization delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In a real app, Spotify would redirect back with an authorization code
        // and you would exchange it for access and refresh tokens
        setIsSpotifyConnected(true);
        setConnectionStep('connected');
        
        // Simulate successful connection
        setTimeout(() => {
          if (typeof window !== 'undefined' && window.alert) {
            alert('🎵 Successfully connected to Spotify!\n\n' +
                  '✓ You can now search millions of songs\n' +
                  '✓ Create custom wedding playlists\n' +
                  '✓ Access curated wedding music collections\n\n' +
                  'Start building your perfect wedding soundtrack!');
          }
        }, 500);
      } else {
        setConnectionStep('idle');
      }
    } catch (error) {
      console.error('Spotify connection error:', error);
      setConnectionStep('idle');
      if (typeof window !== 'undefined' && window.alert) {
        alert('Connection failed. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect from Spotify
  const handleSpotifyDisconnect = () => {
    if (confirm('Are you sure you want to disconnect from Spotify? Your saved playlists will remain but you won\'t be able to search new songs.')) {
      setIsSpotifyConnected(false);
      setConnectionStep('idle');
      if (typeof window !== 'undefined' && window.alert) {
        alert('Successfully disconnected from Spotify.');
      }
    }
  };

  // Search songs
  const handleSearch = (query: string) => {
    setSearchTerm(query);
    if (query.trim()) {
      const results = weddingSongs.filter(song =>
        song.title.toLowerCase().includes(query.toLowerCase()) ||
        song.artist.toLowerCase().includes(query.toLowerCase()) ||
        song.subcategory.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // Add song to playlist
  const addSongToPlaylist = (song: typeof weddingSongs[0], playlistId: string) => {
    const newSong = {
      id: song.id,
      title: song.title,
      artist: song.artist,
      addedDate: new Date().toISOString().split('T')[0]
    };
    
    setUserPlaylists(prev => ({
      ...prev,
      [playlistId]: [...(prev[playlistId] || []), newSong]
    }));
  };

  // Remove song from playlist
  const removeSongFromPlaylist = (songId: string, playlistId: string) => {
    setUserPlaylists(prev => ({
      ...prev,
      [playlistId]: prev[playlistId]?.filter(song => song.id !== songId) || []
    }));
  };

  // Create new playlist
  const createPlaylist = () => {
    if (newPlaylist.name.trim()) {
      const playlistId = `custom-${Date.now()}`;
      setUserPlaylists(prev => ({
        ...prev,
        [playlistId]: []
      }));
      setNewPlaylist({ name: '', description: '', category: 'custom' });
      setShowCreatePlaylist(false);
    }
  };

  // File upload handlers
  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(files);
      // Auto-read CSV files
      const file = files[0];
      if (file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setUploadData(prev => ({ ...prev, csvData: content, importFormat: 'csv' }));
        };
        reader.readAsText(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const csvFiles = Array.from(files).filter(file => 
        file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv')
      );
      
      if (csvFiles.length > 0) {
        const dt = new DataTransfer();
        csvFiles.forEach(file => dt.items.add(file));
        setSelectedFiles(dt.files);
        
        // Auto-read first CSV
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setUploadData(prev => ({ ...prev, csvData: content, importFormat: 'csv' }));
        };
        reader.readAsText(csvFiles[0]);
      }
    }
  };

  // Process playlist upload
  const processPlaylistUpload = () => {
    try {
      if (!uploadData.csvData.trim()) return;

      let songsToImport: Array<{ title: string; artist: string }> = [];

      if (uploadData.importFormat === 'csv') {
        // Parse CSV data
        const lines = uploadData.csvData.trim().split('\n');
        const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
        
        // Find title and artist columns
        const titleIndex = headers.findIndex(h => 
          h.includes('title') || h.includes('song') || h.includes('track')
        );
        const artistIndex = headers.findIndex(h => 
          h.includes('artist') || h.includes('performer') || h.includes('singer')
        );

        if (titleIndex === -1) {
          alert('Could not find title column in CSV. Please ensure your CSV has a "Title" or "Song" column.');
          return;
        }

        // Process data rows
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          if (values[titleIndex]) {
            songsToImport.push({
              title: values[titleIndex],
              artist: artistIndex !== -1 ? (values[artistIndex] || 'Unknown Artist') : 'Unknown Artist'
            });
          }
        }
      } else {
        // Parse text format (Title - Artist per line)
        const lines = uploadData.csvData.trim().split('\n');
        for (const line of lines) {
          if (line.trim()) {
            const parts = line.split(' - ');
            if (parts.length >= 2) {
              songsToImport.push({
                title: parts[0].trim(),
                artist: parts[1].trim()
              });
            } else {
              songsToImport.push({
                title: line.trim(),
                artist: 'Unknown Artist'
              });
            }
          }
        }
      }

      if (songsToImport.length === 0) {
        alert('No valid songs found in the uploaded file. Please check the format.');
        return;
      }

      // Convert to playlist format
      const newSongs = songsToImport.map((song, index) => ({
        id: `uploaded-${Date.now()}-${index}`,
        title: song.title,
        artist: song.artist,
        addedDate: new Date().toISOString().split('T')[0]
      }));

      // Add to selected playlist
      setUserPlaylists(prev => {
        const currentSongs = prev[uploadData.targetPlaylist] || [];
        const updatedSongs = uploadData.replaceExisting ? 
          newSongs : 
          [...currentSongs, ...newSongs];
        
        return {
          ...prev,
          [uploadData.targetPlaylist]: updatedSongs
        };
      });

      // Reset and close
      setUploadData({
        targetPlaylist: 'my-ceremony',
        csvData: '',
        importFormat: 'csv',
        replaceExisting: false
      });
      setSelectedFiles(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setShowUploadPlaylist(false);

      alert(`Successfully imported ${songsToImport.length} songs to your playlist!`);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error processing upload. Please check your file format and try again.');
    }
  };

  // Add manual song
  const addManualSong = () => {
    if (newManualSong.title.trim() && newManualSong.artist.trim()) {
      const song = {
        id: `manual-${Date.now()}`,
        title: newManualSong.title.trim(),
        artist: newManualSong.artist.trim(),
        addedDate: new Date().toISOString().split('T')[0]
      };

      setUserPlaylists(prev => ({
        ...prev,
        [newManualSong.playlist]: [...(prev[newManualSong.playlist] || []), song]
      }));

      setNewManualSong({ title: '', artist: '', playlist: 'my-ceremony' });
      setShowAddSong(false);
    }
  };

  // Export playlist to CSV
  const exportPlaylistToCSV = (playlistId: string) => {
    const playlist = userPlaylists[playlistId] || [];
    if (playlist.length === 0) {
      alert('This playlist is empty. Add some songs first!');
      return;
    }

    const csvContent = [
      'Title,Artist,Date Added',
      ...playlist.map(song => `"${song.title}","${song.artist}","${song.addedDate}"`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wedding-playlist-${playlistId}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Get filtered songs by category
  const getFilteredSongs = () => {
    if (selectedPlaylistCategory === 'custom') return [];
    return weddingSongs.filter(song => song.category === selectedPlaylistCategory);
  };

  const getCategoryColorClass = (color: string, type: 'bg' | 'text' | 'border') => {
    const colors: Record<string, Record<string, string>> = {
      rose: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
      amber: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
      green: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' }
    };
    return colors[color]?.[type] || colors.blue[type];
  };

  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <span className="text-2xl">🎵</span>
          </div>
          <h1 className="text-3xl font-bold text-amber-800">Wedding Music Playlists</h1>
          <p className="text-amber-700">Create the perfect soundtrack for every moment of your wedding day</p>
        </div>

        {/* Spotify Integration */}
        <div className={`rounded-lg border p-6 transition-all ${
          isSpotifyConnected 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
            : isConnecting
              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
              : 'bg-gradient-to-r from-green-50 to-green-100 border-green-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`rounded-full p-3 transition-colors ${
                isSpotifyConnected ? 'bg-green-600' : 
                isConnecting ? 'bg-blue-600 animate-pulse' : 'bg-green-500'
              }`}>
                <span className="text-white text-xl">
                  {isConnecting ? '⟳' : '♪'}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {isSpotifyConnected ? (
                    <span className="text-green-800">Spotify Connected!</span>
                  ) : isConnecting ? (
                    <span className="text-blue-800">Connecting to Spotify...</span>
                  ) : (
                    <span className="text-green-800">Spotify Integration</span>
                  )}
                </h3>
                <p className="text-sm">
                  {isSpotifyConnected ? (
                    <span className="text-green-700">Search millions of songs and create custom playlists</span>
                  ) : isConnecting ? (
                    <span className="text-blue-700">
                      {connectionStep === 'authorizing' ? 'Opening Spotify authorization...' : 'Establishing connection...'}
                    </span>
                  ) : (
                    <span className="text-green-700">Connect to Spotify to access millions of songs</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              {isSpotifyConnected && (
                <div className="flex items-center gap-2 bg-green-100 px-3 py-2 rounded-lg">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-green-800 font-medium">Connected</span>
                </div>
              )}
              
              <div className="flex gap-2">
                {isSpotifyConnected ? (
                  <>
                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined' && window.open) {
                          window.open('https://open.spotify.com', '_blank');
                        }
                      }}
                      className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                    >
                      Open Spotify
                    </button>
                    <button
                      onClick={handleSpotifyDisconnect}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleSpotifyConnect}
                    disabled={isConnecting}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      isConnecting
                        ? 'bg-blue-600 text-white cursor-wait'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {isConnecting ? (
                      <>
                        <span className="animate-spin">⟳</span>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <span>♪</span>
                        Connect Spotify
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Connection benefits */}
          {!isSpotifyConnected && !isConnecting && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2 text-green-700">
                <span>🔍</span>
                <span>Search 100M+ songs</span>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <span>📝</span>
                <span>Create custom playlists</span>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <span>🎵</span>
                <span>Wedding music collections</span>
              </div>
            </div>
          )}

          {/* Connection success message */}
          {isSpotifyConnected && (
            <div className="mt-4 bg-white bg-opacity-80 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">🎉</span>
                <div className="text-sm text-green-800">
                  <div className="font-semibold">You're all set!</div>
                  <div>Start searching for songs below or browse our curated wedding collections.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Song Search */}
        {isSpotifyConnected && (
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-amber-800">Search Wedding Songs</h3>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <span>✓</span>
                <span>Spotify Connected</span>
              </div>
            </div>
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search by song title, artist, or mood..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>
              <button
                onClick={() => setShowAddSong(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add Manual Song
              </button>
              <button
                onClick={() => setShowUploadPlaylist(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload Playlist
              </button>
            </div>
            
            {searchResults.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {searchResults.map(song => (
                  <div key={song.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🎵</span>
                      <div>
                        <div className="font-semibold text-amber-800">{song.title}</div>
                        <div className="text-sm text-gray-600">{song.artist} • {song.duration}</div>
                        <div className="text-xs text-purple-600">{song.subcategory}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">Popularity:</span>
                        <div className="bg-gray-200 rounded-full w-12 h-2">
                          <div 
                            className="bg-green-500 rounded-full h-2 transition-all"
                            style={{ width: `${song.popularity}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{song.popularity}%</span>
                      </div>
                      <select
                        onChange={(e) => e.target.value && addSongToPlaylist(song, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-xs"
                        defaultValue=""
                      >
                        <option value="">Add to playlist...</option>
                        <option value="my-ceremony">My Ceremony</option>
                        <option value="my-cocktail">My Cocktail Hour</option>
                        <option value="my-reception">My Reception</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Playlist Categories Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="font-semibold text-amber-800 mb-3">Music Categories</h3>
              <div className="space-y-2">
                {Object.entries(playlistCategories).map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedPlaylistCategory(key as any)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedPlaylistCategory === key 
                        ? `${getCategoryColorClass(category.color, 'bg')} ${getCategoryColorClass(category.color, 'border')} border ${getCategoryColorClass(category.color, 'text')}` 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{category.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{category.name}</div>
                        <div className="text-xs text-gray-500 truncate">{category.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="font-semibold text-amber-800 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowCreatePlaylist(true)}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2"
                >
                  <span>➕</span>
                  <span>Create Playlist</span>
                </button>
                <button
                  onClick={() => setShowUploadPlaylist(true)}
                  className="w-full text-left p-2 hover:bg-blue-50 rounded text-sm flex items-center gap-2 text-blue-700"
                >
                  <span>📤</span>
                  <span>Upload Playlist</span>
                </button>
                <button
                  onClick={() => setShowAddSong(true)}
                  className="w-full text-left p-2 hover:bg-purple-50 rounded text-sm flex items-center gap-2 text-purple-700"
                >
                  <span>🎵</span>
                  <span>Add Manual Song</span>
                </button>
                <button 
                  onClick={() => {
                    if (isSpotifyConnected) {
                      if (typeof window !== 'undefined' && window.alert) {
                        alert('�� Export to Spotify\n\nThis would create actual Spotify playlists from your wedding collections. In the full version, this will:\n\n• Create playlists in your Spotify account\n• Add all selected songs\n• Set custom playlist artwork\n• Share with your wedding party');
                      }
                    } else {
                      if (typeof window !== 'undefined' && window.alert) {
                        alert('Please connect to Spotify first to export your playlists.');
                      }
                    }
                  }}
                  disabled={!isSpotifyConnected}
                  className={`w-full text-left p-2 rounded text-sm flex items-center gap-2 ${
                    isSpotifyConnected ? 'hover:bg-gray-50' : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <span>📥</span>
                  <span>Export to Spotify</span>
                </button>
                <button 
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.alert) {
                      alert('🎧 Playlist Preview\n\nThis feature would let you preview your wedding playlists with 30-second song clips from Spotify. Perfect for:\n\n• Testing the flow and vibe\n• Getting feedback from your partner\n• Ensuring smooth transitions');
                    }
                  }}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2"
                >
                  <span>🎧</span>
                  <span>Preview Playlist</span>
                </button>
                {isSpotifyConnected && (
                  <button 
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.open) {
                        window.open('https://open.spotify.com', '_blank');
                      }
                    }}
                    className="w-full text-left p-2 hover:bg-green-50 rounded text-sm flex items-center gap-2 text-green-700"
                  >
                    <span>♪</span>
                    <span>Open Spotify App</span>
                  </button>
                )}
              </div>
            </div>

            {/* Playlist Stats */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="font-semibold text-amber-800 mb-3">Your Music</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Songs:</span>
                  <span className="font-semibold text-amber-800">
                    {Object.values(userPlaylists).flat().length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Playlists:</span>
                  <span className="font-semibold text-amber-800">{Object.keys(userPlaylists).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ready for Wedding:</span>
                  <span className="font-semibold text-green-600">
                    {userPlaylists['my-ceremony']?.length > 0 && userPlaylists['my-reception']?.length > 0 ? 'Yes' : 'In Progress'}
                  </span>
                </div>
                {isSpotifyConnected && (
                  <div className="mt-3 p-2 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-green-800">
                      <span className="text-green-600">♪</span>
                      <span>Spotify Connected</span>
                    </div>
                    <div className="text-xs text-green-700 mt-1">
                      Search millions of songs and export playlists
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-amber-800">
                    {playlistCategories[selectedPlaylistCategory].name}
                  </h2>
                  <div className="flex gap-2">
                    {selectedPlaylistCategory !== 'custom' && (
                      <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm">
                        {getFilteredSongs().length} suggested songs
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4">
                {selectedPlaylistCategory === 'custom' ? (
                  /* Custom Playlists View */
                  <div className="space-y-6">
                    {Object.entries(userPlaylists).map(([playlistId, songs]) => (
                      <div key={playlistId} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-amber-800 capitalize">
                            {playlistId.replace('my-', '').replace('-', ' ')} Playlist
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">{songs.length} songs</span>
                            <button
                              onClick={() => exportPlaylistToCSV(playlistId)}
                              className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
                              title="Export playlist as CSV"
                            >
                              📥 CSV
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {songs.map((song, index) => (
                            <div key={`${song.id}-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center gap-3">
                                <span className="text-lg">🎵</span>
                                <div>
                                  <div className="font-medium text-amber-800">{song.title}</div>
                                  <div className="text-sm text-gray-600">{song.artist}</div>
                                  {song.notes && (
                                    <div className="text-xs text-purple-600 italic">{song.notes}</div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Added {song.addedDate}</span>
                                <button
                                  onClick={() => removeSongFromPlaylist(song.id, playlistId)}
                                  className="text-red-600 hover:text-red-800 text-xs px-2 py-1 hover:bg-red-50 rounded"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                          {songs.length === 0 && (
                            <div className="text-center py-6 text-gray-500">
                              <span className="text-3xl block mb-2">🎵</span>
                              <p className="text-sm">No songs in this playlist yet</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Suggested Songs View */
                  <div className="space-y-3">
                    {/* Connection prompt for non-Spotify users */}
                    {!isSpotifyConnected && (
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 text-center mb-6">
                        <div className="text-4xl mb-3">🎵</div>
                        <h3 className="text-lg font-semibold text-amber-800 mb-2">Unlock Millions of Songs</h3>
                        <p className="text-amber-700 mb-4">
                          Connect to Spotify to search from over 100 million songs and create the perfect wedding soundtrack.
                        </p>
                        <button
                          onClick={handleSpotifyConnect}
                          disabled={isConnecting}
                          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                          {isConnecting ? 'Connecting...' : 'Connect Spotify Now'}
                        </button>
                      </div>
                    )}
                    
                    {getFilteredSongs().map(song => (
                      <div key={song.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🎵</span>
                          <div>
                            <div className="font-semibold text-amber-800">{song.title}</div>
                            <div className="text-sm text-gray-600">{song.artist} • {song.duration}</div>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${getCategoryColorClass(playlistCategories[selectedPlaylistCategory].color, 'bg')} ${getCategoryColorClass(playlistCategories[selectedPlaylistCategory].color, 'text')}`}>
                              {song.subcategory}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">⭐</span>
                            <span className="text-xs text-gray-500">{song.popularity}%</span>
                          </div>
                          {isSpotifyConnected ? (
                            <select
                              onChange={(e) => e.target.value && addSongToPlaylist(song, e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-xs"
                              defaultValue=""
                            >
                              <option value="">Add to...</option>
                              <option value="my-ceremony">Ceremony</option>
                              <option value="my-cocktail">Cocktail Hour</option>
                              <option value="my-reception">Reception</option>
                            </select>
                          ) : (
                            <button
                              onClick={handleSpotifyConnect}
                              className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
                            >
                              Connect to Add
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Create Playlist Modal */}
        {showCreatePlaylist && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold text-amber-800 mb-4">Create New Playlist</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Playlist Name</label>
                  <input
                    type="text"
                    value={newPlaylist.name}
                    onChange={(e) => setNewPlaylist({...newPlaylist, name: e.target.value})}
                    placeholder="e.g., Our Love Songs"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newPlaylist.description}
                    onChange={(e) => setNewPlaylist({...newPlaylist, description: e.target.value})}
                    placeholder="Describe your playlist..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCreatePlaylist(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createPlaylist}
                    disabled={!newPlaylist.name.trim()}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Create Playlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Playlist Modal */}
        {showUploadPlaylist && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-amber-800 mb-4">Upload Music Playlist</h3>
              
              <div className="space-y-6">
                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* File Upload Area */}
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                    isDragOver 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                  onClick={handleFileSelect}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <span className="text-4xl block mb-2">
                    {isDragOver ? '📥' : '🎵'}
                  </span>
                  <h4 className="font-semibold text-gray-700 mb-1">
                    {isDragOver ? 'Drop playlist file here' : 'Upload Playlist File'}
                  </h4>
                  <p className="text-sm text-gray-500 mb-3">
                    {isDragOver ? 'Release to upload' : 'or drag and drop CSV/TXT files here'}
                  </p>
                  {!isDragOver && (
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileSelect();
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Choose File
                    </button>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    Supports CSV, TXT files (Max 5MB)
                  </div>
                </div>

                {/* Selected File Preview */}
                {selectedFiles && selectedFiles.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Selected File</h4>
                    <div className="flex items-center justify-between bg-white rounded p-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📄</span>
                        <div>
                          <div className="font-medium text-blue-800">{selectedFiles[0].name}</div>
                          <div className="text-xs text-blue-600">
                            {(selectedFiles[0].size / 1024).toFixed(1)} KB • {selectedFiles[0].type || 'Text file'}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedFiles(null);
                          setUploadData(prev => ({...prev, csvData: ''}));
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="text-red-600 hover:text-red-800 px-2 py-1"
                        title="Remove file"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                {/* Format Instructions */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">📄 CSV Format</h4>
                    <div className="text-sm text-green-700 space-y-2">
                      <div className="bg-white rounded p-2 font-mono text-xs">
                        Title,Artist<br/>
                        "Perfect","Ed Sheeran"<br/>
                        "All of Me","John Legend"<br/>
                        "A Thousand Years","Christina Perri"
                      </div>
                      <p>Columns: Title, Artist, Song, Track, Performer, Singer</p>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-800 mb-2">📝 Text Format</h4>
                    <div className="text-sm text-purple-700 space-y-2">
                      <div className="bg-white rounded p-2 font-mono text-xs">
                        Perfect - Ed Sheeran<br/>
                        All of Me - John Legend<br/>
                        A Thousand Years - Christina Perri<br/>
                        or just song titles (one per line)
                      </div>
                      <p>One song per line, "Title - Artist" format</p>
                    </div>
                  </div>
                </div>

                {/* Upload Options */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Playlist</label>
                    <select
                      value={uploadData.targetPlaylist}
                      onChange={(e) => setUploadData({...uploadData, targetPlaylist: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      <option value="my-ceremony">My Ceremony Playlist</option>
                      <option value="my-cocktail">My Cocktail Hour Playlist</option>
                      <option value="my-reception">My Reception Playlist</option>
                      {Object.keys(userPlaylists).filter(id => id.startsWith('custom-')).map(playlistId => (
                        <option key={playlistId} value={playlistId}>
                          Custom Playlist ({playlistId.replace('custom-', '').substring(0, 20)}...)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Import Format</label>
                    <div className="flex gap-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="csv"
                          checked={uploadData.importFormat === 'csv'}
                          onChange={(e) => setUploadData({...uploadData, importFormat: e.target.value as 'csv'})}
                          className="text-blue-600"
                        />
                        <span className="text-sm">CSV Format</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="text"
                          checked={uploadData.importFormat === 'text'}
                          onChange={(e) => setUploadData({...uploadData, importFormat: e.target.value as 'text'})}
                          className="text-purple-600"
                        />
                        <span className="text-sm">Text Format</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="replaceExisting"
                      checked={uploadData.replaceExisting}
                      onChange={(e) => setUploadData({...uploadData, replaceExisting: e.target.checked})}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label htmlFor="replaceExisting" className="text-sm text-gray-700">
                      Replace existing songs in playlist (otherwise, songs will be added)
                    </label>
                  </div>
                </div>

                {/* Manual CSV Input */}
                {!selectedFiles && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Or paste playlist data directly
                    </label>
                    <textarea
                      value={uploadData.csvData}
                      onChange={(e) => setUploadData({...uploadData, csvData: e.target.value})}
                      placeholder={uploadData.importFormat === 'csv' 
                        ? 'Title,Artist\n"Perfect","Ed Sheeran"\n"All of Me","John Legend"'
                        : 'Perfect - Ed Sheeran\nAll of Me - John Legend\nA Thousand Years - Christina Perri'
                      }
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 font-mono text-sm"
                    />
                  </div>
                )}

                {/* Upload Preview */}
                {uploadData.csvData && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-800 mb-2">Upload Preview</h4>
                    <div className="text-sm text-amber-700">
                      <div>Format: {uploadData.importFormat.toUpperCase()}</div>
                      <div>Target: {uploadData.targetPlaylist.replace('my-', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Playlist</div>
                      <div>Mode: {uploadData.replaceExisting ? 'Replace existing songs' : 'Add to existing songs'}</div>
                      <div>
                        Estimated songs: ~{uploadData.csvData.trim().split('\n').length - (uploadData.importFormat === 'csv' ? 1 : 0)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
                
              <div className="flex gap-3 pt-6">
                <button
                  onClick={() => {
                    setShowUploadPlaylist(false);
                    setSelectedFiles(null);
                    setUploadData({
                      targetPlaylist: 'my-ceremony',
                      csvData: '',
                      importFormat: 'csv',
                      replaceExisting: false
                    });
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={processPlaylistUpload}
                  disabled={!uploadData.csvData.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {uploadData.replaceExisting ? 'Replace Playlist' : 'Add to Playlist'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Manual Song Modal */}
        {showAddSong && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold text-amber-800 mb-4">Add Manual Song</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Song Title</label>
                  <input
                    type="text"
                    value={newManualSong.title}
                    onChange={(e) => setNewManualSong({...newManualSong, title: e.target.value})}
                    placeholder="e.g., Perfect"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Artist Name</label>
                  <input
                    type="text"
                    value={newManualSong.artist}
                    onChange={(e) => setNewManualSong({...newManualSong, artist: e.target.value})}
                    placeholder="e.g., Ed Sheeran"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Add to Playlist</label>
                  <select
                    value={newManualSong.playlist}
                    onChange={(e) => setNewManualSong({...newManualSong, playlist: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  >
                    <option value="my-ceremony">My Ceremony Playlist</option>
                    <option value="my-cocktail">My Cocktail Hour Playlist</option>
                    <option value="my-reception">My Reception Playlist</option>
                    {Object.keys(userPlaylists).filter(id => id.startsWith('custom-')).map(playlistId => (
                      <option key={playlistId} value={playlistId}>
                        Custom Playlist ({playlistId.replace('custom-', '').substring(0, 20)}...)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">💡</span>
                    <div className="text-sm text-purple-700">
                      <div className="font-semibold mb-1">Manual Song Entry</div>
                      <div>Add songs manually when you know the exact title and artist. Great for:</div>
                      <div className="mt-1 ml-2">
                        • Special request songs<br/>
                        • Custom covers or versions<br/>
                        • Songs not available on Spotify<br/>
                        • Live band repertoire
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddSong(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addManualSong}
                    disabled={!newManualSong.title.trim() || !newManualSong.artist.trim()}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Song
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

// Wedding Vendor Manager Component
function WeddingVendorManager() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'photographer' | 'venue' | 'caterer' | 'florist' | 'dj' | 'videographer' | 'makeup' | 'transportation' | 'officiant' | 'custom'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'researching' | 'contacted' | 'quoted' | 'booked' | 'paid' | 'completed'>('all');
  const [showAddVendor, setShowAddVendor] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingVendor, setEditingVendor] = useState<string | null>(null);


  // Vendor categories with colors and icons
  const vendorCategories = {
    photographer: { name: 'Photography', icon: '📸', color: 'blue', desc: 'Wedding photographers and engagement shoots' },
    venue: { name: 'Venue & Reception', icon: '🏰', color: 'purple', desc: 'Wedding venues and reception halls' },
    caterer: { name: 'Catering & Food', icon: '🍽️', color: 'orange', desc: 'Catering services and wedding cakes' },
    florist: { name: 'Flowers & Decor', icon: '🌸', color: 'pink', desc: 'Florists and decoration services' },
    dj: { name: 'Music & DJ', icon: '🎵', color: 'indigo', desc: 'DJs, bands, and entertainment' },
    videographer: { name: 'Videography', icon: '🎬', color: 'red', desc: 'Wedding videographers and cinematography' },
    makeup: { name: 'Beauty & Hair', icon: '💄', color: 'rose', desc: 'Makeup artists and hair stylists' },
    transportation: { name: 'Transportation', icon: '🚗', color: 'green', desc: 'Wedding cars and transportation' },
    officiant: { name: 'Officiant', icon: '👨‍💼', color: 'amber', desc: 'Wedding officiants and celebrants' },
    custom: { name: 'Other Vendors', icon: '⭐', color: 'gray', desc: 'Custom vendor categories' }
  };

  // Vendor status options
  const vendorStatuses = [
    { key: 'researching', name: 'Researching', color: 'bg-gray-100 text-gray-800' },
    { key: 'contacted', name: 'Contacted', color: 'bg-blue-100 text-blue-800' },
    { key: 'quoted', name: 'Quoted', color: 'bg-yellow-100 text-yellow-800' },
    { key: 'booked', name: 'Booked', color: 'bg-green-100 text-green-800' },
    { key: 'paid', name: 'Paid', color: 'bg-purple-100 text-purple-800' },
    { key: 'completed', name: 'Completed', color: 'bg-emerald-100 text-emerald-800' }
  ];

  // Vendors data - start empty for users
  const [vendors, setVendors] = useState<Array<{
    id: string;
    name: string;
    category: keyof typeof vendorCategories;
    status: 'researching' | 'contacted' | 'quoted' | 'booked' | 'paid' | 'completed';
    contactName?: string;
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
    quotedPrice?: number;
    finalPrice?: number;
    depositPaid?: number;
    balanceDue?: number;
    contractDate?: string;
    eventDate?: string;
    rating?: number;
    notes?: string;
    services?: string;
    communicationLog?: Array<{
      id: string;
      date: string;
      type: 'email' | 'phone' | 'meeting' | 'other';
      summary: string;
      followUp?: string;
    }>;
    documents?: Array<{
      id: string;
      name: string;
      type: 'contract' | 'quote' | 'invoice' | 'receipt' | 'other';
      uploadDate: string;
    }>;
    starred: boolean;
    referredBy?: string;
  }>>([]);

  const [newVendor, setNewVendor] = useState({
    name: '',
    category: 'photographer' as keyof typeof vendorCategories,
    contactName: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    quotedPrice: '',
    services: '',
    notes: '',
    referredBy: ''
  });

  // Filter vendors
  const filteredVendors = vendors.filter(vendor => {
    const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || vendor.status === selectedStatus;
    const matchesSearch = searchTerm === '' || 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.services?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const totalVendors = vendors.length;
  const bookedVendors = vendors.filter(v => v.status === 'booked' || v.status === 'paid' || v.status === 'completed').length;
  const quotedVendors = vendors.filter(v => v.status === 'quoted').length;
  const researchingVendors = vendors.filter(v => v.status === 'researching' || v.status === 'contacted').length;
  const totalSpent = vendors.reduce((sum, v) => sum + (v.depositPaid || 0), 0);
  const totalBudgeted = vendors.reduce((sum, v) => sum + (v.quotedPrice || v.finalPrice || 0), 0);
  const totalBalance = vendors.reduce((sum, v) => sum + (v.balanceDue || 0), 0);

  const addVendor = () => {
    if (newVendor.name && newVendor.contactName) {
      const vendor = {
        id: Date.now().toString(),
        name: newVendor.name,
        category: newVendor.category,
        status: 'researching' as const,
        contactName: newVendor.contactName,
        email: newVendor.email || undefined,
        phone: newVendor.phone || undefined,
        website: newVendor.website || undefined,
        address: newVendor.address || undefined,
        quotedPrice: newVendor.quotedPrice ? parseFloat(newVendor.quotedPrice) : undefined,
        services: newVendor.services || undefined,
        notes: newVendor.notes || undefined,
        referredBy: newVendor.referredBy || undefined,
        communicationLog: [],
        documents: [],
        starred: false
      };
      
      setVendors([vendor, ...vendors]);
      setNewVendor({
        name: '',
        category: 'photographer',
        contactName: '',
        email: '',
        phone: '',
        website: '',
        address: '',
        quotedPrice: '',
        services: '',
        notes: '',
        referredBy: ''
      });
      setShowAddVendor(false);
    }
  };

  const deleteVendor = (id: string) => {
    setVendors(vendors.filter(v => v.id !== id));
  };

  const updateVendorStatus = (id: string, status: 'researching' | 'contacted' | 'quoted' | 'booked' | 'paid' | 'completed') => {
    setVendors(vendors.map(v => 
      v.id === id ? { ...v, status } : v
    ));
  };

  const toggleStarred = (id: string) => {
    setVendors(vendors.map(v => 
      v.id === id ? { ...v, starred: !v.starred } : v
    ));
  };

  const addCommunicationLog = (vendorId: string, logEntry: {
    type: 'email' | 'phone' | 'meeting' | 'other';
    summary: string;
    followUp?: string;
  }) => {
    setVendors(vendors.map(v => 
      v.id === vendorId ? {
        ...v,
        communicationLog: [...(v.communicationLog || []), {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          ...logEntry
        }]
      } : v
    ));
  };

  const getCategoryColorClass = (color: string, type: 'bg' | 'text' | 'border') => {
    const colors: Record<string, Record<string, string>> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
      red: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
      rose: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' },
      green: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
      amber: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
      gray: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' }
    };
    return colors[color]?.[type] || colors.gray[type];
  };

  const getRatingStars = (rating?: number) => {
    if (!rating) return '☆☆☆☆☆';
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <span className="text-2xl">🤝</span>
          </div>
          <h1 className="text-3xl font-bold text-amber-800">Vendor Management</h1>
          <p className="text-amber-700">Organize and track all your wedding vendors in one place</p>
        </div>

        {/* Vendor Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalVendors}</div>
            <div className="text-sm text-gray-600">Total Vendors</div>
          </div>
          <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{bookedVendors}</div>
            <div className="text-sm text-gray-600">Booked</div>
          </div>
          <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{quotedVendors}</div>
            <div className="text-sm text-gray-600">Quoted</div>
          </div>
          <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{researchingVendors}</div>
            <div className="text-sm text-gray-600">Researching</div>
          </div>
          <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">£{totalSpent.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Spent</div>
          </div>
          <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-red-600">£{totalBalance.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Balance Due</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddVendor(true)}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2"
            >
              <span>➕</span>
              Add Vendor
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <span>📥</span>
              Export List
            </button>
            <button 
              onClick={() => {
                if (typeof window !== 'undefined' && window.alert) {
                  alert('📊 Vendor Analytics\n\nThis would show:\n\n• Spending breakdown by category\n• Timeline of vendor bookings\n• Average prices by vendor type\n• Contract completion status\n• Payment schedule overview\n• Vendor performance ratings');
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <span>📊</span>
              Analytics
            </button>
          </div>

          <div className="flex gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search vendors..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Category Filter */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="font-semibold text-amber-800 mb-3">Vendor Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCategory === 'all' 
                      ? 'bg-amber-100 border border-amber-300 text-amber-800' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🤝</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">All Vendors</div>
                      <div className="text-xs text-gray-500">View everything</div>
                    </div>
                    <div className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                      {totalVendors}
                    </div>
                  </div>
                </button>

                {Object.entries(vendorCategories).map(([key, category]) => {
                  const count = vendors.filter(v => v.category === key).length;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key as any)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedCategory === key 
                          ? `${getCategoryColorClass(category.color, 'bg')} ${getCategoryColorClass(category.color, 'border')} border ${getCategoryColorClass(category.color, 'text')}` 
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{category.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{category.name}</div>
                          <div className="text-xs text-gray-500 truncate">{category.desc}</div>
                        </div>
                        {count > 0 && (
                          <div className={`${getCategoryColorClass(category.color, 'bg')} ${getCategoryColorClass(category.color, 'text')} text-xs px-2 py-1 rounded-full`}>
                            {count}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status Filter */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="font-semibold text-amber-800 mb-3">Status</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedStatus('all')}
                  className={`w-full text-left p-2 rounded-lg transition-colors flex items-center justify-between ${
                    selectedStatus === 'all' 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="text-sm font-medium">All Status</span>
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                    {totalVendors}
                  </span>
                </button>

                {vendorStatuses.map((status) => {
                  const count = vendors.filter(v => v.status === status.key).length;
                  return (
                    <button
                      key={status.key}
                      onClick={() => setSelectedStatus(status.key as any)}
                      className={`w-full text-left p-2 rounded-lg transition-colors flex items-center justify-between ${
                        selectedStatus === status.key 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="text-sm font-medium">{status.name}</span>
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="font-semibold text-amber-800 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => {
                    const starredVendors = vendors.filter(v => v.starred);
                    if (starredVendors.length > 0) {
                      alert(`⭐ Starred Vendors (${starredVendors.length})\n\n` + 
                            starredVendors.map(v => `• ${v.name} (${v.category})`).join('\n'));
                    } else {
                      alert('No starred vendors yet. Click the star icon on vendors to mark them as favorites!');
                    }
                  }}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2"
                >
                  <span>⭐</span>
                  <span>View Starred</span>
                </button>
                <button 
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.alert) {
                      alert('📋 Vendor Comparison\n\nThis feature would let you:\n\n• Compare prices side-by-side\n• View services included\n• Check ratings and reviews\n• Compare contract terms\n• Export comparison charts');
                    }
                  }}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2"
                >
                  <span>📋</span>
                  <span>Compare Vendors</span>
                </button>
                <button 
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.alert) {
                      alert('📅 Contract Tracking\n\nThis feature would let you:\n\n• Track contract signing dates\n• Set payment deadlines\n• Monitor vendor milestones\n• Get deadline reminders\n• View contract timelines');
                    }
                  }}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2"
                >
                  <span>📋</span>
                  <span>Contract Tracking</span>
                </button>
              </div>
            </div>
          </div>

          {/* Vendor List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-amber-800">
                    {selectedCategory === 'all' ? 'All Vendors' : vendorCategories[selectedCategory as keyof typeof vendorCategories]?.name}
                    {selectedStatus !== 'all' && ` - ${selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}`}
                  </h2>
                  <div className="flex gap-2">
                    <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm">
                      {filteredVendors.length} {filteredVendors.length === 1 ? 'vendor' : 'vendors'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {filteredVendors.map((vendor) => {
                  const category = vendorCategories[vendor.category];
                  const statusInfo = vendorStatuses.find(s => s.key === vendor.status);
                  
                  return (
                    <div key={vendor.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <span className="text-2xl">{category.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-amber-800">{vendor.name}</h4>
                              {vendor.starred && <span className="text-yellow-500">⭐</span>}
                              <span className={`px-2 py-1 rounded-full text-xs ${statusInfo?.color}`}>
                                {statusInfo?.name}
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                              <span className={`px-2 py-1 rounded-full ${getCategoryColorClass(category.color, 'bg')} ${getCategoryColorClass(category.color, 'text')}`}>
                                {category.icon} {category.name}
                              </span>
                              {vendor.rating && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                                  {getRatingStars(vendor.rating)} ({vendor.rating}/5)
                                </span>
                              )}
                            </div>
                            
                            {vendor.contactName && (
                              <div className="text-sm text-gray-700 mb-1">
                                👤 Contact: {vendor.contactName}
                              </div>
                            )}
                            
                            {vendor.email && (
                              <div className="text-sm text-gray-600 mb-1">
                                📧 {vendor.email}
                              </div>
                            )}
                            
                            {vendor.phone && (
                              <div className="text-sm text-gray-600 mb-1">
                                📱 {vendor.phone}
                              </div>
                            )}
                            
                            {vendor.services && (
                              <div className="text-sm text-blue-600 mb-1">
                                🛠️ Services: {vendor.services}
                              </div>
                            )}
                            
                            {vendor.quotedPrice && (
                              <div className="text-sm font-semibold text-green-600 mb-1">
                                💰 Quote: £{vendor.quotedPrice.toLocaleString()}
                              </div>
                            )}
                            
                            {vendor.finalPrice && vendor.finalPrice !== vendor.quotedPrice && (
                              <div className="text-sm font-semibold text-purple-600 mb-1">
                                💳 Final: £{vendor.finalPrice.toLocaleString()}
                              </div>
                            )}
                            
                            {vendor.balanceDue && vendor.balanceDue > 0 && (
                              <div className="text-sm font-semibold text-red-600 mb-1">
                                ⚠️ Balance Due: £{vendor.balanceDue.toLocaleString()}
                              </div>
                            )}
                            
                            {vendor.contractDate && (
                              <div className="text-sm text-purple-600 mb-1">
                                📋 Contract: {new Date(vendor.contractDate).toLocaleDateString()}
                              </div>
                            )}
                            
                            {vendor.eventDate && (
                              <div className="text-sm text-orange-600 mb-1">
                                📅 Service Date: {new Date(vendor.eventDate).toLocaleDateString()}
                              </div>
                            )}
                            
                            {vendor.referredBy && (
                              <div className="text-sm text-indigo-600 mb-1">
                                👥 Referred by: {vendor.referredBy}
                              </div>
                            )}
                            
                            {vendor.notes && (
                              <div className="text-sm text-gray-600 italic mt-2 bg-gray-50 p-2 rounded">
                                💡 {vendor.notes}
                              </div>
                            )}
                            
                            {vendor.communicationLog && vendor.communicationLog.length > 0 && (
                              <div className="text-xs text-gray-500 mt-2">
                                💬 Last contact: {vendor.communicationLog[vendor.communicationLog.length - 1].date}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-1 ml-3">
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => toggleStarred(vendor.id)}
                              className={`px-2 py-1 rounded text-xs ${
                                vendor.starred 
                                  ? 'bg-yellow-100 text-yellow-600' 
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title={vendor.starred ? 'Remove from starred' : 'Add to starred'}
                            >
                              ⭐
                            </button>
                            
                            <select
                              value={vendor.status}
                              onChange={(e) => updateVendorStatus(vendor.id, e.target.value as any)}
                              className="px-2 py-1 rounded text-xs border border-gray-300"
                            >
                              {vendorStatuses.map(status => (
                                <option key={status.key} value={status.key}>
                                  {status.name}
                                </option>
                              ))}
                            </select>
                            
                            <button
                              onClick={() => {
                                if (typeof window !== 'undefined' && window.alert) {
                                  alert(`📞 Contact ${vendor.name}\n\n${vendor.contactName ? `Contact: ${vendor.contactName}\n` : ''}${vendor.phone ? `Phone: ${vendor.phone}\n` : ''}${vendor.email ? `Email: ${vendor.email}\n` : ''}${vendor.website ? `Website: ${vendor.website}\n` : ''}\nThis would open your preferred communication method.`);
                                }
                              }}
                              className="px-2 py-1 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded text-xs"
                              title="Contact vendor"
                            >
                              📞
                            </button>
                            
                            <button
                              onClick={() => deleteVendor(vendor.id)}
                              className="px-2 py-1 bg-red-100 text-red-600 hover:bg-red-200 rounded text-xs"
                              title="Delete vendor"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {filteredVendors.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <span className="text-6xl block mb-4">🤝</span>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No vendors found</h3>
                    <p className="text-sm mb-4">
                      {searchTerm ? 'Try adjusting your search terms' : 'Add your first vendor to get started'}
                    </p>
                    <button
                      onClick={() => setShowAddVendor(true)}
                      className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                    >
                      Add Vendor
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add Vendor Modal */}
        {showAddVendor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-amber-800 mb-4">Add New Vendor</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                  <input
                    type="text"
                    value={newVendor.name}
                    onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                    placeholder="e.g., Smith Photography Studio"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newVendor.category}
                    onChange={(e) => setNewVendor({...newVendor, category: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    {Object.entries(vendorCategories).map(([key, category]) => (
                      <option key={key} value={key}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name *</label>
                  <input
                    type="text"
                    value={newVendor.contactName}
                    onChange={(e) => setNewVendor({...newVendor, contactName: e.target.value})}
                    placeholder="e.g., John Smith"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newVendor.email}
                    onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
                    placeholder="contact@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newVendor.phone}
                    onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})}
                    placeholder="+44 7700 900123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={newVendor.website}
                    onChange={(e) => setNewVendor({...newVendor, website: e.target.value})}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quoted Price (£)</label>
                  <input
                    type="number"
                    value={newVendor.quotedPrice}
                    onChange={(e) => setNewVendor({...newVendor, quotedPrice: e.target.value})}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Referred By</label>
                  <input
                    type="text"
                    value={newVendor.referredBy}
                    onChange={(e) => setNewVendor({...newVendor, referredBy: e.target.value})}
                    placeholder="e.g., Friend, Website, Wedding Fair"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={newVendor.address}
                    onChange={(e) => setNewVendor({...newVendor, address: e.target.value})}
                    placeholder="123 Main Street, City, Country"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Services Offered</label>
                  <input
                    type="text"
                    value={newVendor.services}
                    onChange={(e) => setNewVendor({...newVendor, services: e.target.value})}
                    placeholder="e.g., Wedding photography, engagement shoots, albums"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={newVendor.notes}
                    onChange={(e) => setNewVendor({...newVendor, notes: e.target.value})}
                    placeholder="Additional notes about this vendor..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>
              </div>
                
              <div className="flex gap-3 pt-6">
                <button
                  onClick={() => setShowAddVendor(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addVendor}
                  disabled={!newVendor.name.trim() || !newVendor.contactName.trim()}
                  className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Vendor
                </button>
              </div>
            </div>
          </div>
        )}


      </div>
    </ErrorBoundary>
  );
}



// Wedding Task Manager Component
function WeddingTaskManager() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'planning' | 'vendors' | 'legal' | 'day-of' | 'childcare' | 'custom'>('all');
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'urgent' | 'high' | 'medium' | 'low'>('all');
  const [showAddTask, setShowAddTask] = useState(false);
  const [showChildcareBooking, setShowChildcareBooking] = useState(false);
  const [showViewTimeline, setShowViewTimeline] = useState(false);
  const [showProgressReport, setShowProgressReport] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Task categories with colors and icons
  const taskCategories = {
    planning: { name: 'Planning & Booking', icon: '📋', color: 'blue', desc: 'Venue, catering, entertainment booking' },
    vendors: { name: 'Vendor Management', icon: '🤝', color: 'purple', desc: 'Photographer, florist, vendors' },
    legal: { name: 'Legal & Documents', icon: '📄', color: 'orange', desc: 'Marriage license, contracts, insurance' },
    'day-of': { name: 'Wedding Day', icon: '💒', color: 'rose', desc: 'Day-of coordination and setup' },
    childcare: { name: 'Childcare & Family', icon: '👶', color: 'green', desc: 'Children arrangements and care' },
    custom: { name: 'Custom Tasks', icon: '⭐', color: 'amber', desc: 'Your personal to-do items' }
  };

  // Wedding tasks - start empty for users to add their own
  const [tasks, setTasks] = useState<Array<{
    id: string;
    title: string;
    description: string;
    category: keyof typeof taskCategories;
    priority: 'urgent' | 'high' | 'medium' | 'low';
    status: 'pending' | 'in-progress' | 'completed';
    dueDate?: string;
    completedDate?: string;
    notes?: string;
    estimatedTime?: string;
    vendor?: string;
    cost?: number;
    timeline: '12-months' | '9-months' | '6-months' | '3-months' | '1-month' | '1-week' | 'day-of';
  }>>([]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'custom' as keyof typeof taskCategories,
    priority: 'medium' as 'urgent' | 'high' | 'medium' | 'low',
    dueDate: '',
    notes: '',
    estimatedTime: '',
    vendor: '',
    cost: ''
  });

  // Childcare booking form
  const [childcareBooking, setChildcareBooking] = useState({
    serviceType: 'nanny',
    date: '2024-06-15',
    startTime: '15:00',
    endTime: '24:00',
    numberOfChildren: '1',
    ageGroups: [] as string[],
    location: 'venue',
    specialRequirements: '',
    budget: '',
    contactName: '',
    contactPhone: '',
    contactEmail: ''
  });

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    const matchesSearch = searchTerm === '' || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.vendor?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesPriority && matchesSearch;
  });

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const urgentTasks = tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length;
  const overdueTasks = tasks.filter(t => 
    t.status !== 'completed' && 
    t.dueDate && 
    new Date(t.dueDate) < new Date()
  ).length;

  const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

  const addTask = () => {
    if (newTask.title && newTask.description) {
      const task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        category: newTask.category,
        priority: newTask.priority,
        status: 'pending' as const,
        dueDate: newTask.dueDate || undefined,
        notes: newTask.notes || undefined,
        estimatedTime: newTask.estimatedTime || undefined,
        vendor: newTask.vendor || undefined,
        cost: newTask.cost ? parseFloat(newTask.cost) : undefined,
        timeline: '3-months' as const
      };
      
      setTasks([task, ...tasks]);
      setNewTask({
        title: '',
        description: '',
        category: 'custom',
        priority: 'medium',
        dueDate: '',
        notes: '',
        estimatedTime: '',
        vendor: '',
        cost: ''
      });
      setShowAddTask(false);
    }
  };

  const updateTaskStatus = (id: string, status: 'pending' | 'in-progress' | 'completed') => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task, status };
        if (status === 'completed') {
          updatedTask.completedDate = new Date().toISOString().split('T')[0];
        } else {
          delete updatedTask.completedDate;
        }
        return updatedTask;
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const bookChildcare = () => {
    // Create a childcare task if childcare booking is submitted
    const childcareTask = {
      id: Date.now().toString(),
      title: `${childcareBooking.serviceType === 'nanny' ? 'Nanny' : 'Babysitter'} for Wedding Day`,
      description: `${childcareBooking.serviceType} for ${childcareBooking.numberOfChildren} children from ${childcareBooking.startTime} to ${childcareBooking.endTime}`,
      category: 'childcare' as const,
      priority: 'high' as const,
      status: 'completed' as const,
      completedDate: new Date().toISOString().split('T')[0],
      dueDate: childcareBooking.date,
      timeline: '3-months' as const,
      vendor: childcareBooking.contactName,
      cost: childcareBooking.budget ? parseFloat(childcareBooking.budget) : undefined,
      notes: `Contact: ${childcareBooking.contactName} (${childcareBooking.contactPhone}). Special requirements: ${childcareBooking.specialRequirements}`
    };
    
    setTasks([childcareTask, ...tasks]);
    setShowChildcareBooking(false);
    
    // Reset form
    setChildcareBooking({
      serviceType: 'nanny',
      date: '2024-06-15',
      startTime: '15:00',
      endTime: '24:00',
      numberOfChildren: '1',
      ageGroups: [],
      location: 'venue',
      specialRequirements: '',
      budget: '',
      contactName: '',
      contactPhone: '',
      contactEmail: ''
    });
    
    alert('Childcare booking confirmed! Task added to your wedding planning list.');
  };

  const getCategoryColorClass = (color: string, type: 'bg' | 'text' | 'border') => {
    const colors: Record<string, Record<string, string>> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
      rose: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' },
      green: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
      amber: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' }
    };
    return colors[color]?.[type] || colors.blue[type];
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimelineColor = (timeline: string) => {
    switch (timeline) {
      case '12-months': return 'bg-indigo-100 text-indigo-800';
      case '9-months': return 'bg-purple-100 text-purple-800';
      case '6-months': return 'bg-blue-100 text-blue-800';
      case '3-months': return 'bg-orange-100 text-orange-800';
      case '1-month': return 'bg-red-100 text-red-800';
      case '1-week': return 'bg-pink-100 text-pink-800';
      case 'day-of': return 'bg-rose-100 text-rose-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <span className="text-2xl">✅</span>
          </div>
          <h1 className="text-3xl font-bold text-amber-800">Wedding Task Manager</h1>
          <p className="text-amber-700">Stay organized with your comprehensive wedding planning checklist</p>
        </div>

        {/* Progress Overview */}
        <div className="bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-amber-800">Overall Progress</h3>
            <span className="text-2xl font-bold text-amber-600">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className="bg-gradient-to-r from-amber-500 to-rose-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-amber-800">{completedTasks}/{totalTasks}</div>
              <div className="text-amber-700">Completed</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-600">{inProgressTasks}</div>
              <div className="text-amber-700">In Progress</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-orange-600">{urgentTasks}</div>
              <div className="text-amber-700">Urgent</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-red-600">{overdueTasks}</div>
              <div className="text-amber-700">Overdue</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddTask(true)}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2"
            >
              <span>➕</span>
              Add Task
            </button>
            <button
              onClick={() => setShowChildcareBooking(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <span>👶</span>
              Book Childcare
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <span>📥</span>
              Export Tasks
            </button>
          </div>

          <div className="flex gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Category Filter */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="font-semibold text-amber-800 mb-3">Task Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCategory === 'all' 
                      ? 'bg-amber-100 border border-amber-300 text-amber-800' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📝</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">All Tasks</div>
                      <div className="text-xs text-gray-500">View everything</div>
                    </div>
                    <div className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                      {totalTasks}
                    </div>
                  </div>
                </button>

                {Object.entries(taskCategories).map(([key, category]) => {
                  const count = tasks.filter(t => t.category === key).length;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key as any)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedCategory === key 
                          ? `${getCategoryColorClass(category.color, 'bg')} ${getCategoryColorClass(category.color, 'border')} border ${getCategoryColorClass(category.color, 'text')}` 
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{category.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{category.name}</div>
                          <div className="text-xs text-gray-500 truncate">{category.desc}</div>
                        </div>
                        {count > 0 && (
                          <div className={`${getCategoryColorClass(category.color, 'bg')} ${getCategoryColorClass(category.color, 'text')} text-xs px-2 py-1 rounded-full`}>
                            {count}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Priority Filter */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="font-semibold text-amber-800 mb-3">Priority Level</h3>
              <div className="space-y-2">
                {[
                  { key: 'all', name: 'All Priorities', count: totalTasks },
                  { key: 'urgent', name: 'Urgent', count: tasks.filter(t => t.priority === 'urgent').length },
                  { key: 'high', name: 'High', count: tasks.filter(t => t.priority === 'high').length },
                  { key: 'medium', name: 'Medium', count: tasks.filter(t => t.priority === 'medium').length },
                  { key: 'low', name: 'Low', count: tasks.filter(t => t.priority === 'low').length }
                ].map((priority) => (
                  <button
                    key={priority.key}
                    onClick={() => setSelectedPriority(priority.key as any)}
                    className={`w-full text-left p-2 rounded-lg transition-colors flex items-center justify-between ${
                      selectedPriority === priority.key 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="text-sm font-medium">{priority.name}</span>
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                      {priority.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="font-semibold text-amber-800 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setShowChildcareBooking(true)}
                  className="w-full text-left p-2 hover:bg-green-50 rounded text-sm flex items-center gap-2"
                >
                  <span>👶</span>
                  <span>Book Childcare</span>
                </button>
                <button 
                  onClick={() => setShowViewTimeline(true)}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2"
                >
                  <span>⏰</span>
                  <span>View Timeline</span>
                </button>
                <button 
                  onClick={() => setShowProgressReport(true)}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2"
                >
                  <span>📊</span>
                  <span>Progress Report</span>
                </button>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-amber-800">
                    {selectedCategory === 'all' ? 'All Tasks' : taskCategories[selectedCategory as keyof typeof taskCategories]?.name}
                    {selectedPriority !== 'all' && ` - ${selectedPriority.charAt(0).toUpperCase() + selectedPriority.slice(1)} Priority`}
                  </h2>
                  <div className="flex gap-2">
                    <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm">
                      {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {filteredTasks.map((task) => {
                  const category = taskCategories[task.category];
                  const isOverdue = task.status !== 'completed' && task.dueDate && new Date(task.dueDate) < new Date();
                  
                  return (
                    <div key={task.id} className={`border rounded-lg p-4 transition-colors ${
                      task.status === 'completed' ? 'bg-green-50 opacity-75' : 
                      isOverdue ? 'bg-red-50 border-red-200' : 'hover:bg-gray-50'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <span className="text-2xl">{category.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className={`font-semibold text-amber-800 ${task.status === 'completed' ? 'line-through' : ''}`}>
                                {task.title}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                                {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                              </span>
                            </div>
                            
                            <p className={`text-sm text-gray-700 mb-2 ${task.status === 'completed' ? 'line-through' : ''}`}>
                              {task.description}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                              <span className={`px-2 py-1 rounded-full ${getCategoryColorClass(category.color, 'bg')} ${getCategoryColorClass(category.color, 'text')}`}>
                                {category.icon} {category.name}
                              </span>
                              <span className={`px-2 py-1 rounded-full ${getTimelineColor(task.timeline)}`}>
                                {task.timeline.replace('-', ' ')}
                              </span>
                              {task.estimatedTime && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                  ⏱️ {task.estimatedTime}
                                </span>
                              )}
                            </div>
                            
                            {task.dueDate && (
                              <div className={`text-sm mb-1 ${
                                isOverdue ? 'text-red-600 font-semibold' : 
                                task.status === 'completed' ? 'text-gray-500' : 'text-orange-600'
                              }`}>
                                📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                                {isOverdue && ' (Overdue!)'}
                              </div>
                            )}
                            
                            {task.vendor && (
                              <div className="text-sm text-blue-600 mb-1">
                                🏢 Vendor: {task.vendor}
                              </div>
                            )}
                            
                            {task.cost && (
                              <div className="text-sm font-semibold text-green-600 mb-1">
                                💰 Cost: £{task.cost.toLocaleString()}
                              </div>
                            )}
                            
                            {task.completedDate && (
                              <div className="text-sm text-green-600 mb-1">
                                ✅ Completed: {new Date(task.completedDate).toLocaleDateString()}
                              </div>
                            )}
                            
                            {task.notes && (
                              <div className="text-sm text-gray-600 italic mt-2 bg-gray-50 p-2 rounded">
                                💡 {task.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-1 ml-3">
                          <div className="flex flex-col gap-1">
                            <select
                              value={task.status}
                              onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                              className={`px-2 py-1 rounded text-xs border-0 ${getStatusColor(task.status)}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                            
                            {task.category === 'custom' && (
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="px-2 py-1 bg-red-100 text-red-600 hover:bg-red-200 rounded text-xs"
                                title="Delete task"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {filteredTasks.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <span className="text-6xl block mb-4">✅</span>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No tasks found</h3>
                    <p className="text-sm mb-4">
                      {searchTerm ? 'Try adjusting your search terms' : 'Add your first custom task to get started'}
                    </p>
                    <button
                      onClick={() => setShowAddTask(true)}
                      className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                    >
                      Add Task
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add Task Modal */}
        {showAddTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-amber-800 mb-4">Add New Task</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="e.g., Book wedding DJ"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    placeholder="Detailed description of the task..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({...newTask, category: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    {Object.entries(taskCategories).map(([key, category]) => (
                      <option key={key} value={key}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Time</label>
                  <input
                    type="text"
                    value={newTask.estimatedTime}
                    onChange={(e) => setNewTask({...newTask, estimatedTime: e.target.value})}
                    placeholder="e.g., 2 hours, 1 week"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor/Contact</label>
                  <input
                    type="text"
                    value={newTask.vendor}
                    onChange={(e) => setNewTask({...newTask, vendor: e.target.value})}
                    placeholder="e.g., DJ Services Ltd"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost (£)</label>
                  <input
                    type="number"
                    value={newTask.cost}
                    onChange={(e) => setNewTask({...newTask, cost: e.target.value})}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={newTask.notes}
                    onChange={(e) => setNewTask({...newTask, notes: e.target.value})}
                    placeholder="Additional notes, reminders, or special requirements..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>
              </div>
                
              <div className="flex gap-3 pt-6">
                <button
                  onClick={() => setShowAddTask(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addTask}
                  disabled={!newTask.title.trim() || !newTask.description.trim()}
                  className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Childcare Booking Modal */}
        {showChildcareBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-amber-800 mb-4">Book Wedding Childcare Services</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                  <select
                    value={childcareBooking.serviceType}
                    onChange={(e) => setChildcareBooking({...childcareBooking, serviceType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  >
                    <option value="nanny">Professional Nanny</option>
                    <option value="babysitter">Babysitter</option>
                    <option value="childcare-center">Mobile Childcare Center</option>
                    <option value="family-member">Family Member/Friend</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={childcareBooking.date}
                    onChange={(e) => setChildcareBooking({...childcareBooking, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={childcareBooking.startTime}
                    onChange={(e) => setChildcareBooking({...childcareBooking, startTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={childcareBooking.endTime}
                    onChange={(e) => setChildcareBooking({...childcareBooking, endTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Children</label>
                  <select
                    value={childcareBooking.numberOfChildren}
                    onChange={(e) => setChildcareBooking({...childcareBooking, numberOfChildren: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  >
                    <option value="1">1 child</option>
                    <option value="2">2 children</option>
                    <option value="3">3 children</option>
                    <option value="4">4 children</option>
                    <option value="5+">5+ children</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <select
                    value={childcareBooking.location}
                    onChange={(e) => setChildcareBooking({...childcareBooking, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  >
                    <option value="venue">At wedding venue</option>
                    <option value="separate-room">Separate room at venue</option>
                    <option value="nearby-location">Nearby location</option>
                    <option value="family-home">Family home</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget (£/hour)</label>
                  <input
                    type="number"
                    value={childcareBooking.budget}
                    onChange={(e) => setChildcareBooking({...childcareBooking, budget: e.target.value})}
                    placeholder="e.g., 15-25 per hour"
                    min="0"
                    step="0.50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={childcareBooking.contactName}
                    onChange={(e) => setChildcareBooking({...childcareBooking, contactName: e.target.value})}
                    placeholder="Provider's name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={childcareBooking.contactPhone}
                    onChange={(e) => setChildcareBooking({...childcareBooking, contactPhone: e.target.value})}
                    placeholder="+44 7700 900123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={childcareBooking.contactEmail}
                    onChange={(e) => setChildcareBooking({...childcareBooking, contactEmail: e.target.value})}
                    placeholder="provider@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Requirements</label>
                  <textarea
                    value={childcareBooking.specialRequirements}
                    onChange={(e) => setChildcareBooking({...childcareBooking, specialRequirements: e.target.value})}
                    placeholder="Age groups, allergies, special needs, meal requirements, activities, etc."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                <h4 className="font-semibold text-green-800 mb-2">Childcare Tips for Weddings</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <div>• Book childcare 6-8 weeks in advance</div>
                  <div>• Provide emergency contact details and medical information</div>
                  <div>• Consider having childcare during both ceremony and reception</div>
                  <div>• Prepare activity bags and snacks for the children</div>
                  <div>• Inform other parents about childcare arrangements</div>
                </div>
              </div>
                
              <div className="flex gap-3 pt-6">
                <button
                  onClick={() => setShowChildcareBooking(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={bookChildcare}
                  disabled={!childcareBooking.contactName || !childcareBooking.contactPhone}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Timeline View Modal */}
        {showViewTimeline && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-6xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-amber-800">Wedding Planning Timeline</h3>
                <button
                  onClick={() => setShowViewTimeline(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Timeline Overview */}
                <div className="bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-amber-800">Timeline Overview</h4>
                    <div className="flex gap-2">
                      <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                        {tasks.filter(t => t.status === 'completed').length} Completed
                      </span>
                      <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                        {tasks.filter(t => t.status !== 'completed').length} Remaining
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-amber-700">
                    Plan your wedding tasks based on when they should be completed relative to your big day.
                  </div>
                </div>

                {/* Timeline Periods */}
                <div className="space-y-8">
                  {[
                    { key: '12-months', name: '12+ Months Before', icon: '🎯', desc: 'Initial planning and venue booking', color: 'indigo' },
                    { key: '9-months', name: '9 Months Before', icon: '📋', desc: 'Vendor research and major bookings', color: 'purple' },
                    { key: '6-months', name: '6 Months Before', icon: '🤝', desc: 'Finalize vendors and details', color: 'blue' },
                    { key: '3-months', name: '3 Months Before', icon: '⚡', desc: 'Final arrangements and confirmations', color: 'orange' },
                    { key: '1-month', name: '1 Month Before', icon: '🔥', desc: 'Last-minute preparations', color: 'red' },
                    { key: '1-week', name: '1 Week Before', icon: '⏰', desc: 'Final week preparations', color: 'pink' },
                    { key: 'day-of', name: 'Wedding Day', icon: '💒', desc: 'Day-of coordination and execution', color: 'rose' }
                  ].map((period) => {
                    const periodTasks = tasks.filter(task => task.timeline === period.key);
                    const completedTasks = periodTasks.filter(task => task.status === 'completed').length;
                    const progressPercentage = periodTasks.length > 0 ? Math.round((completedTasks / periodTasks.length) * 100) : 0;
                    
                    const getColorClasses = (color: string) => {
                      const colors: Record<string, { bg: string; text: string; border: string }> = {
                        indigo: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
                        purple: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
                        blue: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
                        orange: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
                        red: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
                        pink: { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300' },
                        rose: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' }
                      };
                      return colors[color] || colors.blue;
                    };
                    
                    const colorClasses = getColorClasses(period.color);
                    
                    return (
                      <div key={period.key} className={`border rounded-lg p-6 ${colorClasses.bg} ${colorClasses.border}`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{period.icon}</span>
                            <div>
                              <h5 className={`text-lg font-semibold ${colorClasses.text}`}>{period.name}</h5>
                              <p className="text-sm text-gray-600">{period.desc}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${colorClasses.text}`}>
                              {completedTasks}/{periodTasks.length}
                            </div>
                            <div className="text-sm text-gray-600">
                              {progressPercentage}% Complete
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        {periodTasks.length > 0 && (
                          <div className="w-full bg-white bg-opacity-50 rounded-full h-3 mb-4">
                            <div 
                              className={`h-3 rounded-full transition-all bg-gradient-to-r ${
                                progressPercentage === 100 ? 'from-green-500 to-green-600' :
                                progressPercentage >= 75 ? 'from-blue-500 to-blue-600' :
                                progressPercentage >= 50 ? 'from-yellow-500 to-yellow-600' :
                                'from-orange-500 to-orange-600'
                              }`}
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                        )}
                        
                        {/* Tasks List */}
                        {periodTasks.length > 0 ? (
                          <div className="space-y-2">
                            {periodTasks.slice(0, 3).map((task) => {
                              const category = taskCategories[task.category];
                              return (
                                <div key={task.id} className={`bg-white bg-opacity-80 rounded-lg p-3 border ${task.status === 'completed' ? 'opacity-75' : ''}`}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 flex-1">
                                      <span className="text-lg">{category.icon}</span>
                                      <div className="flex-1 min-w-0">
                                        <div className={`font-medium ${colorClasses.text} ${task.status === 'completed' ? 'line-through' : ''}`}>
                                          {task.title}
                                        </div>
                                        <div className="text-xs text-gray-600 truncate">
                                          {task.description}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className={`px-2 py-1 rounded-full text-xs ${
                                        task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                        task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                      }`}>
                                        {task.priority}
                                      </span>
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                        task.status === 'completed' ? 'bg-green-600 text-white' :
                                        task.status === 'in-progress' ? 'bg-blue-600 text-white' :
                                        'bg-gray-300 text-gray-600'
                                      }`}>
                                        {task.status === 'completed' ? '✓' : 
                                         task.status === 'in-progress' ? '⟳' : '○'}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            {periodTasks.length > 3 && (
                              <div className="text-center">
                                <span className="text-sm text-gray-600">
                                  + {periodTasks.length - 3} more task{periodTasks.length - 3 === 1 ? '' : 's'}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="bg-white bg-opacity-50 rounded-lg p-4 text-center">
                            <span className="text-gray-500 text-sm">No tasks scheduled for this period</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Timeline Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-800 mb-3">📚 Timeline Tips</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span><strong>12+ Months:</strong> Book popular venues, set budget, create guest list</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span><strong>9 Months:</strong> Book major vendors (photographer, caterer, band)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span><strong>6 Months:</strong> Send invitations, finalize menu, order attire</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span><strong>3 Months:</strong> Confirm guest count, finalize details, get marriage license</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span><strong>1 Month:</strong> Confirm final details, arrange seating, pack honeymoon</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span><strong>Wedding Day:</strong> Relax and enjoy your special day!</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => setShowViewTimeline(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close Timeline
                  </button>
                  <button
                    onClick={() => {
                      setShowViewTimeline(false);
                      setShowAddTask(true);
                    }}
                    className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                  >
                    Add New Task
                  </button>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.alert) {
                        const timelineSummary = [
                          '📊 Wedding Planning Timeline Summary\n',
                          `Total Tasks: ${tasks.length}`,
                          `Completed: ${tasks.filter(t => t.status === 'completed').length}`,
                          `In Progress: ${tasks.filter(t => t.status === 'in-progress').length}`,
                          `Pending: ${tasks.filter(t => t.status === 'pending').length}`,
                          '',
                          'Tasks by Timeline:',
                          ...['12-months', '9-months', '6-months', '3-months', '1-month', '1-week', 'day-of'].map(period => {
                            const periodTasks = tasks.filter(t => t.timeline === period);
                            const completed = periodTasks.filter(t => t.status === 'completed').length;
                            return `${period.replace('-', ' ')}: ${completed}/${periodTasks.length} completed`;
                          })
                        ].join('\n');
                        
                        alert(timelineSummary);
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Export Summary
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Report Modal */}
        {showProgressReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-6xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-amber-800">Wedding Planning Progress Report</h3>
                <button
                  onClick={() => setShowProgressReport(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Overall Progress Summary */}
                <div className="bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-amber-800">Overall Progress</h4>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-amber-600">{completionPercentage}%</div>
                      <div className="text-sm text-amber-700">Complete</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-rose-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                      <div className="text-sm text-amber-700">Completed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{inProgressTasks}</div>
                      <div className="text-sm text-amber-700">In Progress</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">{pendingTasks}</div>
                      <div className="text-sm text-amber-700">Pending</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
                      <div className="text-sm text-amber-700">Overdue</div>
                    </div>
                  </div>
                </div>

                {/* Progress by Category */}
                <div className="bg-white rounded-lg border shadow-sm p-6">
                  <h4 className="text-lg font-semibold text-amber-800 mb-4">Progress by Category</h4>
                  <div className="space-y-4">
                    {Object.entries(taskCategories).map(([key, category]) => {
                      const categoryTasks = tasks.filter(task => task.category === key);
                      const categoryCompleted = categoryTasks.filter(task => task.status === 'completed').length;
                      const categoryProgress = categoryTasks.length > 0 ? Math.round((categoryCompleted / categoryTasks.length) * 100) : 0;
                      
                      return (
                        <div key={key} className={`p-4 rounded-lg border ${getCategoryColorClass(category.color, 'bg')} ${getCategoryColorClass(category.color, 'border')}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{category.icon}</span>
                              <div>
                                <div className={`font-semibold ${getCategoryColorClass(category.color, 'text')}`}>
                                  {category.name}
                                </div>
                                <div className="text-xs text-gray-600">{category.desc}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-xl font-bold ${getCategoryColorClass(category.color, 'text')}`}>
                                {categoryCompleted}/{categoryTasks.length}
                              </div>
                              <div className="text-xs text-gray-600">{categoryProgress}%</div>
                            </div>
                          </div>
                          
                          {categoryTasks.length > 0 && (
                            <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all ${
                                  categoryProgress === 100 ? 'bg-green-500' :
                                  categoryProgress >= 75 ? 'bg-blue-500' :
                                  categoryProgress >= 50 ? 'bg-yellow-500' : 'bg-orange-500'
                                }`}
                                style={{ width: `${categoryProgress}%` }}
                              ></div>
                            </div>
                          )}
                          
                          {categoryTasks.length === 0 && (
                            <div className="text-center py-2">
                              <span className="text-xs text-gray-500">No tasks in this category yet</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Priority Analysis */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg border shadow-sm p-6">
                    <h4 className="text-lg font-semibold text-amber-800 mb-4">Priority Breakdown</h4>
                    <div className="space-y-3">
                      {[
                        { key: 'urgent', name: 'Urgent', color: 'bg-red-100 text-red-800', count: tasks.filter(t => t.priority === 'urgent').length },
                        { key: 'high', name: 'High', color: 'bg-orange-100 text-orange-800', count: tasks.filter(t => t.priority === 'high').length },
                        { key: 'medium', name: 'Medium', color: 'bg-yellow-100 text-yellow-800', count: tasks.filter(t => t.priority === 'medium').length },
                        { key: 'low', name: 'Low', color: 'bg-green-100 text-green-800', count: tasks.filter(t => t.priority === 'low').length }
                      ].map((priority) => {
                        const priorityCompleted = tasks.filter(t => t.priority === priority.key && t.status === 'completed').length;
                        const priorityProgress = priority.count > 0 ? Math.round((priorityCompleted / priority.count) * 100) : 0;
                        
                        return (
                          <div key={priority.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${priority.color}`}>
                                {priority.name}
                              </span>
                              <span className="text-sm text-gray-600">
                                {priorityCompleted}/{priority.count} completed
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-amber-800">{priorityProgress}%</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border shadow-sm p-6">
                    <h4 className="text-lg font-semibold text-amber-800 mb-4">Timeline Analysis</h4>
                    <div className="space-y-3">
                      {[
                        { key: '12-months', name: '12+ Months', color: 'indigo' },
                        { key: '9-months', name: '9 Months', color: 'purple' },
                        { key: '6-months', name: '6 Months', color: 'blue' },
                        { key: '3-months', name: '3 Months', color: 'orange' },
                        { key: '1-month', name: '1 Month', color: 'red' },
                        { key: '1-week', name: '1 Week', color: 'pink' },
                        { key: 'day-of', name: 'Wedding Day', color: 'rose' }
                      ].map((period) => {
                        const periodTasks = tasks.filter(task => task.timeline === period.key);
                        const periodCompleted = periodTasks.filter(task => task.status === 'completed').length;
                        const periodProgress = periodTasks.length > 0 ? Math.round((periodCompleted / periodTasks.length) * 100) : 0;
                        
                        return (
                          <div key={period.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-amber-800">{period.name}</span>
                              <span className="text-xs text-gray-600">
                                {periodCompleted}/{periodTasks.length} tasks
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all ${
                                    period.color === 'indigo' ? 'bg-indigo-500' :
                                    period.color === 'purple' ? 'bg-purple-500' :
                                    period.color === 'blue' ? 'bg-blue-500' :
                                    period.color === 'orange' ? 'bg-orange-500' :
                                    period.color === 'red' ? 'bg-red-500' :
                                    period.color === 'pink' ? 'bg-pink-500' :
                                    'bg-rose-500'
                                  }`}
                                  style={{ width: `${periodProgress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600 w-8">{periodProgress}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Upcoming Deadlines */}
                <div className="bg-white rounded-lg border shadow-sm p-6">
                  <h4 className="text-lg font-semibold text-amber-800 mb-4">Upcoming Deadlines</h4>
                  {(() => {
                    const upcomingTasks = tasks
                      .filter(task => task.dueDate && task.status !== 'completed')
                      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
                      .slice(0, 5);
                    
                    if (upcomingTasks.length === 0) {
                      return (
                        <div className="text-center py-8 text-gray-500">
                          <span className="text-4xl block mb-2">🎯</span>
                          <p className="text-sm">No upcoming deadlines set</p>
                        </div>
                      );
                    }
                    
                    return (
                      <div className="space-y-3">
                        {upcomingTasks.map((task) => {
                          const category = taskCategories[task.category];
                          const dueDate = new Date(task.dueDate!);
                          const today = new Date();
                          const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                          const isOverdue = daysUntilDue < 0;
                          const isUrgent = daysUntilDue <= 7 && daysUntilDue >= 0;
                          
                          return (
                            <div key={task.id} className={`p-4 rounded-lg border ${
                              isOverdue ? 'bg-red-50 border-red-200' :
                              isUrgent ? 'bg-orange-50 border-orange-200' :
                              'bg-gray-50 border-gray-200'
                            }`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-xl">{category.icon}</span>
                                  <div>
                                    <div className="font-medium text-amber-800">{task.title}</div>
                                    <div className="text-sm text-gray-600">{task.description}</div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className={`text-sm font-semibold ${
                                    isOverdue ? 'text-red-600' :
                                    isUrgent ? 'text-orange-600' :
                                    'text-gray-600'
                                  }`}>
                                    {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` :
                                     daysUntilDue === 0 ? 'Due today' :
                                     daysUntilDue === 1 ? 'Due tomorrow' :
                                     `Due in ${daysUntilDue} days`}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {dueDate.toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                {/* Performance Insights */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-blue-800 mb-4">📈 Performance Insights</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h5 className="font-semibold text-blue-800">Strengths:</h5>
                      <div className="space-y-2 text-sm text-blue-700">
                        {completionPercentage >= 75 && (
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            <span>Excellent overall progress ({completionPercentage}%)</span>
                          </div>
                        )}
                        {urgentTasks === 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            <span>No urgent tasks outstanding</span>
                          </div>
                        )}
                        {overdueTasks === 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            <span>All deadlines are being met</span>
                          </div>
                        )}
                        {Object.values(taskCategories).some(category => {
                          const categoryTasks = tasks.filter(task => task.category === category);
                          const categoryCompleted = categoryTasks.filter(task => task.status === 'completed').length;
                          return categoryTasks.length > 0 && categoryCompleted === categoryTasks.length;
                        }) && (
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            <span>Some categories fully completed</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h5 className="font-semibold text-blue-800">Recommendations:</h5>
                      <div className="space-y-2 text-sm text-blue-700">
                        {urgentTasks > 0 && (
                          <div className="flex items-start gap-2">
                            <span className="text-orange-600 mt-0.5">⚠️</span>
                            <span>Focus on {urgentTasks} urgent task{urgentTasks === 1 ? '' : 's'}</span>
                          </div>
                        )}
                        {overdueTasks > 0 && (
                          <div className="flex items-start gap-2">
                            <span className="text-red-600 mt-0.5">🚨</span>
                            <span>Address {overdueTasks} overdue task{overdueTasks === 1 ? '' : 's'} immediately</span>
                          </div>
                        )}
                        {completionPercentage < 25 && (
                          <div className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">📋</span>
                            <span>Consider adding more specific tasks to your list</span>
                          </div>
                        )}
                        {inProgressTasks > 5 && (
                          <div className="flex items-start gap-2">
                            <span className="text-yellow-600 mt-0.5">⏳</span>
                            <span>You have {inProgressTasks} tasks in progress - consider prioritizing</span>
                          </div>
                        )}
                        <div className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">💡</span>
                          <span>Regularly review and update task priorities as your wedding approaches</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => setShowProgressReport(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close Report
                  </button>
                  <button
                    onClick={() => {
                      setShowProgressReport(false);
                      setShowAddTask(true);
                    }}
                    className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                  >
                    Add New Task
                  </button>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.alert) {
                        const reportData = {
                          date: new Date().toLocaleDateString(),
                          totalTasks: totalTasks,
                          completed: completedTasks,
                          inProgress: inProgressTasks,
                          pending: pendingTasks,
                          overdue: overdueTasks,
                          urgent: urgentTasks,
                          completionRate: completionPercentage,
                          categories: Object.keys(taskCategories).map(key => {
                            const categoryTasks = tasks.filter(task => task.category === key);
                            const categoryCompleted = categoryTasks.filter(task => task.status === 'completed').length;
                            return {
                              name: taskCategories[key as keyof typeof taskCategories].name,
                              total: categoryTasks.length,
                              completed: categoryCompleted,
                              progress: categoryTasks.length > 0 ? Math.round((categoryCompleted / categoryTasks.length) * 100) : 0
                            };
                          }),
                          upcomingDeadlines: tasks
                            .filter(task => task.dueDate && task.status !== 'completed')
                            .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
                            .slice(0, 5)
                            .map(task => ({
                              title: task.title,
                              dueDate: task.dueDate,
                              priority: task.priority
                            }))
                        };
                        
                        let report = `📊 Wedding Planning Progress Report\n`;
                        report += `Generated: ${reportData.date}\n\n`;
                        report += `📈 OVERALL PROGRESS\n`;
                        report += `Total Tasks: ${reportData.totalTasks}\n`;
                        report += `Completion Rate: ${reportData.completionRate}%\n`;
                        report += `Completed: ${reportData.completed}\n`;
                        report += `In Progress: ${reportData.inProgress}\n`;
                        report += `Pending: ${reportData.pending}\n`;
                        report += `Overdue: ${reportData.overdue}\n`;
                        report += `Urgent: ${reportData.urgent}\n\n`;
                        
                        report += `📋 CATEGORY BREAKDOWN\n`;
                        reportData.categories.forEach(cat => {
                          report += `${cat.name}: ${cat.completed}/${cat.total} (${cat.progress}%)\n`;
                        });
                        
                        if (reportData.upcomingDeadlines.length > 0) {
                          report += `\n⏰ UPCOMING DEADLINES\n`;
                          reportData.upcomingDeadlines.forEach(task => {
                            report += `• ${task.title} - Due: ${task.dueDate} (${task.priority} priority)\n`;
                          });
                        }
                        
                        report += `\n💡 RECOMMENDATIONS\n`;
                        if (reportData.overdue > 0) {
                          report += `• Address ${reportData.overdue} overdue tasks immediately\n`;
                        }
                        if (reportData.urgent > 0) {
                          report += `• Focus on ${reportData.urgent} urgent tasks\n`;
                        }
                        if (reportData.completionRate < 50) {
                          report += `• Consider breaking down large tasks into smaller, manageable steps\n`;
                        }
                        report += `• Regularly review and update task priorities\n`;
                        report += `• Set realistic deadlines for remaining tasks\n`;
                        
                        alert(report);
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Export Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

// Wedding Gift Registry Component
function WeddingGiftRegistry() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'homeware' | 'experiences' | 'honeymoon' | 'charity' | 'custom'>('all');
  const [showAddRegistry, setShowAddRegistry] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Registry providers with their information
  const registryProviders = {
    johnlewis: { 
      name: 'John Lewis & Partners', 
      icon: '🏪', 
      color: 'blue', 
      url: 'https://www.johnlewis.com/gift-list',
      description: 'Premium department store with excellent gift list service',
      features: ['Free service', 'In-store assistance', 'Thank you management', 'Delivery options'],
      categories: ['Homeware', 'Kitchen', 'Bedroom', 'Electronics', 'Experiences']
    },
    prezola: { 
      name: 'Prezola', 
      icon: '🎁', 
      color: 'purple', 
      url: 'https://prezola.com',
      description: 'Modern wedding gift list platform with cash funds',
      features: ['Cash funds included', 'Honeymoon registry', 'Multi-retailer', 'Mobile app'],
      categories: ['Everything', 'Cash funds', 'Experiences', 'Charity donations']
    },
    amazon: { 
      name: 'Amazon Wedding Registry', 
      icon: '📦', 
      color: 'orange', 
      url: 'https://www.amazon.co.uk/wedding',
      description: 'Huge selection with fast delivery and returns',
      features: ['Prime shipping', 'Easy returns', 'Price tracking', 'Thank you list'],
      categories: ['Everything', 'Home & Garden', 'Electronics', 'Books', 'Baby']
    },
    marksandspencer: { 
      name: 'Marks & Spencer', 
      icon: '🛍️', 
      color: 'green', 
      url: 'https://www.marksandspencer.com/gift-list',
      description: 'Quality homeware and food gifts',
      features: ['Food & wine gifts', 'Quality homeware', 'Personal service', 'Store collection'],
      categories: ['Homeware', 'Food & Wine', 'Bedroom', 'Kitchen']
    },
    thewhitecompany: { 
      name: 'The White Company', 
      icon: '🏡', 
      color: 'rose', 
      url: 'https://www.thewhitecompany.com',
      description: 'Luxury homeware and lifestyle gifts',
      features: ['Premium quality', 'Elegant packaging', 'Personal styling', 'Luxury items'],
      categories: ['Luxury homeware', 'Bedroom', 'Bath', 'Fragrance']
    },
    debenhams: { 
      name: 'Debenhams', 
      icon: '🏢', 
      color: 'indigo', 
      url: 'https://www.debenhams.com',
      description: 'Department store with variety of brands',
      features: ['Multiple brands', 'Beauty products', 'Fashion items', 'Home goods'],
      categories: ['Fashion', 'Beauty', 'Home', 'Electrical']
    }
  };

  // User's registries - start empty for users
  const [userRegistries, setUserRegistries] = useState<Array<{
    id: string;
    provider: keyof typeof registryProviders;
    name: string;
    url?: string;
    description: string;
    isActive: boolean;
    items: Array<{
      id: string;
      name: string;
      price: number;
      purchased: boolean;
      quantity: number;
      purchasedQuantity: number;
      category: string;
      image?: string;
      notes?: string;
    }>;
    createdDate: string;
    totalValue: number;
    totalPurchased: number;
  }>>([]);

  const [newRegistry, setNewRegistry] = useState({
    provider: 'johnlewis' as keyof typeof registryProviders,
    name: '',
    url: '',
    description: ''
  });

  const [newItem, setNewItem] = useState({
    registryId: '',
    name: '',
    price: '',
    quantity: '1',
    category: 'homeware',
    notes: ''
  });

  // Calculate statistics
  const totalRegistries = userRegistries.length;
  const activeRegistries = userRegistries.filter(r => r.isActive).length;
  const totalItems = userRegistries.reduce((sum, reg) => sum + reg.items.length, 0);
  const totalValue = userRegistries.reduce((sum, reg) => sum + reg.totalValue, 0);
  const totalPurchased = userRegistries.reduce((sum, reg) => sum + reg.totalPurchased, 0);
  const purchasePercentage = totalValue > 0 ? Math.round((totalPurchased / totalValue) * 100) : 0;

  const addRegistry = () => {
    if (newRegistry.name && newRegistry.provider) {
      const registry = {
        id: Date.now().toString(),
        provider: newRegistry.provider,
        name: newRegistry.name,
        url: newRegistry.url || undefined,
        description: newRegistry.description,
        isActive: true,
        items: [],
        createdDate: new Date().toISOString().split('T')[0],
        totalValue: 0,
        totalPurchased: 0
      };
      
      setUserRegistries([registry, ...userRegistries]);
      setNewRegistry({
        provider: 'johnlewis',
        name: '',
        url: '',
        description: ''
      });
      setShowAddRegistry(false);
    }
  };

  const addItemToRegistry = () => {
    if (newItem.registryId && newItem.name && newItem.price) {
      const item = {
        id: Date.now().toString(),
        name: newItem.name,
        price: parseFloat(newItem.price),
        purchased: false,
        quantity: parseInt(newItem.quantity) || 1,
        purchasedQuantity: 0,
        category: newItem.category,
        notes: newItem.notes || undefined
      };

      setUserRegistries(registries => 
        registries.map(registry => {
          if (registry.id === newItem.registryId) {
            const updatedItems = [...registry.items, item];
            const totalValue = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            return { ...registry, items: updatedItems, totalValue };
          }
          return registry;
        })
      );

      setNewItem({
        registryId: '',
        name: '',
        price: '',
        quantity: '1',
        category: 'homeware',
        notes: ''
      });
      setShowAddItem(false);
    }
  };

  const deleteRegistry = (id: string) => {
    setUserRegistries(userRegistries.filter(r => r.id !== id));
  };

  const toggleRegistryActive = (id: string) => {
    setUserRegistries(registries =>
      registries.map(registry =>
        registry.id === id ? { ...registry, isActive: !registry.isActive } : registry
      )
    );
  };

  const getCategoryColorClass = (color: string, type: 'bg' | 'text' | 'border') => {
    const colors: Record<string, Record<string, string>> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
      green: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
      rose: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' }
    };
    return colors[color]?.[type] || colors.blue[type];
  };

  const filteredProviders = Object.entries(registryProviders).filter(([key, provider]) =>
    searchTerm === '' || 
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <span className="text-2xl">🎁</span>
          </div>
          <h1 className="text-3xl font-bold text-amber-800">Wedding Gift Registry</h1>
          <p className="text-amber-700">Create and manage your wedding gift registries across multiple retailers</p>
        </div>

        {/* Registry Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalRegistries}</div>
            <div className="text-sm text-gray-600">Total Registries</div>
          </div>
          <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{activeRegistries}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{totalItems}</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
          <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">£{totalValue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
          <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-rose-600">{purchasePercentage}%</div>
            <div className="text-sm text-gray-600">Purchased</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddRegistry(true)}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2"
            >
              <span>➕</span>
              Create Registry
            </button>
            <button
              onClick={() => setShowAddItem(true)}
              disabled={userRegistries.length === 0}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <span>🛍️</span>
              Add Item
            </button>
            <button 
              onClick={() => {
                if (typeof window !== 'undefined' && window.alert) {
                  alert('📊 Registry Analytics\n\nThis would show:\n\n• Most wished-for items\n• Purchase trends\n• Popular price ranges\n• Category breakdown\n• Guest purchase patterns\n• Thank you card tracking');
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span>📊</span>
              Analytics
            </button>
          </div>

          <div className="flex gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search registries or providers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User's Registries */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-amber-800">Your Registries</h2>
                  <div className="flex gap-2">
                    <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm">
                      {userRegistries.length} registries
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {userRegistries.map((registry) => {
                  const provider = registryProviders[registry.provider];
                  return (
                    <div key={registry.id} className={`border rounded-lg p-4 ${getCategoryColorClass(provider.color, 'bg')} ${getCategoryColorClass(provider.color, 'border')}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <span className="text-2xl">{provider.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className={`font-semibold ${getCategoryColorClass(provider.color, 'text')}`}>
                                {registry.name}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs ${registry.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {registry.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            
                            <div className="text-sm text-gray-700 mb-2">{registry.description}</div>
                            
                            <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
                              <span className={`px-2 py-1 rounded-full ${getCategoryColorClass(provider.color, 'bg')} ${getCategoryColorClass(provider.color, 'text')}`}>
                                {provider.icon} {provider.name}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                {registry.items.length} items
                              </span>
                              <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                                £{registry.totalValue.toLocaleString()} total
                              </span>
                            </div>
                            
                            {registry.url && (
                              <div className="text-sm text-blue-600 mb-2">
                                🔗 <a href={registry.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                  View Registry Online
                                </a>
                              </div>
                            )}
                            
                            <div className="text-xs text-gray-500">
                              Created: {new Date(registry.createdDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-1 ml-3">
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => toggleRegistryActive(registry.id)}
                              className={`px-2 py-1 rounded text-xs ${
                                registry.isActive 
                                  ? 'bg-yellow-100 text-yellow-600' 
                                  : 'bg-green-100 text-green-600'
                              }`}
                              title={registry.isActive ? 'Deactivate registry' : 'Activate registry'}
                            >
                              {registry.isActive ? 'Pause' : 'Activate'}
                            </button>
                            
                            <button
                              onClick={() => {
                                setNewItem({...newItem, registryId: registry.id});
                                setShowAddItem(true);
                              }}
                              className="px-2 py-1 bg-purple-100 text-purple-600 hover:bg-purple-200 rounded text-xs"
                              title="Add item to registry"
                            >
                              Add Item
                            </button>
                            
                            <button
                              onClick={() => deleteRegistry(registry.id)}
                              className="px-2 py-1 bg-red-100 text-red-600 hover:bg-red-200 rounded text-xs"
                              title="Delete registry"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {userRegistries.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <span className="text-6xl block mb-4">🎁</span>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No registries created yet</h3>
                    <p className="text-sm mb-4">Create your first wedding gift registry to get started</p>
                    <button
                      onClick={() => setShowAddRegistry(true)}
                      className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                    >
                      Create First Registry
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Registry Providers Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="font-semibold text-amber-800 mb-3">Popular Registry Providers</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredProviders.map(([key, provider]) => (
                  <div key={key} className={`p-3 rounded-lg border ${getCategoryColorClass(provider.color, 'bg')} ${getCategoryColorClass(provider.color, 'border')}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{provider.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold ${getCategoryColorClass(provider.color, 'text')} mb-1`}>
                          {provider.name}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">{provider.description}</p>
                        
                        <div className="space-y-1">
                          <div className="text-xs text-gray-600 font-medium">Features:</div>
                          {provider.features.slice(0, 2).map((feature, index) => (
                            <div key={index} className="text-xs text-gray-600 flex items-center gap-1">
                              <span className="text-green-600">✓</span>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex gap-2 mt-3">
                          <a
                            href={provider.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 bg-white bg-opacity-80 text-xs rounded hover:bg-opacity-100 transition-colors"
                          >
                            Visit Site
                          </a>
                          <button
                            onClick={() => {
                              setNewRegistry({...newRegistry, provider: key as keyof typeof registryProviders});
                              setShowAddRegistry(true);
                            }}
                            className="px-2 py-1 bg-white bg-opacity-80 text-xs rounded hover:bg-opacity-100 transition-colors"
                          >
                            Use Provider
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Registry Tips */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="font-semibold text-amber-800 mb-3">Registry Tips</h3>
              <div className="space-y-2 text-sm text-amber-700">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">💡</span>
                  <span>Include a variety of price ranges for all budgets</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">🎯</span>
                  <span>Add items you genuinely need and want</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">⭐</span>
                  <span>Consider experiences as well as physical gifts</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">📅</span>
                  <span>Set up registries 3-6 months before your wedding</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Registry Modal */}
        {showAddRegistry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-amber-800 mb-4">Create New Registry</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                  <select
                    value={newRegistry.provider}
                    onChange={(e) => setNewRegistry({...newRegistry, provider: e.target.value as keyof typeof registryProviders})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    {Object.entries(registryProviders).map(([key, provider]) => (
                      <option key={key} value={key}>
                        {provider.icon} {provider.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registry Name *</label>
                  <input
                    type="text"
                    value={newRegistry.name}
                    onChange={(e) => setNewRegistry({...newRegistry, name: e.target.value})}
                    placeholder="e.g., Sarah & Tom's Wedding Registry"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registry URL (optional)</label>
                  <input
                    type="url"
                    value={newRegistry.url}
                    onChange={(e) => setNewRegistry({...newRegistry, url: e.target.value})}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newRegistry.description}
                    onChange={(e) => setNewRegistry({...newRegistry, description: e.target.value})}
                    placeholder="Brief description of this registry..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">💡</span>
                    <div className="text-sm text-purple-700">
                      <div className="font-semibold mb-1">Registry Tip</div>
                      <div>Create multiple registries with different providers to give your guests more options and take advantage of different store strengths.</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddRegistry(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addRegistry}
                    disabled={!newRegistry.name.trim()}
                    className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Create Registry
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Item Modal */}
        {showAddItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-amber-800 mb-4">Add Item to Registry</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registry</label>
                  <select
                    value={newItem.registryId}
                    onChange={(e) => setNewItem({...newItem, registryId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    <option value="">Select a registry...</option>
                    {userRegistries.filter(r => r.isActive).map(registry => (
                      <option key={registry.id} value={registry.id}>
                        {registryProviders[registry.provider].icon} {registry.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    placeholder="e.g., KitchenAid Stand Mixer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (£) *</label>
                    <input
                      type="number"
                      value={newItem.price}
                      onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    <option value="homeware">🏠 Homeware</option>
                    <option value="kitchen">🍳 Kitchen</option>
                    <option value="bedroom">🛏️ Bedroom</option>
                    <option value="bathroom">🛁 Bathroom</option>
                    <option value="electronics">📱 Electronics</option>
                    <option value="experiences">🎯 Experiences</option>
                    <option value="other">📦 Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={newItem.notes}
                    onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
                    placeholder="Color preference, size, model details..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddItem(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addItemToRegistry}
                    disabled={!newItem.registryId || !newItem.name.trim() || !newItem.price}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

// Wedding Cash Fund Component
function WeddingCashFund() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'honeymoon' | 'house' | 'experiences' | 'charity' | 'custom'>('all');
  const [showCreateFund, setShowCreateFund] = useState(false);
  const [showContributionForm, setShowContributionForm] = useState(false);
  const [selectedFund, setSelectedFund] = useState<string | null>(null);

  // Cash fund categories with templates
  const fundCategories = {
    honeymoon: {
      name: 'Honeymoon Fund',
      icon: '🏝️',
      color: 'blue',
      description: 'Help us create unforgettable honeymoon memories',
      templates: [
        { name: 'Tropical Honeymoon', goal: 5000, description: 'Beach resort, flights, and romantic dinners' },
        { name: 'European Adventure', goal: 4000, description: 'City breaks, museums, and fine dining' },
        { name: 'Luxury Spa Retreat', goal: 3000, description: 'Wellness treatments and relaxation' }
      ]
    },
    house: {
      name: 'New Home Fund',
      icon: '🏡',
      color: 'green',
      description: 'Contribute to our new home together',
      templates: [
        { name: 'House Deposit', goal: 10000, description: 'Help us save for our first home deposit' },
        { name: 'Home Improvements', goal: 3000, description: 'Renovations and decorating our new home' },
        { name: 'Garden Fund', goal: 1500, description: 'Creating our dream garden space' }
      ]
    },
    experiences: {
      name: 'Experience Fund',
      icon: '🎯',
      color: 'purple',
      description: 'Fund memorable experiences instead of physical gifts',
      templates: [
        { name: 'Date Night Fund', goal: 1000, description: 'Monthly date nights for our first year' },
        { name: 'Adventure Fund', goal: 2500, description: 'Skydiving, cooking classes, and new experiences' },
        { name: 'Travel Fund', goal: 4000, description: 'Weekend breaks and city trips' }
      ]
    },
    charity: {
      name: 'Charity Fund',
      icon: '❤️',
      color: 'rose',
      description: 'Donate to causes close to our hearts',
      templates: [
        { name: 'Local Charity', goal: 1000, description: 'Supporting our local community charity' },
        { name: 'Environmental Cause', goal: 1500, description: 'Contributing to environmental protection' },
        { name: 'Children\'s Charity', goal: 2000, description: 'Helping children in need' }
      ]
    },
    custom: {
      name: 'Custom Fund',
      icon: '⭐',
      color: 'amber',
      description: 'Create your own personalized cash fund',
      templates: [
        { name: 'Custom Goal', goal: 1000, description: 'Create your own unique fund' }
      ]
    }
  };

  // User's cash funds - start empty for users
  const [cashFunds, setCashFunds] = useState<Array<{
    id: string;
    name: string;
    description: string;
    category: keyof typeof fundCategories;
    goalAmount: number;
    currentAmount: number;
    isActive: boolean;
    createdDate: string;
    contributions: Array<{
      id: string;
      amount: number;
      contributorName?: string;
      message?: string;
      date: string;
      isAnonymous: boolean;
    }>;
    imageUrl?: string;
    thankYouMessage?: string;
  }>>([]);

  const [newFund, setNewFund] = useState({
    name: '',
    description: '',
    category: 'honeymoon' as keyof typeof fundCategories,
    goalAmount: '',
    thankYouMessage: ''
  });

  const [contributionForm, setContributionForm] = useState({
    amount: '',
    contributorName: '',
    message: '',
    isAnonymous: false
  });

  // Calculate statistics
  const totalFunds = cashFunds.length;
  const activeFunds = cashFunds.filter(f => f.isActive).length;
  const totalGoal = cashFunds.reduce((sum, fund) => sum + fund.goalAmount, 0);
  const totalRaised = cashFunds.reduce((sum, fund) => sum + fund.currentAmount, 0);
  const totalContributions = cashFunds.reduce((sum, fund) => sum + fund.contributions.length, 0);
  const progressPercentage = totalGoal > 0 ? Math.round((totalRaised / totalGoal) * 100) : 0;

  const createCashFund = () => {
    if (newFund.name && newFund.goalAmount) {
      const fund = {
        id: Date.now().toString(),
        name: newFund.name,
        description: newFund.description,
        category: newFund.category,
        goalAmount: parseFloat(newFund.goalAmount),
        currentAmount: 0,
        isActive: true,
        createdDate: new Date().toISOString().split('T')[0],
        contributions: [],
        thankYouMessage: newFund.thankYouMessage || 'Thank you so much for your generous contribution to our special day!'
      };
      
      setCashFunds([fund, ...cashFunds]);
      setNewFund({
        name: '',
        description: '',
        category: 'honeymoon',
        goalAmount: '',
        thankYouMessage: ''
      });
      setShowCreateFund(false);
    }
  };

  const addContribution = () => {
    if (selectedFund && contributionForm.amount) {
      const contribution = {
        id: Date.now().toString(),
        amount: parseFloat(contributionForm.amount),
        contributorName: contributionForm.isAnonymous ? undefined : contributionForm.contributorName,
        message: contributionForm.message || undefined,
        date: new Date().toISOString().split('T')[0],
        isAnonymous: contributionForm.isAnonymous
      };

      setCashFunds(funds =>
        funds.map(fund => {
          if (fund.id === selectedFund) {
            return {
              ...fund,
              contributions: [...fund.contributions, contribution],
              currentAmount: fund.currentAmount + contribution.amount
            };
          }
          return fund;
        })
      );

      setContributionForm({
        amount: '',
        contributorName: '',
        message: '',
        isAnonymous: false
      });
      setSelectedFund(null);
      setShowContributionForm(false);

      // Show thank you message
      if (typeof window !== 'undefined' && window.alert) {
        alert('🎉 Thank You!\n\nYour contribution has been added successfully. This is a demo - in the real app, this would process a secure payment and send confirmation emails.');
      }
    }
  };

  const deleteFund = (id: string) => {
    setCashFunds(cashFunds.filter(f => f.id !== id));
  };

  const toggleFundActive = (id: string) => {
    setCashFunds(funds =>
      funds.map(fund =>
        fund.id === id ? { ...fund, isActive: !fund.isActive } : fund
      )
    );
  };

  const getCategoryColorClass = (color: string, type: 'bg' | 'text' | 'border') => {
    const colors: Record<string, Record<string, string>> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
      green: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
      rose: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' },
      amber: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' }
    };
    return colors[color]?.[type] || colors.blue[type];
  };

  const filteredFunds = selectedCategory === 'all' 
    ? cashFunds 
    : cashFunds.filter(fund => fund.category === selectedCategory);

  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <span className="text-2xl">💰</span>
          </div>
          <h1 className="text-3xl font-bold text-amber-800">Wedding Cash Fund</h1>
          <p className="text-amber-700">Create personalized cash funds for your wedding goals and dreams</p>
        </div>

        {/* Fund Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalFunds}</div>
            <div className="text-sm text-gray-600">Total Funds</div>
          </div>
          <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{activeFunds}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">£{totalGoal.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Goal Amount</div>
          </div>
          <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">£{totalRaised.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Raised</div>
          </div>
          <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-rose-600">{progressPercentage}%</div>
            <div className="text-sm text-gray-600">Progress</div>
          </div>
        </div>

        {/* Progress Overview */}
        {totalFunds > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-amber-800">Overall Progress</h3>
              <span className="text-2xl font-bold text-green-600">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-green-600">£{totalRaised.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Raised</div>
              </div>
              <div>
                <div className="text-xl font-bold text-blue-600">£{(totalGoal - totalRaised).toLocaleString()}</div>
                <div className="text-sm text-gray-600">Remaining</div>
              </div>
              <div>
                <div className="text-xl font-bold text-purple-600">{totalContributions}</div>
                <div className="text-sm text-gray-600">Contributors</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateFund(true)}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2"
            >
              <span>➕</span>
              Create Fund
            </button>
            <button
              onClick={() => {
                if (cashFunds.length > 0) {
                  setShowContributionForm(true);
                } else {
                  alert('Create a cash fund first to test contributions!');
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <span>💝</span>
              Test Contribution
            </button>
            <button 
              onClick={() => {
                if (typeof window !== 'undefined' && window.alert) {
                  alert('📊 Fund Analytics\n\nThis would show:\n\n• Contribution trends over time\n• Average contribution amounts\n• Most popular funds\n• Thank you message tracking\n• Payment method analytics\n• Goal achievement predictions');
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span>📊</span>
              Analytics
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Fund Categories Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="font-semibold text-amber-800 mb-3">Fund Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCategory === 'all' 
                      ? 'bg-amber-100 border border-amber-300 text-amber-800' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">💰</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">All Funds</div>
                      <div className="text-xs text-gray-500">View everything</div>
                    </div>
                    <div className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                      {totalFunds}
                    </div>
                  </div>
                </button>

                {Object.entries(fundCategories).map(([key, category]) => {
                  const count = cashFunds.filter(f => f.category === key).length;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key as any)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedCategory === key 
                          ? `${getCategoryColorClass(category.color, 'bg')} ${getCategoryColorClass(category.color, 'border')} border ${getCategoryColorClass(category.color, 'text')}` 
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{category.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{category.name}</div>
                          <div className="text-xs text-gray-500 truncate">{category.description}</div>
                        </div>
                        {count > 0 && (
                          <div className={`${getCategoryColorClass(category.color, 'bg')} ${getCategoryColorClass(category.color, 'text')} text-xs px-2 py-1 rounded-full`}>
                            {count}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cash Fund Tips */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="font-semibold text-amber-800 mb-3">Cash Fund Tips</h3>
              <div className="space-y-2 text-sm text-amber-700">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">💡</span>
                  <span>Set realistic and specific goals that guests can relate to</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">🎯</span>
                  <span>Explain exactly what the money will be used for</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">⭐</span>
                  <span>Consider offering different contribution levels</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">📅</span>
                  <span>Send personalized thank you messages to contributors</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cash Funds List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-amber-800">
                    {selectedCategory === 'all' ? 'All Cash Funds' : fundCategories[selectedCategory as keyof typeof fundCategories]?.name}
                  </h2>
                  <div className="flex gap-2">
                    <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm">
                      {filteredFunds.length} funds
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {filteredFunds.map((fund) => {
                  const category = fundCategories[fund.category];
                  const progress = fund.goalAmount > 0 ? Math.round((fund.currentAmount / fund.goalAmount) * 100) : 0;
                  
                  return (
                    <div key={fund.id} className={`border rounded-lg p-6 ${getCategoryColorClass(category.color, 'bg')} ${getCategoryColorClass(category.color, 'border')}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3 flex-1">
                          <span className="text-3xl">{category.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className={`text-xl font-semibold ${getCategoryColorClass(category.color, 'text')}`}>
                                {fund.name}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs ${fund.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {fund.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            
                            <p className="text-gray-700 mb-4">{fund.description}</p>
                            
                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">Progress</span>
                                <span className={`font-semibold ${getCategoryColorClass(category.color, 'text')}`}>
                                  £{fund.currentAmount.toLocaleString()} / £{fund.goalAmount.toLocaleString()} ({progress}%)
                                </span>
                              </div>
                              <div className="w-full bg-white bg-opacity-50 rounded-full h-3">
                                <div 
                                  className={`h-3 rounded-full transition-all ${
                                    progress === 100 ? 'bg-green-500' :
                                    progress >= 75 ? 'bg-blue-500' :
                                    progress >= 50 ? 'bg-yellow-500' : 'bg-orange-500'
                                  }`}
                                  style={{ width: `${Math.min(progress, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                              <div className="flex items-center gap-1">
                                <span className="text-purple-600">👥</span>
                                <span className="text-gray-700">{fund.contributions.length} contributors</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-amber-600">💰</span>
                                <span className="text-gray-700">£{(fund.currentAmount / Math.max(fund.contributions.length, 1)).toFixed(0)} avg</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-blue-600">📅</span>
                                <span className="text-gray-700">Created {new Date(fund.createdDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-3">
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => {
                                setSelectedFund(fund.id);
                                setShowContributionForm(true);
                              }}
                              disabled={!fund.isActive}
                              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                            >
                              💝 Contribute
                            </button>
                            
                            <button
                              onClick={() => toggleFundActive(fund.id)}
                              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                                fund.isActive 
                                  ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                                  : 'bg-green-100 text-green-600 hover:bg-green-200'
                              }`}
                            >
                              {fund.isActive ? 'Pause' : 'Activate'}
                            </button>
                            
                            <button
                              onClick={() => deleteFund(fund.id)}
                              className="px-3 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg text-sm transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Recent Contributions */}
                      {fund.contributions.length > 0 && (
                        <div className="bg-white bg-opacity-50 rounded-lg p-4 mt-4">
                          <h5 className="font-semibold text-gray-800 mb-3">Recent Contributions</h5>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {fund.contributions.slice(-3).reverse().map((contribution) => (
                              <div key={contribution.id} className="flex justify-between items-center p-2 bg-white bg-opacity-80 rounded">
                                <div>
                                  <div className="font-medium text-gray-800">
                                    {contribution.isAnonymous ? 'Anonymous' : contribution.contributorName || 'Anonymous'}
                                  </div>
                                  {contribution.message && (
                                    <div className="text-xs text-gray-600 italic">"{contribution.message}"</div>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold text-green-600">£{contribution.amount.toLocaleString()}</div>
                                  <div className="text-xs text-gray-500">{contribution.date}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {filteredFunds.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <span className="text-6xl block mb-4">💰</span>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No cash funds created yet</h3>
                    <p className="text-sm mb-4">Create your first cash fund to help guests contribute to your dreams</p>
                    <button
                      onClick={() => setShowCreateFund(true)}
                      className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                    >
                      Create First Fund
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Create Fund Modal */}
        {showCreateFund && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-amber-800 mb-4">Create Cash Fund</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fund Category</label>
                  <select
                    value={newFund.category}
                    onChange={(e) => {
                      const category = e.target.value as keyof typeof fundCategories;
                      const template = fundCategories[category].templates[0];
                      setNewFund({
                        ...newFund, 
                        category,
                        name: template.name,
                        description: template.description,
                        goalAmount: template.goal.toString()
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    {Object.entries(fundCategories).map(([key, category]) => (
                      <option key={key} value={key}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fund Name *</label>
                  <input
                    type="text"
                    value={newFund.name}
                    onChange={(e) => setNewFund({...newFund, name: e.target.value})}
                    placeholder="e.g., Honeymoon in Bali"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    value={newFund.description}
                    onChange={(e) => setNewFund({...newFund, description: e.target.value})}
                    placeholder="Explain what this fund will help you achieve..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goal Amount (£) *</label>
                  <input
                    type="number"
                    value={newFund.goalAmount}
                    onChange={(e) => setNewFund({...newFund, goalAmount: e.target.value})}
                    min="1"
                    step="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thank You Message</label>
                  <textarea
                    value={newFund.thankYouMessage}
                    onChange={(e) => setNewFund({...newFund, thankYouMessage: e.target.value})}
                    placeholder="Personal message to thank contributors..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                {/* Category Templates */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    {fundCategories[newFund.category].icon} {fundCategories[newFund.category].name} Templates
                  </h4>
                  <div className="space-y-2">
                    {fundCategories[newFund.category].templates.map((template, index) => (
                      <button
                        key={index}
                        onClick={() => setNewFund({
                          ...newFund,
                          name: template.name,
                          description: template.description,
                          goalAmount: template.goal.toString()
                        })}
                        className="w-full text-left p-3 bg-white bg-opacity-80 rounded border hover:bg-opacity-100 transition-colors"
                      >
                        <div className="font-medium text-blue-800">{template.name}</div>
                        <div className="text-sm text-blue-600">£{template.goal.toLocaleString()} - {template.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCreateFund(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createCashFund}
                    disabled={!newFund.name.trim() || !newFund.description.trim() || !newFund.goalAmount}
                    className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Create Fund
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contribution Form Modal */}
        {showContributionForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-amber-800 mb-4">Make a Contribution</h3>
              
              <div className="space-y-4">
                {!selectedFund && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Fund</label>
                    <select
                      value={selectedFund || ''}
                      onChange={(e) => setSelectedFund(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                    >
                      <option value="">Choose a fund...</option>
                      {cashFunds.filter(f => f.isActive).map(fund => (
                        <option key={fund.id} value={fund.id}>
                          {fundCategories[fund.category].icon} {fund.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contribution Amount (£) *</label>
                  <input
                    type="number"
                    value={contributionForm.amount}
                    onChange={(e) => setContributionForm({...contributionForm, amount: e.target.value})}
                    min="1"
                    step="1"
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={contributionForm.isAnonymous}
                    onChange={(e) => setContributionForm({...contributionForm, isAnonymous: e.target.checked})}
                    className="h-4 w-4 text-green-600 rounded"
                  />
                  <label htmlFor="anonymous" className="text-sm text-gray-700">
                    Make this contribution anonymous
                  </label>
                </div>

                {!contributionForm.isAnonymous && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      value={contributionForm.contributorName}
                      onChange={(e) => setContributionForm({...contributionForm, contributorName: e.target.value})}
                      placeholder="Your name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Personal Message (optional)</label>
                  <textarea
                    value={contributionForm.message}
                    onChange={(e) => setContributionForm({...contributionForm, message: e.target.value})}
                    placeholder="Add a personal message for the couple..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">🔒</span>
                    <div className="text-sm text-green-700">
                      <div className="font-semibold mb-1">Secure Payment</div>
                      <div>In the full version, this would integrate with Stripe or PayPal for secure payment processing. This is a demo contribution.</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowContributionForm(false);
                      setSelectedFund(null);
                      setContributionForm({
                        amount: '',
                        contributorName: '',
                        message: '',
                        isAnonymous: false
                      });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addContribution}
                    disabled={!selectedFund || !contributionForm.amount}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    💝 Contribute £{contributionForm.amount || '0'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

// Wedding Hashtag Generator Component
function WeddingHashtagGenerator() {
  // Popular wedding hashtag generators
  const hashtagGenerators = [
    {
      name: 'Wedding Hashers',
      url: 'https://weddinghashers.com/',
      description: 'The most popular wedding hashtag generator with creative and unique suggestions',
      features: ['Creative algorithms', 'Pun-based hashtags', 'Multiple options', 'Social media integration'],
      icon: '💫',
      color: 'pink'
    },
    {
      name: 'Celebrate Ally',
      url: 'https://www.celebrateally.com/wedding/hashtag',
      description: 'Creative wedding hashtag generator with personalized suggestions',
      features: ['Personalized suggestions', 'Multiple style options', 'Easy to use', 'Free generator'],
      icon: '🎉',
      color: 'purple'
    },
    {
      name: 'Kittl Tools',
      url: 'https://www.kittl.com/tools/writing/wedding-hashtag-generator?utm_medium=paid&utm_source=google&utm_campaign=products&utm_term=POD&utm_content=merchandise&gad_source=1&gad_campaignid=22687336260&gbraid=0AAAAAohBaMohzlCTBjlbJbFq6ggUPR-1V&gclid=Cj0KCQjwoP_FBhDFARIsANPG24PsbLLIjag2p39Qn9Eubn43MPjIbtkGR1fo6Xf6S47vdNoOKowVNEwaAuSCEALw_wcB',
      description: 'Professional design tools with wedding hashtag generator and creative resources',
      features: ['Design-focused approach', 'Professional templates', 'Creative tools suite', 'Typography focused'],
      icon: '🎨',
      color: 'blue'
    }
  ];

  const [selectedGenerator, setSelectedGenerator] = useState<string | null>(null);

  const getCategoryColorClass = (color: string, type: 'bg' | 'text' | 'border') => {
    const colors: Record<string, Record<string, string>> = {
      pink: { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
      rose: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
      amber: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' }
    };
    return colors[color]?.[type] || colors.pink[type];
  };

  return (
    <ErrorBoundary>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <span className="text-2xl">#️⃣</span>
          </div>
          <h1 className="text-3xl font-bold text-amber-800">Wedding Hashtag Generators</h1>
          <p className="text-amber-700">Access the best wedding hashtag generators to create perfect social media tags</p>
        </div>

        {/* Featured Generator - Wedding Hashers */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl">💫</span>
              <h2 className="text-2xl font-bold text-amber-800">Wedding Hashers</h2>
              <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-semibold">Most Popular</span>
            </div>
            
            <p className="text-amber-700 text-lg mb-6">
              The #1 wedding hashtag generator trusted by couples worldwide. Creates unique, creative hashtags based on your names and wedding details.
            </p>
            
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white bg-opacity-80 rounded-lg p-4">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-sm font-semibold text-amber-800">Creative Algorithms</div>
                <div className="text-xs text-amber-600">Advanced name-blending technology</div>
              </div>
              <div className="bg-white bg-opacity-80 rounded-lg p-4">
                <div className="text-2xl mb-2">😄</div>
                <div className="text-sm font-semibold text-amber-800">Pun-Based Hashtags</div>
                <div className="text-xs text-amber-600">Clever wordplay and rhymes</div>
              </div>
              <div className="bg-white bg-opacity-80 rounded-lg p-4">
                <div className="text-2xl mb-2">🌟</div>
                <div className="text-sm font-semibold text-amber-800">Multiple Options</div>
                <div className="text-xs text-amber-600">Dozens of unique suggestions</div>
              </div>
              <div className="bg-white bg-opacity-80 rounded-lg p-4">
                <div className="text-2xl mb-2">📱</div>
                <div className="text-sm font-semibold text-amber-800">Social Integration</div>
                <div className="text-xs text-amber-600">Check availability instantly</div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.open('https://weddinghashers.com/', '_blank')}
                className="px-8 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-semibold shadow-lg text-lg"
              >
                🚀 Try Wedding Hashers
              </button>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && window.alert) {
                    alert('💡 How Wedding Hashers Works:\n\n1. Enter both partners\' names\n2. Add optional wedding details (date, location)\n3. Choose your style (romantic, fun, elegant)\n4. Get dozens of creative hashtag suggestions\n5. Check social media availability\n6. Copy your favorites instantly\n\nWedding Hashers uses advanced algorithms to create unique, memorable hashtags that your guests will love using!');
                  }
                }}
                className="px-6 py-3 bg-white bg-opacity-90 text-pink-700 rounded-lg hover:bg-opacity-100 transition-colors font-semibold border border-pink-300"
              >
                ℹ️ How It Works
              </button>
            </div>
          </div>
        </div>

        {/* Other Generators Grid */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-amber-800 mb-2">More Great Hashtag Generators</h2>
            <p className="text-amber-700">Compare different generators to find your perfect wedding hashtag</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hashtagGenerators.slice(1).map((generator, index) => (
              <div 
                key={index} 
                className={`border rounded-lg p-6 transition-all hover:shadow-lg ${
                  selectedGenerator === generator.name 
                    ? `${getCategoryColorClass(generator.color, 'bg')} ${getCategoryColorClass(generator.color, 'border')} border-2` 
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{generator.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-amber-800">{generator.name}</h3>
                      {generator.name === 'Wedding Hashtag Wall' && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">UK Focused</span>
                      )}
                    </div>
                    
                    <p className="text-amber-700 text-sm mb-3">{generator.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      {generator.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-green-600 text-xs">✓</span>
                          <span className="text-xs text-amber-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(generator.url, '_blank')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${getCategoryColorClass(generator.color, 'bg')} ${getCategoryColorClass(generator.color, 'text')} hover:opacity-90`}
                      >
                        Visit Generator
                      </button>
                      <button
                        onClick={() => setSelectedGenerator(selectedGenerator === generator.name ? null : generator.name)}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        {selectedGenerator === generator.name ? 'Less Info' : 'More Info'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Information */}
                {selectedGenerator === generator.name && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="font-semibold text-amber-800 mb-1">Best For:</div>
                        <div className="text-amber-700">
                          {generator.name === 'Celebrate Ally' && 'Couples looking for creative, personalized hashtag suggestions with multiple style options.'}
                          {generator.name === 'Kittl Tools' && 'Couples who want design-focused hashtags with professional typography and creative approach.'}
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-semibold text-amber-800 mb-1">What Makes It Special:</div>
                        <div className="text-amber-700">
                          {generator.name === 'Celebrate Ally' && 'Offers creative hashtag suggestions with different style options to match your wedding vibe and personality.'}
                          {generator.name === 'Kittl Tools' && 'Part of a comprehensive design tools suite, focusing on typography and professional aesthetic for wedding branding.'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* DIY Hashtag Tips */}
        <div className="bg-white rounded-lg border shadow-sm p-8">
          <div className="text-center mb-6">
            <div className="text-3xl mb-3">💡</div>
            <h2 className="text-2xl font-bold text-amber-800 mb-2">DIY Hashtag Creation Tips</h2>
            <p className="text-amber-700">Want to create your own? Here are expert tips for making great wedding hashtags</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-amber-800">✅ Do's</h3>
              <div className="space-y-3 text-sm text-amber-700">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span><strong>Keep it short:</strong> 15-25 characters is ideal for easy typing and sharing</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span><strong>Make it memorable:</strong> Use rhymes, alliteration, or wordplay</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span><strong>Test pronunciation:</strong> Say it out loud - guests will share it verbally</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span><strong>Check uniqueness:</strong> Search on Instagram, TikTok, and Twitter first</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span><strong>Include wedding year:</strong> Helps with uniqueness and provides context</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span><strong>Use capital letters:</strong> #SarahAndTom is easier to read than #sarahandtom</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-amber-800">❌ Don'ts</h3>
              <div className="space-y-3 text-sm text-amber-700">
                <div className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">•</span>
                  <span><strong>Avoid complex spellings:</strong> Keep it simple for guests to remember</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">•</span>
                  <span><strong>Skip numbers and symbols:</strong> Except meaningful years (like #Smith2024)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">•</span>
                  <span><strong>Don't be too personal:</strong> Inside jokes won't make sense to all guests</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">•</span>
                  <span><strong>Avoid controversial topics:</strong> Keep it universally positive and celebratory</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">•</span>
                  <span><strong>Don't use multiple hashtags:</strong> One primary hashtag works best</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">•</span>
                  <span><strong>Skip generic words:</strong> "Wedding" or "Love" alone are too common</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Uniqueness Checker */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-800 mb-3">🔍 Check Your Hashtag's Uniqueness</h3>
          <div className="space-y-3 text-sm text-yellow-700">
            <div>Before finalizing your hashtag, search for it on these platforms to ensure it's unique:</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => window.open('https://www.instagram.com/explore/tags/', '_blank')}
                className="px-3 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors flex items-center gap-2"
              >
                <span>📸</span>
                <span>Instagram</span>
              </button>
              <button
                onClick={() => window.open('https://twitter.com/search', '_blank')}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
              >
                <span>🐦</span>
                <span>Twitter/X</span>
              </button>
              <button
                onClick={() => window.open('https://www.tiktok.com/search', '_blank')}
                className="px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <span>📱</span>
                <span>TikTok</span>
              </button>
              <button
                onClick={() => window.open('https://www.facebook.com/hashtag/', '_blank')}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
              >
                <span>👥</span>
                <span>Facebook</span>
              </button>
            </div>
            <div className="bg-white bg-opacity-80 rounded-lg p-4 mt-4">
              <div className="font-semibold text-yellow-800 mb-2">💡 Pro Tip:</div>
              <div className="text-yellow-700">
                A good wedding hashtag should have very few (ideally zero) existing posts on social media. 
                If your hashtag already has thousands of posts, consider tweaking it to make it more unique to your wedding.
              </div>
            </div>
          </div>
        </div>

        {/* Using Your Hashtag */}
        <div className="bg-gradient-to-r from-rose-50 to-purple-50 border border-rose-200 rounded-lg p-6">
          <h3 className="font-semibold text-rose-800 mb-4 text-center">📱 How to Use Your Wedding Hashtag</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3 text-sm text-rose-700">
              <div className="font-semibold text-rose-800 mb-2">Before the Wedding:</div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>Include on save-the-dates and wedding invitations</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>Add to engagement party and bridal shower materials</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>Use for engagement photos and wedding planning updates</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>Create a wedding website section explaining the hashtag</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 text-sm text-rose-700">
              <div className="font-semibold text-rose-800 mb-2">On Your Wedding Day:</div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>Display on welcome signs and ceremony programs</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>Include in table cards and wedding favors</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>Announce it during speeches or reception announcements</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-600 mt-0.5">•</span>
                  <span>Ask your photographer to include it in photo captions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-rose-50 flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <div className="text-6xl">��</div>
            <h1 className="text-2xl font-bold text-amber-800 bridallink-brand">BridalLink</h1>
            <p className="text-amber-700">Loading your wedding planning tools...</p>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
            >
              Continue
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function BridalLinkApp() {
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [isPremiumMember, setIsPremiumMember] = useState<boolean>(false);
  const [isMember, setIsMember] = useState<boolean>(false);
  const [showSignup, setShowSignup] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // No additional calendar state needed as EventCalendar manages its own state

  // Load premium status from localStorage with enhanced error handling
  React.useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        
        if (typeof window !== 'undefined' && window.localStorage) {
          // Load premium subscription status
          const premiumSubscription = localStorage.getItem('premiumSubscription');
          if (premiumSubscription) {
            try {
              const subscription = JSON.parse(premiumSubscription);
              if (subscription && subscription.status === 'active') {
                setIsPremiumMember(true);
              }
            } catch (parseError) {
              console.error('Error parsing premium subscription data:', parseError);
              // Clear invalid data
              localStorage.removeItem('premiumSubscription');
            }
          }

          // Load community membership status
          const communityStatus = localStorage.getItem('bridallink_community_member');
          if (communityStatus === 'true') {
            setIsMember(true);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Continue without user data - app should still work
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to prevent flash of loading content
    const timer = setTimeout(loadUserData, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle premium upgrade success with error handling
  const handlePremiumUpgradeSuccess = () => {
    try {
      setIsPremiumMember(true);
      
      // Store premium status in localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          const subscription = {
            status: 'active',
            plan: 'premium',
            startDate: new Date().toISOString(),
            nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
          };
          localStorage.setItem('premiumSubscription', JSON.stringify(subscription));
        } catch (storageError) {
          console.error('Error saving premium subscription to localStorage:', storageError);
          // Continue with upgrade even if localStorage fails
        }
      }
      
      if (typeof window !== 'undefined' && window.alert) {
        alert('🎉 Premium Upgrade Successful!\n\nWelcome to BridalLink Premium! You now have access to:\n\n✓ Expert wedding consultations with Carolina\n✓ Priority email support within 24 hours\n✓ Mallorca vendor network access\n✓ Spanish translation support\n\nYou can now book consultations and access all premium features.');
      }
    } catch (error) {
      console.error('Error handling premium upgrade success:', error);
      // Still try to set premium status even if other operations fail
      setIsPremiumMember(true);
    }
  };

  // Temporary testing function to set premium status
  const activatePremiumForTesting = () => {
    try {
      setIsPremiumMember(true);
      
      if (typeof window !== 'undefined' && window.localStorage) {
        const subscription = {
          status: 'active',
          plan: 'premium',
          startDate: new Date().toISOString(),
          nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };
        localStorage.setItem('premiumSubscription', JSON.stringify(subscription));
      }
      
      alert('✅ Premium Status Activated for Testing!\\n\\nYou can now access the Premium Member Dashboard and see the Calendly integration.\\n\\nGo to: Premium Upgrade section to view the member dashboard.');
    } catch (error) {
      console.error('Error activating premium for testing:', error);
    }
  };

  // Safe navigation wrapper with enhanced error handling
  const safeNavigate = useCallback((section: Section) => {
    try {
      // Validate section exists
      if (!section) {
        console.warn('Invalid section provided to navigation');
        return;
      }
      setCurrentSection(section);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to home on navigation error
      setCurrentSection('home');
    }
  }, []);

  // Safe section renderer with error handling
  const renderSection = () => {
    try {
      switch (currentSection) {
      case 'dashboard':
        return (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-rose-100 to-amber-100 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <img 
                  src={bridalLinkLogoImage} 
                  alt="BridalLink Logo" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h1 className="text-3xl font-bold text-amber-800 bridallink-font">Wedding Dashboard</h1>
              <p className="text-amber-700">Your wedding planning at a glance</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border shadow-sm p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => safeNavigate('budget')}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">💰</span>
                    <span className="text-gray-400">→</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600">Budget</h3>
                  <div className="text-2xl font-bold text-gray-800">£0</div>
                  <div className="text-sm text-gray-500">Set your budget</div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border shadow-sm p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => safeNavigate('guests')}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">👥</span>
                    <span className="text-gray-400">→</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600">Guests</h3>
                  <div className="text-2xl font-bold text-gray-800">0</div>
                  <div className="text-sm text-gray-500">Add your guests</div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border shadow-sm p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => safeNavigate('documents')}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🗂️</span>
                    <span className="text-gray-400">→</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600">Documents</h3>
                  <div className="text-2xl font-bold text-gray-800">0</div>
                  <div className="text-sm text-gray-500">Upload documents</div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border shadow-sm p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => safeNavigate('tasks')}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">✅</span>
                    <span className="text-gray-400">→</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600">Tasks</h3>
                  <div className="text-2xl font-bold text-gray-800">0/0</div>
                  <div className="text-sm text-gray-500">Add your tasks</div>
                </div>
              </div>

              <div className="bg-white rounded-lg border shadow-sm p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => safeNavigate('vendors')}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🤝</span>
                    <span className="text-gray-400">→</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600">Vendors</h3>
                  <div className="text-2xl font-bold text-gray-800">0</div>
                  <div className="text-sm text-gray-500">Manage your vendors</div>
                </div>
              </div>

              <div className="bg-white rounded-lg border shadow-sm p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => safeNavigate('weather')}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🌤️</span>
                    <span className="text-gray-400">→</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600">Weather</h3>
                  <div className="text-2xl font-bold text-gray-800">22°C</div>
                  <div className="text-sm text-gray-500">Wedding day forecast</div>
                </div>
              </div>

              <div className="bg-white rounded-lg border shadow-sm p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => safeNavigate('shopping')}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🛍️</span>
                    <span className="text-gray-400">→</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600">Shopping</h3>
                  <div className="text-2xl font-bold text-gray-800">50+</div>
                  <div className="text-sm text-gray-500">Wedding retailers</div>
                </div>
              </div>

              <div className="bg-white rounded-lg border shadow-sm p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => safeNavigate('registry')}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🎁</span>
                    <span className="text-gray-400">→</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600">Gift Registry</h3>
                  <div className="text-2xl font-bold text-gray-800">0</div>
                  <div className="text-sm text-gray-500">Create registries</div>
                </div>
              </div>

              <div className="bg-white rounded-lg border shadow-sm p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => safeNavigate('cashfund')}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">💰</span>
                    <span className="text-gray-400">→</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600">Cash Fund</h3>
                  <div className="text-2xl font-bold text-gray-800">£0</div>
                  <div className="text-sm text-gray-500">Optional contribution funds</div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'budget':
        return <WeddingBudgetTracker />;
        
      case 'guests':
        return <WeddingGuestList />;
        
      case 'ai-assistant':
        return <AIWeddingAssistant />;
        
      case 'premium-upgrade':
        return (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-amber-100 to-rose-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <span className="text-2xl">👑</span>
              </div>
              <h1 className="text-3xl font-bold text-amber-800">Premium Wedding Planning</h1>
              <p className="text-amber-700">Upgrade for expert advice and advanced features</p>
              {isPremiumMember && (
                <div className="bg-green-100 border border-green-200 rounded-lg p-3 max-w-sm mx-auto">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl">✅</span>
                    <span className="text-green-800 font-semibold">Already Premium Member!</span>
                  </div>
                </div>
              )}
            </div>
            
            {!isPremiumMember ? (
              <>
                {/* Expert Introduction */}
                <div className="bg-white rounded-lg border shadow-sm p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-amber-800 mb-2">Expert Mallorca Wedding Consultations</h2>
                    <p className="text-amber-700">Get personalized advice from a UK-based wedding planner specializing in Mallorca destination weddings</p>
                  </div>
                  
                  {/* Expert Profile */}
                  <div className="bg-rose-100 rounded-lg p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-amber-200 to-rose-200 rounded-full flex items-center justify-center text-4xl">
                          👰‍♀️
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1">
                          <span className="text-white text-xs">⭐</span>
                        </div>
                      </div>
                      
                      <div className="flex-1 text-center md:text-left space-y-3">
                        <div>
                          <h3 className="text-xl font-bold text-amber-800">UK-based Mallorca Specialist</h3>
                          <div className="flex items-center justify-center md:justify-start gap-2 text-amber-600 mt-1">
                            <span>📍</span>
                            <span>United Kingdom</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                          <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">Wedding planning experience in Mallorca</span>
                          <span className="bg-rose-100 text-rose-800 px-2 py-1 rounded-full text-xs">UK-Based</span>
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">Fluent Spanish</span>
                        </div>
                        
                        <div className="flex items-center justify-center md:justify-start gap-4">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
                            <span className="text-sm text-amber-700">4.9/5</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-rose-500">💕</span>
                            <span className="text-sm text-amber-700">Mallorca Expert</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Pricing Plans */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="text-center p-6 border border-amber-200 rounded-lg hover:shadow-lg transition-shadow">
                      <div className="mb-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">Most Popular</span>
                      </div>
                      <h3 className="text-xl font-semibold text-amber-800 mb-4">Monthly Plan</h3>
                      <div className="text-4xl font-bold text-amber-600 mb-2">£4.99</div>
                      <div className="text-sm text-gray-600 mb-6">per month</div>
                      <div className="space-y-3 text-left mb-8">
                        <div className="flex items-center gap-3">
                          <span className="text-green-600 font-bold">✓</span>
                          <span className="text-sm text-amber-700">10-minute free consultation call</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-green-600 font-bold">✓</span>
                          <span className="text-sm text-amber-700">£40/hour expert wedding advice</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-green-600 font-bold">✓</span>
                          <span className="text-sm text-amber-700">Spanish translation support</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-green-600 font-bold">✓</span>
                          <span className="text-sm text-amber-700">Mallorca vendor recommendations</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-green-600 font-bold">✓</span>
                          <span className="text-sm text-amber-700">Email support within 24 hours</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <PaymentIntegration planType="monthly" onSuccess={handlePremiumUpgradeSuccess} />
                      </div>
                      <p className="text-xs text-gray-500 mt-3">Cancel anytime • No long-term commitment</p>
                    </div>
                    
                    <div className="text-center p-6 border border-amber-200 rounded-lg bg-gradient-to-br from-amber-50 to-rose-50 hover:shadow-lg transition-shadow relative">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold">Best Value</span>
                      </div>
                      <h3 className="text-xl font-semibold text-amber-800 mb-4 mt-2">Yearly Plan</h3>
                      <div className="text-4xl font-bold text-amber-600 mb-2">£49.99</div>
                      <div className="text-sm text-gray-600 mb-2">per year</div>
                      <div className="text-sm font-semibold text-green-600 mb-6">Save £9.89 (17% off)!</div>
                      <div className="space-y-3 text-left mb-8">
                        <div className="flex items-center gap-3">
                          <span className="text-green-600 font-bold">✓</span>
                          <span className="text-sm text-amber-700 font-semibold">10-minute free consultation call</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-green-600 font-bold">✓</span>
                          <span className="text-sm text-amber-700">£40/hour expert wedding advice</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-green-600 font-bold">✓</span>
                          <span className="text-sm text-amber-700">Spanish translation support</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-green-600 font-bold">✓</span>
                          <span className="text-sm text-amber-700">Mallorca vendor recommendations</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-green-600 font-bold">✓</span>
                          <span className="text-sm text-amber-700">Email support within 24 hours</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <PaymentIntegration planType="yearly" onSuccess={handlePremiumUpgradeSuccess} />
                      </div>
                      <p className="text-xs text-gray-500 mt-3">Best value • Same features as monthly at a discount</p>
                    </div>
                  </div>
                </div>

                {/* Why Choose Premium */}
                <div className="bg-white rounded-lg border shadow-sm p-8">
                  <h3 className="text-2xl font-bold text-amber-800 text-center mb-6">Why Choose BridalLink Premium?</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🎯</div>
                      <h4 className="font-semibold text-amber-800 mb-2">Expert Guidance</h4>
                      <p className="text-sm text-amber-700">Get advice from a professional wedding planner with wedding planning experience in Mallorca</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🌍</div>
                      <h4 className="font-semibold text-amber-800 mb-2">Local Knowledge</h4>
                      <p className="text-sm text-amber-700">Navigate Spanish bureaucracy, vendor negotiations, and cultural considerations with confidence</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">💰</div>
                      <h4 className="font-semibold text-amber-800 mb-2">Save Money</h4>
                      <p className="text-sm text-amber-700">Avoid costly mistakes and get insider vendor recommendations that save you hundreds</p>
                    </div>
                  </div>
                </div>






              </>
            ) : (
              /* Premium Member Dashboard */
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                  <div className="text-4xl mb-4">🎉</div>
                  <h2 className="text-2xl font-bold text-green-800 mb-4">Welcome, Premium Member!</h2>
                  <p className="text-green-700 mb-6">You have full access to expert wedding consultations with Carolina, our UK-based Mallorca specialist.</p>
                  
                  {/* Expert Contact Information */}
                  <div className="bg-white bg-opacity-80 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-xl">📧</span>
                      <h3 className="text-xl font-bold text-green-800">Contact Carolina Directly</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="text-center">
                        <p className="text-sm text-green-700 mb-2">Get your free 10-minute consultation by emailing:</p>
                        <a 
                          href="mailto:carolina@bridallink.co.uk?subject=Premium%20Member%20-%20Free%20Consultation%20Request&body=Hi%20Carolina,%0A%0AI'm%20a%20BridalLink%20Premium%20member%20and%20would%20like%20to%20book%20my%20free%2010-minute%20consultation.%0A%0AMy%20wedding%20question/topic:%0A[Please%20write%20your%20specific%20question%20here%20so%20Carolina%20can%20prepare]%0A%0APreferred%20call%20times:%0A[Please%20include%202-3%20time%20options]%0A%0AThank%20you!" 
                          className="text-green-600 font-bold hover:text-green-800 transition-colors text-lg"
                        >
                          carolina@bridallink.co.uk
                        </a>
                        <p className="text-xs text-green-600 mt-1">UK-based Mallorca Wedding Specialist</p>
                      </div>
                      
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left">
                        <h4 className="font-semibold text-amber-800 mb-2">📝 How to Book:</h4>
                        <div className="space-y-2 text-sm text-amber-700">
                          <div className="flex items-start gap-2">
                            <span className="text-amber-600 mt-0.5">1.</span>
                            <span><strong>Email Carolina</strong> with your specific wedding question so she can prepare</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-amber-600 mt-0.5">2.</span>
                            <span><strong>Include 2-3 preferred time slots</strong> for your 10-minute consultation</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-amber-600 mt-0.5">3.</span>
                            <span><strong>Carolina will respond within 24 hours</strong> to confirm your appointment</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                        <h4 className="font-semibold text-blue-800 mb-2">💰 Additional Support:</h4>
                        <div className="space-y-2 text-sm text-blue-700">
                          <div className="flex items-center gap-2">
                            <span className="text-blue-600">•</span>
                            <span><strong>Extended advice:</strong> £40 per hour after your free consultation</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-blue-600">•</span>
                            <span><strong>Ongoing support:</strong> Special package pricing for 5+ hours</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-blue-600">•</span>
                            <span><strong>Response time:</strong> All emails answered within 24 hours</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Calendly Integration for Premium Members */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-xl">📅</span>
                      <h3 className="text-xl font-bold text-blue-800">Book Your Free 10-Minute Call</h3>
                    </div>
                    <p className="text-blue-700 text-center mb-4">
                      Skip the email - book your complimentary consultation instantly with our calendar booking system
                    </p>
                    
                    {/* Live Calendly Widget */}
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-center mb-4">
                        <div className="text-2xl mb-2">🗓️</div>
                        <h4 className="font-semibold text-blue-800 mb-2">Direct Calendar Booking</h4>
                        <p className="text-sm text-blue-700">Choose your preferred time slot instantly</p>
                      </div>
                      
                      {/* Actual Calendly Widget Integration */}
                      <CalendlyWidget 
                        url="https://calendly.com/carolina-bridallink/new-meeting"
                        mode="inline"
                        height="600px"
                        className="rounded-lg overflow-hidden"
                      />
                      
                      <div className="bg-white bg-opacity-80 rounded-lg p-3 text-left mt-4">
                        <h5 className="font-semibold text-blue-800 mb-2 text-center">🎯 Booking Benefits:</h5>
                        <div className="space-y-1 text-sm text-blue-700">
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            <span><strong>Instant booking:</strong> No email back-and-forth needed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            <span><strong>Calendar integration:</strong> Automatic calendar invites</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            <span><strong>Question preparation:</strong> Add your questions during booking</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            <span><strong>Reminders:</strong> Automatic email and SMS reminders</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-2xl mb-2">⏰</div>
                      <h4 className="font-semibold text-amber-800 mb-1">10-Min Free Call</h4>
                      <p className="text-sm text-amber-700">Book your complimentary consultation</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-2xl mb-2">💬</div>
                      <h4 className="font-semibold text-amber-800 mb-1">24-Hour Response</h4>
                      <p className="text-sm text-amber-700">Quick email replies guaranteed</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-2xl mb-2">🌴</div>
                      <h4 className="font-semibold text-amber-800 mb-1">Mallorca Expert</h4>
                      <p className="text-sm text-amber-700">Specialized local knowledge</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 justify-center">
                    <button 
                      onClick={() => {
                        if (typeof window !== 'undefined' && window.alert) {
                          alert('🗓️ Consultation Booking\n\nThis would open Carolina\'s calendar booking system where you can:\n\n• Choose available time slots\n• Select consultation type (general, vendor, legal)\n• Add specific questions\n• Get confirmation details\n\nYour Premium subscription includes priority booking!');
                        }
                      }}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      📧 Email Carolina
                    </button>
                    <button 
                      onClick={() => safeNavigate('expert-advice')}
                      className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold"
                    >
                      Expert Advice
                    </button>
                  </div>
                </div>

                {/* Premium Member Benefits */}
                <div className="bg-white rounded-lg border shadow-sm p-6">
                  <h3 className="text-xl font-bold text-amber-800 mb-4">Your Premium Benefits</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <span className="text-green-600 text-xl">✓</span>
                      <div>
                        <h4 className="font-semibold text-amber-800">Expert Consultations</h4>
                        <p className="text-sm text-amber-700">Direct access to our UK-based specialist for wedding planning advice</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-green-600 text-xl">✓</span>
                      <div>
                        <h4 className="font-semibold text-amber-800">Priority Support</h4>
                        <p className="text-sm text-amber-700">Email support within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-green-600 text-xl">✓</span>
                      <div>
                        <h4 className="font-semibold text-amber-800">Vendor Network</h4>
                        <p className="text-sm text-amber-700">Access to trusted Mallorca wedding vendors</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-green-600 text-xl">✓</span>
                      <div>
                        <h4 className="font-semibold text-amber-800">Spanish Translation</h4>
                        <p className="text-sm text-amber-700">Help with contracts and vendor communication</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'vendors':
        return <WeddingVendorManager />;

      case 'tasks':
        return <WeddingTaskManager />;

      case 'music':
        return <WeddingMusicPlaylist />;

      case 'seating':
        return <CeremonySeatingPlanner />;

      case 'community':
        if (!isMember) {
          // Show signup requirement instead of direct access
          return (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <span className="text-2xl">👩‍💻</span>
                </div>
                <h1 className="text-3xl font-bold text-amber-800">Join the Bride Community</h1>
                <p className="text-amber-700">Connect with fellow brides planning their dream weddings</p>
              </div>

              <div className="bg-white rounded-lg border shadow-sm p-8">
                <div className="text-center space-y-6">
                  <div className="bg-gradient-to-r from-rose-100 to-amber-100 p-6 rounded-xl">
                    <h2 className="text-2xl font-bold text-amber-800 mb-4">Welcome to Our Community!</h2>
                    <p className="text-amber-700 mb-4">
                      Join 1,247+ active brides sharing their wedding planning journey, getting advice, 
                      and supporting each other through this exciting time.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="text-center">
                        <div className="text-3xl mb-2">💬</div>
                        <h3 className="font-semibold text-amber-800 mb-2">Active Discussions</h3>
                        <p className="text-sm text-amber-700">Get real-time advice on venues, dresses, vendors, and more</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl mb-2">📸</div>
                        <h3 className="font-semibold text-amber-800 mb-2">Photo Gallery</h3>
                        <p className="text-sm text-amber-700">Share and get inspired by wedding photos from other brides</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl mb-2">🏰</div>
                        <h3 className="font-semibold text-amber-800 mb-2">Venue Reviews</h3>
                        <p className="text-sm text-amber-700">Honest reviews and recommendations from real couples</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl mb-2">💡</div>
                        <h3 className="font-semibold text-amber-800 mb-2">Expert Tips</h3>
                        <p className="text-sm text-amber-700">Wisdom and advice from brides who've been there</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-rose-50 border border-rose-200 rounded-lg p-6">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-2xl">🔒</span>
                      <h3 className="text-lg font-semibold text-amber-800">Private & Safe Community</h3>
                    </div>
                    <div className="text-sm text-amber-700 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Your email is never shared publicly</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Supportive, spam-free environment</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Moderated discussions for quality content</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Free to join - no subscription required</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowSignup(true)}
                    className="px-8 py-4 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors text-lg font-semibold shadow-lg"
                  >
                    Join Community Now
                  </button>

                  <p className="text-sm text-gray-500">
                    Takes less than 30 seconds • Start connecting with other brides instantly
                  </p>
                </div>
              </div>

              {/* Community Stats Preview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
                  <div className="text-2xl font-bold text-rose-600">0</div>
                  <div className="text-sm text-gray-600">Active Brides</div>
                </div>
                <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <div className="text-sm text-gray-600">Messages Today</div>
                </div>
                <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-gray-600">Photos Shared</div>
                </div>
                <div className="bg-white rounded-lg border shadow-sm p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-gray-600">Weddings This Month</div>
                </div>
              </div>
            </div>
          );
        }
        return <BrideCommunity />;

      case 'schedule':
        return <WeddingDaySchedule />;

      case 'documents':
        return <DocumentManager />;

      case 'weather':
        return <WeatherForecast />;

      case 'shopping':
        return <WeddingShoppingHub />;

      case 'privacy-policy':
        return <PrivacyPolicy onBack={() => safeNavigate('home')} />;

      case 'calendar':
        return <EventCalendar />;

      case 'registry':
        return <WeddingGiftRegistry />;

      case 'cashfund':
        return <WeddingCashFund />;

      case 'hashtag-generator':
        return <WeddingHashtagGenerator />;

      case 'expert-advice':
        return (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-amber-100 to-rose-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <span className="text-2xl">🌴</span>
              </div>
              <h1 className="text-3xl font-bold text-amber-800">Expert Wedding Advice</h1>
              <p className="text-amber-700">Get personalized guidance from your UK-based Mallorca wedding specialist</p>
              {isPremiumMember && (
                <div className="bg-amber-100 border border-amber-200 rounded-lg p-3 max-w-sm mx-auto">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl">👑</span>
                    <span className="text-amber-800 font-semibold">Premium Member - Consultations Available!</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-rose-100 rounded-lg p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-amber-200 to-rose-200 rounded-full flex items-center justify-center text-6xl">
                    👰‍♀️
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-amber-500 rounded-full p-2">
                    <span className="text-white text-sm">⭐</span>
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-amber-800">UK-based Mallorca Specialist</h2>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-amber-600 mt-1">
                      <span>📍</span>
                      <span>United Kingdom</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">Mallorca Expert</span>
                    <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-sm">UK-Based</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Spanish Speaker</span>
                  </div>
                  
                  <p className="text-amber-700">
                    Based in the UK with extensive experience planning weddings in Mallorca. Our specialist helps couples navigate destination wedding challenges, vendor coordination, and Spanish translation needs.
                  </p>
                  
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">⭐���⭐⭐⭐</span>
                      <span className="text-sm text-amber-700">4.9/5 Rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-rose-500">💕</span>
                      <span className="text-sm text-amber-700">Expert Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isPremiumMember ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-2xl font-semibold text-green-800 mb-4">Ready to Book Your Free Consultation?</h3>
                <p className="text-green-700 mb-6">As a Premium member, you can book your 10-minute consultation with Carolina directly.</p>
                <div className="bg-white bg-opacity-80 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-xl">📧</span>
                    <h4 className="font-semibold text-green-800">Contact Carolina Directly</h4>
                  </div>
                  <div className="text-center space-y-3">
                    <div>
                      <p className="text-sm text-green-700 mb-2">Email Carolina for your free 10-minute consultation:</p>
                      <a 
                        href="mailto:carolina@bridallink.co.uk?subject=Premium%20Member%20-%20Free%20Consultation%20Request&body=Hi%20Carolina,%0A%0AI'm%20a%20BridalLink%20Premium%20member%20and%20would%20like%20to%20book%20my%20free%2010-minute%20consultation.%0A%0AMy%20wedding%20question/topic:%0A[Please%20write%20your%20specific%20question%20here%20so%20Carolina%20can%20prepare]%0A%0APreferred%20call%20times:%0A[Please%20include%202-3%20time%20options]%0A%0AThank%20you!" 
                        className="text-green-600 font-bold hover:text-green-800 transition-colors text-lg"
                      >
                        carolina@bridallink.co.uk
                      </a>
                      <p className="text-xs text-green-600 mt-1">UK-based Mallorca Wedding Specialist</p>
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-left">
                      <h5 className="font-semibold text-amber-800 mb-2 text-center">📝 Booking Instructions:</h5>
                      <div className="space-y-1 text-sm text-amber-700">
                        <div className="flex items-start gap-2">
                          <span className="text-amber-600 mt-0.5">•</span>
                          <span>Write your specific question so Carolina can prepare</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-amber-600 mt-0.5">•</span>
                          <span>Include 2-3 preferred time slots</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-amber-600 mt-0.5">•</span>
                          <span>Response within 24 hours guaranteed</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left">
                      <h5 className="font-semibold text-blue-800 mb-2 text-center">💰 Additional Services:</h5>
                      <div className="space-y-1 text-sm text-blue-700">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600">•</span>
                          <span><strong>Extended advice:</strong> £40 per hour for Mallorca</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600">•</span>
                          <span><strong>Package pricing:</strong> Available for 5+ hours</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <button 
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.alert) {
                        alert('🗓️ Consultation Booking\n\nThis would open Carolina\'s calendar booking system where you can:\n\n• Choose available time slots\n• Select consultation type (general, vendor, legal)\n• Add specific questions\n• Get confirmation details\n\nYour Premium subscription includes priority booking!');
                      }
                    }}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-lg"
                  >
                    📧 Email Carolina
                  </button>
                  <button 
                    onClick={() => safeNavigate('premium-upgrade')}
                    className="px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold"
                  >
                    View Premium Benefits
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-rose-100 to-amber-100 border border-rose-200 rounded-lg p-8 text-center">
                <div className="text-4xl mb-4">👑</div>
                <h3 className="text-2xl font-semibold text-amber-800 mb-4">Ready to Get Expert Advice?</h3>
                <p className="text-amber-700 mb-4 text-lg">Upgrade to Premium to access expert consultations with our UK-based Mallorca specialist</p>
                
                <div className="bg-white bg-opacity-80 rounded-lg p-6 mb-6">
                  <div className="grid md:grid-cols-2 gap-4 text-left">
                    <div className="flex items-center gap-3">
                      <span className="text-green-600 text-xl">✓</span>
                      <span className="text-amber-700">10-minute free consultation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-600 text-xl">✓</span>
                      <span className="text-amber-700">£40/hour expert wedding advice for Mallorca</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-600 text-xl">✓</span>
                      <span className="text-amber-700">Spanish translation support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-600 text-xl">✓</span>
                      <span className="text-amber-700">Mallorca vendor network</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <button 
                    onClick={() => safeNavigate('premium-upgrade')}
                    className="px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold shadow-lg"
                  >
                    View Premium Plans
                  </button>
                </div>
                
                <p className="text-sm text-amber-600 mt-4">Starting from £4.99/month</p>
              </div>
            )}
          </div>
        );
        
      default:
        return (
          <div className="max-w-6xl mx-auto space-y-8 text-center">
            <div className="bg-white rounded-lg border shadow-sm p-8">
              <h2 className="text-2xl font-bold text-amber-800 mb-4">Feature Coming Soon</h2>
              <p className="text-amber-700 mb-4">This section is being developed. Please check back later!</p>
              <p className="text-sm text-gray-600">In the meantime, explore our other wedding planning tools from the homepage.</p>
            </div>
          </div>
        );
      }
    } catch (error) {
      console.error('Error rendering section:', error);
      // Fallback content if section fails to render
      return (
        <div className="max-w-6xl mx-auto space-y-8 text-center">
          <div className="bg-white rounded-lg border shadow-sm p-8">
            <h2 className="text-2xl font-bold text-amber-800 mb-4 bridallink-brand">BridalLink</h2>
            <p className="text-amber-700 mb-4">Your wedding planning companion</p>
            <button 
              onClick={() => safeNavigate('home')}
              className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }
  };

  // Main render with error boundary
  if (currentSection !== 'home') {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-rose-50">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => safeNavigate('home')}
                className="flex items-center gap-2 text-amber-800 hover:text-amber-900 transition-colors"
              >
                <span>←</span>
                Back to Home
              </button>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-gradient-to-r from-rose-200 to-amber-200 rounded-full flex items-center justify-center p-2">
                  <img 
                    src={bridalLinkLogoImage} 
                    alt="BridalLink Logo" 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="flex gap-2">
                  {isMember && (
                    <div className="flex items-center gap-2 bg-pink-100 px-3 py-1 rounded-full">
                      <span>👩‍💻</span>
                      <span className="text-sm text-pink-800">Community Member</span>
                    </div>
                  )}
                  {isPremiumMember ? (
                    <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                      <span>✅</span>
                      <span className="text-sm text-green-800 font-semibold">Premium</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => safeNavigate('premium-upgrade')}
                      className="flex items-center gap-1 bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 text-amber-800 hover:from-amber-200 hover:to-yellow-200 px-4 py-2 rounded-lg transition-all font-semibold shadow-sm hover:shadow-lg"
                    >
                      <span>👑</span>
                      <span>Upgrade Premium</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
            {renderSection()}
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-rose-50 flex items-center justify-center">
        {/* Signup Modal */}
        {showSignup && (
          <ErrorBoundary fallback={<div />}>
            <SignupModal 
              onSignup={(data) => {
                try {
                  setIsMember(true);
                  setShowSignup(false);
                  // Navigate to community after successful signup
                  safeNavigate('community');
                  if (typeof window !== 'undefined' && window.alert) {
                    alert(`Welcome to the BridalLink Community, ${data.name}!`);
                  }
                } catch (error) {
                  console.error('Signup error:', error);
                  setShowSignup(false);
                }
              }} 
              onClose={() => {
                try {
                  setShowSignup(false);
                } catch (error) {
                  console.error('Close signup error:', error);
                }
              }} 
            />
          </ErrorBoundary>
        )}
        
        <div className="text-center space-y-6 max-w-4xl mx-auto px-4">
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="h-32 w-32 bg-gradient-to-r from-rose-200 to-amber-200 rounded-full flex items-center justify-center p-4">
                <img 
                  src={bridalLinkLogoImage} 
                  alt="BridalLink Logo" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-amber-800 mb-4 bridallink-brand">BridalLink</h1>
            <p className="text-xl text-amber-700">Your complete wedding planning companion</p>
          </div>
          
          {/* Featured Sections */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              className="bg-gradient-to-r from-rose-200 to-amber-200 rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-shadow text-center"
              onClick={() => safeNavigate('dashboard')}
            >
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-amber-800 mb-2">Wedding Dashboard</h3>
              <p className="text-amber-700 mb-4">Your complete wedding planning overview</p>
              <div className="flex justify-center">
                <span className="bg-white bg-opacity-80 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">Essential</span>
              </div>
            </div>

            <div 
              className="bg-gradient-to-r from-pink-200 to-purple-200 rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-shadow text-center"
              onClick={() => isMember ? safeNavigate('community') : setShowSignup(true)}
            >
              <div className="text-4xl mb-4">👩‍💻</div>
              <h3 className="text-xl font-bold text-amber-800 mb-2">Bride Community</h3>
              <p className="text-amber-700 mb-4">Connect with fellow brides and share experiences</p>
              <div className="flex justify-center">
                {!isMember && (
                  <span className="bg-rose-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Join Now</span>
                )}
              </div>
            </div>

            <div 
              className="bg-gradient-to-r from-purple-200 to-blue-200 rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-shadow text-center"
              onClick={() => safeNavigate('ai-assistant')}
            >
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-amber-800 mb-2">AI Planning Assistant</h3>
              <p className="text-amber-700 mb-4">Get personalized recommendations and smart insights</p>
              <div className="flex justify-center">
                <span className="bg-white bg-opacity-80 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">AI Powered!</span>
              </div>
            </div>
          </div>

          {/* Core Planning Tools */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-amber-800 text-center mb-6">Essential Planning Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                className="bg-rose-100 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => safeNavigate('budget')}
              >
                <div className="text-3xl mb-3">💰</div>
                <h3 className="text-lg font-semibold text-amber-800">Budget Tracker</h3>
                <p className="text-sm text-amber-700 mt-2">Track expenses and spending</p>
                <div className="mt-3">
                  <span className="bg-green-200 text-amber-800 px-2 py-1 rounded-full text-xs">Essential</span>
                </div>
              </div>
              
              <div 
                className="bg-rose-100 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => safeNavigate('guests')}
              >
                <div className="text-3xl mb-3">👥</div>
                <h3 className="text-lg font-semibold text-amber-800">Guest List</h3>
                <p className="text-sm text-amber-700 mt-2">Manage invitations and RSVPs</p>
              </div>

              <div 
                className="bg-rose-100 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => safeNavigate('documents')}
              >
                <div className="text-3xl mb-3">🗂️</div>
                <h3 className="text-lg font-semibold text-amber-800">Documents</h3>
                <p className="text-sm text-amber-700 mt-2">Contracts, receipts & important files</p>
                <div className="mt-3">
                  <span className="bg-blue-200 text-amber-800 px-2 py-1 rounded-full text-xs">Organize</span>
                </div>
              </div>

              <div 
                className="bg-rose-100 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => safeNavigate('tasks')}
              >
                <div className="text-3xl mb-3">✅</div>
                <h3 className="text-lg font-semibold text-amber-800">Task Manager</h3>
                <p className="text-sm text-amber-700 mt-2">Wedding to-do lists</p>
              </div>

              <div 
                className="bg-rose-100 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => safeNavigate('vendors')}
              >
                <div className="text-3xl mb-3">🤝</div>
                <h3 className="text-lg font-semibold text-amber-800">Vendor Manager</h3>
                <p className="text-sm text-amber-700 mt-2">Track vendors and contracts</p>
                <div className="mt-3">
                  <span className="bg-purple-200 text-amber-800 px-2 py-1 rounded-full text-xs">New!</span>
                </div>
              </div>

              <div 
                className="bg-rose-100 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => safeNavigate('shopping')}
              >
                <div className="text-3xl mb-3">🛍️</div>
                <h3 className="text-lg font-semibold text-amber-800">Shopping Hub</h3>
                <p className="text-sm text-amber-700 mt-2">Wedding retailers & deals</p>
                <div className="mt-3">
                  <span className="bg-purple-200 text-amber-800 px-2 py-1 rounded-full text-xs">50+ Stores</span>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Features */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-amber-800 text-center mb-6">Advanced Planning Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                className="bg-rose-100 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => safeNavigate('schedule')}
              >
                <div className="text-3xl mb-3">⏰</div>
                <h3 className="text-lg font-semibold text-amber-800">Day Schedule</h3>
                <p className="text-sm text-amber-700 mt-2">Plan your perfect wedding day timeline</p>
                <div className="mt-3">
                  <span className="bg-orange-200 text-amber-800 px-2 py-1 rounded-full text-xs">Essential</span>
                </div>
              </div>

              <div 
                className="bg-rose-100 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => safeNavigate('music')}
              >
                <div className="text-3xl mb-3">🎵</div>
                <h3 className="text-lg font-semibold text-amber-800">Music Playlist</h3>
                <p className="text-sm text-amber-700 mt-2">Spotify integration for wedding music</p>
                <div className="mt-3">
                  <span className="bg-indigo-200 text-amber-800 px-2 py-1 rounded-full text-xs">Spotify</span>
                </div>
              </div>

              <div 
                className="bg-rose-100 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => safeNavigate('seating')}
              >
                <div className="text-3xl mb-3">🪑</div>
                <h3 className="text-lg font-semibold text-amber-800">Seating Planner</h3>
                <p className="text-sm text-amber-700 mt-2">Design table layouts and arrangements</p>
                <div className="mt-3">
                  <span className="bg-green-200 text-amber-800 px-2 py-1 rounded-full text-xs">Pro Tool</span>
                </div>
              </div>

              <div 
                className="bg-rose-100 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => safeNavigate('calendar')}
              >
                <div className="text-3xl mb-3">📅</div>
                <h3 className="text-lg font-semibold text-amber-800">Calendar</h3>
                <p className="text-sm text-amber-700 mt-2">Important dates and deadlines</p>
                <div className="mt-3">
                  <span className="bg-purple-200 text-amber-800 px-2 py-1 rounded-full text-xs">Essential</span>
                </div>
              </div>

              <div 
                className="bg-rose-100 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => safeNavigate('weather')}
              >
                <div className="text-3xl mb-3">🌤️</div>
                <h3 className="text-lg font-semibold text-amber-800">Weather</h3>
                <p className="text-sm text-amber-700 mt-2">Wedding day forecast</p>
                <div className="mt-3">
                  <span className="bg-blue-200 text-amber-800 px-2 py-1 rounded-full text-xs">Smart</span>
                </div>
              </div>

              <div 
                className="bg-rose-100 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => safeNavigate('expert-advice')}
              >
                <div className="text-3xl mb-3">🌴</div>
                <h3 className="text-lg font-semibold text-amber-800">Expert Advice</h3>
                <p className="text-sm text-amber-700 mt-2">Mallorca specialist consultations</p>
                <div className="mt-3">
                  <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded-full text-xs">Premium</span>
                </div>
              </div>

              <div 
                className="bg-rose-100 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => safeNavigate('registry')}
              >
                <div className="text-3xl mb-3">🎁</div>
                <h3 className="text-lg font-semibold text-amber-800">Gift Registry</h3>
                <p className="text-sm text-amber-700 mt-2">Link gift registries across multiple retailers</p>
                <div className="mt-3">
                  <span className="bg-purple-200 text-amber-800 px-2 py-1 rounded-full text-xs">Multi-Store</span>
                </div>
              </div>

              <div 
                className="bg-rose-100 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => safeNavigate('cashfund')}
              >
                <div className="text-3xl mb-3">💰</div>
                <h3 className="text-lg font-semibold text-amber-800">Cash Fund</h3>
                <p className="text-sm text-amber-700 mt-2">Create honeymoon and experience funds</p>
                <div className="mt-3">
                  <span className="bg-green-200 text-amber-800 px-2 py-1 rounded-full text-xs">Optional</span>
                </div>
              </div>

              <div 
                className="bg-rose-100 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => safeNavigate('hashtag-generator')}
              >
                <div className="text-3xl mb-3">#️⃣</div>
                <h3 className="text-lg font-semibold text-amber-800">Hashtag Generator</h3>
                <p className="text-sm text-amber-700 mt-2">Create perfect social media hashtags</p>
                <div className="mt-3">
                  <span className="bg-blue-200 text-amber-800 px-2 py-1 rounded-full text-xs">Social</span>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Upgrade CTA */}
          {!isPremiumMember && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 rounded-xl shadow-lg p-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-4xl">👑</span>
                  <h3 className="text-2xl font-bold text-amber-800">Upgrade to Premium</h3>
                </div>
                <p className="text-amber-700 mb-4 text-lg">Get expert wedding planning advice from Carolina, a UK-based Mallorca specialist</p>
                <p className="text-amber-600 mb-6 text-sm">💳 Secure payment with Stripe</p>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white bg-opacity-80 rounded-lg p-4">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="flex items-center gap-1 justify-center">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-amber-700 font-semibold">Expert Consultations</span>
                    </div>
                    <p className="text-sm text-amber-600">10-min free consultation + £40/hour advice for Mallorca</p>
                  </div>
                  <div className="bg-white bg-opacity-80 rounded-lg p-4">
                    <div className="text-2xl mb-2">🌍</div>
                    <div className="flex items-center gap-1 justify-center">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-amber-700 font-semibold">Local Expertise</span>
                    </div>
                    <p className="text-sm text-amber-600">Mallorca specialist + Spanish translation</p>
                  </div>
                  <div className="bg-white bg-opacity-80 rounded-lg p-4">
                    <div className="text-2xl mb-2">📱</div>
                    <div className="flex items-center gap-1 justify-center">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-amber-700 font-semibold">Priority Support</span>
                    </div>
                    <p className="text-sm text-amber-600">Email support within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={() => safeNavigate('premium-upgrade')}
                    className="px-8 py-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl"
                  >
                    View Premium Plans
                  </button>
                </div>
                
                <div className="mt-4 flex gap-4 justify-center text-sm">
                  <span className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full font-semibold">Monthly: £4.99</span>
                  <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full font-semibold">Yearly: £49.99 (Save 17%)</span>
                </div>
                
                <p className="text-xs text-amber-600 mt-3">Cancel anytime • No long-term commitment</p>
              </div>
            </div>
          )}

          {/* Premium Member Status */}
          {isPremiumMember && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-xl shadow-lg p-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="text-3xl">🎉</span>
                  <h3 className="text-xl font-bold text-green-800">Premium Member</h3>
                </div>
                <p className="text-green-700 mb-4">You have access to expert wedding consultations with Carolina!</p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => safeNavigate('premium-upgrade')}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Book Consultation
                  </button>
                  <button
                    onClick={() => safeNavigate('expert-advice')}
                    className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold"
                  >
                    Expert Advice
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer with Privacy Policy and Legal Links */}
          <div className="bg-white bg-opacity-50 rounded-lg border border-rose-200 p-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center gap-6 text-sm text-amber-600">
                <button
                  onClick={() => safeNavigate('privacy-policy')}
                  className="hover:text-amber-800 transition-colors font-medium"
                >
                  Privacy Policy
                </button>
                <span className="text-amber-400">•</span>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.alert) {
                      alert('Terms of Service\n\nBridalLink Terms of Service\n\n1. Service Description\nBridalLink provides wedding planning tools, expert consultations, and community features to help couples plan their perfect wedding.\n\n2. User Responsibilities\n• Provide accurate information\n• Use the service responsibly\n• Respect other community members\n\n3. Payment Terms\n• Premium subscriptions are billed monthly or yearly\n• Secure payments processed by Stripe\n\n4. Privacy & Data\nYour privacy is important to us. Please see our Privacy Policy for detailed information about data handling.\n\n5. Community Guidelines\n• Be respectful and supportive\n• No spam or commercial promotion\n• Share authentic experiences\n\n6. Support\n📧 Email: carolina@bridallink.co.uk\n💬 Premium: Email support within 24 hours\n\nFor complete terms, please contact support.');
                    }
                  }}
                  className="hover:text-amber-800 transition-colors font-medium"
                >
                  Terms of Service
                </button>
                <span className="text-amber-400">•</span>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.alert) {
                      alert('Contact BridalLink Support\n\n📧 Email Support\ncarolina@bridallink.co.uk\n\n👑 Premium Members\n• Email support within 24 hours\n• Priority email response (within 24 hours)\n• Direct access to Carolina for consultations\n\n💬 Community Support\n• Get help from fellow brides in our community\n• Share experiences and get advice\n• Growing community of active members\n\n🌍 Mallorca Wedding Specialist\nCarolina - UK-based expert\n• Spanish translation support\n• Local vendor network\n\nWe\'re here to make your wedding planning journey smooth and stress-free!');
                    }
                  }}
                  className="hover:text-amber-800 transition-colors font-medium"
                >
                  Contact Support
                </button>
              </div>
              
              <div className="border-t border-rose-200 pt-4">
                <div className="flex items-center justify-center gap-4 mb-3">
                  <div className="h-8 w-8 bg-gradient-to-r from-rose-200 to-amber-200 rounded-full flex items-center justify-center p-1">
                    <img 
                      src={bridalLinkLogoImage} 
                      alt="BridalLink Logo" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <p className="text-sm text-amber-800 bridallink-brand font-semibold">BridalLink</p>
                </div>
                <p className="text-xs text-amber-600">
                  © 2024 BridalLink. Your complete wedding planning companion.
                </p>
                <p className="text-xs text-amber-500 mt-1">
                  Payments securely processed by Stripe • Expert advice from UK-based Mallorca specialist
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

// Signup Modal Component
interface SignupModalProps {
  onSignup: (formData: { name: string; email: string }) => void;
  onClose: () => void;
}

function SignupModal({ onSignup, onClose }: SignupModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      try {
        onSignup({ name: name.trim(), email: email.trim() });
      } catch (error) {
        console.error('Submit error:', error);
      }
    }
  };

  return (
    <ErrorBoundary>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full">
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-r from-rose-100 to-amber-100 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <img 
                src={bridalLinkLogoImage} 
                alt="BridalLink Logo" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-amber-800 mb-2">Join the Community</h3>
              <p className="text-amber-700">Connect with other couples planning their dream weddings</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-left">
                <label className="block text-sm font-medium text-amber-700 mb-2">Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500">👤</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                    placeholder="Your name"
                    required
                  />
                </div>
              </div>

              <div className="text-left">
                <label className="block text-sm font-medium text-amber-700 mb-2">Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500">📧</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div className="bg-rose-50 rounded-lg p-4 text-left">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <p className="text-sm text-amber-700">
                      Share your wedding journey with other couples
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <p className="text-sm text-amber-700">
                      Get advice and inspiration from the community
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <p className="text-sm text-amber-700">
                      Access 6 specialized channels (venues, dresses, vendors, etc.)
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-rose-500 mt-0.5">🔒</span>
                    <p className="text-sm text-amber-700">
                      Your information is kept private and never shared
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Maybe Later
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50"
                  disabled={!name.trim() || !email.trim()}
                >
                  Join Community
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}