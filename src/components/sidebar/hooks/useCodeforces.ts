
import { Friend } from '../types';

export const useCodeforces = () => {
  const fetchCodeforcesData = async (handle: string, setFriends: (friends: Friend[]) => void, setCurrentUserHandle: (handle: string) => void) => {
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

  return { fetchCodeforcesData };
};
