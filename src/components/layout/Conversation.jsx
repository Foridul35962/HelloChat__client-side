import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ChatHeader from '../common/ChatHeader'
import ChatContent from '../common/ChatContent'
import SendMessage from '../common/SendMessage'
import { getMessagesByUserId } from '../../store/slices/messageSlice'
import NoChatHistoryPlaceholder from '../common/NoChatHistoryPlaceholder'
import { LoaderIcon } from 'lucide-react'

const Conversation = () => {
    const dispatch = useDispatch()
    const { selectedUser, messages, isMessagesLoading } = useSelector((state) => state.message)
    useEffect(() => {
        const getMessage = async () => {
            try {
                await dispatch(getMessagesByUserId(selectedUser?._id)).unwrap()
            } catch (error) {
                console.log(error);
            }
        }
        getMessage()
    }, [dispatch, selectedUser])
    return (
        <>
            {
                selectedUser && (
                    <div className="flex flex-col h-full">
                        <div>
                            <ChatHeader />
                        </div>
                        <div className="flex-1 overflow-y-auto">
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