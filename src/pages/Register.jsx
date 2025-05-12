import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React from 'react';

const API_URL = process.env.REACT_APP_API_URL;
const schema = yup.object().shape({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match')
});

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  
  const navigate = useNavigate();
  
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/register`, data);
      console.log('Registration response:', response.data);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
    }
  };
  

  return (
    <div className="w-screen h-screen flex items-center justify-center min-h-screen bg-[#272052]">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#272052] rounded-2xl shadow-xl p-6 w-full flex flex-col md:flex-row items-center"
      >
        <div className="flex-1 p-6 text-white flex flex-col items-center text-center w-full max-w-6xl mx-auto py-4 ml-[-150px] mt-15">
          <img
            src={require('../assets/images/Education Book 1.png')}
            alt="Education Book"
            className="absolute top-0 left-0 w-[170px] h-[200px]"
          />
          <img
            src={require('../assets/images/Book and Globe 1.png')}
            alt="Book and Globe"
            className="absolute top-[10px] left-[50%] translate-x-[-50%] w-[250px] h-[250px]"
          />
          <img
            src={require('../assets/images/coins 2.png')}
            alt="Coin"
            className="absolute top-[90px] left-[30%] translate-x-[-50%] w-[30px] h-[30px]"
          />
          <img
            src={require('../assets/images/coins 2.png')}
            alt="Coin"
            className="absolute top-[500px] left-[30%] translate-x-[500%] w-[40px] h-[40px]"
          />
          <img 
            src={require('../assets/images/Book Stacks 1.png')}
            alt="Coin"
            className="absolute top-[500px] left-0 w-[50px] h-[50px]"
          />
          <br /><br />
          <div className='mt-10'>
            <img
              src={require('../assets/images/african-teen-playing-cartoon-clipart-4.png')}
              alt="Profile"
              style={{ width: '515px', height: '260px' }}
            />
          </div>
          <div className="text-left font-[Source Serif Pro] ml-[-150px]">
            <h1 className="text-3xl font-bold mb-4">
              Welcome to the <br />
              <span className="text-purple-400">Sode Social Skills App!</span>
            </h1>
            <p className="text-lg mb-6">Play, Practice & Build Social Skills for Life!</p>
            <p className="text-sm">
              Already Registered?{' '}
              <a href="/login" className="underline text-purple-400">
                Click Here to Login!
              </a>
            </p>
          </div>
          <button className="flex items-center justify-center bg-white text-gray-700 px-4 py-2 mt-6 rounded-full shadow-md w-56 text-sm font-bold hover:bg-gray-100 transition-colors">
            <FcGoogle className="mr-2" size={20} /> LOGIN WITH GOOGLE
          </button>
        </div>
        <div className="w-[500px] h-[550px] bg-[rgba(216,213,225,0.8)] p-8 rounded-3xl shadow-xl mr-6">
          <h2 className="text-2xl font-bold mb-6 text-[#272052] text-center">Create Your Account!</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input {...register('first_name')} placeholder="First Name" className="w-full bg-white text-[#272052] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C2A73] placeholder-gray-400" />
              <p className="text-red-500 text-sm mt-1">{errors.first_name?.message}</p>
            </div>
            <div>
              <input {...register('last_name')} data-testid="username-input" placeholder="Last Name" className="w-full bg-white text-[#272052] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C2A73] placeholder-gray-400" />
              <p className="text-red-500 text-sm mt-1">{errors.last_name?.message}</p>
            </div>
            <div>
              <input {...register('email')} placeholder="Email" data-testid="email-input" type="email" className="w-full bg-white text-[#272052] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C2A73] placeholder-gray-400" />
              <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
            </div>
            <div>
              <input {...register('phone')} placeholder="Phone Number" className="w-full bg-white text-[#272052] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C2A73] placeholder-gray-400" />
              <p className="text-red-500 text-sm mt-1">{errors.phone?.message}</p>
            </div>
            <div>
              <input {...register('password')} placeholder="Password" data-testid="password-input" type="password" className="w-full bg-white text-[#272052] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C2A73] placeholder-gray-400" />
              <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>
            </div>
            <div>
              <input {...register('confirmPassword')} placeholder="Confirm Password" type="password" className="w-full bg-white text-[#272052] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C2A73] placeholder-gray-400" />
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword?.message}</p>
            </div>
            <button type="submit" data-testid="register-button" className="w-full bg-[#3C2A73] text-white py-3 rounded-lg font-bold shadow-md hover:bg-[#272052] transition-colors">REGISTER</button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}


//Looks good. Works good. I have to edit the structure to include the role of the person registering?**speak to Kwabena and see