// filepath: /home/bastieng/SAE-401-Threads/frontend/src/components/protetedBackoffice/protetedBackoffice.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from "../../data/user";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedBackoffice({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('ProtectedBackoffice useEffect triggered');
    const token = sessionStorage.getItem('Token');
    if (token) {
      console.log('Token found:', token);
      User.verifyAdmin({ token }).then(response => {
        console.log('Response:', response); // Log the response
        if (response.code !== "C-0001") {
          navigate('/home');
        }
      }).catch((error) => {
        console.error('Error during verification:', error);
        navigate('/');
      });
    } else {
      console.log('No token found');
      navigate('/');
    }
  }, [navigate]);

  return <>{children}</>;
};