import React, { useState, useEffect } from 'react';

export function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ category: '', amount: 0 });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`https://backend.server-uditangshu-2004.workers.dev/api/v1/expenses/all-expenses`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `${localStorage.getItem('jwtToken')}`
            }
        });
    
      const data = await response.json();
      setExpenses(data);
    } catch (e) {
      console.log(e)
    }
  };

  const handleCreateExpense = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch(`https://backend.server-uditangshu-2004.workers.dev/api/v1/expenses`, {
        method: 'POST',
        headers: {
             'Content-Type': 'application/json',
             'Authorization': `${localStorage.getItem('jwtToken')}`
             },
        body: JSON.stringify(newExpense),
      });
      const data = await response.json();
      setExpenses([...expenses, data]);
      setNewExpense({ category: '', amount: 0 });
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateExpense = async (id, updatedExpense) => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://backend.server-uditangshu-2004.workers.dev/api/v1/expenses/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('jwtToken')}`
         },
        body: JSON.stringify(updatedExpense),
      });
      const data = await response.json();
      setExpenses(expenses.map((expense) => expense.id === id ? data : expense));
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      setIsLoading(true);
      await fetch(`https://backend.server-uditangshu-2004.workers.dev/api/v1/expenses/${id}`, { method: 'DELETE' });
      setExpenses(expenses.filter((expense) => expense.id !== id));
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

 
return (
    <div>
        <h1>Expenses</h1>
        <form onSubmit={handleCreateExpense}>
        <label>Category:</label>
        <input
            type="text"
            value={newExpense.category || ''}
            onChange={(event) => setNewExpense({...newExpense, category: event.target.value })}
            required
        />
        <br />
        <label>Amount:</label>
        <input
            type="number"
            value={newExpense.amount}
            onChange={(event) => setNewExpense({...newExpense, amount: event.target.valueAsNumber })}
            required
        />
        <br />
        <button type="submit">Create Expense</button>
        </form>
        <ul>
        {expenses.map((expense) => (
            <li key={expense.id}>
            <span>{expense.category || 'No category'}</span>
            <span>${expense.amount }</span>
            <button onClick={() => handleUpdateExpense(expense.id, { category: 'Updated Category', amount: 100 })}>
                Update
            </button>
            <button onClick={() => handleDeleteExpense(expense.id)}>Delete</button>
            </li>
        ))}
        </ul>
    </div>
    );
}