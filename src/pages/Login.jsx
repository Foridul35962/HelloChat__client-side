import { LoaderIcon, LockIcon, MailIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../store/slices/authSlice'
import { toast } from 'react-toastify'
import logInImg from '../assets/login.png'

const Login = () => {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error, user } = useSelector((state) => state.auth)

  const onSubmit = async (data) => {
    try {
      await dispatch(login(data)).unwrap()
      reset()
      toast.success('user loggedIn successfully')
      navigate('/')
    } catch (err) {
      toast.error(err.message)
    }
  }
  return (
    <div className='bg-gray-800 rounded-2xl w-full p-8 flex justify-between'>
      <div className='w-full sm:w-1/2 flex flex-col justify-center items-center gap-5'>
        <h2 className='text-blue-400 text-2xl text-center'>Sign Up for a new account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2 w-full'>
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
                  required: 'password is required'
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
          <button
            type='submit'
            disabled={loading}
            className={`w-full py-2 rounded-xl flex my-3 justify-center items-center font-semibold text-black transition-all duration-200 ${loading
              ? 'bg-cyan-800 cursor-not-allowed opacity-70'
              : 'bg-cyan-400 hover:bg-cyan-500 active:bg-cyan-700 cursor-pointer'
              }`
            }
          >
            {loading ? <LoaderIcon className="animate-spin w-5 h-5" /> : 'Login'}
          </button>
        </form>
        <p className='text-white'>Don't have any account? <span className='text-blue-500 hover:underline cursor-pointer' onClick={() => navigate('/registration')}>registration</span></p>
      </div>


      <div className='hidden sm:flex w-1/2 max-h-dvh flex-col items-center justify-center gap-6'>
        <img src={logInImg} alt="image" className='md:max-h-[80%]' />
        <div className='w-full text-center flex flex-col gap-2 items-center justify-center'>
          <p className='text-blue-400 text-2xl'>Contact any time, any where</p>
          <div className='flex gap-2 *:bg-blue-400 *:text-black'>
            <p className='px-2 py-1 rounded'>Free</p>
            <p className='px-2 py-1 rounded'>Easy Setup</p>
            <p className='px-2 py-1 rounded'>Private</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login