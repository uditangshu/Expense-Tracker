
import './App.css';
import { BrowserRouter, Route,Router, Routes } from 'react-router-dom';
import Category from './pages/Category';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Home from './pages/Home';
import { Expenses } from './dynamicExpenses.jsx/Expenses';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/category" element={<Category/>} />
        <Route path="/signin" element={<Signin/>} /> 
        <Route path="/signup" element={<Signup/>} />
        <Route path ="/"element={<Home/>}></Route>
        <Route path ="/expenses"element={<Expenses/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
