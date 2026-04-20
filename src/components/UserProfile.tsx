"use client";

import React from 'react'
import { Button } from "@heroui/button"
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card"
import { Spinner } from "@heroui/spinner"
import { Avatar } from "@heroui/avatar"
import { Divider } from "@heroui/divider"
import { useRouter } from "next/navigation"
import { Mail, User, LogOut, ArrowRight } from "lucide-react"
import { useUserContext } from '@/contextApi/UserProvider'

export default function UserProfile() {
  const { currentUser, isLoaded, isSignedIn, refetch } = useUserContext()
  const router = useRouter()

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    await refetch()
    router.push('/')
  }

  if (!isLoaded) {
    return (
      <div className="flex flex-col justify-center items-center p-12">
        <Spinner size="lg" color="primary" />
        <p className="mt-4 text-default-600">Loading your profile...</p>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <Card className="max-w-md mx-auto border border-default-200 bg-default-50 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex gap-3">
          <User className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">User Profile</h2>
        </CardHeader>
        <Divider />
        <CardBody className="text-center py-10">
          <div className="mb-6">
            <Avatar name="Guest" size="lg" className="mx-auto mb-4" />
            <p className="text-lg font-medium">Not Signed In</p>
            <p className="text-default-500 mt-2">Please sign in to access your profile</p>
          </div>
          <Button
            variant="solid"
            color="primary"
            size="lg"
            onClick={() => router.push("/sign-in")}
            className="px-8"
            endContent={<ArrowRight className="h-4 w-4" />}
          >
            Sign In
          </Button>
        </CardBody>
      </Card>
    )
  }

  const initials = currentUser?.userName?.[0]?.toUpperCase() || "U"

  return (
    <Card className="max-w-md mx-auto border border-default-200 bg-default-50 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex gap-3">
        <User className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">User Profile</h2>
      </CardHeader>
      <Divider />
      <CardBody className="py-6">
        <div className="flex flex-col items-center text-center mb-6">
          <Avatar name={initials} size="lg" className="mb-4 h-24 w-24 text-lg" />
          <h3 className="text-xl font-semibold">{currentUser?.userName}</h3>
          <div className="flex items-center gap-2 mt-1 text-default-500">
            <Mail className="h-4 w-4" />
            <span>{currentUser?.email}</span>
          </div>
        </div>
      </CardBody>
      <Divider />
      <CardFooter className="flex justify-between">
        <Button
          variant="flat"
          color="danger"
          startContent={<LogOut className="h-4 w-4" />}
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  )
}
