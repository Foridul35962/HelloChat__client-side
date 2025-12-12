import { Image, LoaderIcon, Send } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'
import { sendMessage } from '../../store/slices/messageSlice';

const SendMessage = () => {
  const dispatch = useDispatch()
  const { selectedUser, sendMessageLoading } = useSelector((state) => state.message)

  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleSend = async () => {
    if (!message && !image) return;

    const formData = new FormData()
    formData.append('image', image)
    formData.append('message', message)

    try {
      await dispatch(sendMessage({ id: selectedUser._id, message: formData})).unwrap()
    } catch (error) {
      toast.error(error)
    }

    // Reset input
    setMessage('');
    setImage(null);
    fileInputRef.current.value = null;
  };

  return (
    <div className='bg-gray-900 flex w-full gap-2 p-2 items-center rounded-lg'>
      {/* Text Input */}
      <input
        type="text"
        name="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
        placeholder='Type a message...'
        className='flex-1 min-w-0 bg-gray-800 text-white rounded-full px-3 py-2 outline-none'
      />

      {/* Buttons */}
      <div className='flex gap-2 shrink-0'>
        {/* Image Button */}
        <button
          type="button"
          onClick={handleFileClick}
          className='p-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600'
        >
          {image ? <p>loaded</p> : <Image className='size-4' />}
        </button>
        <input
          type="file"
          name="image"
          ref={fileInputRef}
          onChange={handleFileChange}
          className='hidden'
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          className='p-2 bg-green-500 text-white rounded-full hover:bg-green-600'
        >
          {sendMessageLoading ? <LoaderIcon className="animate-spin size-4" /> :<Send className='size-4' />}
        </button>
      </div>
    </div>

  );
};

export default SendMessage;