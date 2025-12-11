import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ChatHeader from '../common/ChatHeader'
import ChatContent from '../common/ChatContent'
import SendMessage from '../common/SendMessage'

const Conversation = () => {
    const dispatch = useDispatch()
    const { selectedUser } = useSelector((state) => state.message)
    return (
        <>
            {
                selectedUser && (
                    <div className="flex flex-col h-full">
                        <div>
                            <ChatHeader />
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <ChatContent />
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