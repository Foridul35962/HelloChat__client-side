import React, { useEffect } from 'react'
import avatar from '../../assets/avatar.png'
import Dot from '../../assets/dot.png'
import { useDispatch, useSelector } from 'react-redux'
import { getChatPartners, setSelectedUser } from '../../store/slices/messageSlice'
import LoadingSkeleton from '../common/LoadingSkeleton'
import NoChatsFound from '../common/NoChatsFound'

const ChatList = ({ activeTab }) => {
  const dispatch = useDispatch()
  const { chatPartners, loading } = useSelector((state) => state.message)
  const { onlineUsers } = useSelector((state) => state.socket)
  useEffect(() => {
    const showPartners = async () => {
      try {
        await dispatch(getChatPartners()).unwrap()
      } catch (error) {
        console.log(error);
      }
    }
    showPartners()
  }, [dispatch, activeTab])

  return (
    <>
      {
        loading ? <LoadingSkeleton /> : chatPartners.length === 0 ? <NoChatsFound /> :
          chatPartners.map((chatPartner, idx) => (
            <div key={idx} className='flex flex-col gap-2 text-white cursor-pointer' onClick={() => dispatch(setSelectedUser(chatPartner))}>
              <div className='flex gap-2 items-center bg-gray-900 rounded-xl px-1 py-1.5'>
                <div className='relative'>
                  <img src={chatPartner?.profilePic?.url || avatar} alt="img" className='size-10 rounded-full object-cover' />
                  {onlineUsers.includes(chatPartner._id) && <img src={Dot} alt="active" className='text-green-600 size-3 absolute top-0 right-0' />}
                </div>
                <p className='font-semibold'>{chatPartner?.fullName}</p>
              </div>
            </div>
          ))
      }
    </>
  )
}

export default ChatList