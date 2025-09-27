import React, { useState } from 'react';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [weddingDate, setWeddingDate] = useState('');
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '' });

  const totalSpent = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const remaining = budget - totalSpent;

  const addExpense = () => {
    if (newExpense.description && newExpense.amount) {
      setExpenses([...expenses, {
        id: Date.now(),
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        date: new Date().toLocaleDateString()
      }]);
      setNewExpense({ description: '', amount: '' });
    }
  };

  const calculateDays = () => {
    if (!weddingDate) return null;
    const today = new Date();
    const wedding = new Date(weddingDate);
    const diff = wedding.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysUntil = calculateDays();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl text-center text-gray-800">💒 Wedding Planner</h1>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center space-x-8">
            {[
              { id: 'home', label: 'Home' },
              { id: 'budget', label: 'Budget' },
              { id: 'tasks', label: 'Tasks' }
            ].map(page => (
              <button
                key={page.id}
                onClick={() => setCurrentPage(page.id)}
                className={`py-4 px-6 font-medium ${
                  currentPage === page.id
                    ? 'border-b-2 border-rose-500 text-rose-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {page.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {currentPage === 'home' && (
          <div className="space-y-8">
            {/* Date Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl mb-4">Wedding Date</h2>
              <div className="flex items-center space-x-4">
                <input
                  type="date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                />
                {daysUntil !== null && (
                  <span className="text-lg text-rose-600">
                    {daysUntil > 0 ? `${daysUntil} days to go!` : 'Today is the day!'}
                  </span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-2xl mb-2">💰</div>
                <h3 className="text-lg mb-1">Budget</h3>
                <p className="text-xl">£{budget.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-2xl mb-2">💸</div>
                <h3 className="text-lg mb-1">Spent</h3>
                <p className="text-xl">£{totalSpent.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-2xl mb-2">💵</div>
                <h3 className="text-lg mb-1">Remaining</h3>
                <p className={`text-xl ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  £{remaining.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'budget' && (
          <div className="space-y-6">
            <h2 className="text-2xl">Budget Tracker</h2>
            
            {/* Set Budget */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg mb-4">Set Budget</h3>
              <div className="flex items-center space-x-2">
                <span>£</span>
                <input
                  type="number"
                  value={budget || ''}
                  onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                  placeholder="Enter budget"
                  className="px-3 py-2 border rounded-md w-48"
                />
              </div>
            </div>

            {/* Add Expense */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg mb-4">Add Expense</h3>
              <div className="flex space-x-4 mb-4">
                <input
                  type="text"
                  placeholder="Description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  className="px-3 py-2 border rounded-md flex-1"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  className="px-3 py-2 border rounded-md w-32"
                />
                <button
                  onClick={addExpense}
                  className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Expenses List */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg mb-4">Expenses</h3>
              {expenses.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No expenses yet</p>
              ) : (
                <div className="space-y-2">
                  {expenses.map(expense => (
                    <div key={expense.id} className="flex justify-between items-center p-2 border-b">
                      <span>{expense.description}</span>
                      <span>£{expense.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {currentPage === 'tasks' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl mb-4">Wedding Tasks</h2>
            <p className="text-gray-500 text-center py-8">Task management coming soon!</p>
          </div>
        )}
      </main>
    </div>
  );
}export default App;