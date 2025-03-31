import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Post } from '../../data/post';
import BlockedPopup from '../BlockedPopup/BlockedPopup'; // Import du popup

interface NewPostProps {
  onClose: () => void;
  onPostCreated: () => void;
}

function NewPost({ onClose, onPostCreated }: NewPostProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [content, setContent] = useState('');
  const [isBlocked, setIsBlocked] = useState(false); // État pour afficher le popup

  let pseudo = localStorage.getItem("pseudo");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handlePost = async () => {
    let pseudo = sessionStorage.getItem('Pseudo') as string;
    let data = { content, pseudo };
  
    try {
      console.log('Sending post data:', data); // Log the data being sent
      const response = await Post.setPost(data, sessionStorage.getItem('Token') as string);
  
      // Vérifiez si le code C-3132 est renvoyé
      if (response.code === 'C-3132') {
        console.warn('User is blocked. Showing popup.');
        setIsBlocked(true); // Affiche le popup
        return;
      }
  
      setIsVisible(false);
      onPostCreated(); // Appelle la fonction de rafraîchissement
    } catch (error) {
      console.error('Error while creating post:', error);
    }
  };

  const handleBlockedPopupClose = () => {
    sessionStorage.clear(); // Efface le sessionStorage
    window.location.href = '/'; // Redirige vers la page d'accueil
  };

  return (
    <>
      {isBlocked && <BlockedPopup onClose={handleBlockedPopupClose} />}
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
    </>
  );
}

export default NewPost;