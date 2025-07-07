
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Friend, Submission } from '../types';

interface CodeforcesContextType {
  codeforcesHandle: string;
  setCodeforcesHandle: (handle: string) => void;
  currentUserHandle: string;
  setCurrentUserHandle: (handle: string) => void;
  friends: Friend[];
  setFriends: (friends: Friend[]) => void;
  recentSubmissions: Submission[];
  fetchCodeforcesData: (handle: string) => Promise<void>;
}

const CodeforcesContext = createContext<CodeforcesContextType | undefined>(undefined);

export const useCodeforcesContext = () => {
  const context = useContext(CodeforcesContext);
  if (!context) {
    throw new Error('useCodeforcesContext must be used within a CodeforcesProvider');
  }
  return context;
};

interface CodeforcesProviderProps {
  children: ReactNode;
}

export const CodeforcesProvider: React.FC<CodeforcesProviderProps> = ({ children }) => {
  const [codeforcesHandle, setCodeforcesHandle] = useState('');
  const [currentUserHandle, setCurrentUserHandle] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);

  const recentSubmissions: Submission[] = [
    {
      id: '1',
      handle: 'tourist',
      problemName: 'Maximum Subarray',
      problemRating: 1900,
      verdict: 'Accepted',
      timestamp: new Date(Date.now() - 3600000),
      problemUrl: '#'
    },
    {
      id: '2',
      handle: 'jiangly',
      problemName: 'Tree DP',
      problemRating: 2100,
      verdict: 'Wrong Answer',
      timestamp: new Date(Date.now() - 7200000),
      problemUrl: '#'
    },
  ];

  const fetchCodeforcesData = async (handle: string) => {
    try {
      // Fetch user info
      const userResponse = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
      const userData = await userResponse.json();
      
      if (userData.status === 'OK') {
        // Fetch user's friends
        const friendsResponse = await fetch(`https://codeforces.com/api/user.friends?onlyOnline=false`);
        const friendsData = await friendsResponse.json();
        
        if (friendsData.status === 'OK') {
          const fetchedFriends = friendsData.result.map((friend: any) => ({
            handle: friend,
            name: friend,
            rating: Math.floor(Math.random() * 2000) + 1000, // Mock rating
            isOnline: Math.random() > 0.5
          }));
          setFriends(fetchedFriends);
        }
        
        setCurrentUserHandle(handle);
      }
    } catch (error) {
      console.error('Error fetching Codeforces data:', error);
      // Set some mock data for development
      setFriends([
        { handle: 'tourist', name: 'Gennady', rating: 3900, isOnline: true },
        { handle: 'jiangly', name: 'Jiang Ly', rating: 3800, isOnline: true },
        { handle: 'benq', name: 'Benjamin Qi', rating: 3600, isOnline: false },
        { handle: 'ecnerwala', name: 'Eric Chen', rating: 3500, isOnline: true },
      ]);
      setCurrentUserHandle(handle);
    }
  };

  const value: CodeforcesContextType = {
    codeforcesHandle,
    setCodeforcesHandle,
    currentUserHandle,
    setCurrentUserHandle,
    friends,
    setFriends,
    recentSubmissions,
    fetchCodeforcesData
  };

  return (
    <CodeforcesContext.Provider value={value}>
      {children}
    </CodeforcesContext.Provider>
  );
};
