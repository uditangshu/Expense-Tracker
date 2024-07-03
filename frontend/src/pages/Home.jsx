import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import Edit from '../components/Edit';
import {EditButton} from '../components/EditButton';
import BarChart from '../components/Chart';

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
        // console.log(user)
        setIncome(user.income);
        setUsername(user.username);
        setBalance(user.balance);
      } catch (e) {
        console.error('Error fetching data:', e);
        navigate('/signin');
      }
    };

    fetchData();
  }, [navigate]);

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
  const handleCreateClick = ()=>{
    navigate("/category",{replace: true})
  }

  return (
    <div className="container mx-auto p-4 pt-6 md:p-4 lg:p-4 w-screen">
      <header className="flex justify-between mb-4 ">
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
      <div className="p-4 max-w-md mx-auto mt-4 bg-white shadow-md">
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
        <div className="max-w-md mx-auto pt-2  md:pt-4">
          <Link
            className="block text-blue-500 hover:text-blue-800 hover:bg-gray-100"
          to="/category"
          >
            create categories and expenses
          </Link>
        </div>
      </div>
      <div className='pt-4 grid grid-cols-1 md:grid-cols-2 gap-1'>
      { Array.isArray(expenses) && expenses.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 shadow-lg ">
           <h1 className='text-2xl font-semibold py-4 flex justify-center shadow-md h-16'>Recent transactions</h1>
          {expenses.slice(-5).map((expense, index) => (
            <div key={index} className="bg-white shadow-md rounded p-4">
              <h3 className="text-lg font-bold">{expense.description}</h3>
              <p className="text-lg font-bold">categoryId: {expense.categoryId}</p>
              <p className="text-lg font-bold text-red-600">${expense.balance}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className='w-full'>
          <h1 className='text-2xl font-semibold py-4 flex justify-center'>Recent transactions</h1>
          <p className="text-gray-700 text-lg mb-4py-4 flex justify-center">No expenses yet!</p>
            <div className='flex justify-center mt-4'>
              <button onClick={handleCreateClick} className=" text-white bg-blue-500 hover:bg-blue-700 rounded p-2">Create one</button>
            </div>
        </div>
      )}
      <div className=' col-span-1 h-svh bg-slate-500'>
      <h1 className='text-2xl font-semibold py-4 flex justify-center bg-white shadow-md pb-6 chart-container'>Chart</h1>
      <div className='text-white '>
        <BarChart/>
      </div>
      </div>
    </div > 
</div>
  );
}

export default Home;