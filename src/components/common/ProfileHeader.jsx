import React, { useRef } from 'react'
import avatar from '../../assets/avatar.png'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { LogOut, Volume2, VolumeOff } from 'lucide-react'
import { logout, updateProfile } from '../../store/slices/authSlice'
import { toggleSound } from '../../store/slices/messageSlice'

const ProfileHeader = () => {

    const dispatch = useDispatch()
    const fileInputRef = useRef(null)
    const { user, loading } = useSelector((state) => state.auth)
    const { isSoundEnabled } = useSelector((state) => state.message)

    const handleLogOut = async () => {
        if (window.confirm('Are you want to logged out your self?')) {
            try {
                await dispatch(logout()).unwrap()
                toast.success('log out successfully')
            } catch (error) {
                toast.error(error.message)
            }
        }
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            alert('Image must be under 5MB')
            return
        }

        const formData = new FormData()
        formData.append('image', file)

        try {
            await dispatch(updateProfile(formData)).unwrap()
            toast.success('image upload successful')
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className='flex justify-between items-center text-white'>
            <div className='flex gap-3 items-center'>
                <div>
                    <button
                        className="size-14 rounded-full overflow-hidden relative group cursor-pointer"
                        onClick={() => fileInputRef.current.click()}>
                        <img
                            src={user?.profilePic?.url || avatar}
                            alt="user image"
                            className='size-full object-cover' />
                        <div className={`absolute inset-0 bg-black/50 opacity-0 ${loading ? 'opacity-100' : 'group-hover:opacity-100'} flex items-center justify-center transition-opacity`}>
                            <span className="text-white text-xs">{loading ? 'Loading' : 'Change'}</span>
                        </div>
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                </div>
                <div className='flex flex-col'>
                    <p className='font-bold'>{user?.fullName}</p>
                    <p>Online</p>
                </div>
            </div>
            <div className='flex gap-2'>
                <LogOut onClick={handleLogOut} className='cursor-pointer' />
                <div className='cursor-pointer' onClick={() => dispatch(toggleSound())}>{isSoundEnabled ? <Volume2 /> : <VolumeOff />}</div>
            </div>
        </div>
    )
}

export default ProfileHeader