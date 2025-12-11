import React, { useEffect } from 'react'
import LoadingSkeleton from '../common/LoadingSkeleton'
import avatar from '../../assets/avatar.png'
import { useDispatch, useSelector } from 'react-redux'
import { getAllContacts, setSelectedUser } from '../../store/slices/messageSlice'

const ContactList = () => {
  const dispatch = useDispatch()
  const { allContacts, loading } = useSelector((state) => state.message)
  useEffect(() => {
    const showContacts = async () => {
      try {
        await dispatch(getAllContacts()).unwrap()
      } catch (error) {
        console.log(error);
      }
    }
    showContacts()
  }, [dispatch])
  return (
    <>
      {
        loading ? <LoadingSkeleton /> : allContacts &&
          allContacts.map((contacts, idx) => (
            <div key={idx} className='flex flex-col gap-2 text-white cursor-pointer' onClick={() => dispatch(setSelectedUser(contacts))}>
              <div className='flex gap-2 items-center bg-gray-900 rounded-xl px-1 py-1.5'>
                <img src={contacts?.profilePic?.url || avatar} alt="img" className='size-10 rounded-full object-cover' />
                <p className='font-semibold'>{contacts?.fullName}</p>
              </div>
            </div>
          ))
      }
    </>
  )
}

export default ContactList