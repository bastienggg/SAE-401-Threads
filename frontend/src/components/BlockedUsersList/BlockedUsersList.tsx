import React, { useEffect, useState } from 'react';
import { User } from '../../data/user';
import { Blocked } from '../../data/blocked';
import { Button } from '../ui/button';
import { Ban } from 'lucide-react';

interface BlockedUser {
    id: number;
    pseudo: string;
    email: string;
    blockedAt: string;
}

export default function BlockedUsersList() {
    const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlockedUsers = async () => {
            const token = sessionStorage.getItem('Token');
            if (!token) return;

            try {
                const response = await fetch('http://localhost:8080/api/blocked-users', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setBlockedUsers(data);
            } catch (error) {
                console.error('Error fetching blocked users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlockedUsers();
    }, []);

    const handleUnblock = async (userId: number) => {
        const token = sessionStorage.getItem('Token');
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:8080/api/unblock/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setBlockedUsers(blockedUsers.filter(user => user.id !== userId));
            }
        } catch (error) {
            console.error('Error unblocking user:', error);
        }
    };

    if (loading) {
        return <div className="p-4">Chargement...</div>;
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="flex items-center space-x-2 mb-4">
                <Ban className="h-5 w-5 text-red-500" />
                <h2 className="text-xl font-bold">Utilisateurs bloqués</h2>
            </div>
            {blockedUsers.length === 0 ? (
                <p className="text-gray-500">Aucun utilisateur bloqué</p>
            ) : (
                <div className="space-y-4">
                    {blockedUsers.map(user => (
                        <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <h3 className="font-semibold">{user.pseudo}</h3>
                                <p className="text-sm text-gray-600">{user.email}</p>
                                <p className="text-xs text-gray-500">Bloqué le {new Date(user.blockedAt).toLocaleDateString()}</p>
                            </div>
                            <Button
                                onClick={() => handleUnblock(user.id)}
                                variant="destructive"
                                size="default"
                            >
                                Débloquer
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 