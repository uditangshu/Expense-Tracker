import React, { useState, useEffect } from 'react';
import { HiPlus} from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
function Category() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editedCategoryId, setEditedCategoryId] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://backend.server-uditangshu-2004.workers.dev/api/v1/categories', {
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
  }, [],2000);

  const handleCreateCategory = async () => {
    try {
      const response = await fetch('https://backend.server-uditangshu-2004.workers.dev/api/v1/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('jwtToken')}`
        },
        body: JSON.stringify({ name: newCategoryName }),
      });
      const data = await response.json();
      setCategories([...categories, data]);
      setNewCategoryName('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditCategory = async (id) => {
    try {
      const response = await fetch(`https://backend.server-uditangshu-2004.workers.dev/api/v1/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('jwtToken')}`
        },
        body: JSON.stringify({ name: editedCategoryName }),
      });
      const data = await response.json();
      setCategories(categories.map(category => category.id === id? data : category));
      setEditedCategoryId(null);
      setEditedCategoryName('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await fetch(`https://backend.server-uditangshu-2004.workers.dev/api/v1/categories/${id}`,
         { 
          method: 'DELETE' ,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('jwtToken')}`
          }
         });
      setCategories(categories.filter(category => category.id!== id));
    } catch (e) {
      console.log(e);
    }
    
  };

  return (
    <div className="max-w-md mx-auto p-4 pt-6 md:p-6 lg:p-12 bg-white rounded shadow-md">
      <h1 className="text-3xl font-bold mb-4">Categories</h1>
      <h4 className='text-xl font-semibold pb-1'>create expenses in categories</h4>
      <ul className="list-none mb-4">
        {
        
        Array.isArray(categories) && categories.map(category => (
          <li key={category.id} className="flex justify-between mb-2">
            <span className="text-lg">{category.name}</span>
            <div className="flex">
            <button  className="px-3 py-3 hover:bg-gray-300"onClick={() => navigate(`/expenses/${category.id}`)}>
                <HiPlus />
              </button>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setEditedCategoryId(category.id)}>Edit</button>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => handleDeleteCategory(category.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <form className="mb-4">
        <label className="block mb-2">
          Create new category:
          <input type="text" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="w-full p-2 pl-10 text-sm text-gray-700 border-2 border-blue-500 " />
        </label>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleCreateCategory}>Create</button>
      </form>
      {editedCategoryId && (
        <form className="mb-4">
          <label className="block mb-2">
            Edit category:
            <input type="text" value={editedCategoryName} onChange={e => setEditedCategoryName(e.target.value)} className="w-full p-2 pl-10 text-sm text-gray-700 border-2 border-blue-500" />
          </label>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleEditCategory(editedCategoryId)}>Save</button>
        </form>
      )}
    </div>
  );
}

export default Category;