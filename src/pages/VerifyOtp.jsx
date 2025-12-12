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
        <div className="bg-gray-900 rounded-2xl w-full sm:w-1/2 p-8 shadow-lg border border-gray-700">
            <div className="w-full flex flex-col justify-center items-center gap-6">

                {/* Heading */}
                <h2 className="text-cyan-400 text-3xl font-bold text-center">
                    Verify OTP
                </h2>

                {/* Added message */}
                <p className="text-gray-400 text-center text-sm px-6">
                    An OTP has been sent <span className='font-bold'>{email}</span>. Please check your inbox and enter the code below.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">

                    {/* OTP Input */}
                    <input
                        type="number"
                        id="otp"
                        name="otp"
                        required
                        placeholder="Enter OTP"
                        className="w-full bg-gray-800 border border-gray-600 rounded-xl py-3 px-4 text-center 
                   text-lg tracking-widest font-semibold text-cyan-300
                   focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent 
                   transition-all"
                    />

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl flex justify-center items-center font-semibold text-black text-lg transition-all duration-200
                            ${loading
                                ? "bg-cyan-800 cursor-not-allowed opacity-70"
                                : "bg-cyan-400 hover:bg-cyan-500 active:bg-cyan-700 cursor-pointer shadow-md"
                            }`
                        }
                    >
                        {loading ? (
                            <LoaderIcon className="animate-spin w-6 h-6 text-white" />
                        ) : (
                            "Verify Email"
                        )}
                    </button>

                </form>
            </div>
        </div>

    )
}

export default VerifyOtp