import { LoaderIcon } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { verifyEmail } from '../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const VerifyOtp = ({ email }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading } = useSelector((state) => state.auth)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = {
            email,
            otp: e.target.otp.value
        }
        try {
            await dispatch(verifyEmail(data)).unwrap()
            toast.success('User registered successfully')
            e.target.otp.value = ""
            navigate('/login')
        } catch (error) {
            toast.error(error.message)
        }
    }
    return (
        <div className='bg-gray-800 rounded-2xl w-full sm:w-1/2 p-8 flex justify-between'>
            <div className='w-full flex flex-col justify-center items-center gap-5'>
                <h2 className='text-blue-400 text-3xl text-center'>Verify Otp</h2>
                <form onSubmit={handleSubmit} className='flex flex-col gap-2 w-full'>
                    <input
                        type="number"
                        className='w-full border-blue-400 border rounded-xl py-1 px-2 text-center font-sans tracking-widest font-semibold text-lg text-blue-400'
                        placeholder='Enter Otp'
                        name='otp'
                        required
                        id="opt" />
                    <button
                        type='submit'
                        disabled={loading}
                        className={`w-full py-2 rounded-xl flex justify-center items-center font-semibold text-black transition-all duration-200 ${loading
                            ? 'bg-cyan-800 cursor-not-allowed opacity-70'
                            : 'bg-cyan-400 hover:bg-cyan-500 active:bg-cyan-700 cursor-pointer'
                            }`
                        }
                    >
                        {loading ? <LoaderIcon className="animate-spin w-5 h-5" /> : 'Verify Email'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default VerifyOtp