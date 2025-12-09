import React, { useState } from 'react'
import VerifyOtp from './VerifyOtp'
import { LockIcon, MailIcon, UserIcon, LoaderIcon, Circle, CircleCheckBig } from "lucide-react";
import { useForm } from 'react-hook-form'
import regImg from '../assets/signup.png'
import { useNavigate } from 'react-router-dom';
import { registration } from '../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Registration = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()

  //password validation
  const passwordValue = watch("password", "");
  const alphabetValidate = /^(?=.*[a-zA-Z])/.test(passwordValue);
  const numberValidate = /^(?=.*\d)/.test(passwordValue);
  const lengthValidate = /^(?=.{8,})/.test(passwordValue);

  const [verified, setVerified] = useState(false)
  const [email, setEmail] = useState('')

  const { loading, error } = useSelector((state) => state.auth)
  const onSubmit = async (data) => {
    try {
      await dispatch(registration(data)).unwrap()
      setEmail(data.email)
      reset()
      setVerified(!verified)
    } catch (err) {
      toast.error(error.message)
    }
  }

  return (
    <>
      {
        verified ? <VerifyOtp email={email} /> :
          <div className='bg-gray-800 rounded-2xl w-full p-8 flex justify-between'>
            <div className='w-full sm:w-1/2 flex flex-col justify-center items-center gap-5'>
              <h2 className='text-blue-400 text-2xl text-center'>Sign Up for a new account</h2>
              <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2 w-full'>
                <div className='flex flex-col w-full gap-1'>
                  <label htmlFor="fullName" className='text-white'>Full Name</label>
                  <div className='relative'>
                    <input
                      className='w-full border-blue-400 border rounded-xl py-1 pl-9 text-lg pr-1.5 text-blue-400'
                      type="text"
                      {
                      ...register('fullName', {
                        required: "user name is required"
                      })
                      }
                      placeholder='Ex: John'
                      id="fullName" />
                    <UserIcon className='absolute text-purple-600 left-1.5 top-1.5' />
                  </div>
                  {
                    errors.fullName && (
                      <p className='text-red-600'>{errors.fullName.message}</p>
                    )
                  }
                </div>
                <div className='flex flex-col w-full gap-1'>
                  <label htmlFor="email" className='text-white'>Email</label>
                  <div className='relative'>
                    <input
                      type="email"
                      className='w-full border-blue-400 border rounded-xl py-1 pl-9 text-lg pr-1.5 text-blue-400'
                      {
                      ...register('email', {
                        required: "email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Enter a valid email",
                        }
                      })
                      }
                      placeholder='example@email.com'

                      id="email" />
                    <MailIcon className='absolute text-purple-600 left-1.5 top-1.5' />
                  </div>
                  {
                    errors.email && (
                      <p className='text-red-600'>{errors.email.message}</p>
                    )
                  }
                </div>
                <div className='flex flex-col w-full gap-1'>
                  <label htmlFor="password" className='text-white'>Password</label>
                  <div className='relative'>
                    <input
                      type="password"
                      className='w-full border-blue-400 border rounded-xl py-1 pl-9 text-lg pr-1.5 text-blue-400'

                      placeholder='password'
                      {
                      ...register('password', {
                        required: 'password is required',
                        minLength: {
                          value: 8,
                          message: "password must contain 8 characters"
                        },
                        pattern: {
                          value: /^(?=.*\d)(?=.*[a-zA-Z])/,
                          message: "password must include alphabet and number"
                        }
                      })
                      }
                      id="password" />
                    <LockIcon className='absolute text-purple-600 left-1.5 top-1.5' />
                  </div>
                  {
                    errors.password && (
                      <p className='text-red-600'>{errors.password.message}</p>
                    )
                  }
                </div>
                {/* password validation */}
                <div className='flex flex-col *:flex *:gap-1 gap-1.5 py-3 *:items-center'>
                  <div className={`${alphabetValidate ? "text-green-600" : "text-white"}`}>
                    {alphabetValidate ? <CircleCheckBig /> : <Circle />} At least one Alphabet
                  </div>
                  <div className={`${numberValidate ? "text-green-600" : "text-white"}`}>
                    {numberValidate ? <CircleCheckBig /> : <Circle />} At least one number
                  </div>
                  <div className={`${lengthValidate ? "text-green-600" : "text-white"}`}>
                    {lengthValidate ? <CircleCheckBig /> : <Circle />} minimum lenght 8 characters
                  </div>
                </div>
                <button
                  type='submit'
                  disabled={loading}
                  className={`w-full py-2 rounded-xl flex justify-center items-center font-semibold text-black transition-all duration-200 ${loading
                    ? 'bg-cyan-800 cursor-not-allowed opacity-70'
                    : 'bg-cyan-400 hover:bg-cyan-500 active:bg-cyan-700 cursor-pointer'
                    }`
                  }
                >
                  {loading ? <LoaderIcon className="animate-spin w-5 h-5" /> : 'Registration'}
                </button>
              </form>
              <p className='text-white'>Already has an account? <span className='text-blue-500 hover:underline cursor-pointer' onClick={() => navigate('/login')}>login</span></p>
            </div>


            <div className='hidden sm:flex w-1/2 max-h-dvh flex-col items-center justify-center gap-6'>
              <img src={regImg} alt="image" className='md:max-h-[80%]' />
              <div className='w-full text-center flex flex-col gap-2 items-center justify-center'>
                <p className='text-blue-400 text-2xl'>Start Your Journey Today</p>
                <div className='flex gap-2 *:bg-blue-400 *:text-black'>
                  <p className='px-2 py-1 rounded'>Free</p>
                  <p className='px-2 py-1 rounded'>Easy Setup</p>
                  <p className='px-2 py-1 rounded'>Private</p>
                </div>
              </div>
            </div>
          </div>
      }
    </>
  )
}

export default Registration