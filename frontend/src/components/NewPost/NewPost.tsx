import { useState, useEffect } from 'react';
import {Button} from '../ui/button';
import { Post } from '../../data/post';

interface NewPostProps {
  onClose: () => void;
  onPostCreated: () => void; // Ajoutez cette ligne
}

function NewPost({ onClose, onPostCreated }: NewPostProps) { // Modifiez cette ligne
    const [isVisible, setIsVisible] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const [content, setContent] = useState('');

    let pseudo = localStorage.getItem("pseudo");

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handlePost = async () => {
            let pseudo = sessionStorage.getItem('Pseudo') as string;
            let data = { content, pseudo }
            console.log('Sending post data:', data); // Log the data being sent
            await Post.setPost(data, sessionStorage.getItem('Token') as string);
            setIsVisible(false);
            onPostCreated(); // Ajoutez cet appel
    };

    return (
        <div className={`fixed h-h-full inset-0 flex items-end justify-center z-10 backdrop-blur-sm transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="bg-white p-4 rounded shadow-lg relative w-full h-3/4 flex flex-col gap-4">
                <div className="flex flex-row justify-between w-full border-b-2 border-b-neutral-200 p-2">
                    <p onClick={onClose} className='hover:cursor-pointer'>Cancel</p>
                    <p className='font-bold'>New thread</p>
                </div>
                <p className='font-bold'>{pseudo}</p>
                <textarea 
                    className={`border-none w-full h-full focus:outline-none resize-none ${charCount === 250 ? 'text-red-500' : ''}`} 
                    placeholder='Start typing (0/250)' 
                    maxLength={250}
                    onChange={(e) => {
                        const length = e.target.value.length;
                        setCharCount(length);
                        setContent(e.target.value);
                    }} 
                ></textarea>
                <label className={charCount === 250 ? 'text-red-500' : ''}>{charCount}/250</label>
                <Button className="w-full hover:cursor-pointer mb-14" onClick={handlePost}>Post</Button>
            </div>
        </div>
    );
}

export default NewPost;