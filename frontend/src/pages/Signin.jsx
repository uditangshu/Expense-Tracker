import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';


function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { email, password };
    try {
      const response = await fetch('https://backend.server-uditangshu-2004.workers.dev/api/v1/user/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      // console.log(response)
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('jwtToken', data.jwt);
        navigate('/', { replace: true });
      } else {
        console.error('Error signing in:', data.error);
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
      <div className="flex mb-4">
        <h1 className="text-3xl font-bold">MyPaisa</h1>
      </div>
      <div className="bg-gray-100 rounded shadow-md p-4 max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">Signin</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Signin
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Don't have an account? 
          <Link className="text-blue-500"to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Signin;