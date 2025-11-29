'use client'

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs';

export type SerializedUser = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  userName: string | null;
  emailAddress: string | undefined;
  role: string,
  status: string | null,
} | null;

type UserContextType = {
  currentUser: SerializedUser;
  isLoaded: boolean;
  isSignedIn: boolean;
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  isLoaded: false,
  isSignedIn: false,
}) 

export function UserProvider({children}: {children:ReactNode}) {
  const {user, isLoaded, isSignedIn} = useUser()
  const [currentUser, setCurrentUser] = useState<SerializedUser>(null);
  useEffect(() => {
    if(isLoaded && user){
      setCurrentUser({
        id: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        imageUrl: user?.imageUrl,
        userName: user?.username,
        emailAddress: user?.emailAddresses?.[0]?.emailAddress,
        role: user.publicMetadata.role as string,
        status: user?.emailAddresses?.[0]?.verification.status
      })
    }
  }, [user, isLoaded, isSignedIn])
  return (
    <UserContext.Provider value={{ currentUser, isLoaded, isSignedIn: !!isSignedIn }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext() {
  return useContext(UserContext)
}