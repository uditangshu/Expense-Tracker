import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ balance: 0, description: ''});
  const {catId} = useParams();
  
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async (e) => {
    // e.preventDefault();
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
  
  const handleCreateExpense = async (e) => {
    e.preventDefault();
    console.log(newExpense.balance)
    console.log(newExpense.description)
    try {
      const response = await fetch(`https://backend.server-uditangshu-2004.workers.dev/api/v1/expenses/${catId || undefined}`, {
        method: 'POST',
        headers: {
             'Content-Type': 'application/json',
             'Authorization': `${localStorage.getItem('jwtToken')}`
             },
        body: JSON.stringify({
        balance: parseFloat(newExpense.balance), 
        description: newExpense.description}),
      });
      
      const data = await response.json();
      console.log(data.balance);
      console.log(data.description)
      setExpenses([...expenses, data]);
      setNewExpense({ balance: 0, description: '' });
    } catch (e) {
      console.log(e)
    }
  };

  const handleUpdateExpense = async (id, updatedExpense) => {
    try {
     
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
    } catch (e) {
      console.log(e)
    } 
  };

  const handleDeleteExpense = async (id) => {
    try {
      await fetch(`https://backend.server-uditangshu-2004.workers.dev/api/v1/expenses/${id}`,{
         method: 'DELETE',
         headers: {
            'Authorization': `${localStorage.getItem('jwtToken')}`
         }
        });
        console.log()
      setExpenses(expenses.filter((expense) => expense.id !== id));
    } 
    catch (e)
    {
      console.log(e)
    } 
  };

 
return (
  <div className="max-w-xl mx-auto p-4 bg-white rounded shadow-md">
  <h1 className="text-3xl text-center mb-4">Expenses</h1>
  <form onSubmit={handleCreateExpense} className="flex flex-col items-center">
    <label className="block mb-2 ">Amount:</label>
    <input
      type="number"
      value={newExpense.balance}
      onChange={(e) => setNewExpense({...newExpense, balance: e.target.value })}
      required
      className="p-2 pl-10 text-sm text-gray-700 border-2 border-gray-400 rounded"
    />
    <label className="block mb-2">Description:</label>
    <input
      type="text"
      value={newExpense.description}
      onChange={(e) => setNewExpense({...newExpense, description: e.target.value })}
      required
      className="p-2 pl-10 text-sm text-gray-700 border-2 border-gray-400 rounded"
    />
    <br />
    <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
      Create Expense
    </button>
  </form>
  <ul className="list-none p-0 m-4">
    {expenses.map((expense) => (
      <li key={expense.id} className="p-4 border-b border-gray-200 mb-4">
        <span className="mr-4">{expense.category || ''}</span>
        <span className="mr-4">${expense.balance}</span>
        <span className="mr-4">{expense.description}</span>
        <button onClick={() => handleUpdateExpense(expense.id, { category: 'Updated Category', amount: 100 })} className="bg-blue-500 hover:bg-blue-700 text-white float-right font-bold py-2 px-4 rounded ">
          Update
        </button>
        <button onClick={() => handleDeleteExpense(expense.id)} className="bg-red-500 hover:bg-red-700 float-right text-white font-bold py-2 px-4 rounded mr-2">
          Delete
        </button>
      </li>
    ))}
  </ul>
</div>
)
}
   