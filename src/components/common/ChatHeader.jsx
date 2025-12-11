import React from 'react'
import { X } from 'lucide-react'
import Dot from '../../assets/dot.png'
import avatar from '../../assets/avatar.png'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedUser } from '../../store/slices/messageSlice'

const ChatHeader = () => {
    const dispatch = useDispatch()
    const { selectedUser } = useSelector((state) => state.message)
    console.log(selectedUser);

    return (
        <div className='w-full flex items-center justify-between bg-gray-900 px-2 py-1 rounded-xl'>
            <div className='flex items-center gap-2.5'>
                <div className='relative w-fit'>
                    <img src={selectedUser?.profilePic?.url || avatar} alt="img" className='size-10 rounded-full object-cover' />
                    <img src={Dot} alt="active" className='text-green-600 size-3 absolute top-0 right-0' />
                </div>
                <div className='text-white flex flex-col gap-0.5'>
                    <p className='font-semibold'>{selectedUser.fullName}</p>
                    <p>Online</p>
                </div>
            </div>
            <X className='text-white cursor-pointer' onClick={()=>dispatch(setSelectedUser(null))}/>
        </div>
    )
}

export default ChatHeader