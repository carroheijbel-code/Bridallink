import React from 'react';

// Essential components for the wedding planner
export function WeddingNavigation({ currentView, setCurrentView }: { currentView: string; setCurrentView: (view: string) => void }) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'budget', label: 'Budget' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'guests', label: 'Guests' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl text-gray-800">💒 Wedding Planner</h1>
          <div className="flex space-x-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`px-3 py-2 rounded text-sm ${item.id === currentView ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export function HomePage() {
  return (
    <div className="text-center">
      <h2 className="text-4xl mb-4 text-gray-800">Welcome to Your Wedding Planner</h2>
      <p className="text-gray-600 mb-8">Plan your perfect day with our simple tools</p>
      
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl mb-2">💰</div>
          <h3 className="text-lg font-semibold mb-2">Budget Tracker</h3>
          <p className="text-gray-600 text-sm">Keep track of your wedding expenses</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl mb-2">✅</div>
          <h3 className="text-lg font-semibold mb-2">Task Manager</h3>
          <p className="text-gray-600 text-sm">Stay organized with your to-do list</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl mb-2">👥</div>
          <h3 className="text-lg font-semibold mb-2">Guest List</h3>
          <p className="text-gray-600 text-sm">Manage your wedding invitations</p>
        </div>
      </div>
    </div>
  );
}

export function BudgetPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Budget Tracker</h2>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Budget</h3>
          <p className="text-2xl font-bold text-gray-800">£0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Spent</h3>
          <p className="text-2xl font-bold text-gray-800">£0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Remaining</h3>
          <p className="text-2xl font-bold text-green-600">£0</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Recent Expenses</h3>
        <p className="text-gray-500 text-center py-8">No expenses added yet</p>
        <div className="text-center mt-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Add Expense
          </button>
        </div>
      </div>
    </div>
  );
}

export function TasksPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Wedding Tasks</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Your To-Do List</h3>
        <p className="text-gray-500 text-center py-8">No tasks added yet</p>
        <div className="text-center mt-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}

export function GuestsPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Guest List</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Your Guest List</h3>
        <p className="text-gray-500 text-center py-8">No guests added yet</p>
        <div className="text-center mt-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Add Guest
          </button>
        </div>
      </div>
    </div>
  );
}