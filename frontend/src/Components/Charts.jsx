import React from 'react'
import { Bar, Bubble, Doughnut, Line, Pie } from "react-chartjs-2"
import { Chart as ChartJS } from 'chart.js/auto';


export const BarChart = ({ chartData }) => {
  return (
    <Bar data={chartData} options={{
      responsive:true
    }} className='aspect-video text-xl' />
  )
}

export const PieChart = ({ chartData }) => {

  return (
    <Pie data={chartData} options={{
      responsive:true,
      plugins: {
        legend: {
          position: 'top',
        }
      }
    }} className='text-xl' />
  )
}

export const DoughnutChart = ({ chartData }) => {
  return (
    <Doughnut options={{
      responsive: true,
      
    }} data={chartData} className='aspect-[6/5] text-2xl' />
  )
}

export const LineChart = ({ chartData }) => {
  return (
    <Line data={chartData} options={{
      plugins: {
        filler: {
          propagate: false,
        },
      },
      pointBackgroundColor: '#fff',
      radius: 10,
      interaction: {
        intersect: false,
      }}} className='aspect-square text-xl' />
  )
}

export const StackedBarChart = ({ chartData }) => {
  return (
    <Bar data={chartData} options={ {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true
        }
      }
    }}className='aspect-square text-xl' />
  )
}

export const StackedLineBar = ({ chartData }) => {
  return (
    <Line data={chartData} options={{
      responsive:true,
      scales: {
        y: {
          stacked: true
        }
      }
    }} className='aspect-square text-xl' />
  )
}