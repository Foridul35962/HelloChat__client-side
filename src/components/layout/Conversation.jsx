import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ChatHeader from '../common/ChatHeader'
import ChatContent from '../common/ChatContent'
import SendMessage from '../common/SendMessage'
import { getMessagesByUserId } from '../../store/slices/messageSlice'
import NoChatHistoryPlaceholder from '../common/NoChatHistoryPlaceholder'
import { LoaderIcon } from 'lucide-react'
import { subscribeToMessages, unsubscribeFromMessages } from '../../store/slices/socketSlice'

const Conversation = () => {
    const dispatch = useDispatch()
    const { selectedUser, messages, isMessagesLoading } = useSelector((state) => state.message)
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (!selectedUser) return
                await dispatch(getMessagesByUserId(selectedUser._id)).unwrap()
                dispatch(subscribeToMessages())
            } catch (error) {
                console.log(error)
            }
        }

        fetchMessages()

        // cleanup function
        return () => {
            dispatch(unsubscribeFromMessages())
        }
    }, [dispatch, selectedUser])

    return (
        <>
            {
                selectedUser && (
                    <div className="flex flex-col h-full min-h-0">
                        <div>
                            <ChatHeader />
                        </div>
                        <div className="flex flex-col flex-1 min-h-0">
                            {
                                isMessagesLoading ?
                                    <div className='w-full h-full flex items-center justify-center'>
                                        <LoaderIcon className="animate-spin size-20 text-white" />
                                    </div> :
                                    messages.length !== 0 ?
                                        <ChatContent messages={messages} /> :
                                        <NoChatHistoryPlaceholder name={selectedUser?.fullName} />
                            }
                        </div>
                        <div>
                            <SendMessage />
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default Conversation