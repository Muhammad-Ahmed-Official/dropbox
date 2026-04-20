'use client'

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'

export type SerializedUser = {
  id: string;
  userName: string;
  email: string;
} | null;

type UserContextType = {
  currentUser: SerializedUser;
  isLoaded: boolean;
  isSignedIn: boolean;
  refetch: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  isLoaded: false,
  isSignedIn: false,
  refetch: async () => {},
})

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<SerializedUser>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.data);
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{
      currentUser,
      isLoaded,
      isSignedIn: !!currentUser,
      refetch: fetchUser,
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext() {
  return useContext(UserContext)
}
