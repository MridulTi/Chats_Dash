import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from '../../Context/Context'
import axios from 'axios'
import { FaChartLine } from "react-icons/fa";
import { useError } from '../../Context/ErrorContext';

export function Login() {
  const { toggleAuthPage, setUserDetails,toggleLogin,isLogin } = useAuth();
  const [formData, setFormData] = useState({})
  const { triggerError } = useError();
  const navigate = useNavigate()


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function postLogin() {
    axios.post("/api/v1/auth/login", formData)
      .then(res => {
        setUserDetails(res.data.user)
        toggleLogin()
        navigate("/")
      })
      .catch(err => {
        triggerError(err)
      })
  }

  return (
    <div className="bg-indigo-100 w-screen h-screen flex items-center justify-center">
      <div className="w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 rounded-xl p-6 py-10 bg-white flex flex-col gap-4 items-center">
        <div className="aspect-square w-16 bg-indigo-200 rounded-full grid place-items-center"><FaChartLine className='text-red-600 text-4xl'/></div>
        <h1 className="text-2xl sm:text-3xl font-bold text-center">Chart Login</h1>
        <h2 className="text-sm text-center px-2">Hey, Enter your details to sign in to your account.</h2>
        <input
          onChange={handleInputChange}
          name="email"
          className="outline-0 p-2 border border-neutral-200 w-full rounded-md"
          type="text"
          placeholder="Email"
        />
        <input
          onChange={handleInputChange}
          name="userName"
          className="outline-0 p-2 border border-neutral-200 w-full rounded-md"
          type="text"
          placeholder="Username"
        />
        <input
          onChange={handleInputChange}
          name="password"
          className="outline-0 p-2 border border-neutral-200 w-full rounded-md"
          type="password"
          placeholder="Passcode"
        />
        <button
          onClick={postLogin}
          className="w-full rounded-lg text-gray-700 hover:text-gray-900 bg-indigo-100 p-2 font-semibold hover:bg-indigo-200 transition-all"
        >
          Sign In!
        </button>
        <p className="text-sm text-center">
          Don't have an account? <Link to="/reg-log/signup"
            className="font-bold text-sm cursor-pointer hover:text-orange-600 transition-all"
            
          >
            Register Now!
          </Link>
        </p>
      </div>
    </div>

  )
}
export function Register() {
  const { toggleAuthPage } = useAuth();
  const [formData, setFormData] = useState({})
  const { triggerError } = useError();
  const navigate = useNavigate()

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function postRegister() {
    axios.post("/api/v1/auth/register", formData)
      .then(res => {
        console.log(res.status)
        if(res.status==200){
          navigate("/reg-log/login")
        }
      })
      .catch(err => {
        triggerError(err)
      })
  }

  return (
    <div className="bg-indigo-100 w-screen h-screen flex items-center justify-center">
      <div className="w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/3 xl:w-1/4 rounded-xl p-6 py-10 bg-white flex flex-col gap-4 items-center">
        <div className="aspect-square w-16 bg-indigo-200 rounded-full grid place-items-center"><FaChartLine className='text-red-600 text-4xl'/></div>
        <h1 className="text-2xl sm:text-3xl font-bold text-center">Chart Signup</h1>
        <h2 className="text-sm text-center px-2">Hey, Enter your details to sign up for your account.</h2>
        <input
          onChange={handleInputChange}
          name="firstName"
          className="outline-none p-2 border border-neutral-300 w-full rounded-md"
          type="text"
          placeholder="Full Name"
        />
        <input
          onChange={handleInputChange}
          name="lastName"
          className="outline-none p-2 border border-neutral-300 w-full rounded-md"
          type="text"
          placeholder="Last Name"
        />
        <input
          onChange={handleInputChange}
          name="email"
          className="outline-none p-2 border border-neutral-300 w-full rounded-md"
          type="email"
          placeholder="Email"
        />
        <input
          onChange={handleInputChange}
          name="userName"
          className="outline-none p-2 border border-neutral-300 w-full rounded-md"
          type="text"
          placeholder="Username"
        />
        <input
          onChange={handleInputChange}
          name="password"
          className="outline-none p-2 border border-neutral-300 w-full rounded-md"
          type="password"
          placeholder="Passcode"
        />
        <button
          onClick={postRegister}
          className="w-full rounded-lg text-gray-700 hover:text-gray-900 bg-indigo-100 p-2 font-semibold hover:bg-indigo-200 transition-all"
        >
          Sign Up!
        </button>
        <p className="text-sm text-center flex gap-2">
          Already have an account? 
          <Link to="/reg-log/login"
            className="font-bold text-sm cursor-pointer hover:text-orange-600 transition-all"
            
          >Login!
          </Link>
        </p>
      </div>
    </div>

  )
}