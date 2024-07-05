import React, { useState, useEffect } from 'react';
import { DB_URL } from '../DB_URL';
import { useNavigate } from 'react-router-dom';

export const Expense = () => {
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState(''); 
  const [showCreateCategory, setShowCreateCategory] = useState(false); 
  const navigate= useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${DB_URL}/api/v1/categories`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('jwtToken')}`
          }
        });
        const data = await response.json();
        console.log(data)
        setCategories(data);

      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, [!showCreateCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${DB_URL}/api/v1/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('jwtToken')}`
         },
        body: JSON.stringify({ balance: amount,description: description,category: category }),
      });
      const data = await response.json();
      console.log(body);
      
      setAmount('');
      setDescription('');
      setCategory('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${DB_URL}/api/v1/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('jwtToken')}`
        },

        body: JSON.stringify({ name: newCategory }),
      });
      const data = await response.json();
      console.log(data);
      setCategories([...categories, data]); 
      setNewCategory('');
      setShowCreateCategory(false); 
      
      
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className=" container max-w-md mx-auto p-4 pt-6 md:p-4 lg:p-4 shadow-xl">
      <div>
        <button className='text-3xl font-bold pb-3' onClick={()=>{navigate("/")}}>MyPaisa</button>
      </div>
      <h2 className="text-2xl font-semibold mb-4 ">Create Expense</h2>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label className="block mb-2">
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className="w-full p-2 pl-10 text-sm text-gray-700"
          />
        </label>
        <label className="block mb-2">
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 pl-10 text-sm text-gray-700"
          />
        </label>
        {showCreateCategory ? (
          <div className="flex flex-col mb-2">
            <label>Create new category:</label>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full p-2 pl-10 text-sm text-gray-700 mb-2"
            />
            <button
              type="button"
              onClick={handleCreateCategory}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Create Category
            </button>
          </div>
        ) : (
          <label className="block mb-2">
            Category:
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 pl-10 text-sm text-gray-700"
            >
              <option value="">Select a category</option>
              {Array.isArray(categories) && categories.map((category,index) => (
                <option key={index} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <button
          type="button"
          onClick={() => setShowCreateCategory(!showCreateCategory)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {showCreateCategory ? 'Back to categories' : 'Create new category'}
        </button>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto mt-4 shadow-md"
        >
          Create Expense
        
        </button>
      </form>
    </div>
  );
}
