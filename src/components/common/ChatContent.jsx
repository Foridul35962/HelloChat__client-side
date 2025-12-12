import React from 'react'
import { useSelector } from 'react-redux'

const ChatContent = ({ messages }) => {
  const { user } = useSelector((state) => state.auth)

  return (
    <div className="w-full flex flex-col gap-3 p-3 overflow-y-auto custom-scrollbar flex-1">
      {messages?.map((msg, idx) => {
        const isSender = msg.senderId === user?._id

        return (
          <div
            key={idx}
            className={`w-full flex ${isSender ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs sm:max-w-sm md:max-w-md p-3 rounded-2xl shadow
                ${isSender ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-black rounded-bl-none'}`}
            >
              {msg.text && <p className="whitespace-pre-wrap wrap-break-word">{msg.text}</p>}
              {msg.image && (
                <a href={msg.image} target="_blank" rel="noopener noreferrer">
                  <img
                    src={msg.image}
                    alt="message-img"
                    className="rounded-lg mt-2 max-h-60 object-cover cursor-pointer"
                  />
                </a>
              )}
              <p className={`text-xs mt-1 opacity-70 ${isSender ? 'text-right' : 'text-left'}`}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ChatContent