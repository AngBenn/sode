import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
});

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data) => {
    console.log('User Data:', data);
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
            src={require('../assets/images/coins 2.png')}
            alt="Education Book"
            className="absolute top-0 right-0 w-[40px] h-[40px]"
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
          <img
            src={require('../assets/images/Book Stacks 1.png')}
            alt="Education Book"
            className="absolute bottom-0 right-0 w-[80px] h-[80px]"
          />
          <br></br>
          <br></br>
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
            <span className="text-[15px] mb-6">Play, Practice & Build Social Skills for Life!</span>
            <br></br>
            <p className="text-[15px]">
              Not registered yet? <a href="/register" className="underline text-purple-400">
                Click Here to Login!
              </a>
            </p>
          </div>
        </div>
        {/* Right Section (Login Form + Google Login) */}
        <div className="flex flex-col items-center mt-20 mr-6">

          {/* Login Form */}
          <div className="w-[500px] h-[340px] bg-[rgba(216,213,225,0.8)] p-6 rounded-3xl shadow-xl overflow-hidden">
            <h2 className="text-2xl font-bold mb-6 text-[#272052] text-center">Login To Your Account!</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                {...register('email')}
                placeholder="Email"
                type="email"
                className="w-full bg-white text-[#272052] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C2A73] placeholder-gray-400"
              />
              <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
            </div>

            <div>
              <input
                {...register('password')}
                placeholder="Password"
                type="password"
                className="w-full bg-white text-[#272052] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C2A73] placeholder-gray-400"
              />
              <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>
            </div>

               <button
              type="submit"
              className="w-full bg-[#3C2A73] text-white py-3 rounded-lg font-bold shadow-md hover:bg-[#272052] transition-colors"
            >
              LOGIN
            </button>
            </form>
          </div>

          {/* Google Login Button and Forgot Password */}

          <p className=" text-1xl text-center text-white text-sm mt-2">
            <a href="#" className="underline">Forgot Password?</a>
          </p>

          
            <button className="flex items-center justify-center bg-white text-gray-700 px-4 py-2 mt-6 rounded-full shadow-md w-56 text-sm font-bold hover:bg-gray-100 transition-colors">
              <FcGoogle className="mr-2" size={20} /> LOGIN WITH GOOGLE
            </button>

         
        </div>
      </motion.div>
    </div>
  );
}