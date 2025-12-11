import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setActiveTab } from '../store/slices/messageSlice'
import ProfileHeader from '../components/common/ProfileHeader'
import { LoaderIcon } from 'lucide-react'
import ChatList from '../components/layout/ChatList'
import ContactList from '../components/layout/ContactList'
import Conversation from '../components/layout/Conversation'
import NoConversationPlaceholder from '../components/common/NoConversationPlaceholder'

const Home = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { activeTab, selectedUser } = useSelector((state) => state.message)

  return (
    <>
      {
        !user ? <LoaderIcon className="animate-spin size-20 text-white" /> :
          <div className='bg-gray-800 rounded-2xl h-[86vh] w-full p-2 md:p-8 flex gap-2'>
            {/* left side */}
            <div className={`${selectedUser && 'hidden md:flex w-full'} w-full md:w-1/3 flex flex-col gap-2.5 overflow-y-scroll custom-scrollbar`}>
              {/* profile header */}
              <ProfileHeader />

              <div className='flex flex-col gap-3 border-2 border-cyan-400 rounded-2xl p-3'>
                <div className='flex justify-between gap-2 w-full'>
                  <button
                    className={`${activeTab === 'chats' && 'bg-cyan-900 font-semibold'} text-white cursor-pointer w-full rounded py-1`}
                    onClick={() => dispatch(setActiveTab('chats'))}
                  >
                    Chats
                  </button>
                  <button
                    className={`${activeTab === 'contacts' && 'bg-cyan-900 font-semibold'} text-white cursor-pointer w-full rounded py-1`}
                    onClick={() => dispatch(setActiveTab('contacts'))}
                  >
                    Contacts
                  </button>
                </div>
                {
                  activeTab === 'chats' ? <ChatList activeTab={activeTab} /> : <ContactList />
                }
              </div>
            </div>
            {/* right side */}
            <div className={`w-2/3 md:pl-6 md:border-l md:border-gray-600 ${selectedUser? 'block w-full md:w-2/3' : 'hidden md:block'}`}>
              {selectedUser ? <Conversation /> : <NoConversationPlaceholder />}
            </div>
          </div>}
    </>
  )
}

export default Home