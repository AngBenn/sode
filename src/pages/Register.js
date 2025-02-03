import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match')
});

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data) => {
    console.log('User Data:', data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-800 to-indigo-900 p-4">
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl w-full flex flex-col md:flex-row">
        <div className="flex-1 p-6 text-white bg-gradient-to-r from-purple-700 to-indigo-700 rounded-2xl">
          <h1 className="text-3xl font-bold mb-4">Welcome to the Sode Social Skills App!</h1>
          <p className="mb-6">Play, Practice & Build Social Skills for Life!</p>
          <p className="text-sm">Already Registered? <a href="#" className="underline">Click Here to Login!</a></p>
          <button className="flex items-center justify-center bg-white text-gray-700 px-4 py-2 mt-4 rounded-lg shadow-md w-full">
            <FcGoogle className="mr-2" size={24} /> LOGIN WITH GOOGLE
          </button>
        </div>
        
        <div className="flex-1 p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Create Your Account!</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input {...register('firstName')} placeholder="First Name" className="input-field" />
            <p className="text-red-500 text-sm">{errors.firstName?.message}</p>

            <input {...register('lastName')} placeholder="Last Name" className="input-field" />
            <p className="text-red-500 text-sm">{errors.lastName?.message}</p>

            <input {...register('email')} placeholder="Email" type="email" className="input-field" />
            <p className="text-red-500 text-sm">{errors.email?.message}</p>

            <input {...register('phone')} placeholder="Phone Number" className="input-field" />
            <p className="text-red-500 text-sm">{errors.phone?.message}</p>

            <input {...register('password')} placeholder="Password" type="password" className="input-field" />
            <p className="text-red-500 text-sm">{errors.password?.message}</p>

            <input {...register('confirmPassword')} placeholder="Confirm Password" type="password" className="input-field" />
            <p className="text-red-500 text-sm">{errors.confirmPassword?.message}</p>

            <button type="submit" className="w-full bg-indigo-700 text-white py-2 rounded-lg font-bold shadow-md hover:bg-indigo-800">REGISTER</button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// Tailwind styles (ensure Tailwind is installed and configured in your project)
const inputField = "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500";
