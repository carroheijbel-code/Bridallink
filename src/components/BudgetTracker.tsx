// This file has been moved to WeddingBudgetTracker.tsx
// Keeping this as placeholder to avoid import conflicts

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
}

const CATEGORIES = [
  'Venue',
  'Catering',
  'Photography',
  'Flowers',
  'Music/DJ',
  'Dress/Attire',
  'Rings',
  'Transportation',
  'Decorations',
  'Other'
];

export function BudgetTracker() {
  const [totalBudget, setTotalBudget] = React.useState(0);
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [showAddExpense, setShowAddExpense] = React.useState(false);
  const [showBudgetSetup, setShowBudgetSetup] = React.useState(false);
  const [newExpense, setNewExpense] = React.useState({
    category: '',
    description: '',
    amount: ''
  });
  const [newBudget, setNewBudget] = React.useState('');

  // Load data from localStorage
  React.useEffect(() => {
    try {
      const savedBudget = localStorage.getItem('totalBudget');
      const savedExpenses = localStorage.getItem('expenses');
      
      if (savedBudget) {
        setTotalBudget(parseInt(savedBudget));
        setNewBudget(savedBudget);
      }
      if (savedExpenses) {
        setExpenses(JSON.parse(savedExpenses));
      }
    } catch (error) {
      console.error('Error loading budget data:', error);
    }
  }, []);

  // Save data to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('totalBudget', totalBudget.toString());
      localStorage.setItem('expenses', JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving budget data:', error);
    }
  }, [totalBudget, expenses]);

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = totalBudget - totalSpent;
  const budgetPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const handleAddExpense = () => {
    if (newExpense.category && newExpense.description && newExpense.amount) {
      const expense: Expense = {
        id: Date.now().toString(),
        category: newExpense.category,
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        date: new Date().toISOString().split('T')[0]
      };
      
      setExpenses([...expenses, expense]);
      setNewExpense({ category: '', description: '', amount: '' });
      setShowAddExpense(false);
    }
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const handleSetBudget = () => {
    if (newBudget) {
      setTotalBudget(parseFloat(newBudget));
      setShowBudgetSetup(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-gray-800">Budget Tracker</h1>
        <div className="space-x-2">
          <button
            onClick={() => setShowBudgetSetup(true)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            <DollarSign className="h-4 w-4 inline mr-2" />
            Set Budget
          </button>
          <button
            onClick={() => setShowAddExpense(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 inline mr-2" />
            Add Expense
          </button>
        </div>
      </div>

      {/* Budget Setup Modal */}
      {showBudgetSetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg mb-4">Set Total Budget</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Total Wedding Budget (£)</label>
                <input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter total budget"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleSetBudget}
                  className="flex-1 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                >
                  Set Budget
                </button>
                <button
                  onClick={() => setShowBudgetSetup(false)}
                  className="flex-1 border border-gray-300 p-2 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg mb-4">Add New Expense</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Description</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="What did you spend on?"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Amount (£)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="0.00"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddExpense}
                  className="flex-1 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                >
                  Add Expense
                </button>
                <button
                  onClick={() => setShowAddExpense(false)}
                  className="flex-1 border border-gray-300 p-2 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Budget</span>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl text-gray-800">£{totalBudget.toLocaleString()}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Spent</span>
            <DollarSign className="h-4 w-4 text-red-600" />
          </div>
          <div className="text-2xl text-gray-800">£{totalSpent.toLocaleString()}</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-red-600 h-2 rounded-full" 
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {budgetPercentage.toFixed(1)}% of budget used
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Remaining</span>
            <DollarSign className={`h-4 w-4 ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </div>
          <div className={`text-2xl ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            £{remainingBudget.toLocaleString()}
          </div>
          {remainingBudget < 0 && (
            <p className="text-xs text-red-600 mt-1">Over budget!</p>
          )}
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg mb-4">Recent Expenses</h3>
        {expenses.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No expenses added yet</p>
        ) : (
          <div className="space-y-4">
            {expenses.slice().reverse().map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="text-gray-800">{expense.description}</div>
                  <div className="text-sm text-gray-500">{expense.category} • {expense.date}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800">£{expense.amount.toLocaleString()}</span>
                  <button
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}