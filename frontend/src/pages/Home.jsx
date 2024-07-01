import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import Edit from '../components/Edit';
import {EditButton} from '../components/EditButton';

function Home() {
  const [username, setUsername] = useState('');
  const [income, setIncome] = useState(0);
  const [balance, setBalance] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://backend.server-uditangshu-2004.workers.dev/api/v1/home', {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('jwtToken')}`
          }
        });
        const user = await response.json();
        setIncome(user.income);
        setUsername(user.username);
        setBalance(user.balance);
        setExpenses(user.expenses); 
      } catch (e) {
        console.error('Error fetching data:', e);
        navigate('/signin');
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/signin');
  };
  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleEditSubmit = async ({newUsername}) => {
    try {
      const response = await fetch('https://backend.server-uditangshu-2004.workers.dev/api/v1/home', {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('jwtToken')}`
        },
        body: JSON.stringify({
          username: newUsername
       })
      });
      const updatedUser = await response.json();
      setUsername(newUsername);
      setShowEditModal(false);
    } catch (e) {
      console.error('Error updating data:', e);
    }
  };


  return (
    <div className="container mx-auto p-4 pt-6 md:p-4 lg:p-4">
      <header className="flex justify-between mb-4">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">MyPaisa</h1>
          <span className="text-lg font-bold ml-4">{username}</span>
        </div>
        <div className="flex items-center">
          <button className="bg-blue-500 hover:bg-blue-700 shadow-md text-white font-bold py-2 px-4 rounded" onClick={handleLogout}>Logout</button>
          <EditButton onClick={handleEdit} />

            {showEditModal && (
          <Edit onClose={() => setShowEditModal(false)} onSubmit={handleEditSubmit} />
            )}
            </div>
      </header>
      <div className="p-4 max-w-md mx-auto bg-white shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-center">Dashboard</h1>
        <div className="flex justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Total Income</h2>
            <p className="text-gray-700">${income}</p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Balance</h2>
            <p className="text-gray-700">${balance}</p>
          </div>
        </div>
        <h2 className="text-2xl font-bold ">Expenses</h2>
        <div className="max-w-md mx-auto pt-6  md:pt-12">
          {expenses > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {expenses.map((expense, index) => (
                <div key={index} className="bg-white shadow-md rounded p-4">
                  <h3 className="text-lg font-bold">{expense.category}</h3>
                  <p className="text-lg font-bold text-red-600">${expense.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-700 text-lg mb-4 ">No expenses yet!</p>
          )}
          <Link
            className="block text-blue-400 hover:text-blue-600 hover:bg-gray-200"
          to="/category"
          >
            View and create categories
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;