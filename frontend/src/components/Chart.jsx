// BarChart.js
import React,{useState,useEffect} from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { DB_URL } from '../DB_URL';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);



const BarChart = () => {
  const [categories,setCategories] = useState([]);
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
        const dataCat = await response.json();
        setCategories(dataCat);
  
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);
  
  const data= {
    labels:categories,
    datasets: [
      {
        label: 'Sales',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: [
          
          'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [

          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(192, 192, 192, 1)', 
        },
      },
      title: {
        display: true,
        text: 'Monthly expenses',
        color: '#333', 
        font: {
          size: 18, 
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
        titleColor: '#fff', 
        bodyColor: '#fff', 
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgba(192, 192, 192, 1)',
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)', 
        },
      },
      y: {
        ticks: {
          color: 'rgba(192, 192, 192, 1)',
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
        },
      },
    },
  };

  return <Bar data={data} options={options}/>;
};

export default BarChart;